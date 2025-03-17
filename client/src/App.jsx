import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5002";

function App() {
  const [code, setCode] = useState("");
  const [review, setReview] = useState("");
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

    try {
      const response = await axios.post(`${API_URL}/review`, { code });
      setReview(response.data.review);
      fetchHistory(); // Refresh history after a new review
    } catch (error) {
      setReview("Error analyzing code. Please check your backend.");
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex bg-gray-900 text-white">
      {/* ✅ Sidebar with History Tabs */}
      <div className="w-1/4 h-screen bg-gray-800 p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">📜 Review History</h2>
        {history.length === 0 ? (
          <p className="text-gray-400">No previous reviews yet.</p>
        ) : (
          history.map((item) => (
            <button
              key={item._id}
              onClick={() => setSelectedReview(item)}
              className={`block w-full text-left p-2 rounded-md my-1 ${
                selectedReview?._id === item._id ? "bg-blue-500" : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              {item.code.slice(0, 30)}...
            </button>
          ))
        )}
      </div>

      {/* ✅ Main Content Area */}
      <div className="w-3/4 p-6 overflow-y-auto">
        <h1 className="text-4xl font-bold mb-6 text-blue-400">🚀 AI Code Reviewer</h1>

        {/* ✅ Code Input Box */}
        <textarea
          className="w-full h-48 p-4 border border-gray-600 bg-gray-800 text-white rounded-lg shadow-lg resize-none"
          placeholder="Paste your code here..."
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />

        {/* ✅ Analyze Button */}
        <button
          className="mt-4 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Analyze Code"}
        </button>

        {/* ✅ Review Output */}
        <div className="mt-6 w-full bg-gray-800 p-4 rounded-lg shadow-lg min-h-[200px]">
          <h2 className="text-xl font-semibold text-green-400">AI Review:</h2>
          <pre className="mt-2 bg-gray-700 p-3 rounded-md overflow-x-auto text-sm">
            {selectedReview ? selectedReview.review : review}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default App;
