param([string]$Root = 'D:\Work\Prism', [string]$Python = 'python')
$ErrorActionPreference = 'Stop'
New-Item -ItemType Directory -Force -Path $Root | Out-Null
Copy-Item -LiteralPath (Join-Path $PSScriptRoot 'tryon_server.py') -Destination (Join-Path $Root 'tryon_server.py')
Copy-Item -LiteralPath (Join-Path $PSScriptRoot 'setup_models.py') -Destination (Join-Path $Root 'setup_models.py')
if (!(Test-Path -LiteralPath (Join-Path $Root 'CatVTON'))) {
  git clone https://github.com/Zheng-Chong/CatVTON.git (Join-Path $Root 'CatVTON')
  if ($LASTEXITCODE) { throw 'CatVTON clone failed' }
}
git -C (Join-Path $Root 'CatVTON') checkout 7818397f25613beedb3d861a34769f607cfcf3b1
if ($LASTEXITCODE) { throw 'CatVTON checkout failed' }
& $Python -m venv (Join-Path $Root 'env')
$taskPython = Join-Path $Root 'env/Scripts/python.exe'
& $taskPython -m pip install torch torchvision --index-url https://download.pytorch.org/whl/cu128
if ($LASTEXITCODE) { throw 'CUDA PyTorch installation failed' }
& $taskPython -m pip install 'diffusers==0.32.2' 'transformers==4.48.0' 'accelerate>=0.31,<2' 'huggingface_hub>=0.26,<1' pillow numpy tqdm
if ($LASTEXITCODE) { throw 'Try-on dependencies failed' }
& $taskPython (Join-Path $Root 'setup_models.py')
if ($LASTEXITCODE) { throw 'Model download failed' }
Write-Host 'Setup complete. The local launcher can start the worker over SSH.'
