
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { UserProfile, FoodAnalysis } from "../types";

// The API client is initialized with the injected environment key.
// Always use the process.env.API_KEY as per guidelines.
const getAIClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Universal Food Analyzer
 * Handles OCR for labels AND Computer Vision for real, whole foods.
 */
export async function analyzeFoodImage(imageBase64: string, profile: UserProfile): Promise<FoodAnalysis> {
  const ai = getAIClient();
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: imageBase64
            }
          },
          {
            text: `SYSTEM: You are the NutriScan AI Professional Dietician Backend.
            
            USER CONTEXT: ${JSON.stringify(profile)}
            
            DIRECTIONS:
            1. VISUAL IDENTIFICATION: If the image is a meal or fresh food (e.g., an apple, a plate of eggs), identify it visually.
            2. OCR EXTRACTION: If a nutrition label is present, extract exact values.
            3. ANALYSIS: Determine if this food helps or hinders the user's goal: ${profile.goals}.
            4. ESTIMATION: If visual, estimate volume (e.g., "1 medium bowl") and calculate nutrition based on standard databases.
            
            RESPONSE SCHEMA (JSON):
            {
              "name": "Name of dish or product",
              "healthScore": 0-100,
              "rating": "healthy" | "moderate" | "unhealthy",
              "metrics": {
                "sugar": number (grams),
                "fat": number (grams),
                "salt": number (mg),
                "calories": number (kcal),
                "protein": number (grams),
                "fiber": number (grams)
              },
              "summary": "Professional nutritional breakdown.",
              "recommendation": "Specific advice for this user's lifestyle."
            }`
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            healthScore: { type: Type.NUMBER },
            rating: { type: Type.STRING },
            metrics: {
              type: Type.OBJECT,
              properties: {
                sugar: { type: Type.NUMBER },
                fat: { type: Type.NUMBER },
                salt: { type: Type.NUMBER },
                calories: { type: Type.NUMBER },
                protein: { type: Type.NUMBER },
                fiber: { type: Type.NUMBER }
              }
            },
            summary: { type: Type.STRING },
            recommendation: { type: Type.STRING }
          }
        }
      }
    });

    const result = JSON.parse(response.text || '{}');
    return {
      ...result,
      id: Date.now().toString(),
      timestamp: Date.now()
    };
  } catch (error) {
    console.error("Backend Error:", error);
    throw new Error("NutriScan Backend could not process the image. Please check your connection.");
  }
}

export async function getDieticianResponse(message: string, history: any[], profile: UserProfile) {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [...history, { role: 'user', parts: [{ text: message }] }],
    config: {
      systemInstruction: `You are NutriScan AI Assistant. User Profile: ${JSON.stringify(profile)}. Provide expert nutritional advice.`
    }
  });
  return response.text;
}

export async function generateHealthAudio(text: string): Promise<string> {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  });
  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || '';
}

// Audio Decoding Utilities
export function decodeAudio(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
  return bytes;
}

export async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
  }
  return buffer;
}
