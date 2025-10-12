const OPENROUTER_API_KEY = (import.meta as any).env.VITE_OPENROUTER_API_KEY || 'your-openrouter-key'
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1'

export class AIService {
  private async makeRequest(endpoint: string, data: any) {
    console.log('AIService - Making request to:', `${OPENROUTER_BASE_URL}${endpoint}`)
    console.log('AIService - Request data:', JSON.stringify(data, null, 2))
    console.log('AIService - API Key present:', OPENROUTER_API_KEY ? 'Yes' : 'No')
    
    try {
      const response = await fetch(`${OPENROUTER_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Prism AR App'
        },
        body: JSON.stringify(data)
      })
      
      console.log('AIService - Response status:', response.status)
      console.log('AIService - Response ok:', response.ok)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('AIService - Error response:', errorText)
        throw new Error(`AI service error: ${response.status} ${response.statusText} - ${errorText}`)
      }
      
      const result = await response.json()
      console.log('AIService - Success response:', result)
      return result
    } catch (error) {
      console.error('AIService - Request failed:', error)
      throw error
    }
  }

  async analyzeImage(imageBase64: string, prompt: string) {
    return this.makeRequest('/chat/completions', {
      model: 'google/gemini-flash-1.5',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${imageBase64}` } }
          ]
        }
      ],
      max_tokens: 500
    })
  }

  async generateOutfitRecommendation(wardrobeItems: any[], weather: any, occasion: string) {
    return this.makeRequest('/chat/completions', {
      model: 'qwen/qwen-2.5-72b-instruct',
      messages: [
        {
          role: 'system',
          content: 'You are a fashion stylist AI. Recommend outfits based on wardrobe items, weather, and occasion.'
        },
        {
          role: 'user',
          content: `Weather: ${JSON.stringify(weather)}\nOccasion: ${occasion}\nWardrobe: ${JSON.stringify(wardrobeItems)}\n\nRecommend an outfit with reasoning.`
        }
      ],
      max_tokens: 300
    })
  }

  async translateText(text: string, targetLanguage: string = 'en') {
    return this.makeRequest('/chat/completions', {
      model: 'qwen/qwen-2.5-72b-instruct',
      messages: [
        {
          role: 'system',
          content: `Translate the following text to ${targetLanguage}. Only return the translation, no explanations.`
        },
        {
          role: 'user',
          content: text
        }
      ],
      max_tokens: 200
    })
  }
}