
import { GoogleGenAI } from "@google/genai";

export const generateLoveStory = async (bride: string, groom: string, details: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Write a short, romantic, and poetic wedding "Love Story" or invitation message in Indonesian for a couple named ${bride} and ${groom}. 
  Incorporate these details: ${details}. 
  The tone should be elegant and heartwarming, suitable for a digital wedding invitation. 
  Keep it between 100-150 words. Do not use placeholders, write as a finished text.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Love is a journey, and today we start our forever.";
  } catch (error) {
    console.error("Error generating story:", error);
    return "Cinta adalah perjalanan indah yang kami mulai bersama hari ini. Terima kasih telah menjadi bagian dari cerita kami.";
  }
};
