# Mobile App Deployment Guide

## 📱 Convert to APK/IPA for Testing

### Option 1: Capacitor (Recommended)

1. **Install Capacitor**:
   ```bash
   npm install @capacitor/core @capacitor/cli
   npm install @capacitor/android @capacitor/ios
   ```

2. **Initialize Capacitor**:
   ```bash
   npx cap init prism-app com.yourname.prism
   ```

3. **Build the web app**:
   ```bash
   npm run build
   ```

4. **Add platforms**:
   ```bash
   npx cap add android
   npx cap add ios
   ```

5. **Copy web assets**:
   ```bash
   npx cap copy
   ```

6. **Open in Android Studio**:
   ```bash
   npx cap open android
   ```

### Option 2: PWA to APK (Easier for testing)

1. **Use PWA Builder**:
   - Go to [pwabuilder.com](https://pwabuilder.com)
   - Enter your deployed PWA URL
   - Download Android package
   - Install APK on device

2. **Use Bubblewrap**:
   ```bash
   npm install -g @bubblewrap/cli
   bubblewrap init --manifest https://yourapp.com/manifest.json
   bubblewrap build
   ```

## 🔧 Mobile-Specific Configurations

### Camera Permissions (capacitor.config.ts)
```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.yourname.prism',
  appName: 'Prism',
  webDir: 'dist',
  plugins: {
    Camera: {
      permissions: ['camera', 'photos']
    },
    Geolocation: {
      permissions: ['location']
    }
  }
};

export default config;
```

### Android Permissions (android/app/src/main/AndroidManifest.xml)
```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
```

## 🚀 Quick APK Build Steps

1. **Deploy PWA first**:
   ```bash
   # Deploy to Vercel/Netlify
   npm run build
   ```

2. **Generate APK**:
   - Use PWA Builder with your deployed URL
   - Or use Capacitor for full native features

3. **Test on device**:
   - Enable "Install from unknown sources"
   - Install APK and test camera functionality

## 📋 Testing Checklist

- [ ] Camera access works
- [ ] Image capture and analysis
- [ ] Offline functionality
- [ ] Push notifications
- [ ] File storage permissions
- [ ] Location services
- [ ] App icon and splash screen