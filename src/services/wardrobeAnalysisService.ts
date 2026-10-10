import { AIService, parseAIJSON } from './aiService'
import type { ClothingItem } from '../store/wardrobeStore'
import type { WeatherData } from './weatherService'
export interface OutfitAnalysis {
  recommendation: string
  reasoning: string
  confidence: number
  suggestedItems: string[]
  styleRating: number
}
function validate(text: string, items: ClothingItem[]): OutfitAnalysis {
  const value = parseAIJSON<OutfitAnalysis>(text)
  if (
    typeof value.recommendation !== 'string' ||
    !value.recommendation.trim() ||
    typeof value.reasoning !== 'string' ||
    !Number.isFinite(value.confidence) ||
    !Number.isFinite(value.styleRating) ||
    !Array.isArray(value.suggestedItems)
  )
    throw new Error('The model returned incomplete styling advice. Please retry.')
  return {
    ...value,
    confidence: Math.max(0, Math.min(1, value.confidence)),
    styleRating: Math.max(1, Math.min(10, value.styleRating)),
    suggestedItems: value.suggestedItems.filter((name) => items.some((item) => item.name === name)),
  }
}
export class WardrobeAnalysisService {
  private ai = new AIService()
  async analyzeCurrentOutfit(image: string, items: ClothingItem[]): Promise<OutfitAnalysis> {
    const response = await this.ai.analyzeImage(
      image,
      'Analyze the visible outfit and give practical styling advice. Available wardrobe: ' +
        JSON.stringify(items.map(({ name, color, category }) => ({ name, color, category }))) +
        '. Return JSON only with recommendation (string), reasoning (string), confidence (0 to 1), suggestedItems (exact wardrobe names only), styleRating (1 to 10). Ratings are subjective styling opinions.',
      false,
      true
    )
    return validate(response.choices[0].message.content, items)
  }
  async suggestOutfitForOccasion(
    items: ClothingItem[],
    occasion: string,
    weather?: WeatherData | null
  ): Promise<OutfitAnalysis> {
    if (!items.length) throw new Error('Add wardrobe items first.')
    return validate(
      (await this.ai.generateOutfitRecommendation(items, weather, occasion)).choices[0].message
        .content,
      items
    )
  }
  async compareOutfits(a: string[], b: string[], context: string): Promise<string> {
    return (
      await this.ai.chat(
        'Compare these outfits for ' + context + ': ' + a.join(', ') + ' versus ' + b.join(', ')
      )
    ).choices[0].message.content
  }
}
