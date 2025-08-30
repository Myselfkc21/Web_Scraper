import { useState, useEffect } from "react";
import io from "socket.io-client";
import { testStories } from "./testData";

function App() {
  const [stories, setStories] = useState([]);
  const [recentCount, setRecentCount] = useState(0);
  const [socketStatus, setSocketStatus] = useState("Connecting...");
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState("all");
  const [filteredStories, setFilteredStories] = useState([]);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [isTestMode, setIsTestMode] = useState(false);

  const summaryStyles = [
    { value: "all", label: "All Styles", color: "gray" },
    { value: "default", label: "Default", color: "blue" },
    { value: "tech_enthusiast", label: "Tech Enthusiast", color: "green" },
    { value: "business_focused", label: "Business Focused", color: "purple" },
    { value: "educational", label: "Educational", color: "indigo" },
    { value: "controversial", label: "Controversial", color: "red" },
    { value: "futuristic", label: "Futuristic", color: "cyan" },
  ];

  useEffect(() => {
    // Test mode - load sample data
    if (isTestMode) {
      setStories(testStories);
      setSocketStatus("Test Mode");
      setIsLoading(false);
      setIsProcessing(false);
      setError(null);
      setNotification({
        type: "info",
        message: "🧪 Running in test mode with sample data",
        duration: 5000,
      });
      return;
    }

    const socket = io("http://localhost:4000");

    socket.on("connect", () => {
      setSocketStatus("Connected");
      setIsLoading(false);
      setError(null);
      setNotification({
        type: "success",
        message: "Connected to Hacker News AI Scraper",
        duration: 3000,
      });
    });

    socket.on("disconnect", () => {
      setSocketStatus("Disconnected");
      setNotification({
        type: "warning",
        message: "Disconnected from server",
        duration: 5000,
      });
    });

    socket.on("connect_error", () => {
      setSocketStatus("Error");
      setIsLoading(false);
      setError(
        "Failed to connect to server. Please check if the server is running."
      );
    });

    //gets the data here from the server/
    socket.on("initial_count", (data) => {
      setRecentCount(data.count);
    });

    socket.on("new_stories", (data) => {
      const previousCount = stories.length;
      setStories(data.stories);
      setIsLoading(false);
      setIsProcessing(false);
      setError(null);

      // Show notification for new stories
      if (data.stories.length > previousCount) {
        const newCount = data.stories.length - previousCount;
        setNotification({
          type: "info",
          message: `📰 ${newCount} new story${
            newCount > 1 ? "ies" : "y"
          } processed with AI summaries!`,
          duration: 4000,
        });
      }
    });

    socket.on("error", (data) => {
      setError(data.message || "An error occurred while fetching stories");
      setIsLoading(false);
      setIsProcessing(false);
      setNotification({
        type: "error",
        message: "Error occurred while processing stories",
        duration: 5000,
      });
    });

    return () => socket.disconnect();
  }, [stories.length, isTestMode]);

  // Filter stories based on selected style
  useEffect(() => {
    if (selectedStyle === "all") {
      setFilteredStories(stories);
    } else {
      setFilteredStories(
        stories.filter((story) => story.summary_style === selectedStyle)
      );
    }
  }, [stories, selectedStyle]);

  // Auto-hide notifications
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, notification.duration);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const getStyleColor = (style) => {
    const styleObj = summaryStyles.find((s) => s.value === style);
    return styleObj ? styleObj.color : "gray";
  };

  const getStyleLabel = (style) => {
    const styleObj = summaryStyles.find((s) => s.value === style);
    return styleObj ? styleObj.label : "Unknown";
  };

  // Function to get proper Tailwind classes for each style
  const getStyleClasses = (style) => {
    switch (style) {
      case "default":
        return "bg-blue-100 text-blue-800";
      case "tech_enthusiast":
        return "bg-green-100 text-green-800";
      case "business_focused":
        return "bg-purple-100 text-purple-800";
      case "educational":
        return "bg-indigo-100 text-indigo-800";
      case "controversial":
        return "bg-red-100 text-red-800";
      case "futuristic":
        return "bg-cyan-100 text-cyan-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Function to get filter button classes
  const getFilterButtonClasses = (style) => {
    const baseClasses =
      "px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200";
    if (selectedStyle === style.value) {
      switch (style.color) {
        case "blue":
          return `${baseClasses} bg-blue-100 text-blue-800 ring-2 ring-blue-300`;
        case "green":
          return `${baseClasses} bg-green-100 text-green-800 ring-2 ring-green-300`;
        case "purple":
          return `${baseClasses} bg-purple-100 text-purple-800 ring-2 ring-purple-300`;
        case "indigo":
          return `${baseClasses} bg-indigo-100 text-indigo-800 ring-2 ring-indigo-300`;
        case "red":
          return `${baseClasses} bg-red-100 text-red-800 ring-2 ring-red-300`;
        case "cyan":
          return `${baseClasses} bg-cyan-100 text-cyan-800 ring-2 ring-cyan-300`;
        default:
          return `${baseClasses} bg-gray-100 text-gray-800 ring-2 ring-gray-300`;
      }
    } else {
      return `${baseClasses} bg-gray-100 text-gray-600 hover:bg-gray-200`;
    }
  };

  // Show processing state when stories are being fetched
  useEffect(() => {
    if (
      socketStatus === "Connected" &&
      stories.length === 0 &&
      !isLoading &&
      !isTestMode
    ) {
      setIsProcessing(true);
    }
  }, [socketStatus, stories.length, isLoading, isTestMode]);

  const getNotificationClasses = (type) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200 text-green-800";
      case "error":
        return "bg-red-50 border-red-200 text-red-800";
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      case "info":
        return "bg-blue-50 border-blue-200 text-blue-800";
      default:
        return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Notification Banner */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg border shadow-lg transition-all duration-300 ${getNotificationClasses(
            notification.type
          )}`}
        >
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">{notification.message}</span>
            <button
              onClick={() => setNotification(null)}
              className="ml-2 text-gray-500 hover:text-gray-700"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Enhanced Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-serif text-gray-900">
                Hacker News <span className="font-light italic">AI</span>
              </h1>
              <span className="px-2 py-1 text-xs font-medium bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full">
                Powered by OpenAI
              </span>
            </div>
            <div className="flex items-center space-x-4">
              {/* Test Mode Toggle */}
              <button
                onClick={() => setIsTestMode(!isTestMode)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                  isTestMode
                    ? "bg-purple-100 text-purple-800 ring-2 ring-purple-300"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                title="Toggle test mode for development"
              >
                {isTestMode ? "🧪 Test Mode" : "🔧 Dev Mode"}
              </button>

              <span
                className={`px-3 py-1.5 rounded-full text-xs font-medium tracking-wide ${
                  socketStatus === "Connected"
                    ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20"
                    : socketStatus === "Test Mode"
                    ? "bg-purple-50 text-purple-700 ring-1 ring-purple-600/20"
                    : "bg-red-50 text-red-700 ring-1 ring-red-600/20"
                }`}
              >
                <span
                  className={`inline-block w-1.5 h-1.5 rounded-full mr-2 ${
                    socketStatus === "Connected"
                      ? "bg-emerald-500"
                      : socketStatus === "Test Mode"
                      ? "bg-purple-500"
                      : "bg-red-500"
                  }`}
                ></span>
                {socketStatus}
              </span>
              <span className="px-3 py-1.5 rounded-full text-xs font-medium tracking-wide bg-blue-50 text-blue-700 ring-1 ring-blue-600/20">
                {isTestMode
                  ? `${stories.length} sample stories`
                  : `${recentCount} stories in last hour`}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Style Filter Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 overflow-x-auto">
            <span className="text-sm font-medium text-gray-700 mr-2">
              Summary Style:
            </span>
            {summaryStyles.map((style) => (
              <button
                key={style.value}
                onClick={() => setSelectedStyle(style.value)}
                className={getFilterButtonClasses(style)}
              >
                {style.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <div className="text-gray-500 font-medium">
                Connecting to server...
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center max-w-md">
              <div className="text-red-500 mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="text-red-600 font-medium mb-2">
                Connection Error
              </div>
              <div className="text-gray-600 text-sm">{error}</div>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Retry Connection
              </button>
            </div>
          </div>
        ) : isProcessing ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <div className="text-gray-500 font-medium mb-2">
                Processing stories with AI...
              </div>
              <div className="text-gray-400 text-sm">
                This may take a few moments as we generate unique summaries
              </div>
            </div>
          </div>
        ) : filteredStories.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="text-gray-500 font-medium mb-2">
                {selectedStyle === "all"
                  ? "No stories available"
                  : `No stories with ${getStyleLabel(selectedStyle)} style`}
              </div>
              <div className="text-gray-400 text-sm">
                {selectedStyle === "all"
                  ? "Stories will appear here once scraping begins"
                  : "Try selecting a different style or wait for new stories"}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="text-gray-600 text-sm">
                Showing {filteredStories.length} story
                {filteredStories.length !== 1 ? "ies" : "y"}
                {selectedStyle !== "all" &&
                  ` with ${getStyleLabel(selectedStyle)} style`}
                {isTestMode && " (Test Mode)"}
              </div>
            </div>
            {filteredStories.map((story, index) => (
              <article
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-200/50 p-6 transition duration-200 ease-in-out hover:shadow-md hover:border-gray-300/50"
              >
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 flex-1">
                    <a
                      href={story.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-blue-600 transition-colors duration-200"
                    >
                      {story.title}
                    </a>
                  </h2>
                  <span
                    className={`ml-3 px-2 py-1 text-xs font-medium rounded-full ${getStyleClasses(
                      story.summary_style
                    )}`}
                  >
                    {getStyleLabel(story.summary_style)}
                  </span>
                </div>

                {/* AI Summary Section */}
                {story.summary && (
                  <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-l-4 border-blue-400">
                    <div className="flex items-start space-x-2">
                      <div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-blue-900 mb-1">
                          AI Summary
                        </p>
                        <p className="text-blue-800 leading-relaxed">
                          {story.summary}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  {story.points && (
                    <span className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-1.5 text-orange-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 15l7-7 7 7"
                        />
                      </svg>
                      <span className="font-medium text-gray-700">
                        {story.points}
                      </span>
                    </span>
                  )}
                  {story.author && (
                    <span className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-1.5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <span className="text-gray-600">{story.author}</span>
                    </span>
                  )}
                  {story.website && (
                    <span className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-1.5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                        />
                      </svg>
                      <span className="text-gray-600">{story.website}</span>
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
