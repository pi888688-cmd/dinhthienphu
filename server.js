import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// SỬA LỖI 1: Trỏ thẳng vào thư mục hiện tại (root) chứa file index.html
app.use(express.static(".")); 

// 🚀 cache giúp tăng tốc
const cache = new Map();

app.post("/api/ai", async (req, res) => {
  try {
    const key = JSON.stringify(req.body);

    if (cache.has(key)) {
      return res.json(cache.get(key));
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: req.body.messages,
        temperature: 0.7,
        max_tokens: 1200
      })
    });

    const data = await response.json();
    cache.set(key, data);
    res.json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// SỬA LỖI 2: Sử dụng PORT động của Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server đang chạy tại port ${PORT}`);
});
