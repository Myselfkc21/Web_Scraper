# Hacker News AI Scraper 🚀

A sophisticated web scraper that fetches the latest stories from Hacker News and uses OpenAI's GPT models to generate unique, engaging summaries in different styles.

## ✨ Features

- **Real-time Scraping**: Automatically scrapes Hacker News every hour
- **AI-Powered Summaries**: Uses OpenAI GPT-3.5-turbo to generate unique summaries
- **Multiple Summary Styles**: Each story gets a different perspective:
  - 🎯 **Default**: Concise, engaging summaries
  - 🚀 **Tech Enthusiast**: Casual, excited tone for tech lovers
  - 💼 **Business Focused**: Market implications and opportunities
  - 📚 **Educational**: Beginner-friendly explanations
  - 🔥 **Controversial**: Thought-provoking takes on debates
  - 🌟 **Futuristic**: Forward-looking technology insights
- **Live Updates**: Real-time story updates via WebSocket
- **Smart Filtering**: Filter stories by summary style
- **Modern UI**: Beautiful, responsive interface built with React and Tailwind CSS

## 🛠️ Tech Stack

- **Backend**: Node.js, Express, Socket.IO
- **Frontend**: React, Tailwind CSS
- **Database**: MySQL
- **AI**: OpenAI GPT-3.5-turbo
- **Web Scraping**: Cheerio, Request
- **Real-time**: WebSocket communication

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MySQL database
- OpenAI API key

### 1. Clone and Install Dependencies

```bash
git clone <your-repo-url>
cd "Web scraper project"

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Environment Setup

Create a `.env` file in the `server` directory:

```bash
cd ../server
cp env.example .env
```

Edit `.env` with your configuration:

```env
# OpenAI API Configuration
OPENAI_API_KEY=your_actual_openai_api_key_here

# Database Configuration
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_DATABASE=your_db_name

# Server Configuration
PORT=4000
```

### 3. Database Setup

Create a MySQL database and update the credentials in your `.env` file. The server will automatically create the required tables.

### 4. Start the Application

```bash
# Terminal 1: Start the server
cd server
npm start

# Terminal 2: Start the client
cd client
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:4000

## 🔧 Configuration

### OpenAI API Key

1. Sign up at [OpenAI](https://openai.com/)
2. Get your API key from the dashboard
3. Add it to your `.env` file

### Scraping Frequency

The default scraping interval is 1 hour. You can modify this in `server/server.js`:

```javascript
setInterval(startScraping, 60 * 60 * 1000); // 1 hour
```

### Summary Styles

You can customize the summary styles by modifying the `styles` object in the `generateSummary` function:

```javascript
const styles = {
  "custom_style": "Your custom prompt here"
};
```

## 📊 API Endpoints

- `GET /api/stories` - Get all stories
- `GET /api/stories/style/:style` - Get stories by summary style
- WebSocket events for real-time updates

## 🎨 UI Features

- **Style Filtering**: Filter stories by AI summary style
- **Real-time Status**: Connection status indicator
- **Story Count**: Shows recent story count
- **Responsive Design**: Works on all device sizes
- **Interactive Elements**: Hover effects and smooth transitions

## 🔍 How It Works

1. **Scraping**: The server scrapes Hacker News every hour
2. **Content Extraction**: Extracts titles, points, authors, and content
3. **AI Processing**: Sends content to OpenAI for summary generation
4. **Style Variety**: Each story gets a random summary style for diversity
5. **Real-time Updates**: New stories are pushed to connected clients
6. **Smart Filtering**: Users can filter by summary style

## 🚨 Rate Limiting & Costs

- **OpenAI API**: Each story generates one API call
- **Scraping**: Respects Hacker News by limiting to once per hour
- **Database**: Efficient storage with automatic cleanup

## 🛡️ Error Handling

- Graceful fallbacks when OpenAI API is unavailable
- Database connection retry logic
- WebSocket reconnection handling
- Content validation and sanitization

## 🔮 Future Enhancements

- [ ] User authentication and preferences
- [ ] Custom summary style creation
- [ ] Story bookmarking and history
- [ ] Advanced filtering and search
- [ ] Export functionality
- [ ] Mobile app

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- Hacker News for the content
- OpenAI for the AI capabilities
- The open-source community for the amazing tools

---

**Note**: Make sure to respect Hacker News' terms of service and implement appropriate rate limiting for production use.


# 🚀 Quick Setup Guide

## Prerequisites
- Node.js (v16+)
- MySQL database
- OpenAI API key

## ⚡ 5-Minute Setup

### 1. Install Dependencies
```bash
# Server
cd server
npm install

# Client  
cd ../client
npm install
```

### 2. Configure Environment
```bash
cd ../server
cp env.example .env
```

Edit `.env` with your OpenAI API key:
```env
OPENAI_API_KEY=sk-your-actual-key-here
```

### 3. Start the App
```bash
# Terminal 1: Server
cd server
npm start

# Terminal 2: Client
cd client  
npm run dev
```

## 🧪 Test the AI Features

Run the demo to see AI summaries in action:
```bash
cd server
npm run demo
```

## 🌐 Access Points
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:4000

## 🔑 Get OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up/Login
3. Go to API Keys section
4. Create new secret key
5. Copy to your `.env` file

## 🚨 Troubleshooting

**"OpenAI API key not found"**
- Check your `.env` file exists
- Verify API key is correct
- Restart the server

**Database connection failed**
- Ensure MySQL is running
- Check database credentials in `.env`
- Create database if it doesn't exist

**Stories not loading**
- Check server console for errors
- Verify Hacker News is accessible
- Check OpenAI API quota

## 📚 Next Steps
- Read the full [README.md](README.md)
- Customize summary styles
- Adjust scraping frequency
- Add your own features!

---

**Need help?** Check the main README.md for detailed documentation.

