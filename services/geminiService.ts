import { GoogleGenAI, Type, Modality } from "@google/genai";
import { languages, LanguageCode } from '../lib/translations';

export type AnalysisResult = {
  verdict: string;
  feedback: string;
  compatibilityScore?: number;
  suggestion?: string;
  colorSuggestions?: string;
};

// Helper function to convert File to a Gemini-compatible part
const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      } else {
        resolve('');
      }
    };
    reader.readAsDataURL(file);
  });
  
  const base64EncodedData = await base64EncodedDataPromise;

  return {
    inlineData: {
      data: base64EncodedData,
      mimeType: file.type,
    },
  };
};

const PROMPT_OUTFIT = `You are an expert fashion stylist with a friendly and approachable communication style. Your goal is to give advice that is easy to understand and encouraging. Analyze the provided image of a person and their clothing. Focus on the pairing of the top and bottom garments. 
Consider color coordination, style compatibility, pattern matching, and how the overall outfit complements the person's presentation, skin tone, and visible facial features.
Provide your response in a JSON format with two keys: "verdict" and "feedback".
- "verdict": A short, catchy title for the analysis (e.g., "A Perfect Match!", "Bold and Stylish!", "Good, but could be great!").
- "feedback": A paragraph of constructive feedback and suggestions. Be positive and encouraging in your tone, explaining why the outfit works or offering specific ideas for improvement. **Use clear, simple, and everyday English, avoiding overly technical fashion jargon.**`;

const PROMPT_PAIR = `You are an expert personal stylist and digital artist. Your most important task is to create a virtual try-on image. You will receive three images: one of a person's face, and two of clothing items.
You MUST generate a new, photorealistic image showing the exact person from the face photo wearing the two clothing items. It is critical that you preserve the person's exact facial identity. Do not generate a new person or alter their facial features in any way. This is your primary goal.

After creating the image, you will also provide a fashion analysis of the outfit as a JSON object.
Your analysis should evaluate how the clothing items work together and if they complement the person's features (skin tone, hair color, etc.).

**JSON Analysis Requirements:**
Provide your JSON response with five keys: "compatibilityScore", "verdict", "feedback", "suggestion", and "colorSuggestions". **All text must be in a friendly, conversational tone using simple, everyday English.**
- "compatibilityScore": An integer between 1 (terrible match) and 10 (perfect match).
- "verdict": A short, catchy title for the analysis.
- "feedback": A detailed paragraph explaining your reasoning, focusing on the harmony between the clothes and the person.
- "suggestion": A creative suggestion for a third item (like accessories, shoes, or a jacket) to complete the outfit.
- "colorSuggestions": If the pairing is not a good match (score below 6), YOU MUST provide specific, actionable suggestions for alternative color palettes or clothing styles that would be more flattering (e.g., "These cool tones might wash you out; try warmer earth tones like olive green or rust."). If the match is good, state that the colors are an excellent choice.

**Image Generation Requirements (Recap):**
- The main output is the generated image.
- The person in the image MUST be the same person from the face photo. Do not change their face. This is the most important instruction.
- The clothing items should be accurately represented and styled on the person.
- The final image must be high-quality and realistic.`;

const PROMPT_SAREE = `You are an expert personal stylist and digital artist specializing in traditional Indian attire. Your most important task is to create a virtual try-on image. You will receive two images: one of a person's face and one of a saree.
You MUST generate a new, photorealistic image showing the exact person from the face photo wearing the saree. It is critical that you preserve the person's exact facial identity. Do not generate a new person or alter their facial features in any way. This is your primary goal.

After creating the image, you will also provide a fashion analysis of the look as a JSON object.
Your analysis should evaluate how the saree's color, pattern, and fabric complement the person's features (skin tone, hair color, etc.).

**JSON Analysis Requirements:**
Provide your JSON response with five keys: "compatibilityScore", "verdict", "feedback", "suggestion", and "colorSuggestions". **All text must be in a friendly, conversational tone using simple, everyday English.**
- "compatibilityScore": An integer between 1 (terrible match) and 10 (perfect match).
- "verdict": A short, catchy title for the analysis.
- "feedback": A detailed paragraph explaining your reasoning, focusing on the harmony between the saree and the person.
- "suggestion": A detailed set of accessory recommendations. You MUST provide specific suggestions for each of the following: 1. **Jewelry**: Recommend specific types of earrings AND a necklace (e.g., "Jhumka earrings with a matching choker necklace"). 2. **Clutch Bag**: Suggest a style and color of a clutch bag (e.g., "A gold sequined clutch" or "A traditional potli bag"). 3. **Footwear**: Recommend an appropriate type of footwear (e.g., "Elegant stiletto heels" or "Embellished juttis").
- "colorSuggestions": If the saree is not a good match (score below 6), YOU MUST provide specific, actionable suggestions for alternative color palettes or saree styles that would be more flattering (e.g., "This bright color might overwhelm your features; try softer pastel shades or deep jewel tones."). If the match is good, state that the colors are an excellent choice.

**Image Generation Requirements (Recap):**
- The main output is the generated image.
- The person in the image MUST be the same person from the face photo. Do not change their face. This is the most important instruction.
- The saree should be accurately draped and styled on the person.
- The final image must be high-quality and realistic.`;


