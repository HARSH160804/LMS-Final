# AWS Deployment Guide - LMS Platform

Complete guide for deploying the LMS platform on AWS with Docker, GitHub Actions CI/CD, and Nginx reverse proxy.

## Architecture Overview

```
Internet → Route 53 → ALB/CloudFront → EC2 (Nginx) → Docker Containers
                                                      ├── Frontend (React + Nginx)
                                                      ├── Backend (Node.js/Express)
                                                      └── MongoDB
```

## Prerequisites

- AWS Account with appropriate permissions
- Domain name (optional, for SSL)
- GitHub repository
- Local Docker installation for testing

## Part 1: AWS Infrastructure Setup

### 1.1 Create ECR Repositories

```bash
# Login to AWS CLI
aws configure

# Create ECR repositories
aws ecr create-repository --repository-name lms-backend --region us-east-1
aws ecr create-repository --repository-name lms-frontend --region us-east-1
```

### 1.2 Launch EC2 Instance

**Recommended Instance Type**: t3.medium or t3.large

1. Go to EC2 Dashboard → Launch Instance
2. Choose **Ubuntu Server 22.04 LTS**
3. Instance type: **t3.medium** (2 vCPU, 4 GB RAM)
4. Configure Security Group:
   - SSH (22) - Your IP
   - HTTP (80) - 0.0.0.0/0
   - HTTPS (443) - 0.0.0.0/0
5. Create/Select Key Pair
6. Storage: 30 GB gp3
7. Launch Instance

### 1.3 Configure EC2 Instance

SSH into your instance:

```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

Install Docker and Docker Compose:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install AWS CLI
sudo apt install awscli -y

# Verify installations
docker --version
docker-compose --version
aws --version

# Logout and login again for docker group to take effect
exit
```

### 1.4 Setup Application Directory

```bash
ssh -i your-key.pem ubuntu@your-ec2-ip

# Create application directory
mkdir -p /home/ubuntu/lms
cd /home/ubuntu/lms

# Create .env file
nano .env
```

Add your environment variables:

```env
# MongoDB
MONGO_URI=mongodb://admin:your-secure-password@mongodb:27017/lms?authSource=admin
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=your-secure-password

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
JWT_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Razorpay
RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret

# CORS
CLIENT_URL=http://your-domain.com

# Frontend
VITE_BACKEND_URL=http://your-domain.com/api/v1
```

## Part 2: GitHub Actions Setup

### 2.1 Configure GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add the following secrets:

```
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
EC2_SSH_PRIVATE_KEY=your-ec2-private-key-content
EC2_HOST=your-ec2-public-ip
EC2_USER=ubuntu
VITE_BACKEND_URL=http://your-domain.com/api/v1
```

### 2.2 Create IAM User for GitHub Actions

1. Go to IAM → Users → Create User
2. User name: `github-actions-lms`
3. Attach policies:
   - `AmazonEC2ContainerRegistryPowerUser`
   - `AmazonEC2ReadOnlyAccess`
4. Create access key → CLI
5. Save credentials for GitHub Secrets

## Part 3: Local Testing

### 3.1 Test Docker Build Locally

```bash
# Build backend
cd backend
docker build -t lms-backend:test .

# Build frontend
cd ../frontend
docker build --build-arg VITE_BACKEND_URL=http://localhost/api/v1 -t lms-frontend:test .

# Test with docker-compose
cd ..
docker-compose up -d

# Check logs
docker-compose logs -f

# Test endpoints
curl http://localhost/health
curl http://localhost/api/health

# Stop containers
docker-compose down
```

## Part 4: Deploy to AWS

### 4.1 Initial Manual Deployment

```bash
# On your local machine
# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

# Build and push backend
cd backend
docker build -t YOUR_AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/lms-backend:latest .
docker push YOUR_AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/lms-backend:latest

# Build and push frontend
cd ../frontend
docker build --build-arg VITE_BACKEND_URL=http://your-domain.com/api/v1 \
  -t YOUR_AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/lms-frontend:latest .
docker push YOUR_AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/lms-frontend:latest

# SSH to EC2 and deploy
ssh -i your-key.pem ubuntu@your-ec2-ip
cd /home/ubuntu/lms

# Login to ECR on EC2
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

# Update docker-compose.yml with ECR image URLs
nano docker-compose.yml

# Start services
docker-compose up -d

# Check status
docker-compose ps
docker-compose logs -f
```

### 4.2 Automated Deployment via GitHub Actions

After initial setup, every push to `main` branch will:

1. Run tests
2. Build Docker images
3. Push to ECR
4. Deploy to EC2
5. Verify deployment

```bash
# Trigger deployment
git add .
git commit -m "Deploy to AWS"
git push origin main

# Monitor in GitHub Actions tab
```

## Part 5: SSL/HTTPS Setup (Production)

### 5.1 Install Certbot on EC2

