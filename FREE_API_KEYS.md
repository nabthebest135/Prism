# Free API Keys Guide

## 🌤️ Weather APIs (100% Free)

### 1. OpenWeatherMap (Recommended)
- **Free Tier**: 1,000 calls/day, 60 calls/minute
- **Setup**:
  1. Go to [openweathermap.org/api](https://openweathermap.org/api)
  2. Click "Sign Up" (free account)
  3. Verify email
  4. Go to "API keys" tab
  5. Copy your key
- **Cost**: Completely free forever

### 2. WeatherAPI (Alternative)
- **Free Tier**: 1 million calls/month
- **Setup**:
  1. Go to [weatherapi.com](https://www.weatherapi.com/)
  2. Sign up for free
  3. Get API key from dashboard
- **Cost**: Free tier is very generous

### 3. Open-Meteo (No API Key Needed!)
- **Free Tier**: Unlimited requests
- **Setup**: No registration needed
- **URL**: `https://api.open-meteo.com/v1/forecast`
- **Cost**: Completely free, no limits

## 📍 Location/Places APIs (Free)

### 1. Nominatim (OpenStreetMap) - No API Key!
- **Free Tier**: Unlimited (with fair use)
- **Setup**: No registration needed
- **URL**: `https://nominatim.openstreetmap.org/`
- **Cost**: Completely free

### 2. LocationIQ (Free Tier)
- **Free Tier**: 5,000 requests/day
- **Setup**:
  1. Go to [locationiq.com](https://locationiq.com/)
  2. Sign up for free
  3. Get API key
- **Cost**: Free tier available

### 3. MapBox (Free Tier)
- **Free Tier**: 50,000 requests/month
- **Setup**:
  1. Go to [mapbox.com](https://www.mapbox.com/)
  2. Sign up
  3. Get access token
- **Cost**: Free tier generous

## 🔧 Quick Setup Commands

### Get OpenWeatherMap Key:
```bash
# 1. Visit: https://openweathermap.org/api
# 2. Sign up (free)
# 3. Go to API Keys tab
# 4. Copy your key
```

### Get WeatherAPI Key:
```bash
# 1. Visit: https://www.weatherapi.com/
# 2. Sign up (free) 
# 3. Dashboard -> Your API Key
```

### No-Key Weather (Open-Meteo):
```bash
# No setup needed! Just use:
# https://api.open-meteo.com/v1/forecast?latitude=25.2048&longitude=55.2708&current_weather=true
```

### No-Key Geocoding (Nominatim):
```bash
# No setup needed! Just use:
# https://nominatim.openstreetmap.org/search?q=Dubai&format=json&limit=1
```

## 📋 Recommended Free Stack:
1. **Weather**: Open-Meteo (no key needed)
2. **Geocoding**: Nominatim (no key needed)  
3. **Backup Weather**: OpenWeatherMap (free 1k/day)
4. **AI**: OpenRouter with Qwen (already setup)

## 💰 Cost: $0/month for moderate usage!