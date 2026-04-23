import { GoogleGenAI, Type } from "@google/genai";
import { Fund } from "../types";

// Helper to safely get the API key
const getApiKey = (): string | undefined => {
  return process.env.API_KEY;
};

export const filterFundsWithGemini = async (
  query: string,
  allFunds: Fund[]
): Promise<{ relevantIds: string[]; reasoning: string }> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.warn("No API Key available for Gemini.");
    return { relevantIds: [], reasoning: "API Key missing. Please configure key." };
  }

  const ai = new GoogleGenAI({ apiKey });

  // Prepare a more detailed summary for the model to analyze
  const fundsSummary = allFunds.map(f => ({
    id: f.id,
    title: f.title,
    description: f.description,
    sectors: f.sectors.join(", "),
    fundingType: f.fundingType.join(", "),
    startupStage: f.startupStage.join(", "),
    source: f.source,
  }));

  const prompt = `
    You are a helpful fund and grant discovery assistant.
    User's Goal: "${query}"
    
    Here is a list of available funds and grants:
    ${JSON.stringify(fundsSummary)}

    Task:
    1.  Analyze the user's goal and identify which of the listed funds are most relevant. 
        Consider the title, description, sectors, funding type, and startup stage.
    2.  Return a JSON object. This object must contain:
        a) 'relevantIds': An array of strings, where each string is the 'id' of a relevant fund.
        b) 'reasoning': A short, helpful string (max 2-3 sentences) explaining *why* these specific funds were chosen to match the user's goal.

    If no funds are relevant, return an empty 'relevantIds' array and a polite explanation in 'reasoning'.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            relevantIds: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            reasoning: { type: Type.STRING },
          },
          required: ["relevantIds", "reasoning"]
        },
      },
    });

    const jsonText = response.text;
    if (jsonText) {
      return JSON.parse(jsonText);
    }
    return { relevantIds: [], reasoning: "No response from AI." };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { relevantIds: [], reasoning: "Error connecting to AI service." };
  }
};
