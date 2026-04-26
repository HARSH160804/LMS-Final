# LMS Platform - Production Deployment

Complete production-ready deployment setup with Docker, GitHub Actions CI/CD, Nginx reverse proxy, and AWS infrastructure.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Internet                             │
└────────────────────────┬────────────────────────────────────┘
                         │
                    ┌────▼────┐
                    │ Route 53│ (DNS)
                    └────┬────┘
                         │
                    ┌────▼────┐
                    │   ALB   │ (Load Balancer - Optional)
                    └────┬────┘
                         │
                    ┌────▼────┐
                    │   EC2   │
                    │  Nginx  │ (Reverse Proxy)
                    └────┬────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
   ┌────▼────┐     ┌────▼────┐     ┌────▼────┐
   │Frontend │     │ Backend │     │ MongoDB │
   │ (React) │     │(Node.js)│     │         │
   └─────────┘     └─────────┘     └─────────┘
```

## 📋 What's Included

### Docker Configuration
- ✅ Multi-stage Dockerfile for backend (Node.js)
- ✅ Multi-stage Dockerfile for frontend (React + Nginx)
- ✅ Docker Compose for local development
- ✅ Production Docker Compose override
- ✅ Health checks for all services
- ✅ Non-root user for security
- ✅ Optimized layer caching

### Nginx Configuration
- ✅ Reverse proxy for backend API
- ✅ Static file serving for frontend
- ✅ Gzip compression
- ✅ Rate limiting
- ✅ Security headers
- ✅ SSL/HTTPS support (ready)
- ✅ Load balancing (upstream)
- ✅ Caching configuration

### GitHub Actions CI/CD
- ✅ Automated testing on PR
- ✅ Build and push to AWS ECR
- ✅ Automated deployment to EC2
- ✅ Health check verification
- ✅ Rollback on failure
- ✅ Build caching for faster builds
- ✅ Multi-environment support

### AWS Infrastructure
- ✅ EC2 deployment ready
- ✅ ECR for Docker images
- ✅ IAM roles and policies
- ✅ Security groups configuration
- ✅ CloudWatch logging (ready)
- ✅ Auto-scaling (ready)

## 🚀 Quick Start

### Prerequisites

```bash
# Required
- Docker & Docker Compose
- AWS Account
- GitHub Account
- Node.js 20+ (for local development)

# Optional
- Domain name (for SSL)
- AWS CLI configured
```

### Local Development

```bash
# 1. Clone repository
git clone <your-repo-url>
cd lms-platform

# 2. Setup environment variables
cp .env.example .env
# Edit .env with your values

# 3. Start services
docker-compose up -d

# 4. Check status
docker-compose ps
docker-compose logs -f

# 5. Access application
# Frontend: http://localhost
# Backend API: http://localhost/api
# Health: http://localhost/health
```

### Production Deployment

See [AWS-DEPLOYMENT-GUIDE.md](./AWS-DEPLOYMENT-GUIDE.md) for complete instructions.

**Quick Deploy:**

```bash
# 1. Setup AWS infrastructure (one-time)
# - Create ECR repositories
# - Launch EC2 instance
# - Configure security groups

# 2. Configure GitHub Secrets
# - AWS_ACCESS_KEY_ID
# - AWS_SECRET_ACCESS_KEY
# - EC2_SSH_PRIVATE_KEY
# - EC2_HOST
# - VITE_BACKEND_URL

# 3. Push to main branch
git push origin main

# GitHub Actions will automatically:
# - Run tests
# - Build Docker images
# - Push to ECR
# - Deploy to EC2
# - Verify deployment
```

## 📁 Project Structure

```
.
├── backend/
│   ├── Dockerfile              # Backend Docker image
│   ├── .dockerignore          # Docker ignore rules
│   ├── controllers/           # API controllers
│   ├── models/                # Database models
│   ├── routes/                # API routes
│   └── index.js               # Entry point
│
├── frontend/
│   ├── Dockerfile             # Frontend Docker image
│   ├── nginx.conf             # Frontend Nginx config
│   ├── .dockerignore          # Docker ignore rules
│   └── src/                   # React source code
│
├── nginx/
│   ├── nginx.conf             # Main Nginx config
│   └── conf.d/
│       └── default.conf       # Server configuration
│
├── .github/
│   └── workflows/
│       └── deploy.yml         # CI/CD pipeline
│
├── scripts/
│   └── deploy.sh              # Deployment script
│
├── docker-compose.yml         # Development compose
├── docker-compose.prod.yml    # Production overrides
├── .env.example               # Environment template
└── AWS-DEPLOYMENT-GUIDE.md    # Detailed AWS guide
```

## 🔧 Configuration

### Environment Variables

**Backend (.env):**
```env
NODE_ENV=production
PORT=8000
MONGO_URI=mongodb://...
JWT_SECRET=your-secret-key
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
CLIENT_URL=https://your-domain.com
```

**Frontend (build args):**
```env
VITE_BACKEND_URL=https://your-domain.com/api/v1
```

### GitHub Secrets

Required secrets for CI/CD:

| Secret | Description |
|--------|-------------|
| `AWS_ACCESS_KEY_ID` | AWS IAM user access key |
| `AWS_SECRET_ACCESS_KEY` | AWS IAM user secret key |
| `EC2_SSH_PRIVATE_KEY` | EC2 instance SSH private key |
| `EC2_HOST` | EC2 instance public IP/domain |
| `EC2_USER` | EC2 SSH user (usually `ubuntu`) |
| `VITE_BACKEND_URL` | Frontend API URL |

## 🔒 Security Features

- ✅ Non-root Docker containers
- ✅ Security headers (X-Frame-Options, CSP, etc.)
- ✅ Rate limiting (10 req/s for API, 30 req/s general)
- ✅ CORS configuration
- ✅ JWT authentication with httpOnly cookies
- ✅ Environment variable validation
- ✅ SSL/HTTPS ready
- ✅ MongoDB authentication
- ✅ Secrets management

## 📊 Monitoring

### Health Checks

```bash
# Application health
curl http://your-domain.com/health

