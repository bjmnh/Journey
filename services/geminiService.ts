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

    Include relevant symbols (emojis) in your trope names when appropriate to make them more visually engaging. For example: "🎭 The Reluctant Hero" or "📚 The Academic Overachiever".

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
  messages: ChatMessage[],
  currentTrope?: string | null
): Promise<{ question: string; choices: string[]; updatedCharacterSheet?: CharacterSheet }> => {
  const prompt = `
    You are an insightful and empathetic life coach AI. Your goal is to help the user explore their identity by asking one targeted, open-ended question based on their profile and recent conversation.

    CONTEXT:
    - User Profile: ${JSON.stringify(characterSheet, null, 2)}
    - Current Trope Being Discussed: ${currentTrope || 'General conversation'}
    - Recent Conversation History: ${JSON.stringify(messages.slice(-6), null, 2)}

    INSTRUCTIONS:
    1. Analyze all context to identify a point of tension, a recent change, or an unexplored passion.
    2. Formulate a single, thoughtful question about this topic.
    3. Propose 3-4 plausible answer choices. Include relevant symbols (emojis) in the choices when appropriate to make them more engaging.
    4. If the conversation reveals new insights about the user that should update their character sheet, include an "updatedCharacterSheet" field with the modified data.
    5. Your response MUST be a single, valid JSON object with these keys:
       - "question" (string): The follow-up question
       - "choices" (array of strings): Answer options with symbols when appropriate
       - "updatedCharacterSheet" (optional object): Only include if significant new information emerges

    IMPORTANT: Only update the character sheet if the conversation reveals substantial new information that wasn't previously captured. Minor clarifications don't warrant updates.
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
    choices: ["✨ Sure, let me share", "🤔 Not really", "🔄 Let's change the topic"],
  };

  const result = parseJsonResponse<{ 
    question: string; 
    choices: string[]; 
    updatedCharacterSheet?: CharacterSheet 
  }>(response.text);
  
  return result || fallbackResponse;
};