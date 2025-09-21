
import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const getRefinePrompt = (fieldName: string, text: string): string => {
  switch (fieldName) {
    case 'summary':
      return `As a professional resume writing expert, rewrite the following professional summary to be compelling and concise for a CV. Highlight key strengths and career goals. Keep the tone professional and impactful. Original summary: "${text}"`;
    case 'workDescription':
      return `As a professional resume writing expert, rewrite the following job description to be more impactful for a CV. Use strong action verbs and focus on achievements and quantifiable results. Format the output as bullet points starting with '-'. Original description: "${text}"`;
    default:
      return `Refine the following text for a professional resume: "${text}"`;
  }
};

export const refineTextWithGemini = async (
  fieldName: 'summary' | 'workDescription',
  text: string
): Promise<string> => {
  try {
    const prompt = getRefinePrompt(fieldName, text);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            refinedText: {
              type: Type.STRING,
              description: 'The refined text for the resume section.'
            }
          }
        },
        temperature: 0.5,
      },
    });
    
    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);

    if (result && typeof result.refinedText === 'string') {
      return result.refinedText;
    } else {
      console.error('Unexpected JSON structure from Gemini:', result);
      return text; // Fallback to original text
    }

  } catch (error) {
    console.error('Error calling Gemini API:', error);
    // In case of an error, return the original text
    return text;
  }
};
