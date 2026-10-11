"""Download only inference components; run after setup_remote.ps1."""
import os
from pathlib import Path
os.environ.setdefault('HF_HUB_DISABLE_XET','1')
from huggingface_hub import snapshot_download
root=Path(__file__).resolve().parent / 'models'
snapshot_download('stable-diffusion-v1-5/stable-diffusion-inpainting',local_dir=root/'inpainting',allow_patterns=['scheduler/*','feature_extractor/*','unet/config.json','unet/*fp16.safetensors','safety_checker/config.json','safety_checker/*fp16.safetensors'],max_workers=2)
snapshot_download('zhengchong/CatVTON',local_dir=root/'catvton',allow_patterns=['mix-48k-1024/attention/*'],max_workers=2)
snapshot_download('stabilityai/sd-vae-ft-mse',allow_patterns=['config.json','diffusion_pytorch_model.safetensors'],max_workers=2)
print('Try-on model downloads complete.')
