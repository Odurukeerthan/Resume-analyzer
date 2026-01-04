import { GoogleGenAI } from "@google/genai";

// Explicitly use ONLY .env key
if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY not found in .env");
}

export const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});
