const OPENROUTER_API_KEY = (import.meta as any).env.VITE_OPENROUTER_API_KEY
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1'

export class AIService {
  // Test if API is working
  async testConnection() {
    try {
      console.log('Testing API connection...')
      const response = await this.makeRequest('/chat/completions', {
        model: 'meta-llama/llama-4-maverick:free',
        messages: [{ role: 'user', content: 'Hello' }],
        max_tokens: 5
      })
      console.log('API test successful:', response)
      return true
    } catch (error) {
      console.error('API test failed:', error)
      return false
    }
  }

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

  async analyzeImage(imageBase64: string, prompt: string, conversational: boolean = true) {
    const systemPrompt = conversational ? 
      'You are a friendly, enthusiastic fashion expert who talks like a best friend. Use casual language, emojis, and be encouraging. Give honest but kind advice.' :
      'You are a professional fashion expert.'
    
    return this.makeRequest('/chat/completions', {
      model: 'meta-llama/llama-4-maverick:free',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${imageBase64}` } }
          ]
        }
      ],
      max_tokens: 600
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

  async predictConfidenceScore(imageBase64: string, personalStyle: string) {
    const prompt = `You are a psychology and fashion expert. Analyze this outfit and predict the confidence score (1-10) the wearer will feel. Consider:\n\n` +
      `Personal style preference: ${personalStyle}\n\n` +
      `Factors to analyze:\n` +
      `1. Color psychology and mood impact\n` +
      `2. Fit and comfort level visible\n` +
      `3. Style appropriateness\n` +
      `4. Overall put-together appearance\n` +
      `5. Potential for compliments\n\n` +
      `Provide:\n` +
      `- Confidence score (1-10)\n` +
      `- Psychological reasoning\n` +
      `- What makes this outfit confidence-boosting or confidence-draining\n` +
      `- Tips to increase confidence in this outfit`
    
    return this.analyzeImage(imageBase64, prompt)
  }

  async calculateComplimentProbability(imageBase64: string, occasion: string) {
    const prompt = `You are a social psychology expert. Analyze this outfit and calculate the probability (0-100%) of receiving compliments at: ${occasion}\n\n` +
      `Consider:\n` +
      `1. Visual appeal and uniqueness\n` +
      `2. Appropriateness for the occasion\n` +
      `3. Color combinations and styling\n` +
      `4. Trendy vs classic elements\n` +
      `5. Overall wow factor\n\n` +
      `Provide:\n` +
      `- Compliment probability percentage\n` +
      `- Most likely compliments you'll receive\n` +
      `- What specifically will catch people's attention\n` +
      `- How to maximize compliment potential`
    
    return this.analyzeImage(imageBase64, prompt)
  }
}