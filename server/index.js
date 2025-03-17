import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import axios from "axios";
import Review from "./models/Review.js"; // Import MongoDB Model

const app = express();
app.use(cors());
app.use(express.json());

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const MONGO_URI = process.env.MONGO_URI;

// ✅ Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log("🚀 Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// ✅ AI Code Review API
app.post("/review", async (req, res) => {
  const { code } = req.body;

  if (!code) return res.status(400).json({ error: "No code provided!" });

  try {
    const prompt = `
    You are a **Senior AI Code Reviewer**. Analyze the following code:
    \`\`\`${code}\`\`\`
    Provide structured feedback on:
    - **Code Readability**
    - **Performance & Security Issues**
    - **Alternative Approaches**
    - **Quality Score (1-10)**
    `;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-4o",
        messages: [
          { role: "system", content: "You are an expert AI code reviewer." },
          { role: "user", content: prompt }
        ],
        temperature: 0.3,
        max_tokens: 800,
      },
      {
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "HTTP-Referer": "http://localhost:5173/",
          "X-Title": "AI Code Reviewer",
          "Content-Type": "application/json"
        }
      }
    );

    const reviewText = response.data.choices[0].message.content;

    // ✅ Save Review to MongoDB
    const newReview = new Review({ code, review: reviewText });
    await newReview.save();

    res.json({ review: reviewText });

  } catch (error) {
    console.error("OpenRouter API Error:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Error processing AI request" });
  }
});

// ✅ API to Get All Reviews
app.get("/reviews", async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: "Error fetching reviews" });
  }
});

// Start server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
