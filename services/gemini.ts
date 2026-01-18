
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Using gemini-3-pro-preview for complex itinerary planning tasks
export const generateTourPlan = async (days: number) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Create a detailed ${days}-day tourism itinerary for Kuakata, Patuakhali, Bangladesh. 
      Focus on sunrise/sunset, local food, Lebur Chor, Mishripara Buddhist Temple, and Jhao Bon.
      Suggest specific events or seasonal highlights if possible.
      Provide the response in JSON format.`,
      config: {
        // googleMaps tool removed as it is incompatible with responseMimeType: "application/json"
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
                  activities: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                },
                required: ["day", "title", "activities"]
              }
            }
          },
          required: ["itinerary"]
        }
      }
    });

    // response.text is a property, not a method
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Error generating tour plan:", error);
    return null;
  }
};

// getLiveInfo uses gemini-2.5-flash as it is required for Google Maps grounding
export const getLiveInfo = async (query: string, lat?: number, lng?: number) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: query,
      config: {
        tools: [{ googleMaps: {} }, { googleSearch: {} }],
        toolConfig: lat && lng ? {
          retrievalConfig: {
            latLng: { latitude: lat, longitude: lng }
          }
        } : undefined
      },
    });

    // response.text is a property
    const text = response.text;
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((chunk: any) => {
        if (chunk.maps) return { title: chunk.maps.title, uri: chunk.maps.uri };
        if (chunk.web) return { title: chunk.web.title, uri: chunk.web.uri };
        return null;
      })
      .filter(Boolean) || [];

    return { text, sources };
  } catch (error) {
    console.error("Error fetching live info:", error);
    return { text: "তথ্য লোড করতে সমস্যা হয়েছে।", sources: [] };
  }
};
