// Test data for frontend development and testing
export const testStories = [
  {
    title: "OpenAI releases GPT-4 with improved reasoning capabilities",
    points: "1,234",
    author: "samaltman",
    website: "openai.com",
    url: "https://openai.com/blog/gpt-4",
    summary:
      "OpenAI has unveiled GPT-4, a breakthrough language model that demonstrates human-level performance across various professional and academic benchmarks. The new model shows remarkable improvements in reasoning, creativity, and factual accuracy, making it capable of handling complex tasks like coding, mathematical problem-solving, and creative writing with unprecedented precision.",
    summary_style: "tech_enthusiast",
  },
  {
    title: "Rust 1.70.0 released with performance improvements",
    points: "567",
    author: "steveklabnik",
    website: "rust-lang.org",
    url: "https://blog.rust-lang.org/2023/06/01/Rust-1.70.0.html",
    summary:
      "The Rust team has announced the release of Rust 1.70.0, bringing significant performance improvements and enhanced developer experience. This release focuses on optimizing compilation times and memory usage, making Rust an even more attractive choice for systems programming and performance-critical applications.",
    summary_style: "educational",
  },
  {
    title: "Microsoft acquires GitHub for $7.5 billion",
    points: "890",
    author: "natfriedman",
    website: "microsoft.com",
    url: "https://news.microsoft.com/2018/06/04/microsoft-to-acquire-github-for-7-5-billion/",
    summary:
      "Microsoft's acquisition of GitHub represents a strategic move to strengthen its position in the developer ecosystem. This deal could reshape how developers collaborate and build software, potentially integrating GitHub's platform with Microsoft's extensive developer tools and cloud services.",
    summary_style: "business_focused",
  },
  {
    title: "The future of AI: AGI or just better narrow AI?",
    points: "456",
    author: "yudkowsky",
    website: "lesswrong.com",
    url: "https://www.lesswrong.com/posts/...",
    summary:
      "This provocative piece challenges the conventional wisdom about artificial general intelligence, arguing that current AI progress may be misleading. The author presents compelling evidence that we're building increasingly sophisticated narrow AI systems rather than moving toward true general intelligence, raising important questions about AI safety and development priorities.",
    summary_style: "controversial",
  },
  {
    title: "Quantum computing breakthrough: 1000+ qubit processor",
    points: "789",
    author: "quantum_researcher",
    website: "ibm.com",
    url: "https://research.ibm.com/blog/1000-qubit-processor",
    summary:
      "IBM's latest quantum processor represents a leap forward in quantum computing capabilities, bringing us closer to quantum advantage in practical applications. This breakthrough could revolutionize fields like cryptography, drug discovery, and complex optimization problems, ushering in a new era of computational power.",
    summary_style: "futuristic",
  },
  {
    title: "The hidden costs of technical debt",
    points: "345",
    author: "martinfowler",
    website: "martinfowler.com",
    url: "https://martinfowler.com/articles/is-quality-worth-cost.html",
    summary:
      "Technical debt is often underestimated in software development, leading to increased maintenance costs and reduced development velocity over time. This article provides practical strategies for identifying, measuring, and addressing technical debt before it becomes a critical business risk.",
    summary_style: "default",
  },
];

// Helper function to simulate real-time updates
export const simulateRealTimeUpdates = (callback) => {
  let currentIndex = 0;

  const interval = setInterval(() => {
    if (currentIndex < testStories.length) {
      callback([testStories[currentIndex]]);
      currentIndex++;
    } else {
      clearInterval(interval);
    }
  }, 2000);

  return () => clearInterval(interval);
};
