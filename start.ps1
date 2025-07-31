Write-Host "Starting Power Simulator..." -ForegroundColor Green
Write-Host ""

Write-Host "Installing root dependencies..." -ForegroundColor Yellow
npm install

Write-Host ""
Write-Host "Installing client dependencies..." -ForegroundColor Yellow
Set-Location client
npm install
Set-Location ..

Write-Host ""
Write-Host "Starting development servers..." -ForegroundColor Green
Write-Host "Backend will run on http://localhost:5000" -ForegroundColor Cyan
Write-Host "Frontend will run on http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the servers" -ForegroundColor Red
Write-Host ""

npm run dev 