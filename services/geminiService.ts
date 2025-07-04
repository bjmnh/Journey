import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import type { CharacterSheet, ChatMessage, Trope } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const parseJsonResponse = <T,>(text: string): T | null => {
  let jsonStr = text.trim();
  const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
  const match = jsonStr.match(fenceRegex);
  if (match && match[2]) {
    jsonStr = match[2].trim();
  }
  try {
    return JSON.parse(jsonStr) as T;
  } catch (e) {
    console.error("Failed to parse JSON response:", e);
    return null;
  }
};

/**
 * Analyzes the user's character sheet to identify narrative tropes.
 */
export const analyzeCharacterSheet = async (characterSheet: CharacterSheet): Promise<Trope[]> => {
  const prompt = `
    You are an expert narrative analyst and literary critic. Your task is to analyze the following user-provided 'character sheet' and identify the 3 to 5 most prominent TV Tropes that describe this person's current life situation.

    Focus on their primary struggles, passions, and social dynamics. Do not be literal; infer the underlying archetype. For each trope you identify, provide a one-sentence, user-facing description of what that trope means in this context.

    Your response MUST be a valid JSON object with a single key "tropes", which is an array of objects. Each object must have two keys: "name" (string) and "description" (string). Ensure all string values in the JSON are properly escaped, especially for the "description".

    Character Sheet Data:
    ---
    ${JSON.stringify(characterSheet, null, 2)}
    ---
  `;

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-04-17",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    },
  });

  const result = parseJsonResponse<{ tropes: Trope[] }>(response.text);
  return result?.tropes || [];
};

/**
 * Generates a follow-up question and choices based on the conversation history.
 */
export const getChatResponse = async (
  characterSheet: CharacterSheet,
  messages: ChatMessage[]
): Promise<{ question: string; choices: string[] }> => {
  const prompt = `
    You are an insightful and empathetic life coach AI. Your goal is to help the user explore their identity by asking one targeted, open-ended question based on their profile and recent conversation.

    CONTEXT:
    - User Profile: ${JSON.stringify(characterSheet, null, 2)}
    - Recent Conversation History: ${JSON.stringify(messages.slice(-6), null, 2)}

    INSTRUCTIONS:
    1. Analyze all context to identify a point of tension, a recent change, or an unexplored passion.
    2. Formulate a single, thoughtful question about this topic.
    3. Propose 3-4 plausible answer choices. The choices should represent a trope-confirming action, a trope-subverting action, and a neutral option.
    4. Your response MUST be a single, valid JSON object with two keys: "question" (string) and "choices" (array of strings). Ensure all string values in the JSON are properly escaped.
  `;

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-04-17",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    },
  });

  const fallbackResponse = {
    question: "I'm not sure what to say. Could you tell me more about your day?",
    choices: ["Sure.", "Not really.", "Let's change the topic."],
  };

  const result = parseJsonResponse<{ question: string; choices: string[] }>(response.text);
  return result || fallbackResponse;
};
