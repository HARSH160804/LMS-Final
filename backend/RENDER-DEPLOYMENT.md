# Backend Deployment Guide for Render

## ✅ Production Readiness Checklist

Your Express backend is now production-ready with the following configurations:

### 1. **Entry Point & Start Script**
- Entry file: `index.js`
- Production start script: `npm start` (uses `node index.js`)
- Development script: `npm run dev` (uses `nodemon`)

### 2. **Port Configuration**
- Dynamically uses `process.env.PORT` or defaults to `8000`
- Render will automatically set the PORT environment variable

### 3. **Health Check Endpoints**
Two health check routes are available:
- **Simple**: `GET /api/health` → Returns `{ "status": "ok" }`
- **Detailed**: `GET /health` → Returns full system status including database connection

### 4. **CORS Configuration**
- Configured to accept requests from frontend
- Uses `process.env.CLIENT_URL` for production frontend URL
- Credentials enabled for cookie-based authentication

### 5. **Environment Variables**
- `dotenv` configured at application start
- No secrets hardcoded or logged
- All sensitive data loaded from environment variables

### 6. **Security Features**
- Helmet for security headers
- Rate limiting enabled
- MongoDB sanitization
- XSS protection
- HPP (HTTP Parameter Pollution) prevention

---

## 🚀 Render Deployment Settings

### **Web Service Configuration**

1. **Root Directory**: `Backend`
2. **Build Command**: `npm install`
3. **Start Command**: `npm start`
4. **Environment**: `Node`

### **Required Environment Variables**

Set these in Render Dashboard → Environment:

```
NODE_ENV=production
PORT=8000
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
JWT_EXPIRES_IN=7d
JWT_COOKIE_EXPIRES_IN=7
CLIENT_URL=<your-vercel-frontend-url>
CLOUDINARY_CLOUD_NAME=<your-cloudinary-name>
CLOUDINARY_API_KEY=<your-cloudinary-key>
CLOUDINARY_API_SECRET=<your-cloudinary-secret>
RAZORPAY_KEY_ID=<your-razorpay-key>
RAZORPAY_KEY_SECRET=<your-razorpay-secret>
STRIPE_SECRET_KEY=<your-stripe-key>
STRIPE_WEBHOOK_SECRET=<your-stripe-webhook-secret>
```

### **Health Check Path**
- Set to: `/api/health`
- This allows Render to monitor your service health

---

## 🧪 Local Testing

Verify the backend works locally before deploying:

```bash
cd Backend
npm install
npm start
```

Test the health endpoints:
```bash
# Simple health check
curl http://localhost:8000/api/health

# Detailed health check
curl http://localhost:8000/health
```

Expected responses:
- `/api/health`: `{"status":"ok"}`
- `/health`: Full system status with database connection info

---

## 📝 Post-Deployment Steps

1. **Update Frontend Environment Variables**
   - Set `VITE_API_URL` in Vercel to your Render backend URL
   - Example: `https://your-app.onrender.com`

2. **Test CORS**
   - Ensure frontend can make requests to backend
   - Check browser console for CORS errors

3. **Monitor Logs**
   - Check Render logs for any startup errors
   - Verify database connection is successful

4. **Test Health Endpoints**
   ```bash
   curl https://your-app.onrender.com/api/health
   ```

---

## 🔧 Troubleshooting

### Database Connection Issues
- Verify `MONGO_URI` is correct in Render environment variables
- Ensure MongoDB Atlas allows connections from all IPs (0.0.0.0/0) or Render's IPs

### CORS Errors
- Verify `CLIENT_URL` matches your Vercel frontend URL exactly
- Include protocol (https://) in the URL

### Port Issues
- Render automatically sets PORT - don't hardcode it
- Current config: `process.env.PORT || 8000`

---

## ✨ What Was Changed

1. **PORT default changed**: From 3000 to 8000 (matches .env)
2. **Deprecated MongoDB options removed**: `useNewUrlParser` and `useUnifiedTopology`
3. **Simple health check added**: `GET /api/health` for Render monitoring
4. **All configurations verified**: Production-safe and ready for deployment

---

## 📞 Support

If you encounter issues:
1. Check Render logs for error messages
2. Verify all environment variables are set correctly
3. Test health endpoints after deployment
4. Ensure MongoDB connection string is accessible from Render
