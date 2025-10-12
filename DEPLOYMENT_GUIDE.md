# Deployment Guide - Vercel to APK

## 🚀 Step 1: Deploy to Vercel (5 minutes)

### Option A: GitHub + Vercel (Recommended)
1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/prism-app.git
   git push -u origin main
   ```

2. **Deploy on Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repo
   - Add environment variables:
     ```
     VITE_SUPABASE_URL=https://trcgxlfrkrizcgbudnps.supabase.co
     VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     VITE_OPENROUTER_API_KEY=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
     VITE_WEATHERAPI_KEY=93416f840cf34914867103321251210
     ```
   - Click "Deploy"

### Option B: Direct Upload
1. **Build locally**:
   ```bash
   npm run build
   ```
2. **Upload dist folder** to Vercel manually

## 📱 Step 2: Convert to APK (10 minutes)

### Method 1: PWA Builder (Easiest)
1. **Go to PWA Builder**:
   - Visit [pwabuilder.com](https://pwabuilder.com)
   - Enter your Vercel URL: `https://your-app.vercel.app`
   - Click "Start"

2. **Generate APK**:
   - Click "Package For Stores"
   - Select "Android"
   - Download APK file
   - Install on Android device

### Method 2: Capacitor (Full Native)
1. **Install Capacitor**:
   ```bash
   npm install @capacitor/core @capacitor/cli @capacitor/android
   npx cap init prism-app com.yourname.prism
   ```

2. **Build and Add Android**:
   ```bash
   npm run build
   npx cap add android
   npx cap copy
   ```

3. **Open in Android Studio**:
   ```bash
   npx cap open android
   ```
   - Build APK in Android Studio
   - Or run: `./gradlew assembleDebug`

## 🔧 Quick Commands

### Deploy to Vercel:
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Test APK:
```bash
# Enable "Install from unknown sources" on Android
# Install APK file
# Test camera and AI features
```

## 📋 Deployment Checklist
- [ ] Environment variables added to Vercel
- [ ] App builds successfully
- [ ] PWA manifest configured
- [ ] Camera permissions work
- [ ] API keys working in production
- [ ] APK installs on Android
- [ ] All features work in APK