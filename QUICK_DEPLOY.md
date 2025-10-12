# Quick Deploy to APK (15 minutes)

## 🚀 Method 1: Vercel + PWA Builder (Easiest)

### Step 1: Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (follow prompts)
vercel --prod
```

**Add Environment Variables in Vercel Dashboard:**
- `VITE_SUPABASE_URL` = `https://trcgxlfrkrizcgbudnps.supabase.co`
- `VITE_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- `VITE_OPENROUTER_API_KEY` = `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`
- `VITE_WEATHERAPI_KEY` = `93416f840cf34914867103321251210`

### Step 2: Convert to APK
1. Go to [pwabuilder.com](https://pwabuilder.com)
2. Enter your Vercel URL: `https://your-app.vercel.app`
3. Click "Package For Stores" → "Android"
4. Download APK

## 🚀 Method 2: Netlify + PWA Builder

### Step 1: Deploy to Netlify
```bash
# Build the app
npm run build

# Drag & drop 'dist' folder to netlify.com
# Or connect GitHub repo
```

### Step 2: Same APK process as above

## 📱 Install APK on Android

1. **Enable Unknown Sources**:
   - Settings → Security → Unknown Sources ✅

2. **Install APK**:
   - Download APK to phone
   - Tap to install
   - Grant camera/location permissions

3. **Test Features**:
   - Camera access ✅
   - Weather data ✅
   - AI outfit analysis ✅
   - Wardrobe management ✅

## 🔧 Alternative: Direct APK Build

### Using Capacitor:
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init prism-app com.yourname.prism
npm run build
npx cap add android
npx cap copy
npx cap open android
```

Then build APK in Android Studio.

## 📋 Deployment URLs

After deployment, you'll get:
- **Vercel**: `https://prism-app-xyz.vercel.app`
- **Netlify**: `https://prism-app-xyz.netlify.app`

Use either URL in PWA Builder to generate APK!