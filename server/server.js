require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');

const app = express();
app.use(express.json());
app.use(cors());

const ai = new GoogleGenAI({});
const MODEL_NAME = 'gemini-2.0-flash';

// ---------- Helpers ----------
const helpers = [
  "Ravi Kumar", "Sita Ram", "Anjali Sharma", "Manoj Verma",
  "Deepak Yadav", "Kiran Singh", "Vikram Das", "Priya Nair"
];
function getRandomHelper() {
  const name = helpers[Math.floor(Math.random() * helpers.length)];
  const rating = (Math.random() * (5 - 3.8) + 3.8).toFixed(1);
  return { name, rating };
}

// ---------- 1️⃣ /api/book ----------
app.post('/api/book', async (req, res) => {
  try {
    const { name, arrival_city, arrival_time, luggage } = req.body;

    if (!name || !arrival_city || !arrival_time || !luggage)
      return res.status(400).json({ error: "All fields are required." });

    const luggageWeight = parseInt(luggage) || 0;
    const cost = 50 + luggageWeight * 10;
    const helper = getRandomHelper();

    const prompt = `
You are an AI travel and heritage assistant.
List 3 to 5 famous tourist or heritage places in ${arrival_city}, India.
Return only JSON array like:
[
  {"place": "PLACE NAME", "tagline": "IMPACTFUL LINE"}
]
    `;

    console.log(`[Request] Generating travel info for ${arrival_city}...`);
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    });

    let text = typeof response.text === "function" ? response.text() : response.text;
    let places = [];
    try {
      const start = text.indexOf('[');
      const end = text.lastIndexOf(']');
      places = start !== -1 && end !== -1 ? JSON.parse(text.substring(start, end + 1)) : [];
    } catch {
      places = [{ place: "Unknown", tagline: "Unable to fetch places." }];
    }

    res.json({
      booking_status: "Confirmed",
      name,
      arrival_city,
      arrival_time,
      luggage: luggageWeight,
      estimated_fare: cost,
      assigned_helper: helper,
      recommended_places: places
    });

  } catch (error) {
    console.error("Error in /api/book:", error.message);
    res.status(500).json({ error: "Booking failed.", details: error.message });
  }
});

// ---------- 2️⃣ /api/languages ----------
app.get("/api/languages", async (req, res) => {
  try {
    const prompt = `
List all official and major Indian languages in JSON format like:
[
  {"code": "hi", "name": "Hindi"},
  {"code": "ta", "name": "Tamil"},
  {"code": "te", "name": "Telugu"}
]
    `;
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    });

    let text = typeof response.text === "function" ? response.text() : response.text;
    let languages = [];
    try {
      const start = text.indexOf('[');
      const end = text.lastIndexOf(']');
      languages = start !== -1 && end !== -1 ? JSON.parse(text.substring(start, end + 1)) : [];
    } catch {
      languages = [
        { code: "hi", name: "Hindi" },
        { code: "ta", name: "Tamil" },
        { code: "te", name: "Telugu" },
        { code: "bn", name: "Bengali" },
        { code: "ml", name: "Malayalam" },
        { code: "gu", name: "Gujarati" }
      ];
    }

    res.json(languages);
  } catch (err) {
    console.error("Error fetching languages:", err);
    res.status(500).json({ error: "Failed to load languages" });
  }
});

// ---------- 3️⃣ /api/translate ----------
app.post('/api/translate', async (req, res) => {
  try {
    const { text, language } = req.body;
    if (!text || !language)
      return res.status(400).json({ error: "Both text and language are required." });

    const prompt = `
Translate the following English text into ${language} (an Indian language).
Return only translated text without explanations or labels.
Text: """${text}"""
    `;

    console.log(`[Translate] to ${language}: ${text.slice(0, 40)}...`);
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    });

    let translated = typeof response.text === "function" ? response.text() : response.text;
    translated = translated.replace(/\n/g, " ").trim();

    res.json({ translatedText: translated });

  } catch (error) {
    console.error("Error in /api/translate:", error.message);
    res.status(500).json({ error: "Translation failed.", details: error.message });
  }
});

// ---------- Start Server ----------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
