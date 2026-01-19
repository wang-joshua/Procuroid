# PowerShell Deployment Script for Procuroid Backend
# This script deploys the backend to Google Cloud Run

Write-Host "🚀 Procuroid Backend Deployment Script" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""

# Check if gcloud CLI is installed
Write-Host "Checking for gcloud CLI..." -ForegroundColor Yellow
$gcloudCheck = Get-Command gcloud -ErrorAction SilentlyContinue
if (-not $gcloudCheck) {
    Write-Host "❌ ERROR: gcloud CLI not found!" -ForegroundColor Red
    Write-Host "Please install it from: https://cloud.google.com/sdk/docs/install" -ForegroundColor Red
    exit 1
}
Write-Host "✅ gcloud CLI found" -ForegroundColor Green
Write-Host ""

# Get current directory
$currentDir = Get-Location
$projectRoot = Split-Path -Parent $currentDir

Write-Host "📂 Project root: $projectRoot" -ForegroundColor Cyan
Write-Host ""

# Confirm deployment
Write-Host "⚠️  This will deploy the backend to Cloud Run" -ForegroundColor Yellow
Write-Host "   Region: us-central1" -ForegroundColor Yellow
Write-Host "   Service: procuroid" -ForegroundColor Yellow
Write-Host ""
$confirm = Read-Host "Do you want to continue? (y/n)"
if ($confirm -ne "y") {
    Write-Host "❌ Deployment cancelled" -ForegroundColor Red
    exit 0
}
Write-Host ""

# Navigate to project root
Set-Location $projectRoot

# Submit build to Cloud Build
Write-Host "🔨 Starting Cloud Build..." -ForegroundColor Yellow
Write-Host "This may take 3-5 minutes..." -ForegroundColor Yellow
Write-Host ""

try {
    gcloud builds submit --config procuroid-backend/cloudbuild.yaml .
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Deployment successful!" -ForegroundColor Green
        Write-Host ""
        Write-Host "🔗 Your backend is now live at:" -ForegroundColor Cyan
        Write-Host "   https://procuroid-369418280809.us-central1.run.app" -ForegroundColor Green
        Write-Host ""
        Write-Host "🧪 Test the deployment:" -ForegroundColor Yellow
        Write-Host "   curl https://procuroid-369418280809.us-central1.run.app/health" -ForegroundColor Gray
        Write-Host ""
        
        # Test the health endpoint
        Write-Host "Testing health endpoint..." -ForegroundColor Yellow
        try {
            $response = Invoke-RestMethod -Uri "https://procuroid-369418280809.us-central1.run.app/health" -Method Get
            Write-Host "✅ Health check passed!" -ForegroundColor Green
            Write-Host "   Status: $($response.status)" -ForegroundColor Gray
            Write-Host "   Service: $($response.service)" -ForegroundColor Gray
        }
        catch {
            Write-Host "⚠️  Could not test health endpoint (might take a moment to start)" -ForegroundColor Yellow
        }
        Write-Host ""
        Write-Host "✨ Your frontend should now work without CORS errors!" -ForegroundColor Green
    }
    else {
        Write-Host ""
        Write-Host "❌ Deployment failed!" -ForegroundColor Red
        Write-Host "Check the error messages above for details." -ForegroundColor Red
        exit 1
    }
}
catch {
    Write-Host ""
    Write-Host "❌ Deployment failed with error:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}
finally {
    # Return to original directory
    Set-Location $currentDir
}

Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Clear your browser cache" -ForegroundColor Gray
Write-Host "   2. Refresh your frontend at http://localhost:5173" -ForegroundColor Gray
Write-Host "   3. Try signing in again" -ForegroundColor Gray
Write-Host ""

