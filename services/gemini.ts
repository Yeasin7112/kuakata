
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateProductDescription = async (productName: string, category: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Write a short, appetizing or inviting 2-line description for a ${category} product named "${productName}" in Kuakata. Provide it in English and Bengali. Format: English | Bengali`,
    });
    return response.text;
  } catch (error) {
    console.error("AI Description Error:", error);
    return "Great choice for your stay/meal! | এটি আপনার জন্য চমৎকার পছন্দ!";
  }
};

export const generateTourPlan = async (days: number) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Create a detailed ${days}-day tourism itinerary for Kuakata, Patuakhali, Bangladesh. Focus on sunrise/sunset, local food, Lebur Chor. Response in JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            itinerary: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.NUMBER },
                  title: { type: Type.STRING },
                  activities: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["day", "title", "activities"]
              }
            }
          }
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    return null;
  }
};

export const getLiveInfo = async (query: string, lat?: number, lng?: number) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: query,
      config: {
        tools: [{ googleMaps: {} }, { googleSearch: {} }],
        toolConfig: lat && lng ? {
          retrievalConfig: { latLng: { latitude: lat, longitude: lng } }
        } : undefined
      },
    });
    const text = response.text;
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((chunk: any) => {
        if (chunk.maps) return { title: chunk.maps.title, uri: chunk.maps.uri };
        if (chunk.web) return { title: chunk.web.title, uri: chunk.web.uri };
        return null;
      }).filter(Boolean) || [];
    return { text, sources };
  } catch (error) {
    return { text: "তথ্য লোড করতে সমস্যা হয়েছে।", sources: [] };
  }
};
