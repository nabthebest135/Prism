# API Setup Guide

## 🔑 Required API Keys

### 1. Supabase (Backend & Auth)
- **Cost**: Free tier (50,000 monthly active users)
- **Setup**: See `SUPABASE_SETUP.md`
- **Required for**: User auth, database, file storage

### 2. OpenRouter (AI Models)
- **Cost**: Free tier available, pay-per-use
- **Setup**:
  1. Go to [openrouter.ai](https://openrouter.ai)
  2. Sign up with GitHub/Google
  3. Go to "Keys" → "Create Key"
  4. Add to `.env`: `VITE_OPENROUTER_API_KEY=sk-or-...`
- **Models Used**: 
  - `deepseek/deepseek-chat` (free/cheap)
  - `qwen/qwen-2-7b-instruct` (free/cheap)

### 3. OpenWeatherMap (Weather Data)
- **Cost**: Free tier (1,000 calls/day)
- **Setup**:
  1. Go to [openweathermap.org](https://openweathermap.org/api)
  2. Sign up for free account
  3. Go to "API keys" tab
  4. Copy your key
  5. Add to `.env`: `VITE_WEATHER_API_KEY=your-key-here`

## 🆓 Optional APIs (All Free Tiers)

### Google Places (Location Data)
- **Cost**: Free tier ($200 credit/month)
- **Setup**:
  1. Go to [Google Cloud Console](https://console.cloud.google.com)
  2. Create new project
  3. Enable "Places API"
  4. Create API key
  5. Add to `.env`: `VITE_GOOGLE_PLACES_API_KEY=your-key`

### Alternative Free APIs

#### Translation (instead of Google Translate)
- **LibreTranslate**: Self-hosted, completely free
- **MyMemory**: Free tier (10,000 chars/day)

#### Weather (alternatives)
- **WeatherAPI**: Free tier (1M calls/month)
- **OpenMeteo**: Completely free, no API key needed

#### Maps (instead of Google Maps)
- **OpenStreetMap + Nominatim**: Completely free
- **Mapbox**: Free tier (50,000 requests/month)

## 📱 Calendar Integration

Currently using mock data because:
- **Browser Calendar API**: Not widely supported yet
- **Google Calendar API**: Requires OAuth setup
- **Device Calendar**: Only available in native apps

**For production**: Integrate with:
- Google Calendar API (web)
- Native calendar APIs (when using Capacitor)

## 🔧 Environment Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in your API keys:
   ```env
   # Required
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   VITE_OPENROUTER_API_KEY=sk-or-your-key

   # Optional (app works without these)
   VITE_WEATHER_API_KEY=your-weather-key
   VITE_GOOGLE_PLACES_API_KEY=your-places-key
   ```

3. Start development:
   ```bash
   npm install
   npm run dev
   ```

## 🚀 Production Deployment

### Vercel (Recommended)
1. Connect GitHub repo to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Netlify
1. Connect GitHub repo to Netlify
2. Add environment variables in site settings
3. Deploy automatically on push

### Mobile App Stores
1. Use Capacitor to convert PWA to native app
2. Add native calendar/contacts permissions
3. Submit to App Store/Play Store

## 💰 Cost Breakdown (Monthly)

- **Supabase**: Free (up to 50k users)
- **OpenRouter**: ~$5-20 (depending on usage)
- **Weather API**: Free (1k calls/day)
- **Google Places**: Free ($200 credit)

**Total**: ~$5-20/month for moderate usage