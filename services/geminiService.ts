import { GoogleGenAI, Type } from "@google/genai";
import { TrackType } from '../types';

// NOTE: in a real app, API_KEY should come from process.env.API_KEY
// For this demo, we assume the environment is set up.
const API_KEY = process.env.API_KEY || ''; 

let ai: GoogleGenAI | null = null;

if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
}

export const generateTrackIdeas = async (prompt: string, genre: string): Promise<any> => {
  if (!ai) {
    // Mock response if no API key is present
    return {
      name: `${genre} generated track`,
      instrument: "Synth",
      type: TrackType.MIDI,
      suggestion: "Generated a syncopated rhythm based on typical patterns."
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate a creative track idea for a ${genre} song. The user prompt is: "${prompt}". 
      Return JSON with trackName, instrument, and a brief musical description.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            trackName: { type: Type.STRING },
            instrument: { type: Type.STRING },
            musicalDescription: { type: Type.STRING },
            suggestedBpm: { type: Type.NUMBER }
          }
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const masterTrackAnalysis = async (trackName: string): Promise<string> => {
  if (!ai) return "AI Analysis: Frequency balance looks good. Dynamic range is healthy.";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze the theoretical mix requirements for a ${trackName} stem in an Afro-pop context. Provide mixing advice in one short sentence.`
    });
    return response.text || "Analysis complete.";
  } catch (e) {
    return "Analysis failed.";
  }
}
