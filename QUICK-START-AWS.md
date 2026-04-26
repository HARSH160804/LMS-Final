# Quick Start - AWS Deployment

Get your LMS platform running on AWS in under 30 minutes.

## Prerequisites Checklist

- [ ] AWS Account
- [ ] GitHub Account
- [ ] Domain name (optional, for SSL)
- [ ] Credit card for AWS (free tier available)

## Step 1: AWS Setup (10 minutes)

### 1.1 Create ECR Repositories

```bash
# Install AWS CLI if not already installed
# macOS: brew install awscli
# Linux: sudo apt install awscli
# Windows: Download from AWS website

# Configure AWS CLI
aws configure
# Enter your AWS Access Key ID
# Enter your AWS Secret Access Key
# Enter region: us-east-1
# Enter output format: json

# Create repositories
aws ecr create-repository --repository-name lms-backend --region us-east-1
aws ecr create-repository --repository-name lms-frontend --region us-east-1
```

### 1.2 Launch EC2 Instance

1. Go to [EC2 Console](https://console.aws.amazon.com/ec2/)
2. Click **Launch Instance**
3. Configure:
   - **Name**: lms-production
   - **AMI**: Ubuntu Server 22.04 LTS
   - **Instance type**: t3.medium (2 vCPU, 4 GB RAM)
   - **Key pair**: Create new or select existing
   - **Network**: Allow HTTP (80), HTTPS (443), SSH (22)
   - **Storage**: 30 GB gp3
4. Click **Launch Instance**
5. Wait 2-3 minutes for instance to start
6. Note the **Public IPv4 address**

### 1.3 Configure EC2

```bash
# SSH into your instance (replace with your key and IP)
ssh -i your-key.pem ubuntu@YOUR_EC2_IP

# Run setup script
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install AWS CLI
sudo apt update
sudo apt install awscli -y

# Logout and login again
exit
ssh -i your-key.pem ubuntu@YOUR_EC2_IP

# Verify installations
docker --version
docker-compose --version
aws --version

# Create app directory
mkdir -p /home/ubuntu/lms
cd /home/ubuntu/lms
```

## Step 2: GitHub Setup (5 minutes)

### 2.1 Get Your AWS Account ID

```bash
aws sts get-caller-identity --query Account --output text
```

### 2.2 Create IAM User for GitHub Actions

1. Go to [IAM Console](https://console.aws.amazon.com/iam/)
2. Click **Users** → **Create user**
3. Username: `github-actions-lms`
4. Click **Next**
5. Select **Attach policies directly**
6. Add these policies:
   - `AmazonEC2ContainerRegistryPowerUser`
   - `AmazonEC2ReadOnlyAccess`
7. Click **Create user**
8. Click on the user → **Security credentials**
9. Click **Create access key** → **Command Line Interface (CLI)**
10. Save the **Access Key ID** and **Secret Access Key**

### 2.3 Configure GitHub Secrets

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** for each:

| Name | Value | Where to get it |
|------|-------|-----------------|
| `AWS_ACCESS_KEY_ID` | Your IAM access key | From step 2.2 |
| `AWS_SECRET_ACCESS_KEY` | Your IAM secret key | From step 2.2 |
| `EC2_SSH_PRIVATE_KEY` | Your EC2 private key content | Open your .pem file and copy all content |
| `EC2_HOST` | Your EC2 public IP | From EC2 console |
| `EC2_USER` | `ubuntu` | Default for Ubuntu AMI |
| `VITE_BACKEND_URL` | `http://YOUR_EC2_IP/api/v1` | Replace with your EC2 IP |

## Step 3: Configure Environment (5 minutes)

### 3.1 Create .env file on EC2

```bash
# SSH to EC2
ssh -i your-key.pem ubuntu@YOUR_EC2_IP
cd /home/ubuntu/lms

# Create .env file
nano .env
```

Paste this content (replace with your values):

```env
# MongoDB
MONGO_URI=mongodb://admin:CHANGE_THIS_PASSWORD@mongodb:27017/lms?authSource=admin
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=CHANGE_THIS_PASSWORD

# JWT (generate a random 32+ character string)
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-CHANGE-THIS
JWT_EXPIRES_IN=7d

# Cloudinary (get from https://cloudinary.com)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Razorpay (get from https://razorpay.com)
RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret

# CORS
CLIENT_URL=http://YOUR_EC2_IP

# Frontend
VITE_BACKEND_URL=http://YOUR_EC2_IP/api/v1
```

Save and exit (Ctrl+X, Y, Enter)

## Step 4: Deploy! (10 minutes)

### 4.1 First Deployment

```bash
# On your local machine
git add .
git commit -m "Initial AWS deployment"
git push origin main
```

### 4.2 Monitor Deployment

1. Go to your GitHub repository
2. Click **Actions** tab
3. Watch the deployment progress
4. Wait for all steps to complete (green checkmarks)

### 4.3 Verify Deployment

```bash
# Test health endpoints
curl http://YOUR_EC2_IP/health
curl http://YOUR_EC2_IP/api/health

# Should return "healthy" and 200 OK
```

## Step 5: Access Your Application

Open in browser:
- **Frontend**: `http://YOUR_EC2_IP`
- **API**: `http://YOUR_EC2_IP/api/v1`

## 🎉 Success!

Your LMS platform is now running on AWS!

## Next Steps

### Add SSL/HTTPS (Recommended)

```bash
# SSH to EC2
ssh -i your-key.pem ubuntu@YOUR_EC2_IP

# Install Certbot
sudo apt install certbot -y

# Stop nginx temporarily
cd /home/ubuntu/lms
docker-compose stop nginx

# Get SSL certificate (replace with your domain)
sudo certbot certonly --standalone -d your-domain.com

# Copy certificates
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem /home/ubuntu/lms/nginx/ssl/
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem /home/ubuntu/lms/nginx/ssl/
sudo chown ubuntu:ubuntu /home/ubuntu/lms/nginx/ssl/*

# Update nginx config
nano /home/ubuntu/lms/nginx/conf.d/default.conf
# Uncomment the HTTPS server block

# Restart nginx
docker-compose up -d nginx
```

### Setup Auto-Renewal

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

## Troubleshooting

### Deployment Failed

```bash
# Check GitHub Actions logs
# Go to Actions tab → Click on failed workflow → View logs

# SSH to EC2 and check
ssh -i your-key.pem ubuntu@YOUR_EC2_IP
cd /home/ubuntu/lms
docker-compose logs -f
```

### Can't Access Application

```bash
# Check if containers are running
docker-compose ps

# Check logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs nginx

# Restart services
docker-compose restart
```

### 502 Bad Gateway

```bash
# Check backend health
docker-compose logs backend

# Restart backend
docker-compose restart backend

# Check nginx config
docker exec lms-nginx nginx -t
```

## Useful Commands

```bash
# View logs
docker-compose logs -f

# Restart services
docker-compose restart

# Stop services
docker-compose down

# Start services
docker-compose up -d

# Check status
docker-compose ps

# Update application (pull latest from GitHub)
cd /home/ubuntu/lms
docker-compose pull
docker-compose up -d
```

## Cost Estimate

**Monthly AWS Costs (approximate):**
- EC2 t3.medium: $30-35/month
- EBS Storage (30 GB): $3/month
- Data Transfer: $5-10/month
- **Total**: ~$40-50/month

**Free Tier (first 12 months):**
- 750 hours/month of t2.micro (not recommended for production)
- 30 GB EBS storage
- 15 GB data transfer

## Support

Need help?
- Check [AWS-DEPLOYMENT-GUIDE.md](./AWS-DEPLOYMENT-GUIDE.md) for detailed instructions
- Check [DEPLOYMENT-README.md](./DEPLOYMENT-README.md) for architecture details
- Open GitHub issue

## Security Checklist

- [ ] Changed default MongoDB password
- [ ] Generated strong JWT secret (32+ characters)
- [ ] Configured Cloudinary credentials
- [ ] Configured Razorpay credentials
- [ ] Setup SSL/HTTPS
- [ ] Configured security groups (only necessary ports open)
- [ ] Setup automated backups
- [ ] Enabled CloudWatch monitoring

---

**Congratulations!** 🎉 Your LMS platform is live on AWS!
