import { useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5002/review"; // ✅ Ensure this matches your backend

function App() {
  const [code, setCode] = useState("");
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!code.trim()) {
      alert("Please enter some code!");
      return;
    }
    setLoading(true);
    setReview("Analyzing code...");

    try {
      const response = await axios.post(API_URL, { code });

      // ✅ Clean AI output: Remove `#`, `**`, and trim extra spaces
      let formattedReview = response.data.review
        .replace(/#+/g, "")  // Remove `#` symbols
        .replace(/\*\*/g, "") // Remove `**` (bold markers)
        .trim();

      setReview(formattedReview);
    } catch (error) {
      setReview("Error analyzing code. Please check your backend.");
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-gray-900 text-white px-6 py-4">
      <h1 className="text-4xl font-bold mb-6 text-blue-400">🚀 AI Code Reviewer</h1>

      {/* ✅ Bigger Input Box */}
      <div className="w-full max-w-5xl">
        <textarea
          className="w-full h-56 p-4 border border-gray-600 bg-gray-800 text-white rounded-lg shadow-lg focus:ring-2 focus:ring-blue-400 outline-none resize-none"
          placeholder="Paste your code here..."
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
      </div>

      <button
        className="mt-4 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Analyzing..." : "Analyze Code"}
      </button>

      {/* ✅ Dynamic AI Output Box */}
      {review && (
        <div className="mt-6 w-full max-w-5xl bg-gray-800 p-4 rounded-lg shadow-lg transition-all duration-300 ease-in-out">
          <h2 className="text-xl font-semibold text-green-400">AI Review:</h2>
          <div
            className="mt-2 bg-gray-700 p-3 rounded-md overflow-x-auto text-sm whitespace-pre-line max-h-[400px] overflow-y-auto"
            style={{ minHeight: "100px" }} // ✅ Dynamic height adjustment
          >
            <code>{review}</code>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
