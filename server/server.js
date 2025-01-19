import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import mysql from "mysql2/promise";
import request from "request";
import * as cheerio from "cheerio";
import cors from "cors";
import EventEmitter from "events";
import { hostname } from "os";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
  },
});
const emitter = new EventEmitter();
emitter.setMaxListeners(20);

app.use(cors());

const dbConfig = {
  host: "localhost",
  user: "chaitanya",
  password: "12345678",
  database: "hackernews",
};

const pool = mysql.createPool(dbConfig);

async function initializeDatabase() {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.query(`
      CREATE TABLE IF NOT EXISTS stories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        points VARCHAR(50) DEFAULT '0',
        author VARCHAR(100) DEFAULT 'unknown',
        website VARCHAR(255) DEFAULT '',
        url TEXT,
        content TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Database initialization error:", error);
    process.exit(1);
  } finally {
    if (connection) connection.release();
  }
}

async function saveStories(stories) {
  let connection;
  try {
    connection = await pool.getConnection();

    for (const story of stories) {
      try {
        await connection.query(
          "INSERT INTO stories (title, points, author, website, url, content) VALUES (?, ?, ?, ?, ?, ?)",
          [
            story.title,
            story.points || "0",
            story.author || "unknown",
            story.website || "",
            story.url || "",
            JSON.stringify(story.content || []),
          ]
        );
      } catch (err) {
        console.error(`Error saving story "${story.title}":`, err.message);
      }
    }
    console.log(`Successfully saved ${stories.length} stories to database`);
  } catch (error) {
    console.error("Error in saveStories:", error);
  } finally {
    if (connection) connection.release();
  }
}

async function getRecentStoryCount() {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.query(
      "SELECT COUNT(*) as count FROM stories WHERE created_at >= NOW() - INTERVAL 5 MINUTE"
    );
    return rows[0].count;
  } catch (error) {
    console.error("Error getting recent story count:", error);
    return 0;
  } finally {
    if (connection) connection.release();
  }
}

function scrapeHackerNews() {
  return new Promise((resolve, reject) => {
    request("https://news.ycombinator.com/newest", (err, response, html) => {
      if (err) {
        console.error("Error fetching Hacker News:", err);
        reject(err);
      } else {
        console.log(resolve);
        handleHtml(html, resolve);
      }
    });
  });
}

function handleHtml(html, resolve) {
  let selTool = cheerio.load(html);
  let articles = [];

  let title = selTool(`td.title span.titleline > a`);
  let points = selTool(`td.subtext span.score`);
  let author = selTool(`td.subtext a.hnuser`);
  let parentWebsite = selTool(`td.title span.sitestr`);
  let source = selTool(`td.title span.titleline > a`);

  console.log(`Found ${title.length} stories to process`);

  if (title.length === 0) {
    console.log("No stories found to process");
    resolve([]);
    return;
  }

  let CompletedReq = 0;
  let totalReq = title.length;

  for (let i = 0; i < title.length; i++) {
    let article = {
      title: selTool(title[i]).text().trim(),
      points: selTool(points[i]).text().trim() || "0",
      author: selTool(author[i]).text().trim() || "unknown",
      website: selTool(parentWebsite[i]).text().trim() || "",
      url: selTool(source[i]).attr("href"),
      content: [],
    };

    articles.push(article);

    request(article.url, (err, response, html) => {
      CompletedReq++;

      if (!err) {
        try {
          article.content = fetchSourceData(html);
        } catch (error) {
          console.error(
            `Error processing content for "${article.title}":`,
            error
          );
        }
      }

      if (CompletedReq === totalReq) {
        console.log(
          "Scraping complete -",
          articles.length,
          "articles processed"
        );
        resolve(articles);
      }
    });
  }
}

function fetchSourceData(html) {
  let selTool = cheerio.load(html);
  let data = selTool(`p`);
  let paragraphs = [];

  for (let i = 0; i < data.length; i++) {
    let data_text = selTool(data[i]).text().trim();
    if (data_text) {
      paragraphs.push(data_text);
    }
  }

  return paragraphs;
}

//using socket.io for the client - server communications
io.on("connection", async (socket) => {
  console.log("Client is connected to the server");
  //we use socket.emm=mit here because each client gets connected at any random time and we need to get the data to that exact time
  try {
    const recentCount = await getRecentStoryCount();
    socket.emit("initial_count", { count: recentCount }); //sends count to specific connected client

    const stories = await scrapeHackerNews();
    socket.emit("new_stories", { stories }); //send content to  specific connected  client
  } catch (error) {
    console.error("Error handling new connection:", error);
    socket.emit("error", { message: "Error fetching initial data" });
  }

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

function broadcastStories(stories) {
  io.emit("new_stories", { stories }); //its broadcast , send content to too clients that r connected
}

async function startScraping() {
  try {
    const stories = await scrapeHackerNews(); //actual scraping function is here, it returns the array of articles
    if (stories && stories.length > 0) {
      await saveStories(stories);
      broadcastStories(stories);
      console.log("Scraping cycle completed successfully");
    } else {
      console.log("No stories found in this cycle");
    }
  } catch (error) {
    console.error("Error in scraping cycle:", error);
  }
}

async function start() {
  try {
    await initializeDatabase(); //we basically created the DB here
    await startScraping(); //initial scraping
    setInterval(startScraping, 1000); //recurring scraping

    const PORT = 3000;
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

start();
