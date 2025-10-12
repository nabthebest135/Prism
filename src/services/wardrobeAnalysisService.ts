import { AIService } from './aiService'
import { ClothingItem } from '../store/wardrobeStore'

export interface OutfitAnalysis {
  recommendation: string
  reasoning: string
  confidence: number
  suggestedItems: string[]
  styleRating: number
}

export class WardrobeAnalysisService {
  private aiService = new AIService()

  async analyzeCurrentOutfit(imageBase64: string, wardrobeItems: ClothingItem[]): Promise<OutfitAnalysis> {
    const prompt = `Analyze this person's current outfit and provide styling advice.

Available wardrobe items: ${JSON.stringify(wardrobeItems.map(item => ({
  name: item.name,
  category: item.category,
  color: item.color,
  tags: item.tags
})))}

Please analyze:
1. What clothing items are currently being worn
2. How well they work together (style rating 1-10)
3. Suggest improvements using available wardrobe items
4. Provide styling reasoning

Return JSON format:
{
  "recommendation": "brief outfit advice",
  "reasoning": "detailed explanation",
  "confidence": 0.85,
  "suggestedItems": ["item names from wardrobe"],
  "styleRating": 7
}`

    try {
      const response = await this.aiService.analyzeImage(imageBase64, prompt)
      const result = response.choices?.[0]?.message?.content || '{}'
      
      try {
        return JSON.parse(result)
      } catch {
        // Fallback if JSON parsing fails
        return {
          recommendation: result,
          reasoning: "AI analysis completed",
          confidence: 0.7,
          suggestedItems: [],
          styleRating: 7
        }
      }
    } catch (error) {
      console.error('Outfit analysis error:', error)
      return {
        recommendation: "Looking good! Try experimenting with different combinations.",
        reasoning: "Analysis unavailable",
        confidence: 0.5,
        suggestedItems: [],
        styleRating: 6
      }
    }
  }

  async suggestOutfitForOccasion(
    wardrobeItems: ClothingItem[], 
    occasion: string, 
    weather?: any
  ): Promise<OutfitAnalysis> {
    const temp = weather?.temperature || 25
    const location = weather?.location || 'Unknown'
    
    try {
      const response = await this.aiService.generateOutfitRecommendation(wardrobeItems, weather, occasion)
      const result = response.choices?.[0]?.message?.content || '{}'
      
      try {
        return JSON.parse(result)
      } catch {
        return {
          recommendation: result,
          reasoning: "Perfect for the occasion",
          confidence: 0.8,
          suggestedItems: wardrobeItems.slice(0, 3).map(item => item.name),
          styleRating: 8
        }
      }
    } catch (error) {
      console.error('Outfit suggestion error:', error)
      return {
        recommendation: "Mix and match your favorite pieces!",
        reasoning: "Classic combinations work best",
        confidence: 0.6,
        suggestedItems: [],
        styleRating: 7
      }
    }
  }

  async compareOutfits(outfit1: string[], outfit2: string[], context: string): Promise<string> {
    try {
      const response = await this.aiService.translateText(
        `Compare these outfits for ${context}: ${outfit1.join(', ')} vs ${outfit2.join(', ')}`, 
        'en'
      )
      return response.choices?.[0]?.message?.content || 'Both outfits look great!'
    } catch (error) {
      return 'Both combinations have their merits. Choose what makes you feel confident!'
    }
  }
}