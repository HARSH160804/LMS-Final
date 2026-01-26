# Frontend Production Setup Guide

## ✅ Frontend Configuration Status

Your frontend is **production-ready** and correctly configured to communicate with the deployed backend.

---

## 🔧 Configuration Summary

### API Communication
- ✅ **Centralized API service** - All API calls go through `src/services/api.js`
- ✅ **Environment variable** - Uses `VITE_API_URL` for backend URL
- ✅ **Credentials included** - `credentials: 'include'` for cookie-based auth
- ✅ **No hardcoded URLs** - All services use the centralized API
- ✅ **Fallback configured** - Defaults to `http://localhost:8000` for local dev

### Service Layer
All API calls are properly abstracted through service files:
- ✅ `auth.service.js` - Authentication endpoints
- ✅ `course.service.js` - Course management
- ✅ `progress.service.js` - Learning progress tracking
- ✅ `purchase.service.js` - Payment and enrollment

---

## 🚀 Vercel Deployment

### Required Environment Variable

Set this in your Vercel project settings:

```
VITE_API_URL=https://your-backend.onrender.com
```

**Important**: Replace `https://your-backend.onrender.com` with your actual Render backend URL.

### Steps to Deploy on Vercel

1. **Connect Repository**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New..." → "Project"
   - Import your GitHub repository

2. **Configure Project**
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

3. **Add Environment Variable**
   - Go to Project Settings → Environment Variables
   - Add: `VITE_API_URL` = `https://your-backend.onrender.com`
   - Apply to: Production, Preview, and Development

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete

---

## 🔍 How It Works

### API Service (`src/services/api.js`)

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const BASE_URL = `${API_URL}/api/v1`;
```

- **Local Development**: Uses `http://localhost:8000` (fallback)
- **Production**: Uses `VITE_API_URL` from Vercel environment variables

### Request Configuration

```javascript
const config = {
    ...options,
    headers: { ...defaultHeaders, ...options.headers },
    credentials: 'include', // ✅ Sends cookies for authentication
};
```

- ✅ **credentials: 'include'** - Ensures cookies are sent with cross-origin requests
- ✅ **Proper headers** - Content-Type set correctly for JSON and FormData

---

## 🧪 Testing

### Local Testing with Production Backend

Create a `.env.local` file in the `frontend/` folder:

```env
VITE_API_URL=https://your-backend.onrender.com
```

Then run:
```bash
npm run dev
```

This will test your frontend locally against the production backend.

### Production Testing

After deploying to Vercel:

1. **Test Authentication**
   - Sign up / Sign in
   - Check if cookies are working
   - Verify profile loads

2. **Test API Calls**
   - Browse courses
   - View course details
   - Test instructor features (if applicable)

3. **Check Browser Console**
   - No CORS errors
   - No 404 errors
   - API calls going to correct URL

---

## 🔐 Security Checklist

- ✅ **No secrets in code** - All sensitive data in environment variables
- ✅ **No hardcoded URLs** - Backend URL from environment variable
- ✅ **Credentials included** - Cookies sent with requests
- ✅ **CORS handled** - Backend CORS already configured
- ✅ **Environment files gitignored** - `.env` files not committed

---

## 📝 Environment Files

### `.env.example` (Committed)
Template showing required environment variables:
```env
VITE_API_URL=http://localhost:8000
```

### `.env.local` (Not Committed)
Your local development overrides:
```env
VITE_API_URL=http://localhost:8000
# or for testing with production backend:
# VITE_API_URL=https://your-backend.onrender.com
```

### Vercel Environment Variables (Production)
Set in Vercel dashboard:
```
VITE_API_URL=https://your-backend.onrender.com
```

---

## 🐛 Troubleshooting

### CORS Errors
**Symptom**: "Access-Control-Allow-Origin" errors in browser console

**Solution**: 
1. Verify `VITE_API_URL` is set correctly in Vercel
2. Ensure backend CORS includes your Vercel domain
3. Check backend `CLIENT_URL` environment variable

### Authentication Not Working
**Symptom**: User not staying logged in, 401 errors

**Solution**:
1. Verify `credentials: 'include'` is in API calls (✅ already configured)
2. Check backend cookie settings (SameSite, Secure)
3. Ensure backend and frontend are on HTTPS in production

### API Calls Failing
**Symptom**: 404 errors, network errors

**Solution**:
1. Check `VITE_API_URL` in Vercel environment variables
2. Verify backend is deployed and running on Render
3. Test backend health endpoint: `https://your-backend.onrender.com/api/health`

---

## ✅ Pre-Deployment Checklist

- [x] API service uses environment variable
- [x] All services use centralized API
- [x] No hardcoded localhost URLs
- [x] `credentials: 'include'` configured
- [x] `.env.example` created
- [x] `.gitignore` includes `.env` files
- [x] No backend secrets in frontend code

---

## 🎯 Next Steps

1. **Deploy Backend on Render** (if not already done)
   - Get your backend URL (e.g., `https://your-app.onrender.com`)

2. **Deploy Frontend on Vercel**
   - Set `VITE_API_URL` to your Render backend URL
   - Deploy and test

3. **Update Backend CORS**
   - Add your Vercel domain to backend `CLIENT_URL`
   - Example: `https://your-app.vercel.app`

4. **Test End-to-End**
   - Sign up / Sign in
   - Browse courses
   - Test all features

---

**Last Updated**: January 26, 2026
**Status**: ✅ PRODUCTION READY
