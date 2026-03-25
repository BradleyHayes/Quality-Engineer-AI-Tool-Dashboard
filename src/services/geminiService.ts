import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function generateResponse(prompt: string, systemInstruction?: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        systemInstruction: systemInstruction || "You are Aura, a high-performance AI assistant designed for productivity and development. Provide concise, accurate, and helpful responses.",
      },
    });
    return response.text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("AI Error:", error);
    return "Error: Failed to connect to AI services. Please check your API key.";
  }
}

export async function generateCode(prompt: string) {
  return generateResponse(prompt, "You are an expert software engineer. Provide high-quality code snippets with explanations. Use markdown formatting.");
}

export async function researchTopic(topic: string) {
  return generateResponse(`Research the following topic and provide a structured summary with key points: ${topic}`, "You are a research assistant. Provide detailed, well-structured summaries of complex topics.");
}