const callGemini = async (prompt: string, images: File[], schema: any): Promise<AnalysisResult> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable is not set.");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const imageParts = await Promise.all(images.map(fileToGenerativePart));

    try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: {
              parts: [
                  ...imageParts,
                  { text: prompt }
              ]
          },
          config: {
            responseMimeType: "application/json",
            responseSchema: schema
          }
        });
        
        // The API is configured to return JSON, so we can parse it directly.
        const responseText = response.text;
        return JSON.parse(responseText) as AnalysisResult;

    } catch (error) {
        console.error("Gemini API call failed:", error);
        throw new Error("Failed to get analysis from AI. Please check the console for more details.");
    }
}

export const analyzeClothingPair = async (imageFile: File, language: LanguageCode): Promise<AnalysisResult> => {
    const languageName = languages[language];
    const finalPrompt = `${PROMPT_OUTFIT}\n\nIMPORTANT: Provide your entire analysis in ${languageName}.`;

    const schema = {
        type: Type.OBJECT,
        properties: {
            verdict: { type: Type.STRING },
            feedback: { type: Type.STRING }
        },
        required: ["verdict", "feedback"]
    };
    return callGemini(finalPrompt, [imageFile], schema);
};

const analyzeAndGenerateImage = async (prompt: string, images: File[], language: LanguageCode): Promise<{ analysis: AnalysisResult, generatedImage: string | null }> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable is not set.");
    }
    
    const languageName = languages[language];
    const finalPrompt = `${prompt}\n\nIMPORTANT: Provide your entire JSON analysis in ${languageName}.`;

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const imageParts = await Promise.all(images.map(fileToGenerativePart));

    try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image-preview',
          contents: {
              parts: [
                  ...imageParts,
                  { text: finalPrompt }
              ]
          },
          config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
          }
        });

        let analysis: AnalysisResult | null = null;
        let generatedImage: string | null = null;

        for (const part of response.candidates[0].content.parts) {
            if (part.text) {
                try {
                    const rawText = part.text;
                    // Find the start and end of the JSON object
                    const jsonStart = rawText.indexOf('{');
                    const jsonEnd = rawText.lastIndexOf('}');

                    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
                        const jsonString = rawText.substring(jsonStart, jsonEnd + 1);
                        analysis = JSON.parse(jsonString);
                    } else {
                        throw new Error("Could not find a valid JSON object in the AI's text response.");
                    }
                } catch(e) {
                    console.error("Failed to parse JSON from text part:", e);
                    console.error("Raw text received from AI:", part.text); // Log raw text for debugging
                    // Create a fallback error object to display to the user.
                    analysis = {
                        verdict: "Analysis Error",
                        feedback: "The AI returned a text response, but it could not be parsed as valid JSON. This can sometimes happen with complex images. Please try again. Raw text: \n" + part.text,
                    };
                }
            } else if (part.inlineData) {
                generatedImage = part.inlineData.data;
            }
        }
        
        if (!analysis) {
            throw new Error("AI response did not contain a valid text analysis part.");
        }

        return { analysis, generatedImage };

    } catch (error) {
        console.error("Gemini API call failed:", error);
        throw new Error("Failed to get analysis from AI. Please check the console for more details.");
    }
}


export const analyzePairCompatibility = async (faceImageFile: File, itemImageFile1: File, itemImageFile2: File, language: LanguageCode): Promise<{ analysis: AnalysisResult, generatedImage: string | null }> => {
    return analyzeAndGenerateImage(PROMPT_PAIR, [faceImageFile, itemImageFile1, itemImageFile2], language);
}

export const analyzeSareeCompatibility = async (faceImageFile: File, sareeImageFile: File, language: LanguageCode): Promise<{ analysis: AnalysisResult, generatedImage: string | null }> => {
    return analyzeAndGenerateImage(PROMPT_SAREE, [faceImageFile, sareeImageFile], language);
}
