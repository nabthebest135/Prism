"""Local CatVTON worker. Upstream code/model: CC BY-NC-SA 4.0."""
import base64, gc, io, json, os, sys, threading, traceback
from pathlib import Path
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from PIL import Image, ImageOps, ImageFilter
ROOT = Path(os.environ.get('PRISM_REMOTE_ROOT', Path(__file__).resolve().parent))
sys.path.insert(0, str(ROOT / 'CatVTON'))
os.environ.setdefault('HF_HUB_DISABLE_XET', '1')
lock = threading.Lock()
def ready():
    return all((ROOT / p).exists() for p in ['CatVTON/model/pipeline.py','models/inpainting/unet/diffusion_pytorch_model.fp16.safetensors','models/inpainting/safety_checker/model.fp16.safetensors','models/catvton/mix-48k-1024/attention/model.safetensors'])
def decode(data, mode):
    if not isinstance(data, str) or not data.startswith('data:image/') or len(data) > 16_000_000: raise ValueError('Invalid image')
    image = Image.open(io.BytesIO(base64.b64decode(data.split(',', 1)[1], validate=True)))
    if image.width * image.height > 20_000_000: raise ValueError('Image dimensions too large')
    return ImageOps.exif_transpose(image).convert(mode)
def generate(person, garment, mask, seed):
    import torch
    from accelerate import load_checkpoint_in_model
    from diffusers import AutoencoderKL, DDIMScheduler, UNet2DConditionModel
    from diffusers.pipelines.stable_diffusion.safety_checker import StableDiffusionSafetyChecker
    from transformers import CLIPImageProcessor
    from model.pipeline import CatVTONPipeline
    from model.attn_processor import SkipAttnProcessor
    from model.utils import init_adapter, get_trainable_module
    from utils import resize_and_crop, resize_and_padding
    if not torch.cuda.is_available(): raise RuntimeError('CUDA GPU unavailable')
    # Load only for a job; free VRAM afterward so the existing vision server remains usable.
    pipe = CatVTONPipeline.__new__(CatVTONPipeline)
    pipe.device = 'cuda'; pipe.weight_dtype = torch.bfloat16; pipe.skip_safety_check = False
    base = str(ROOT / 'models/inpainting')
    pipe.noise_scheduler = DDIMScheduler.from_pretrained(base, subfolder='scheduler', local_files_only=True)
    pipe.vae = AutoencoderKL.from_pretrained('stabilityai/sd-vae-ft-mse', local_files_only=True).to('cuda', dtype=pipe.weight_dtype)
    pipe.vae.enable_slicing()
    pipe.feature_extractor = CLIPImageProcessor.from_pretrained(base, subfolder='feature_extractor', local_files_only=True)
    pipe.safety_checker = StableDiffusionSafetyChecker.from_pretrained(base, subfolder='safety_checker', variant='fp16', use_safetensors=True, local_files_only=True).to('cuda', dtype=pipe.weight_dtype)
    pipe.unet = UNet2DConditionModel.from_pretrained(base, subfolder='unet', variant='fp16', use_safetensors=True, local_files_only=True).to('cuda', dtype=pipe.weight_dtype)
    init_adapter(pipe.unet, cross_attn_cls=SkipAttnProcessor)
    pipe.attn_modules = get_trainable_module(pipe.unet, 'attention')
    load_checkpoint_in_model(pipe.attn_modules, str(ROOT / 'models/catvton/mix-48k-1024/attention'))
    try:
        torch.backends.cuda.matmul.allow_tf32 = True
        size = (384, 512)
        person = resize_and_crop(person, size)
        mask = resize_and_crop(mask, size).point(lambda x: 255 if x > 127 else 0)
        garment = resize_and_padding(garment, size)
        result = pipe(image=person, condition_image=garment, mask=mask, width=size[0], height=size[1], num_inference_steps=30, guidance_scale=2.5, generator=torch.Generator('cuda').manual_seed(seed))[0]
        # Preserve all pixels outside the user-selected clothing region.
        result = Image.composite(result, person, mask.filter(ImageFilter.GaussianBlur(2)))
        out = io.BytesIO(); result.save(out, format='PNG')
        return 'data:image/png;base64,' + base64.b64encode(out.getvalue()).decode()
    finally:
        del pipe
        gc.collect(); torch.cuda.empty_cache()
class Handler(BaseHTTPRequestHandler):
    def reply(self, status, body):
        data = json.dumps(body).encode()
        self.send_response(status); self.send_header('Content-Type','application/json'); self.send_header('Content-Length',str(len(data))); self.end_headers(); self.wfile.write(data)
    def do_GET(self):
        if self.path == '/health': self.reply(200, {'ready': ready(), 'busy': lock.locked(), 'model': 'CatVTON', 'resolution': '384x512'})
        else: self.reply(404, {'error':'Unknown endpoint'})
    def do_POST(self):
        if self.path != '/tryon': return self.reply(404, {'error':'Unknown endpoint'})
        if not ready(): return self.reply(503, {'error':'Try-on models are still being installed.'})
        length = int(self.headers.get('Content-Length','0'))
        if length < 1 or length > 12 * 1024 * 1024: return self.reply(413, {'error':'Request too large'})
        if not lock.acquire(blocking=False): return self.reply(409, {'error':'Try-on is busy. Please retry after the current preview finishes.'})
        try:
            body = json.loads(self.rfile.read(length))
            person, garment, mask = decode(body.get('person'),'RGB'), decode(body.get('garment'),'RGB'), decode(body.get('mask'),'L')
            if person.size != mask.size: raise ValueError('Mask must match the person photo')
            if mask.getextrema()[1] < 128: raise ValueError('Paint the clothing area to replace first')
            result = generate(person, garment, mask, int(body.get('seed',42)) % (2**32))
            self.reply(200, {'image':result,'model':'CatVTON'})
        except (ValueError, KeyError, TypeError) as error: self.reply(400, {'error':str(error)})
        except Exception:
            traceback.print_exc()
            self.reply(503, {'error':'Try-on generation failed. Check the remote worker log and available GPU memory.'})
        finally: lock.release()
if __name__ == '__main__':
    print('Prism try-on listening on 127.0.0.1:8024', flush=True)
    ThreadingHTTPServer(('127.0.0.1',8024),Handler).serve_forever()


