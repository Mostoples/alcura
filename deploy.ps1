# PowerShell deployment script for Firebase
# Set environment for service account
$env:GOOGLE_APPLICATION_CREDENTIALS = "$(Get-Location)\firebase-config.json"

Write-Host "Installing dependencies..."
npm install

Write-Host "Deploying to Firebase..."
npx firebase-tools deploy --only hosting,database
