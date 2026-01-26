# 📋 Render Deployment Checklist

Use this checklist to ensure a smooth deployment to Render.

## Pre-Deployment

- [x] ✅ Production start script configured (`npm start`)
- [x] ✅ Entry file uses dynamic PORT (`process.env.PORT`)
- [x] ✅ Health check endpoints available (`/api/health` and `/health`)
- [x] ✅ CORS configured for frontend
- [x] ✅ Environment variables loaded with dotenv
- [x] ✅ No secrets hardcoded or logged
- [x] ✅ `.env` file in `.gitignore`
- [x] ✅ Security middleware enabled
- [x] ✅ Database connection with retry logic
- [x] ✅ Local testing passed

## Render Setup

- [ ] Create new Web Service on Render
- [ ] Connect GitHub repository
- [ ] Set **Root Directory** to `Backend`
- [ ] Set **Build Command** to `npm install`
- [ ] Set **Start Command** to `npm start`
- [ ] Set **Health Check Path** to `/api/health`

## Environment Variables

Add these in Render Dashboard → Environment:

- [ ] `NODE_ENV=production`
- [ ] `PORT=8000`
- [ ] `MONGO_URI=<your-mongodb-uri>`
- [ ] `JWT_SECRET=<your-jwt-secret>`
- [ ] `JWT_EXPIRES_IN=7d`
- [ ] `JWT_COOKIE_EXPIRES_IN=7`
- [ ] `CLIENT_URL=<your-vercel-frontend-url>`
- [ ] `CLOUDINARY_CLOUD_NAME=<your-cloudinary-name>`
- [ ] `CLOUDINARY_API_KEY=<your-cloudinary-key>`
- [ ] `CLOUDINARY_API_SECRET=<your-cloudinary-secret>`
- [ ] `RAZORPAY_KEY_ID=<your-razorpay-key>`
- [ ] `RAZORPAY_KEY_SECRET=<your-razorpay-secret>`
- [ ] `STRIPE_SECRET_KEY=<your-stripe-key>`
- [ ] `STRIPE_WEBHOOK_SECRET=<your-stripe-webhook>`

## MongoDB Atlas Setup

- [ ] MongoDB Atlas cluster created
- [ ] Database user created with password
- [ ] Network access allows Render IPs (use `0.0.0.0/0` for all IPs)
- [ ] Connection string copied and added to Render

## Deployment

- [ ] Click "Create Web Service" on Render
- [ ] Wait for build to complete (check logs)
- [ ] Verify deployment successful
- [ ] Check health endpoint: `curl https://your-app.onrender.com/api/health`

## Post-Deployment

- [ ] Test health endpoint returns `{"status":"ok"}`
- [ ] Test detailed health endpoint `/health`
- [ ] Verify MongoDB connection in logs
- [ ] Test API endpoints (login, courses, etc.)
- [ ] Update frontend `VITE_API_URL` in Vercel
- [ ] Test frontend-backend integration
- [ ] Verify CORS working (no errors in browser console)
- [ ] Test file uploads (if applicable)
- [ ] Test payment integration (Razorpay/Stripe)

## Monitoring

- [ ] Set up Render alerts for downtime
- [ ] Monitor Render logs for errors
- [ ] Check MongoDB Atlas metrics
- [ ] Test health endpoints periodically

## Troubleshooting

If deployment fails, check:

1. **Build Logs** - Look for npm install errors
2. **Runtime Logs** - Check for startup errors
3. **MongoDB Connection** - Verify URI and network access
4. **Environment Variables** - Ensure all are set correctly
5. **Health Check** - Verify endpoint is accessible

---

## Quick Commands

### Test Health Locally
```bash
npm start
curl http://localhost:8000/api/health
```

### Test Health on Render
```bash
curl https://your-app.onrender.com/api/health
```

### View Render Logs
```bash
# In Render Dashboard → Logs tab
# Or use Render CLI
render logs
```

---

## Support Resources

- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Express.js Documentation](https://expressjs.com/)

---

**Last Updated**: January 26, 2026
**Status**: ✅ Ready for Deployment
