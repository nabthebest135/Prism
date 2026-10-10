# Prism

Prism is a local camera assistant for text translation, object and landmark exploration, wardrobe management, styling advice, and generated virtual try-on.

The React app runs on your laptop. Photos are sent through a loopback-only Node server and encrypted SSH tunnels to your Bladefall PC. Text and image analysis use its existing llama.cpp vision model. Generated try-on uses CatVTON on the same GPU. No Gemini, OpenRouter, Supabase, cloud AI key, or paid inference service is required.

## Run the prepared app

Install Node.js 22 or newer if it is not available. The prepared download includes a production build, so no npm installation is needed to run it.

From PowerShell:

```powershell
./scripts/Start-Prism.ps1
```

Open http://localhost:3000 and keep the launcher terminal open. Choose a local profile name; no email or password is needed. The launcher reuses running services and closes only processes it started when you press Enter.

## Bladefall setup

The configured key-auth alias is `ssh bladefall`. Its existing OpenAI-compatible vision endpoint is bound to `127.0.0.1:8011`. The installed try-on worker lives at `D:/Work/Prism` and binds to `127.0.0.1:8024`. The laptop forwards them to ports 18011 and 18012. Neither model is exposed publicly.

Verified hardware: Ryzen 9 9900X3D (12 cores / 24 threads), 32 GB RAM, RTX 5060 Ti with 16 GB VRAM. Existing vision model: Gemma 4 12B Q4_K_M via llama.cpp, with its multimodal projector.

To prepare a different Windows GPU machine, copy the `remote` folder there and run `remote/setup_remote.ps1`. It creates a separate Python environment, checks out pinned CatVTON source, and downloads the inference weights. A CUDA-capable GPU is required for try-on. The vision endpoint must be started separately with a vision-capable model.

## Use it

- World Lens: take or upload a photo, select translation language, discover a place, or identify an object. Results are saved to history. Landmark descriptions can be uncertain and are not verified historical sources.
- Style Lens: scan a garment to save it, get outfit advice, or ask about clothing care.
- Wardrobe: search, filter, rename, and remove your saved garments.
- Smart outfit: choose an occasion; optionally enable current weather. Only actual wardrobe item names are shown as selected items.
- Virtual try-on: upload a person photo and a garment photo, or select a garment from the wardrobe. Paint the clothing region to replace. The upper-body guide is a starting point for centered, standing photos; adjust it to your photo. Keep the face and hands outside the mask, then generate and download a preview.
- Profile: check service status, see milestones calculated from your activity, rename your profile, and export a JSON backup.
- History and discoveries: read full results, save discoveries, and share text.

Generated try-on is an appearance preview, not a fit or size measurement. It runs at 384×512 with 30 diffusion steps. Each job loads the try-on model and releases its GPU memory afterward so the existing vision service remains available. A verified sample took about 14 seconds including loading; latency depends on machine load. The first startup needs internet for model downloads. Normal AI inference uses local weights only.

## Storage and offline behavior

Wardrobe images and analysis history live in IndexedDB in this browser profile. The profile name and local feedback live in browser storage. Different browsers do not share data. Clearing browser/site data removes the saved wardrobe and history; export a backup first. Leaving the profile keeps the device's data available.

The PWA caches the app shell. You can browse saved items and history offline after the first successful load. New AI analyses and try-on need the Bladefall SSH connection. Optional weather uses Open-Meteo and requires internet and location permission. The app does not include device-calendar sync, synthetic testimonials, or fabricated discoveries.

## Development

```sh
npm install
npm run build
npm test
npm run lint
npm start
```

For development, start the backend on port 3001 and Vite on port 3000:

```powershell
$env:PORT='3001'
npm run dev:server
# In a second terminal:
npm run dev
```

Keep the SSH tunnels from the launcher running. Server configuration can be set through `LOCAL_AI_URL`, `LOCAL_AI_MODEL`, `TRYON_URL`, and `PORT`; see `.env.example`. The server uses process environment variables, not browser-visible VITE keys.

## Validation

Production build and TypeScript checks, ESLint, Node proxy tests, a live local translation, photo-based garment identification, wardrobe persistence after reload, and a real CatVTON generation were verified. Proxy tests cover cloud-model override prevention, image forwarding, token caps, foreign-origin rejection, malformed input, and unavailable-service errors.

## Model licensing

The optional CatVTON worker and checkpoints are for non-commercial use under CC BY-NC-SA 4.0. See [remote/NOTICE.md](remote/NOTICE.md) for attribution and model licensing.
