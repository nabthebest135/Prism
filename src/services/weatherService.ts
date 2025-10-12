const WEATHERAPI_KEY = (import.meta as any).env.VITE_WEATHERAPI_KEY || ''
const WEATHER_API_KEY = (import.meta as any).env.VITE_WEATHER_API_KEY || ''
const WEATHERAPI_BASE_URL = 'https://api.weatherapi.com/v1'
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5'
const OPENMETEO_BASE_URL = 'https://api.open-meteo.com/v1'
const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org'

export interface WeatherData {
  temperature: number
  condition: string
  description: string
  humidity: number
  windSpeed: number
  icon: string
  location?: string
  country?: string
}

export class WeatherService {
  async getCurrentWeather(lat?: number, lon?: number): Promise<WeatherData> {
    try {
      // Get user location if not provided
      if (!lat || !lon) {
        const position = await this.getUserLocation()
        lat = position.coords.latitude
        lon = position.coords.longitude
      }

      // Try WeatherAPI first (your key - 1M calls/month)
      if (WEATHERAPI_KEY) {
        try {
          const response = await fetch(
            `${WEATHERAPI_BASE_URL}/current.json?key=${WEATHERAPI_KEY}&q=${lat},${lon}&aqi=no`
          )
          
          if (response.ok) {
            const data = await response.json()
            
            return {
              temperature: Math.round(data.current.temp_c),
              condition: data.current.condition.text,
              description: data.current.condition.text,
              humidity: data.current.humidity,
              windSpeed: data.current.wind_kph / 3.6, // Convert to m/s
              icon: data.current.condition.icon,
              location: data.location.name,
              country: data.location.country
            }
          }
        } catch (weatherApiError) {
          console.log('WeatherAPI failed, trying Open-Meteo...')
        }
      }

      // Fallback to Open-Meteo (no API key needed)
      try {
        const weatherResponse = await fetch(
          `${OPENMETEO_BASE_URL}/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,relativehumidity_2m,windspeed_10m`
        )
        
        if (weatherResponse.ok) {
          const weatherData = await weatherResponse.json()
          const current = weatherData.current_weather
          
          // Get location name
          const locationName = await this.getLocationName(lat, lon)
          
          return {
            temperature: Math.round(current.temperature),
            condition: this.getConditionFromCode(current.weathercode),
            description: this.getDescriptionFromCode(current.weathercode),
            humidity: weatherData.hourly?.relativehumidity_2m?.[0] || 50,
            windSpeed: current.windspeed,
            icon: this.getIconFromCode(current.weathercode),
            location: locationName.city,
            country: locationName.country
          }
        }
      } catch (openMeteoError) {
        console.log('Open-Meteo failed, trying OpenWeatherMap...')
      }

      // Fallback to OpenWeatherMap if API key is available
      if (WEATHER_API_KEY) {
        const response = await fetch(
          `${OPENWEATHER_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
        )
        
        if (response.ok) {
          const data = await response.json()
          
          return {
            temperature: Math.round(data.main.temp),
            condition: data.weather[0].main,
            description: data.weather[0].description,
            humidity: data.main.humidity,
            windSpeed: data.wind.speed,
            icon: data.weather[0].icon,
            location: data.name,
            country: data.sys.country
          }
        }
      }
      
      throw new Error('All weather APIs failed')
    } catch (error) {
      console.error('Weather fetch error:', error)
      throw error
    }
  }

  private getUserLocation(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position),
        (error) => reject(error),
        { timeout: 10000, enableHighAccuracy: true }
      )
    })
  }

  async getLocationName(lat: number, lon: number): Promise<{city: string, country: string}> {
    try {
      const response = await fetch(
        `${NOMINATIM_BASE_URL}/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`
      )
      
      if (response.ok) {
        const data = await response.json()
        return {
          city: data.address?.city || data.address?.town || data.address?.village || 'Unknown City',
          country: data.address?.country || 'Unknown Country'
        }
      }
    } catch (error) {
      console.error('Geocoding error:', error)
    }
    
    return { city: 'Unknown City', country: 'Unknown Country' }
  }

  getConditionFromCode(code: number): string {
    if (code === 0) return 'Clear'
    if (code <= 3) return 'Clouds'
    if (code <= 67) return 'Rain'
    if (code <= 77) return 'Snow'
    if (code <= 82) return 'Rain'
    if (code <= 99) return 'Thunderstorm'
    return 'Clear'
  }

  getDescriptionFromCode(code: number): string {
    const descriptions: {[key: number]: string} = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Fog',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      71: 'Slight snow',
      73: 'Moderate snow',
      75: 'Heavy snow',
      95: 'Thunderstorm'
    }
    return descriptions[code] || 'Unknown weather'
  }

  getIconFromCode(code: number): string {
    if (code === 0) return '01d'
    if (code <= 3) return '02d'
    if (code <= 67) return '10d'
    if (code <= 77) return '13d'
    if (code <= 99) return '11d'
    return '01d'
  }

  getOutfitRecommendation(weather: WeatherData): string {
    const temp = weather.temperature
    const condition = weather.condition.toLowerCase()

    if (temp >= 35) return 'Light cotton shorts, breathable tank top, sandals'
    if (temp >= 30) return 'Linen shorts, cotton t-shirt, light sneakers'
    if (temp >= 25) return 'Light pants, short sleeve shirt, comfortable shoes'
    if (temp >= 20) return 'Jeans, light sweater, casual shoes'
    if (temp >= 15) return 'Long pants, light jacket, closed shoes'
    if (temp >= 10) return 'Warm layers, jacket, boots'
    if (temp < 10) return 'Heavy coat, warm layers, winter boots'
    
    if (condition.includes('rain')) return 'Waterproof jacket, umbrella, closed shoes'
    if (condition.includes('snow')) return 'Warm coat, waterproof boots, gloves'
    
    return 'Comfortable casual wear'
  }
}