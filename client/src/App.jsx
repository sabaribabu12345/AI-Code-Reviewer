import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion"; // Animations

// const API_URL = "http://localhost:5002";
const API_URL = "https://web-production-21cec.up.railway.app";  // Replace with your Railway backend URL

function App() {
  // ✅ Theme State (Stored in LocalStorage)
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      localStorage.setItem("darkMode", !prev);
      return !prev;
    });
  };

  // ✅ State Variables
  const [code, setCode] = useState("");
  const [review, setReview] = useState("");
  const [optimizedCode, setOptimizedCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [copyStatus, setCopyStatus] = useState("Copy");


  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`${API_URL}/reviews`);
      setHistory(response.data);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };
  const handleCopy = () => {
    navigator.clipboard.writeText(optimizedCode).then(() => {
      setCopyStatus("Copied!");
      setTimeout(() => setCopyStatus("Copy"), 2000); // Reset after 2 seconds
    });
  };


  const handleSubmit = async () => {
    if (!code.trim()) {
      alert("Please enter some code!");
      return;
    }
    setLoading(true);
    setReview("Analyzing code...");
    setOptimizedCode("");

    try {
      const response = await axios.post(`${API_URL}/review`, { code });
      setReview(response.data.review);
      setOptimizedCode(response.data.optimizedCode);
      fetchHistory(); // Refresh history after new review
    } catch (error) {
      setReview("Error analyzing code. Please check your backend.");
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/review/${id}`);
      setHistory(history.filter((item) => item._id !== id));
      setSelectedReview(null);
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  return (
    <div className={`min-h-screen w-full ${darkMode ? "bg-gray-900 text-gray-200" : "bg-gray-50 text-gray-900"}`}>
      <div className="max-w-[1440px] mx-auto min-h-screen flex flex-col">
        {/* ✅ Dark Mode Toggle */}
        <motion.button
          className={`absolute top-4 right-4 px-4 py-2 rounded-md shadow-md text-sm font-semibold 
          transition-all duration-300 ease-in-out transform hover:scale-105 ${darkMode ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          onClick={toggleDarkMode}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </motion.button>

        <div className="flex flex-grow">
          {/* ✅ Sidebar with Fixed Height & Scrollable History */}
          <div className={`w-1/4 h-screen ${darkMode ? "bg-gray-800" : "bg-white"} p-4 overflow-y-auto shadow-lg flex flex-col`}>
            <h2 className={`text-2xl font-bold ${darkMode ? "text-blue-400" : "text-blue-600"}`}>
              📜 Review History
            </h2>
            {history.length === 0 ? (
              <p className="text-gray-400 italic">No previous reviews yet.</p>
            ) : (
              <div className="flex-grow overflow-y-auto">
                {history.map((item) => (
                  <div key={item._id} className="flex justify-between items-center bg-gray-700 hover:bg-gray-600 p-3 rounded-md my-2 transition-all duration-200">
                    <button
                      onClick={() => setSelectedReview(item)}
                      className="flex-grow text-left font-semibold text-white"
                    >
                      {item.code.slice(0, 30)}...
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="ml-3 px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ✅ Main Content Area */}
          <div className="w-3/4 p-8 overflow-y-auto">
            <h1 className={`text-5xl font-extrabold mb-8 ${darkMode ? "text-blue-400" : "text-blue-600"}`}>
              🚀 AI Code Reviewer
            </h1>

            {/* ✅ Code Input Box */}
            <textarea
              className="w-full h-52 p-4 border border-gray-600 bg-gray-800 text-white rounded-lg shadow-lg focus:ring-2 focus:ring-blue-400 outline-none resize-none transition-all duration-300"
              placeholder="Paste your code here..."
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />

            {/* ✅ Analyze Button */}
            <motion.button
              className={`mt-6 px-8 py-3 ${darkMode ? "bg-blue-500 hover:bg-blue-600 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"
                } font-semibold rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 disabled:opacity-50`}
              onClick={handleSubmit}
              disabled={loading}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {loading ? "🔍 Analyzing..." : "🚀 Analyze Code"}
            </motion.button>

            {/* ✅ AI Review & Optimized Code */}
            <div className="mt-6 w-full grid grid-cols-2 gap-6">
              {/* 📢 AI Review Section */}
              <motion.div className={`p-4 rounded-lg shadow-lg ${darkMode ? "bg-gray-700 text-yellow-300" : "bg-gray-100 text-yellow-700"}`}>
                <h2 className="text-xl font-semibold">📢 AI Review</h2>
                <pre className="mt-2 bg-gray-600 p-4 rounded-md overflow-x-auto text-md leading-relaxed whitespace-pre-wrap">
                  {selectedReview ? selectedReview.review : review}
                </pre>
              </motion.div>

              {/* 🟢 Optimized Code Section with Copy Button */}
<motion.div 
  className={`p-4 rounded-lg shadow-lg ${darkMode ? "bg-gray-700 text-green-300" : "bg-gray-100 text-green-700"}`}
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  <div className="flex justify-between items-center mb-2">
    <h2 className="text-xl font-semibold">🟢 Optimized Code</h2>
    <button
      onClick={handleCopy}
      className="px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md shadow-md transition-all duration-300"
    >
      {copyStatus}
    </button>
  </div>
  <pre className="mt-2 bg-gray-800 p-4 rounded-md overflow-x-auto text-md leading-relaxed whitespace-pre-wrap text-gray-200">
    {optimizedCode || "AI is processing..."}
  </pre>
</motion.div>


            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
