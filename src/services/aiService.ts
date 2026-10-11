import type { ClothingItem } from '../store/wardrobeStore'
import type { WeatherData } from './weatherService'
export interface AIResponse {
  choices: { message: { content: string } }[]
}
export function parseAIJSON<T>(text: string): T {
  const cleaned = text
    .replace(/<think>[\s\S]*?<\/think>/g, '')
    .replace(/^```(?:json)?\s*|\s*```$/g, '')
    .trim()
  const start = cleaned.indexOf('{'),
    end = cleaned.lastIndexOf('}')
  if (start < 0 || end <= start)
    throw new Error('The model returned an incomplete result. Please retry.')
  return JSON.parse(cleaned.slice(start, end + 1)) as T
}
export class AIService {
  async testConnection() {
    const response = await fetch('/api/health')
    return response.ok && (await response.json()).ai
  }
  async chat(
    prompt: string,
    system = 'You are a helpful assistant. Be concise and acknowledge uncertainty.',
    image?: string,
    json = false
  ): Promise<AIResponse> {
    const content = image
      ? [
          { type: 'text', text: prompt },
          {
            type: 'image_url',
            image_url: {
              url: image.startsWith('data:') ? image : 'data:image/jpeg;base64,' + image,
            },
          },
        ]
      : prompt
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: system },
          { role: 'user', content },
        ],
        max_tokens: 900,
        json,
      }),
      signal: AbortSignal.timeout(190000),
    })
    const result = await response.json()
    if (!response.ok)
      throw new Error(
        typeof result.error === 'string'
          ? result.error
          : result.error?.message || 'Local AI request failed. Please retry.'
      )
    if (!result.choices?.[0]?.message?.content?.trim())
      throw new Error('The model returned no answer. Please retry.')
    return result
  }
  analyzeImage(image: string, prompt: string, conversational = true, json = false) {
    return this.chat(
      prompt,
      conversational
        ? 'You are a helpful visual assistant and stylist. Describe what is visible, give practical advice, and state uncertainty. Never invent identifying details about people or places.'
        : 'You are a professional visual assistant. State uncertainty.',
      image,
      json
    )
  }
  generateOutfitRecommendation(
    items: ClothingItem[],
    weather: WeatherData | null | undefined,
    occasion: string
  ) {
    return this.chat(
      'Suggest an outfit for ' +
        occasion +
        '. Weather: ' +
        JSON.stringify(weather ?? 'unavailable') +
        '. Wardrobe: ' +
        JSON.stringify(
          items.map(({ name, category, color, tags }) => ({ name, category, color, tags }))
        ) +
        '. Use ONLY listed item names. Return JSON with recommendation (string), reasoning (string), confidence (0 to 1), suggestedItems (array of exact item names), styleRating (1 to 10).',
      'You are a practical fashion stylist. Return valid JSON only.',
      undefined,
      true
    )
  }
  translateText(text: string, targetLanguage = 'en') {
    return this.chat(text, 'Translate to ' + targetLanguage + '. Return only the translation.')
  }
  predictConfidenceScore(image: string, personalStyle: string) {
    return this.analyzeImage(
      image,
      'Give subjective style feedback for preference ' +
        personalStyle +
        '. Do not claim to measure psychological confidence from a photo.'
    )
  }
  calculateComplimentProbability(image: string, occasion: string) {
    return this.analyzeImage(
      image,
      'Give styling advice for ' +
        occasion +
        '. Do not invent a probability of receiving compliments.'
    )
  }
}
