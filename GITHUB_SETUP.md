# GitHub Setup & Deploy

## Create GitHub Repo

1. **Go to [github.com](https://github.com) and create new repo**:
   - Name: `prism-ar-app` 
   - Description: `AR camera app for translations and outfit suggestions`
   - Public ✅ (so you can use free deployment)
   - Don't initialize with README (we already have one)

2. **Copy the repo URL** (something like):
   ```
   https://github.com/yourusername/prism-ar-app.git
   ```

3. **Push your code**:
   ```bash
   git remote add origin https://github.com/yourusername/prism-ar-app.git
   git push -u origin main
   ```

## Deploy to Vercel

1. **Go to [vercel.com](https://vercel.com)**
2. **Import your GitHub repo**
3. **Add environment variables**:
   ```
   VITE_SUPABASE_URL=https://trcgxlfrkrizcgbudnps.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   VITE_OPENROUTER_API_KEY=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
   VITE_WEATHERAPI_KEY=93416f840cf34914867103321251210
   ```
4. **Deploy!**

## Convert to APK

1. **Get your Vercel URL** (e.g., `https://prism-ar-app.vercel.app`)
2. **Go to [pwabuilder.com](https://pwabuilder.com)**
3. **Enter your URL → Package For Stores → Android**
4. **Download APK and install on phone!**

## Future Updates

Just push to GitHub and Vercel auto-deploys:
```bash
git add .
git commit -m "Added new feature"
git push
```

Your APK will auto-update too since it's a PWA! 🎉