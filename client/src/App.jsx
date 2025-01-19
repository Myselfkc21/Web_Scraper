import { useState, useEffect } from "react";
import io from "socket.io-client";

function App() {
  const [stories, setStories] = useState([]);
  const [recentCount, setRecentCount] = useState(0);
  const [socketStatus, setSocketStatus] = useState("Connecting...");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const socket = io("http://localhost:3000");

    socket.on("connect", () => {
      setSocketStatus("Connected");
      setIsLoading(false);
    });

    socket.on("disconnect", () => {
      setSocketStatus("Disconnected");
    });

    socket.on("connect_error", () => {
      setSocketStatus("Error");
      setIsLoading(false);
    });

    //gets the data here from the server/
    socket.on("initial_count", (data) => {
      setRecentCount(data.count);
    });

    socket.on("new_stories", (data) => {
      setStories(data.stories);
      setIsLoading(false);
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Refined Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-serif text-gray-900">
              Hacker News <span className="font-light italic">Live</span>
            </h1>
            <div className="flex items-center space-x-4">
              <span
                className={`px-3 py-1.5 rounded-full text-xs font-medium tracking-wide ${
                  socketStatus === "Connected"
                    ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20"
                    : "bg-red-50 text-red-700 ring-1 ring-red-600/20"
                }`}
              >
                <span
                  className={`inline-block w-1.5 h-1.5 rounded-full mr-2 ${
                    socketStatus === "Connected"
                      ? "bg-emerald-500"
                      : "bg-red-500"
                  }`}
                ></span>
                {socketStatus}
              </span>
              <span className="px-3 py-1.5 rounded-full text-xs font-medium tracking-wide bg-blue-50 text-blue-700 ring-1 ring-blue-600/20">
                {recentCount} stories in last 5min
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Refined Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500 font-medium">Loading stories...</div>
          </div>
        ) : (
          <div className="space-y-4">
            {stories.map((story, index) => (
              <article
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-200/50 p-6 transition duration-200 ease-in-out hover:shadow-md hover:border-gray-300/50"
              >
                <h2 className="text-lg font-medium mb-3">
                  <a
                    href={story.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-900 hover:text-blue-600 transition-colors duration-200"
                  >
                    {story.title}
                  </a>
                </h2>
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
