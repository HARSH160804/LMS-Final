# LMS Platform - Learning Management System

A full-stack Learning Management System built with Express.js (backend) and React (frontend).

## 📁 Project Structure

```
LMS-Final/
├── backend/          # Express.js API server
│   ├── controllers/  # Route controllers
│   ├── database/     # Database configuration
│   ├── middleware/   # Express middleware
│   ├── models/       # MongoDB models
│   ├── routes/       # API routes
│   ├── utils/        # Utility functions
│   ├── index.js      # Entry point
│   └── package.json  # Backend dependencies
│
├── frontend/         # React application
│   ├── src/          # React source code
│   ├── public/       # Static assets
│   └── package.json  # Frontend dependencies
│
└── README.md         # This file
```

## 🚀 Deployment

### Backend - Render

The backend is configured for deployment on [Render](https://render.com/).

**Render Settings:**
- **Root Directory**: `backend`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Health Check Path**: `/api/health`

**Required Environment Variables:**
```
NODE_ENV=production
PORT=8000
MONGO_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>
CLIENT_URL=<your-vercel-frontend-url>
CLOUDINARY_CLOUD_NAME=<your-cloudinary-name>
CLOUDINARY_API_KEY=<your-cloudinary-key>
CLOUDINARY_API_SECRET=<your-cloudinary-secret>
RAZORPAY_KEY_ID=<your-razorpay-key>
RAZORPAY_KEY_SECRET=<your-razorpay-secret>
```

📖 **Detailed Guide**: See `backend/RENDER-DEPLOYMENT.md`

### Frontend - Vercel

The frontend is configured for deployment on [Vercel](https://vercel.com/).

**Vercel Settings:**
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

**Required Environment Variables:**
```
VITE_API_URL=<your-render-backend-url>
```

📖 **Detailed Guide**: See `frontend/DEPLOY.md`

## 💻 Local Development

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
cp env.example .env
# Edit .env with your configuration
npm run dev
```

Backend will run on `http://localhost:8000`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on `http://localhost:5173`

## 🔧 Tech Stack

### Backend
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with bcrypt
- **File Upload**: Multer + Cloudinary
- **Payment**: Razorpay & Stripe
- **Security**: Helmet, CORS, Rate Limiting

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v7
- **Animations**: Framer Motion

## 📚 API Documentation

API documentation is available in `backend/API-REFERENCE.md`

**Base URL (Production)**: `https://your-app.onrender.com`
**Base URL (Development)**: `http://localhost:8000`

### Health Check Endpoints
- `GET /api/health` - Simple health check
- `GET /health` - Detailed system status

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Rate limiting
- MongoDB injection prevention
- XSS protection
- HTTP Parameter Pollution prevention
- Secure HTTP headers with Helmet

## 📝 License

ISC

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Support

For issues and questions, please open an issue in the GitHub repository.

---

**Last Updated**: January 26, 2026
