import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5002";

function App() {
  const [code, setCode] = useState("");
  const [review, setReview] = useState("");
  const [optimizedCode, setOptimizedCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);

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
      setHistory(history.filter((item) => item._id !== id)); // Remove from UI
      setSelectedReview(null); // Reset selected review
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  return (
    <div className="h-screen flex bg-gray-900 text-white">
      {/* ✅ Sidebar with History Tabs */}
      <div className="w-1/4 h-screen bg-gray-800 p-4 overflow-y-auto shadow-lg">
        <h2 className="text-2xl font-bold text-blue-400 mb-4">📜 Review History</h2>
        {history.length === 0 ? (
          <p className="text-gray-400 italic">No previous reviews yet.</p>
        ) : (
          history.map((item) => (
            <div key={item._id} className="flex justify-between items-center bg-gray-700 hover:bg-gray-600 p-3 rounded-md my-2 transition-all duration-200">
              <button
                onClick={() => setSelectedReview(item)}
                className="flex-grow text-left font-semibold"
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
          ))
        )}
      </div>

      {/* ✅ Main Content Area */}
      <div className="w-3/4 p-8 overflow-y-auto">
        <h1 className="text-5xl font-extrabold mb-8 text-blue-400 drop-shadow-lg">🚀 AI Code Reviewer</h1>

        {/* ✅ Code Input Box */}
        <textarea
          className="w-full h-52 p-4 border border-gray-600 bg-gray-800 text-white rounded-lg shadow-lg focus:ring-2 focus:ring-blue-400 outline-none resize-none transition-all duration-300"
          placeholder="Paste your code here..."
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        {/* ✅ Analyze Button */}
        <button
          className="mt-6 px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "🔍 Analyzing..." : "🚀 Analyze Code"}
        </button>

        {/* ✅ Review Output */}
        <div className="mt-8 w-full bg-gray-800 p-6 rounded-lg shadow-xl min-h-[250px] transition-all duration-300">
          <h2 className="text-2xl font-bold text-green-400 mb-3">📢 AI Review</h2>
          <pre className="mt-2 bg-gray-700 p-4 rounded-md overflow-x-auto text-md leading-relaxed text-gray-300">
            {selectedReview ? selectedReview.review : review}
          </pre>
        </div>

        {/* ✅ AI Code Improvement */}
        <div className="mt-6 w-full grid grid-cols-2 gap-6">
          {/* Original Code */}
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg min-h-[200px]">
            <h2 className="text-xl font-semibold text-red-400">🔴 Original Code</h2>
            <pre className="mt-2 bg-gray-700 p-3 rounded-md overflow-x-auto text-sm">{code}</pre>
          </div>

          {/* AI-Optimized Code */}
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg min-h-[200px]">
            <h2 className="text-xl font-semibold text-green-400">🟢 AI-Optimized Code</h2>
            <pre className="mt-2 bg-gray-700 p-3 rounded-md overflow-x-auto text-sm">{optimizedCode || "AI is processing..."}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
