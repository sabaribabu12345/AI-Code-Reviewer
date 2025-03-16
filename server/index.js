import "dotenv/config";
import express from "express";
import cors from "cors";
import axios from "axios"; // ✅ Using Axios to make OpenRouter API calls

const app = express();
app.use(cors());
app.use(express.json());

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// AI Code Review API
app.post("/review", async (req, res) => {
  const { code } = req.body;

  if (!code) return res.status(400).json({ error: "No code provided!" });

  try {
    const prompt =  `
    You are a **Senior AI Code Reviewer** with deep expertise in software engineering, security best practices, and performance optimization. 
    
    ### 🔹 **Your Task:**  
    Analyze the following **code snippet** based on the following criteria:
    - ✅ **Code Readability & Maintainability**
    - ✅ **Performance Optimization (Big-O Complexity)**
    - ✅ **Security Vulnerabilities & Edge Cases**
    - ✅ **Coding Best Practices (Based on Language-Specific Standards)**
    - ✅ **Potential Bugs & Errors**
    - ✅ **Alternative Approaches for Improvement**
    
    ---
    ### 🔹 **Analysis Process:**  
    1️⃣ **Code Overview:** Briefly summarize what the code does.  
    2️⃣ **Quality Score (1-10):** Rate the code based on best practices.  
    3️⃣ **Performance Analysis:** Discuss time & space complexity if applicable.  
    4️⃣ **Security Risks:** Identify potential security flaws (e.g., XSS, SQL Injection).  
    5️⃣ **Key Issues Found:** List problems in the code (inefficiencies, anti-patterns, etc.).  
    6️⃣ **Suggested Improvements:** Provide a **better way to write the code** with examples.
    
    ---
    ### 🔹 **Code to Review:**
    \`\`\`
    ${code}
    \`\`\`
    
    ---
    🚀 **Provide a detailed, structured response using markdown formatting.**  
    `;
    

    // ✅ OpenRouter API Call
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
if (!OPENROUTER_API_KEY) {
  console.error("🚨 ERROR: Missing OpenRouter API Key! Add it to your .env file.");
  process.exit(1); // Stop the server if API key is missing
}

const response = await axios.post(
  "https://openrouter.ai/api/v1/chat/completions",
  {
    model: "openai/gpt-4o", // ✅ Using GPT-4o for best performance
    messages: [
      { role: "system", content: "You are an advanced AI code reviewer with expertise in security, performance, and best practices." },
      { role: "user", content: prompt }
    ],
    temperature: 0.3, // ✅ Lower temperature for accuracy (less randomness)
    max_tokens: 800, // ✅ Increased token limit for detailed responses
  },
  {
    headers: {
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
      "Content-Type": "application/json"
    }
  }
);


    res.json({ review: response.data.choices[0].message.content });

  } catch (error) {
    console.error("OpenRouter API Error:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: error.response ? error.response.data : "Error processing AI request" });
  }
});

// Start server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
