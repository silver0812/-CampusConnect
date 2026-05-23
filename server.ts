import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client lazily
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (aiClient) return aiClient;
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not defined in environment secrets. Using fallback AI generation mode.");
    return null;
  }
  try {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    return aiClient;
  } catch (error) {
    console.error("Failed to initialize GoogleGenAI client:", error);
    return null;
  }
}

// REST APIs
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date() });
});

// Gemini Endpoint for AI Assistant Creator
app.post("/api/gemini/generate", async (req, res) => {
  const { topic, category, tone, description } = req.body;
  if (!topic) {
    return res.status(400).json({ error: "Topic is required" });
  }

  const ai = getGeminiClient();
  if (!ai) {
    // Elegant simulation fallback so the app works perfectly offline / pre-key
    const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const generatedFallback = `📢 FALLBACK AI DRAFT: Campus Announcement

Topic: ${topic}
Category: ${category || 'general'}
Tone: ${tone || 'professional'}

Fellow Students,

We are excited to share an update regarding "${topic}". ${description || 'This initiative is designed to enhance student life and foster collaborative committee efforts across CampusConnect.'}

What you need to know:
• Active engagement is key to student-led growth.
• Detailed coordination will happen in respective committees.
• More updates will be posted to the Schedules channel.

Stay tuned for more information directly on the dashboard!

Best regards,
Your CampusConnect Team
Date: ${dateStr}`;

    return res.json({ text: generatedFallback, isFallback: true });
  }

  try {
    const prompt = `Write a polished, engaging student organization announcement for CampusConnect.
    Topic: ${topic}
    Category: ${category}
    Tone: ${tone}
    Rough Context/Description: ${description || 'No additional files or notes added.'}
    
    Structure it beautifully with titles, sections, and clear bullet points. Keep it under 200 words. Do not use generic markdown headers that are too large - use neat emojis and bold text for bullet headers.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    res.json({ text: response.text, isFallback: false });
  } catch (err: any) {
    console.error("Gemini API Error in /generate:", err);
    res.json({ 
      text: `⚠️ AI Generation encountered an error: ${err.message || 'Unknown network error'}.\nBut don't worry, your topic is: "${topic}". Try writing an announcement manually or verify your environment.`, 
      error: true 
    });
  }
});

// Gemini Endpoint to Smart Summarize Discussions and Generate Tasks
app.post("/api/gemini/summarize", async (req, res) => {
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "Messages array is required for summary" });
  }

  const ai = getGeminiClient();
  const conversationText = messages.map(m => `${m.senderName} (${m.senderRole}): ${m.content}`).join("\n");

  if (!ai) {
    // Simulation fallback
    const mockSummary = `📊 SIMULATED DISCUSSION SUMMARY:
    
The committee discussed operational deadlines and immediate responsibilities.
Key points:
• Task delegation is required to address urgent topics.
• Regular follow-ups maintain progress on open agendas.

🎯 AUTO-GENERATED TASKS:
1. "Follow up on group discussion details" (Medium Priority)
2. "Outline next structural phases" (High Priority)`;

    return res.json({ text: mockSummary, isFallback: true });
  }

  try {
    const prompt = `Analyze this committee conversation transcript and write:
1. A concise, professional 3-sentence summary of the discussion.
2. An actionable list of exactly 2 - 3 tasks that must be added to the task board, formatted with a suggested Title, suggested priority (low, medium, high), and justification.

Committee Conversation:
${conversationText}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    res.json({ text: response.text, isFallback: false });
  } catch (err: any) {
    console.error("Gemini API Error in /summarize:", err);
    res.json({ 
      text: `⚠️ Summarizer error: ${err.message || 'Unknown error'}. Try reviewing the messages manually!`, 
      error: true 
    });
  }
});

// Vite Integration
async function initializeApp() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in development mode with Vite middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in production mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CampusConnect Server listening on http://localhost:${PORT}`);
  });
}

initializeApp().catch((err) => {
  console.error("Failed to start CampusConnect server:", err);
});
