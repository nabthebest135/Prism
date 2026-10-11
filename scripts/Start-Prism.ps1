param(
  [string]$RemoteAlias = 'bladefall',
  [string]$RemoteRoot = 'D:/Work/Prism',
  [int]$Port = 3000
)
$ErrorActionPreference = 'Stop'
$taskRoot = Split-Path -Parent $PSScriptRoot
$taskOwned = @()
function Test-Endpoint([string]$Url, [string]$ExpectedModel = '') {
  try { $value = Invoke-RestMethod -Uri $Url -TimeoutSec 3; return (!$ExpectedModel -or $value.model -eq $ExpectedModel) } catch { return $false }
}
function Start-Helper([string]$Executable, [string[]]$Arguments) {
  $info = [Diagnostics.ProcessStartInfo]::new()
  $info.FileName = $Executable
  $info.UseShellExecute = $false
  $info.CreateNoWindow = $true
  # Paths with spaces are passed as single arguments.
  if ($info.PSObject.Properties.Name -contains 'ArgumentList') { foreach ($arg in $Arguments) { $info.ArgumentList.Add($arg) } }
  else { $info.Arguments = ($Arguments | ForEach-Object { '"' + $_.Replace('"','\"') + '"' }) -join ' ' }
  $info.WorkingDirectory = $taskRoot
  return [Diagnostics.Process]::Start($info)
}
try {
  if (!(Test-Path -LiteralPath (Join-Path $taskRoot 'dist/index.html'))) { throw 'Build missing. Run npm install and npm run build first, or use the prepared download.' }
  $taskNode = (Get-Command node -ErrorAction SilentlyContinue).Source
  if (!$taskNode) { throw 'Node.js 22 or newer is required. Install it from nodejs.org.' }
  if (!(Test-Endpoint 'http://127.0.0.1:18011/v1/models')) {
    $taskOwned += Start-Helper 'ssh' @('-N','-o','BatchMode=yes','-o','ExitOnForwardFailure=yes','-o','ServerAliveInterval=30','-L','127.0.0.1:18011:127.0.0.1:8011',$RemoteAlias)
  }
  if (!(Test-Endpoint 'http://127.0.0.1:18012/health' 'CatVTON')) {
    $taskOwned += Start-Helper 'ssh' @('-N','-o','BatchMode=yes','-o','ExitOnForwardFailure=yes','-o','ServerAliveInterval=30','-L','127.0.0.1:18012:127.0.0.1:8024',$RemoteAlias)
    Start-Sleep -Seconds 2
    if (!(Test-Endpoint 'http://127.0.0.1:18012/health' 'CatVTON')) {
      $taskOwned += Start-Helper 'ssh' @('-o','BatchMode=yes','-o','ServerAliveInterval=30',$RemoteAlias,($RemoteRoot + '/env/Scripts/python.exe'),($RemoteRoot + '/tryon_server.py'))
    }
  }
  $taskWait = 0
  while ($taskWait -lt 30 -and !(Test-Endpoint 'http://127.0.0.1:18012/health' 'CatVTON')) { Start-Sleep -Seconds 1; $taskWait++ }
  if (!(Test-Endpoint 'http://127.0.0.1:18011/v1/models')) { throw 'Bladefall vision model is unavailable on port 8011. Start its llama.cpp server, then retry.' }
  if (!(Test-Endpoint 'http://127.0.0.1:18012/health' 'CatVTON')) { throw 'Try-on worker did not start. Check the remote setup and port 8024.' }
  if (!(Test-Endpoint ("http://127.0.0.1:" + $Port + '/api/health'))) {
    $env:PORT = [string]$Port
    $taskOwned += Start-Helper $taskNode @((Join-Path $taskRoot 'server/index.mjs'))
  }
  Write-Host ("Prism: http://localhost:" + $Port)
  Write-Host 'Keep this terminal open. Press Enter to stop processes started by this launcher.'
  Read-Host | Out-Null
} finally {
  foreach ($taskProcess in $taskOwned) { if (!$taskProcess.HasExited) { $taskProcess.Kill() } }
}
