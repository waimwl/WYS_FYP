import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Language, RecipeResponse } from '../types';

const getResponseSchema = (): Schema => {
  const ingredientSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      name: { type: Type.STRING, description: "Name" },
      marketQuantity: { type: Type.STRING, description: "HK Market unit (e.g. 半斤, 4兩)" },
      supermarketQuantity: { type: Type.STRING, description: "Metric unit (e.g. 300g, 1 pack)" },
      prices: {
        type: Type.OBJECT,
        properties: {
          market: { type: Type.INTEGER, description: "HKD price (wet market)" },
          supermarket: { type: Type.INTEGER, description: "HKD price (supermarket)" }
        },
        required: ["market", "supermarket"]
      },
      notes: { type: Type.STRING, description: "Very brief note" }
    },
    required: ["name", "marketQuantity", "supermarketQuantity", "prices", "notes"]
  };

  return {
    type: Type.OBJECT,
    properties: {
      dishes: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "Dish Name" },
            ingredients: { type: Type.ARRAY, items: ingredientSchema },
            cookingSteps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Concise steps"
            }
          },
          required: ["name", "ingredients", "cookingSteps"]
        }
      },
      commonIngredients: {
        type: Type.ARRAY,
        items: ingredientSchema,
        description: "Shared items (oil, rice, etc)"
      },
      portionSize: { type: Type.INTEGER },
      shoppingTips: { type: Type.ARRAY, items: { type: Type.STRING } },
      wastePreventionTip: { type: Type.STRING }
    },
    required: ["dishes", "commonIngredients", "portionSize", "shoppingTips", "wastePreventionTip"]
  };
};

export const generateMealPlan = async (
  familySize: number,
  dishDescription: string,
  language: Language
): Promise<RecipeResponse> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const languageContext = {
    'en': 'English',
    'zh-HK': 'Traditional Chinese (HK)',
    'zh-CN': 'Simplified Chinese'
  }[language];

  // Optimized prompt for speed
  const prompt = `
    Role: HK Chef. Task: Shopping list & steps for "${dishDescription}" (${familySize} ppl).
    
    Output JSON:
    1. Dishes: Split by dish.
    2. Common: Shared items (rice, oil, salt).
    3. Units:
       - Market: 斤/兩/份.
       - Supermarket: g/kg/pack.
    4. Prices (HKD): Wet Market vs Supermarket.
    5. Steps: Concise instructions.
    
    Language: ${languageContext}.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: getResponseSchema(),
        // Disable thinking budget to maximize speed for this task
        thinkingConfig: { thinkingBudget: 0 }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response");
    }

    return JSON.parse(text) as RecipeResponse;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};