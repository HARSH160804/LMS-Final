# 🚀 Render Deployment - Quick Start

## Step 1: Create Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository

## Step 2: Configure Service

```
Name: your-lms-backend
Root Directory: Backend
Environment: Node
Region: Choose closest to your users
Branch: main (or your production branch)
```

## Step 3: Build & Start Commands

```
Build Command: npm install
Start Command: npm start
```

## Step 4: Environment Variables

Click **"Advanced"** → **"Add Environment Variable"** and add:

```
NODE_ENV=production
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
CLIENT_URL=https://your-frontend.vercel.app
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret
```

## Step 5: Health Check (Optional but Recommended)

```
Health Check Path: /api/health
```

## Step 6: Deploy

Click **"Create Web Service"** and wait for deployment to complete.

## Step 7: Test Your Backend

Once deployed, test the health endpoint:

```bash
curl https://your-app.onrender.com/api/health
```

Expected response: `{"status":"ok"}`

## Step 8: Update Frontend

In your Vercel frontend environment variables, set:

```
VITE_API_URL=https://your-app.onrender.com
```

---

## ✅ Your Backend is Ready!

- ✅ Production-safe start script
- ✅ Dynamic PORT configuration
- ✅ Health check endpoints
- ✅ CORS configured
- ✅ Security middleware enabled
- ✅ Environment variables properly loaded
- ✅ No secrets hardcoded

---

## 🔍 Troubleshooting

**Build fails?**
- Check that `Backend` is set as root directory
- Verify `package.json` exists in Backend folder

**App crashes on startup?**
- Check Render logs for errors
- Verify `MONGO_URI` is correct
- Ensure MongoDB Atlas allows Render IPs (use 0.0.0.0/0)

**CORS errors?**
- Verify `CLIENT_URL` matches your Vercel URL exactly
- Include `https://` in the URL

**Health check fails?**
- Wait 2-3 minutes after deployment
- Check if MongoDB connection is successful in logs