```bash
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Stop nginx container temporarily
cd /home/ubuntu/lms
docker-compose stop nginx

# Get SSL certificate
sudo certbot certonly --standalone -d your-domain.com -d www.your-domain.com

# Copy certificates to nginx directory
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem /home/ubuntu/lms/nginx/ssl/
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem /home/ubuntu/lms/nginx/ssl/
sudo chown ubuntu:ubuntu /home/ubuntu/lms/nginx/ssl/*

# Update nginx config to enable HTTPS
nano /home/ubuntu/lms/nginx/conf.d/default.conf
# Uncomment the HTTPS server block and update server_name

# Restart nginx
docker-compose up -d nginx
```

### 5.2 Auto-renewal Setup

```bash
# Create renewal script
cat > /home/ubuntu/renew-cert.sh << 'EOF'
#!/bin/bash
cd /home/ubuntu/lms
docker-compose stop nginx
sudo certbot renew
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem /home/ubuntu/lms/nginx/ssl/
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem /home/ubuntu/lms/nginx/ssl/
sudo chown ubuntu:ubuntu /home/ubuntu/lms/nginx/ssl/*
docker-compose up -d nginx
EOF

chmod +x /home/ubuntu/renew-cert.sh

# Add to crontab (runs monthly)
(crontab -l 2>/dev/null; echo "0 0 1 * * /home/ubuntu/renew-cert.sh") | crontab -
```

## Part 6: Monitoring and Maintenance

### 6.1 View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f nginx

# Last 100 lines
docker-compose logs --tail=100 backend
```

### 6.2 Restart Services

```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart backend

# Rebuild and restart
docker-compose up -d --build backend
```

### 6.3 Database Backup

```bash
# Backup MongoDB
docker exec lms-mongodb mongodump --out /data/backup --authenticationDatabase admin -u admin -p your-password

# Copy backup to host
docker cp lms-mongodb:/data/backup ./mongodb-backup-$(date +%Y%m%d)

# Upload to S3 (optional)
aws s3 cp ./mongodb-backup-$(date +%Y%m%d) s3://your-backup-bucket/ --recursive
```

### 6.4 Health Checks

```bash
# Check container health
docker-compose ps

# Test endpoints
curl http://your-domain.com/health
curl http://your-domain.com/api/health

# Check resource usage
docker stats
```

## Part 7: Scaling and Optimization

### 7.1 Horizontal Scaling with Load Balancer

1. Create Application Load Balancer (ALB)
2. Create Target Group for EC2 instances
3. Launch multiple EC2 instances
4. Update GitHub Actions to deploy to all instances

### 7.2 Use RDS for MongoDB

1. Create MongoDB Atlas cluster or AWS DocumentDB
2. Update `MONGO_URI` in environment variables
3. Remove MongoDB container from docker-compose

### 7.3 Use S3 + CloudFront for Static Assets

1. Build frontend locally
2. Upload `dist/` to S3 bucket
3. Create CloudFront distribution
4. Update API calls to use CloudFront URL

## Troubleshooting

### Issue: Containers not starting

```bash
# Check logs
docker-compose logs

# Check disk space
df -h

# Check memory
free -m

# Restart Docker daemon
sudo systemctl restart docker
```

### Issue: Cannot connect to MongoDB

```bash
# Check MongoDB logs
docker-compose logs mongodb

# Verify connection string
docker exec -it lms-backend env | grep MONGO_URI

# Test connection
docker exec -it lms-mongodb mongosh -u admin -p your-password
```

### Issue: 502 Bad Gateway

```bash
# Check backend health
docker-compose logs backend

# Verify backend is running
docker-compose ps backend

# Check nginx config
docker exec lms-nginx nginx -t

# Restart nginx
docker-compose restart nginx
```

## Security Best Practices

1. **Use strong passwords** for MongoDB and JWT secrets
2. **Enable AWS CloudWatch** for monitoring
3. **Setup AWS WAF** for DDoS protection
4. **Use AWS Secrets Manager** for sensitive data
5. **Enable VPC** for network isolation
6. **Regular security updates**: `sudo apt update && sudo apt upgrade`
7. **Implement rate limiting** (already configured in Nginx)
8. **Use HTTPS only** in production
9. **Regular backups** of database
10. **Monitor logs** for suspicious activity

## Cost Optimization

- **EC2**: Use Reserved Instances for 1-3 year commitment (up to 72% savings)
- **ECR**: Enable lifecycle policies to delete old images
- **CloudWatch**: Set up alarms for cost anomalies
- **Auto Scaling**: Scale down during low traffic periods
- **S3**: Use Intelligent-Tiering for static assets

## Support

For issues or questions:
- Check logs: `docker-compose logs -f`
- GitHub Issues: [Your repo URL]
- AWS Support: https://console.aws.amazon.com/support/

## Next Steps

1. ✅ Setup AWS infrastructure
2. ✅ Configure GitHub Actions
3. ✅ Deploy application
4. ✅ Setup SSL/HTTPS
5. ✅ Configure monitoring
6. 🔄 Setup CI/CD pipeline
7. 🔄 Implement auto-scaling
8. 🔄 Add CloudWatch alarms