# API health
curl http://your-domain.com/api/health

# Container health
docker-compose ps
```

### Logs

```bash
# View all logs
docker-compose logs -f

# View specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f nginx

# Last 100 lines
docker-compose logs --tail=100 backend
```

### Metrics

```bash
# Container stats
docker stats

# Disk usage
docker system df

# Network
docker network ls
```

## 🔄 CI/CD Pipeline

### Workflow Triggers

- **Push to main**: Full deployment
- **Pull Request**: Tests only
- **Manual**: Via GitHub Actions UI

### Pipeline Stages

1. **Test** (on PR and push)
   - Install dependencies
   - Run linters
   - Run tests

2. **Build** (on push to main)
   - Build Docker images
   - Push to AWS ECR
   - Cache layers for speed

3. **Deploy** (on push to main)
   - SSH to EC2
   - Pull latest images
   - Update containers
   - Verify health

4. **Notify** (always)
   - Report status
   - Send notifications

## 🛠️ Maintenance

### Update Application

```bash
# Method 1: Via GitHub (recommended)
git push origin main  # Triggers automatic deployment

# Method 2: Manual on EC2
ssh ubuntu@your-ec2-ip
cd /home/ubuntu/lms
docker-compose pull
docker-compose up -d
```

### Database Backup

```bash
# Backup MongoDB
docker exec lms-mongodb mongodump \
  --out /data/backup \
  --authenticationDatabase admin \
  -u admin -p your-password

# Copy to host
docker cp lms-mongodb:/data/backup ./backup-$(date +%Y%m%d)

# Upload to S3 (optional)
aws s3 cp ./backup-$(date +%Y%m%d) \
  s3://your-backup-bucket/ --recursive
```

### SSL Certificate Renewal

```bash
# Auto-renewal is configured via cron
# Manual renewal:
sudo certbot renew
docker-compose restart nginx
```

## 🐛 Troubleshooting

### Containers won't start

```bash
# Check logs
docker-compose logs

# Check resources
docker stats
df -h
free -m

# Restart Docker
sudo systemctl restart docker
```

### 502 Bad Gateway

```bash
# Check backend
docker-compose logs backend
docker-compose restart backend

# Check nginx config
docker exec lms-nginx nginx -t
docker-compose restart nginx
```

### Database connection issues

```bash
# Check MongoDB
docker-compose logs mongodb

# Test connection
docker exec -it lms-mongodb mongosh -u admin -p your-password

# Verify environment
docker exec lms-backend env | grep MONGO_URI
```

## 📈 Scaling

### Horizontal Scaling

1. Create Application Load Balancer
2. Launch multiple EC2 instances
3. Update GitHub Actions to deploy to all instances
4. Configure health checks in ALB

### Vertical Scaling

1. Stop application: `docker-compose down`
2. Resize EC2 instance type
3. Start application: `docker-compose up -d`

### Database Scaling

- Use MongoDB Atlas (managed)
- Or AWS DocumentDB
- Update `MONGO_URI` in environment

## 💰 Cost Optimization

- Use EC2 Reserved Instances (up to 72% savings)
- Enable ECR lifecycle policies
- Use S3 + CloudFront for static assets
- Implement auto-scaling
- Monitor with AWS Cost Explorer

## 📚 Additional Resources

- [AWS Deployment Guide](./AWS-DEPLOYMENT-GUIDE.md) - Detailed AWS setup
- [Docker Documentation](https://docs.docker.com/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

## 🤝 Support

For issues or questions:
- Check logs: `docker-compose logs -f`
- Review [AWS-DEPLOYMENT-GUIDE.md](./AWS-DEPLOYMENT-GUIDE.md)
- Open GitHub issue

## ✅ Deployment Checklist

- [ ] AWS infrastructure setup
- [ ] ECR repositories created
- [ ] EC2 instance launched and configured
- [ ] Security groups configured
- [ ] Environment variables set
- [ ] GitHub secrets configured
- [ ] Domain name configured (optional)
- [ ] SSL certificates obtained (optional)
- [ ] First deployment successful
- [ ] Health checks passing
- [ ] Monitoring configured
- [ ] Backup strategy implemented

## 📝 License

[Your License]

---

**Ready to deploy?** Follow the [AWS Deployment Guide](./AWS-DEPLOYMENT-GUIDE.md) for step-by-step instructions.
