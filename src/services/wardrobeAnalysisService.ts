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
    
    const prompt = `You are a fashion stylist. Create outfit recommendation for ${occasion} in ${location}.

Weather: ${temp}°C, ${weather?.condition || 'Clear'}

Available wardrobe items:
${wardrobeItems.map(item => `- ${item.name} (${item.category}, ${item.color})`).join('\n')}

For temperature ${temp}°C:
- If 35°C+: Choose light, breathable fabrics (cotton shorts, tank tops, sandals)
- If 30-35°C: Light clothing (linen shorts, cotton shirts, sneakers) 
- If 25-30°C: Comfortable casual (light pants, t-shirts)
- If 20-25°C: Light layers (jeans, light sweater)
- If 15-20°C: Warm layers (jacket, long pants)
- If <15°C: Heavy layers (coat, boots)

Select specific items from the wardrobe that match the temperature. Return JSON:
{
  "recommendation": "Specific outfit: [item1] + [item2] + [item3]",
  "reasoning": "Perfect for ${temp}°C weather because...",
  "confidence": 0.9,
  "suggestedItems": ["exact item names from wardrobe"],
  "styleRating": 8
}`

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
    const prompt = `Compare these two outfit combinations for ${context}:

Outfit 1: ${outfit1.join(', ')}
Outfit 2: ${outfit2.join(', ')}

Which is better and why? Keep response under 100 words.`

    try {
      const response = await this.aiService.translateText(prompt, 'en') // Reusing translation endpoint
      return response.choices?.[0]?.message?.content || 'Both outfits look great!'
    } catch (error) {
      return 'Both combinations have their merits. Choose what makes you feel confident!'
    }
  }
}