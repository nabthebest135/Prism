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
    if (lat === undefined || lon === undefined) {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        if (!navigator.geolocation)
          return reject(
            new Error('Location is unavailable. Outfit suggestions still work without weather.')
          )
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10000,
          maximumAge: 300000,
        })
      })
      lat = position.coords.latitude
      lon = position.coords.longitude
    }
    const response = await fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=' +
        lat +
        '&longitude=' +
        lon +
        '&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&wind_speed_unit=ms',
      { signal: AbortSignal.timeout(10000) }
    )
    if (!response.ok)
      throw new Error('Weather unavailable. Outfit suggestions can use your occasion instead.')
    const data = await response.json(),
      current = data.current
    if (!current || !Number.isFinite(current.temperature_2m))
      throw new Error('Weather data unavailable')
    return {
      temperature: Math.round(current.temperature_2m),
      humidity: current.relative_humidity_2m,
      windSpeed: current.wind_speed_10m,
      condition: this.getConditionFromCode(current.weather_code),
      description: this.getDescriptionFromCode(current.weather_code),
      icon: this.getIconFromCode(current.weather_code),
      location: lat.toFixed(2) + ', ' + lon.toFixed(2),
      country: '',
    }
  }
  async getLocationName(lat: number, lon: number) {
    return { city: lat.toFixed(2) + ', ' + lon.toFixed(2), country: '' }
  }
  getConditionFromCode(code: number) {
    if (code === 0) return 'Clear'
    if (code <= 3) return 'Clouds'
    if (code === 45 || code === 48) return 'Fog'
    if ((code >= 71 && code <= 77) || code === 85 || code === 86) return 'Snow'
    if (code >= 95) return 'Thunderstorm'
    return 'Rain'
  }
  getDescriptionFromCode(code: number) {
    const c = this.getConditionFromCode(code)
    return c === 'Clear' ? 'Clear sky' : c === 'Clouds' ? 'Cloudy' : c
  }
  getIconFromCode(code: number) {
    return this.getConditionFromCode(code)
  }
  getOutfitRecommendation(weather: WeatherData) {
    const protection = ['Rain', 'Thunderstorm'].includes(weather.condition)
      ? ' Add a waterproof layer and closed shoes.'
      : weather.condition === 'Snow'
        ? ' Add waterproof boots and gloves.'
        : ''
    const temp = weather.temperature
    return (
      (temp >= 30
        ? 'Breathable cotton or linen, light colors, and comfortable shoes'
        : temp >= 20
          ? 'Light trousers, a shirt, and comfortable shoes'
          : temp >= 10
            ? 'Long trousers and a warm layer'
            : 'Warm layers, a coat, and boots') + protection
    )
  }
}
