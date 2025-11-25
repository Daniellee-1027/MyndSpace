import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ChatMessage, Subject } from "../types";

let aiClient: GoogleGenAI | null = null;

// Initialize the client securely
const getClient = (): GoogleGenAI => {
  if (!aiClient) {
    const apiKey = process.env.API_KEY || '';
    if (!apiKey) {
      console.error("API_KEY is missing from environment variables.");
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
};

export const generateTutorResponse = async (
  messages: ChatMessage[],
  subject: Subject
): Promise<string> => {
  const client = getClient();
  
  // Format history for the model
  // We take the last few messages to keep context window manageable for a prototype
  const historyText = messages.slice(-5).map(m => `${m.senderName}: ${m.text}`).join('\n');
  
  const systemPrompt = `
    You are a friendly and knowledgeable AI Study Tutor specializing in ${subject}. 
    You are currently in a virtual study room with a student.
    
    Your goals:
    1. Answer specific questions about ${subject}.
    2. Help break down complex topics.
    3. If the user is chatting casually, encourage them gently to get back to focus or suggest a study technique (like Pomodoro).
    4. Keep answers concise (under 150 words) unless asked for a deep dive.
    
    Recent Chat Context:
    ${historyText}
    
    Respond as the AI Tutor:
  `;

  try {
    const response: GenerateContentResponse = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: messages[messages.length - 1].text, // The latest user prompt
      config: {
        systemInstruction: systemPrompt,
      }
    });

    return response.text || "I'm having trouble thinking right now. Let's try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I lost connection to the knowledge base. Please check your API key.";
  }
};