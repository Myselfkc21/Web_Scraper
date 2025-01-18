import request from "request";
import * as cheerio from "cheerio";
import { createObjectCsvWriter as createCsvWriter } from "csv-writer";
import fs from "fs";

// Array to store all scraped articles
let articles = [];

request("https://news.ycombinator.com/newest", (err, response, html) => {
  if (err) {
    console.error("Error fetching HN:", err);
    return;
  }
  handleHtml(html);
});

function handleHtml(html) {
  let selTool = cheerio.load(html);

  // Updated selectors to match current HN structure
  let titles = selTool(`td.title span.titleline > a`);
  let points = selTool(`td.subtext span.score`);
  let authors = selTool(`td.subtext a.hnuser`);
  let parentWebsites = selTool(`td.title span.sitestr`);
  let sources = selTool(`td.title span.titleline > a`);

  let completedRequests = 0;
  const totalRequests = titles.length;

  for (let i = 0; i < titles.length; i++) {
    let article = {
      title: selTool(titles[i]).text().trim(),
      points: selTool(points[i]).text().trim(),
      author: selTool(authors[i]).text().trim(),
      website: selTool(parentWebsites[i]).text().trim(),
      url: selTool(sources[i]).attr("href"),
      content: [], // Will store paragraphs from the source
    };

    articles.push(article);

    // Fetch content from source URL
    request(article.url, (err, response, html) => {
      completedRequests++;

      if (!err && html) {
        article.content = FetchSourceData(html);
      }

      // When all requests are complete, save the data
      if (completedRequests === totalRequests) {
        saveData();
      }
    });
  }
}

function FetchSourceData(html) {
  let selTool = cheerio.load(html);
  let paragraphs = [];

  selTool("p").each((i, elem) => {
    let text = selTool(elem).text().trim();
    if (text.length > 0) {
      paragraphs.push(text);
    }
  });

  return paragraphs;
}

function saveData() {
  // Save as CSV
  const csvWriter = createCsvWriter({
    path: "hackernews_articles.csv",
    header: [
      { id: "title", title: "Title" },
      { id: "points", title: "Points" },
      { id: "author", title: "Author" },
      { id: "website", title: "Website" },
      { id: "url", title: "URL" },
      { id: "content", title: "Content" },
    ],
  });

  // Prepare data for CSV (joining content array into a single string)
  const csvData = articles.map((article) => ({
    ...article,
    content: article.content.join(" | "),
  }));

  // Save CSV
  csvWriter
    .writeRecords(csvData)
    .then(() => console.log("CSV file has been saved"));

  // Save complete data as JSON (includes content as array)
  fs.writeFileSync(
    "./hackernews_articles.json",
    JSON.stringify(articles, null, 2),
    "utf-8"
  );
  console.log("JSON file has been saved");

  // Print summary
  console.log(`\nScraping Complete:`);
  console.log(`Total articles scraped: ${articles.length}`);
  console.log(
    `Files saved: hackernews_articles.csv and hackernews_articles.json`
  );
}
