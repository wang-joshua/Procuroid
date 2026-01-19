# CORS Error Fix - Deployment Guide

## 🐛 Problem
You're getting a CORS error when your frontend (localhost:5173) tries to connect to the Cloud Run backend:
```
Access to XMLHttpRequest at 'https://procuroid-369418280809.us-central1.run.app/auth/signin' 
from origin 'http://localhost:5173' has been blocked by CORS policy
```

## ✅ Solution Applied
I've updated the backend code to fix the CORS issue:

### Changes Made:
1. **Added explicit OPTIONS handling** to `/auth/signin` and `/auth/signup` endpoints
2. **Enhanced CORS configuration** in `main.py`:
   - Added more allowed origins (localhost:8080)
   - Added `X-Requested-With` header support
   - Added `expose_headers` configuration
   - Set `max_age` to 3600 seconds (1 hour cache for preflight)
   - Removed trailing slash from Vercel URL

## 🚀 Deployment Steps

### Option 1: Automatic Deployment (Recommended)
If you have GitHub connected to Cloud Build:

1. **Commit and push the changes:**
   ```bash
   cd procuroid-backend
   git add .
   git commit -m "Fix CORS: Add OPTIONS handling and enhance CORS config"
   git push origin main
   ```

2. **Monitor deployment:**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Navigate to **Cloud Build > History**
   - Wait for the build to complete (usually 3-5 minutes)

3. **Verify the deployment:**
   ```bash
   curl https://procuroid-369418280809.us-central1.run.app/health
   ```

### Option 2: Manual Deployment via gcloud CLI

1. **Navigate to the project root:**
   ```bash
   cd c:\Users\Avi\Desktop\AIATL2025
   ```

2. **Deploy using Cloud Build:**
   ```bash
   gcloud builds submit --config procuroid-backend/cloudbuild.yaml .
   ```

3. **Wait for deployment to complete** (3-5 minutes)

### Option 3: Docker Build and Deploy (Alternative)

1. **Build the Docker image:**
   ```bash
   cd procuroid-backend
   docker build -t gcr.io/procuroid-369418280809/procuroid-backend:latest .
   ```

2. **Push to Google Container Registry:**
   ```bash
   docker push gcr.io/procuroid-369418280809/procuroid-backend:latest
   ```

3. **Deploy to Cloud Run:**
   ```bash
   gcloud run deploy procuroid ^
     --image gcr.io/procuroid-369418280809/procuroid-backend:latest ^
     --region us-central1 ^
     --platform managed ^
     --allow-unauthenticated
   ```

## 🧪 Testing After Deployment

### 1. Test the health endpoint:
```bash
curl https://procuroid-369418280809.us-central1.run.app/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "procuroid-backend",
  "timestamp": "..."
}
```

### 2. Test CORS preflight (OPTIONS request):
```bash
curl -X OPTIONS https://procuroid-369418280809.us-central1.run.app/auth/signin ^
  -H "Origin: http://localhost:5173" ^
  -H "Access-Control-Request-Method: POST" ^
  -H "Access-Control-Request-Headers: Content-Type" ^
  -v
```

Look for these headers in the response:
- `Access-Control-Allow-Origin: http://localhost:5173`
- `Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With`

### 3. Test from your frontend:
- Open your frontend at `http://localhost:5173`
- Try to sign in
- Check the browser console for any errors

## 🔍 Troubleshooting

### If CORS error persists after deployment:

1. **Check Cloud Run logs:**
   ```bash
   gcloud run services logs read procuroid --region us-central1 --limit 50
   ```

2. **Verify the CORS configuration is loaded:**
   - Look for log message: `CORS: allowing ['http://localhost:5173', ...]`
   - This confirms flask-cors is installed and configured

3. **Check if flask-cors is installed:**
   - SSH into Cloud Run instance or check build logs
   - Verify `requirements.txt` includes `flask-cors==4.0.0`

4. **Browser cache issue:**
   - Clear browser cache
   - Try incognito/private browsing mode
   - Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

### If deployment fails:

1. **Check build logs:**
   ```bash
   gcloud builds list --limit 5
   gcloud builds log [BUILD_ID]
   ```

2. **Verify Docker build locally:**
   ```bash
   cd procuroid-backend
   docker build -t test-backend .
   docker run -p 8080:8080 test-backend
   ```

3. **Check for syntax errors:**
   ```bash
   python src/main.py
   ```

## 📝 What Changed in the Code

### File: `src/main.py` (lines 27-47)
- Added `localhost:8080` to allow list
- Added `X-Requested-With` to allowed headers
- Added `expose_headers` configuration
- Added `max_age` for preflight caching
- Removed trailing slash from Vercel URL

### File: `src/api/__init__.py` (lines 98-147)
- Added `"OPTIONS"` to method list for `/auth/signup`
- Added `"OPTIONS"` to method list for `/auth/signin`
- Added explicit OPTIONS handling at start of both functions

## ✨ Expected Result

After deployment, your frontend should be able to:
- ✅ Make OPTIONS preflight requests to the backend
- ✅ Make POST requests to `/auth/signin` and `/auth/signup`
- ✅ Receive proper CORS headers in responses
- ✅ No more "blocked by CORS policy" errors

## 🆘 Need Help?

If the issue persists:
1. Share the Cloud Run logs
2. Share the browser console error (with network tab details)
3. Verify the deployment timestamp matches your latest code push

## 📚 Additional Resources

- [Flask-CORS Documentation](https://flask-cors.readthedocs.io/)
- [Cloud Run Deployment Guide](https://cloud.google.com/run/docs/deploying)
- [CORS Explained (MDN)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

