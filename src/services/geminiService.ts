import { GoogleGenAI, Type } from "@google/genai";
import { Movie, EmotionalData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function enhanceMovieMetadata(movie: Partial<Movie>): Promise<Partial<Movie>> {
  if (!movie.title) return movie;

  const prompt = `分析电影 "${movie.title}"。
  请以 JSON 格式提供以下内容：
  1. 一句该电影的经典台词（中文）。
  2. 准确的 3 个情绪标签（例如：#忧郁, #史诗, #浪漫）。
  3. 包含 5 个维度的情感特质分析（例如："剧情", "画面", "情感", "节奏", "深度"），每个维度的值在 0-100 之间。
  4. 适合该电影详情页的审美主色调（Hex 格式）。`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            quote: { type: Type.STRING },
            moodTags: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            emotionalProfile: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING },
                  intensity: { type: Type.NUMBER }
                },
                required: ["label", "intensity"]
              }
            },
            primaryColor: { type: Type.STRING }
          },
          required: ["quote", "moodTags", "emotionalProfile", "primaryColor"]
        }
      }
    });

    const result = JSON.parse(response.text);
    return {
      ...movie,
      quote: movie.quote || result.quote,
      moodTags: movie.moodTags && movie.moodTags.length > 0 ? movie.moodTags : result.moodTags,
      emotionalProfile: movie.emotionalProfile && movie.emotionalProfile.length > 0 ? movie.emotionalProfile : result.emotionalProfile,
      primaryColor: movie.primaryColor || result.primaryColor
    };
  } catch (error) {
    console.error("Gemini Enhancement Error:", error);
    return movie;
  }
}
