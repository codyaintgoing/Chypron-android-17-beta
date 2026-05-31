import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.post("/api/music-theory", async (req, res) => {
    try {
      const { query } = req.body;
      if (!query) {
        return res.status(400).json({ error: "Query is required" });
      }

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: query,
        config: {
          systemInstruction: `You are a music theory expert. Respond to requests for chords, scales, or chord progressions by analyzing them and returning structured JSON data. Ensure the output EXACTLY matches this schema:
{
  "type": "scale" | "chord" | "progression",
  "root": "C", // Root note, or the key of the progression
  "name": "Major", // Name of scale/chord, or progression pattern like "I-V-vi-IV"
  "notes": ["C", "E", "G"], // Array of absolute notes. For progressions, include ALL unique notes used across all chords. Prefer flats for flat keys, sharps for sharp keys.
  "intervals": ["1", "3", "5"], // Standard intervals (leave empty array for progressions)
  "inversions": ["E-G-C (1st)"], // Text describing inversions (leave empty for progressions)
  "description": "A short description explaining the character or typical use.",
  "chords": [ // OPTIONAL: Only include if the type is "progression"
    { "name": "C Major", "notes": ["C", "E", "G"], "numeral": "I" },
    { "name": "G Major", "notes": ["G", "B", "D"], "numeral": "V" }
  ]
}`,
          responseMimeType: "application/json",
          temperature: 0.2, // Low temperature for factual music theory
        },
      });

      const musicData = JSON.parse(response.text || "{}");
      res.json(musicData);
    } catch (error) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: "Failed to process request" });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
