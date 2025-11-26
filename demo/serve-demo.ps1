param(
  [int]$Port = 8000
)

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$node = Get-Command node -ErrorAction SilentlyContinue
if (-not $node) {
  Write-Host "Node.js not found in PATH. Please install Node.js or run with Python/http-server." -ForegroundColor Yellow
  exit 1
}

Write-Host "Starting demo server on port $Port..."
Start-Process -NoNewWindow -FilePath node -ArgumentList "$scriptDir\serve-demo.js", $Port
Start-Sleep -Seconds 1
$localUrl = "http://localhost:$Port/api-demo.html"
Write-Host "Open demo: $localUrl"
Start-Process $localUrl
