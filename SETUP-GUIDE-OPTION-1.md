# Setup Guide - Option 1: Automated CI/CD

Complete step-by-step guide to deploy your LMS platform on AWS with automated GitHub Actions CI/CD.

## 📋 Prerequisites

Before starting, ensure you have:
- [ ] AWS Account (free tier works)
- [ ] GitHub Account
- [ ] AWS CLI installed on your local machine
- [ ] SSH client (Terminal on Mac/Linux, PuTTY on Windows)
- [ ] Credit card for AWS verification

## 🎯 Overview

This setup will create:
1. AWS ECR repositories for Docker images
2. EC2 instance running your application
3. GitHub Actions pipeline for automatic deployment
4. Every push to `main` branch automatically deploys to AWS

**Total Time**: 30-40 minutes  
**Monthly Cost**: ~$40-50

---

## Step 1: AWS CLI Setup (5 minutes)

### 1.1 Install AWS CLI

**macOS:**
```bash
brew install awscli
```

**Linux:**
```bash
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
```

**Windows:**
Download from: https://aws.amazon.com/cli/

### 1.2 Configure AWS CLI

```bash
aws configure
```

You'll need:
- **AWS Access Key ID**: Get from AWS Console → IAM → Your User → Security Credentials
- **AWS Secret Access Key**: From same location
- **Default region**: `us-east-1` (or your preferred region)
- **Default output format**: `json`

### 1.3 Verify Configuration

```bash
aws sts get-caller-identity
```

Should show your AWS account details.

---

## Step 2: Create AWS ECR Repositories (5 minutes)

ECR (Elastic Container Registry) stores your Docker images.

```bash
# Create backend repository
aws ecr create-repository \
    --repository-name lms-backend \
    --region us-east-1 \
    --image-scanning-configuration scanOnPush=true

# Create frontend repository
aws ecr create-repository \
    --repository-name lms-frontend \
    --region us-east-1 \
    --image-scanning-configuration scanOnPush=true
```

**Save the output!** You'll need the repository URIs later.

Example output:
```json
{
    "repository": {
        "repositoryUri": "123456789012.dkr.ecr.us-east-1.amazonaws.com/lms-backend"
    }
}
```

---

## Step 3: Create IAM User for GitHub Actions (5 minutes)

### 3.1 Create IAM User

1. Go to [IAM Console](https://console.aws.amazon.com/iam/)
2. Click **Users** → **Create user**
3. Username: `github-actions-lms`
4. Click **Next**

### 3.2 Attach Policies

Select **Attach policies directly** and add:
- `AmazonEC2ContainerRegistryPowerUser`
- `AmazonEC2ReadOnlyAccess`

Click **Create user**

### 3.3 Create Access Keys

1. Click on the newly created user
2. Go to **Security credentials** tab
3. Click **Create access key**
4. Select **Command Line Interface (CLI)**
5. Check the confirmation box
6. Click **Create access key**
7. **IMPORTANT**: Copy both:
   - Access key ID
   - Secret access key
   
   ⚠️ You won't be able to see the secret key again!

---

## Step 4: Launch EC2 Instance (10 minutes)

### 4.1 Launch Instance

1. Go to [EC2 Console](https://console.aws.amazon.com/ec2/)
2. Click **Launch Instance**

### 4.2 Configure Instance

**Name and tags:**
- Name: `lms-production`

**Application and OS Images:**
- AMI: **Ubuntu Server 22.04 LTS (HVM), SSD Volume Type**
- Architecture: **64-bit (x86)**

**Instance type:**
- Select: **t3.medium** (2 vCPU, 4 GB RAM)
- For testing, you can use **t2.micro** (free tier) but performance will be limited

**Key pair:**
- Click **Create new key pair**
- Name: `lms-production-key`
- Type: **RSA**
- Format: **.pem** (Mac/Linux) or **.ppk** (Windows/PuTTY)
- Click **Create key pair**
- **SAVE THE FILE!** You'll need it to SSH

**Network settings:**
- Click **Edit**
- Auto-assign public IP: **Enable**
- Firewall (security groups): **Create security group**
- Security group name: `lms-production-sg`
- Description: `Security group for LMS production`

Add these rules:
1. **SSH** - Port 22 - Source: My IP (your current IP)
2. **HTTP** - Port 80 - Source: Anywhere (0.0.0.0/0)
3. **HTTPS** - Port 443 - Source: Anywhere (0.0.0.0/0)

**Configure storage:**
- Size: **30 GB**
- Volume type: **gp3**

### 4.3 Launch

1. Review your configuration
2. Click **Launch instance**
3. Wait 2-3 minutes for instance to start
4. Click on the instance ID
5. **Copy the Public IPv4 address** - you'll need this!

---

## Step 5: Configure EC2 Instance (10 minutes)

### 5.1 Connect to EC2

**Mac/Linux:**
```bash
chmod 400 lms-production-key.pem
ssh -i lms-production-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

**Windows (PowerShell):**
```powershell
ssh -i lms-production-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

### 5.2 Install Docker

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker ubuntu

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install AWS CLI
sudo apt install awscli -y

# Logout and login again for docker group to take effect
exit
```

### 5.3 Reconnect and Verify

```bash
ssh -i lms-production-key.pem ubuntu@YOUR_EC2_PUBLIC_IP

# Verify installations
docker --version
docker-compose --version
aws --version
```

All commands should show version numbers.

### 5.4 Configure AWS CLI on EC2

```bash
aws configure
```

Enter the same credentials you used locally.

### 5.5 Create Application Directory

```bash
mkdir -p /home/ubuntu/lms
cd /home/ubuntu/lms
```

### 5.6 Create Environment File

```bash
nano .env
```

Paste this content (replace with your actual values):

```env
# MongoDB Configuration
MONGO_URI=mongodb://admin:CHANGE_THIS_STRONG_PASSWORD@mongodb:27017/lms?authSource=admin
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=CHANGE_THIS_STRONG_PASSWORD

# JWT Configuration (generate a random 32+ character string)
JWT_SECRET=CHANGE_THIS_TO_A_RANDOM_32_PLUS_CHARACTER_STRING
JWT_EXPIRES_IN=7d

# Cloudinary Configuration (get from https://cloudinary.com)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Razorpay Configuration (get from https://razorpay.com)
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret

# CORS Configuration
CLIENT_URL=http://YOUR_EC2_PUBLIC_IP

# Frontend Configuration
VITE_BACKEND_URL=http://YOUR_EC2_PUBLIC_IP/api/v1

# AWS Configuration
AWS_REGION=us-east-1

# ECR Configuration (replace with your account ID)
ECR_REGISTRY=123456789012.dkr.ecr.us-east-1.amazonaws.com
ECR_REPOSITORY_BACKEND=lms-backend
ECR_REPOSITORY_FRONTEND=lms-frontend
```

**Important replacements:**
- `CHANGE_THIS_STRONG_PASSWORD` - Use a strong password (e.g., `openssl rand -base64 32`)
- `CHANGE_THIS_TO_A_RANDOM_32_PLUS_CHARACTER_STRING` - Generate with `openssl rand -base64 48`
- `YOUR_EC2_PUBLIC_IP` - Your EC2 instance public IP
- `123456789012` - Your AWS account ID (get with `aws sts get-caller-identity`)
- Cloudinary credentials - Sign up at https://cloudinary.com
- Razorpay credentials - Sign up at https://razorpay.com

Save and exit: `Ctrl+X`, then `Y`, then `Enter`

---

## Step 6: Configure GitHub Secrets (5 minutes)

### 6.1 Get Your EC2 Private Key Content

**Mac/Linux:**
```bash
cat lms-production-key.pem
```

**Windows:**
```powershell
Get-Content lms-production-key.pem
```

Copy the entire output (including `-----BEGIN RSA PRIVATE KEY-----` and `-----END RSA PRIVATE KEY-----`)

### 6.2 Add Secrets to GitHub

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** for each of these:

| Secret Name | Value | Where to Get It |
|-------------|-------|-----------------|
| `AWS_ACCESS_KEY_ID` | Your IAM user access key | From Step 3.3 |
| `AWS_SECRET_ACCESS_KEY` | Your IAM user secret key | From Step 3.3 |
| `EC2_SSH_PRIVATE_KEY` | Content of .pem file | From Step 6.1 |
| `EC2_HOST` | Your EC2 public IP | From Step 4.3 |
| `EC2_USER` | `ubuntu` | Default for Ubuntu |
| `VITE_BACKEND_URL` | `http://YOUR_EC2_IP/api/v1` | Replace with your IP |

### 6.3 Verify Secrets

After adding all secrets, you should see 6 secrets listed.

---

## Step 7: Update GitHub Actions Workflow (2 minutes)

The workflow file is already created at `.github/workflows/deploy.yml`. We just need to verify it's correct.

### 7.1 Check AWS Region

Open `.github/workflows/deploy.yml` and verify:

```yaml
env:
  AWS_REGION: us-east-1  # Change if you used a different region
```

### 7.2 Commit and Push

```bash
git add .github/workflows/deploy.yml
git commit -m "Configure GitHub Actions for AWS deployment"
git push origin main
```

---

## Step 8: First Deployment (5 minutes)

### 8.1 Trigger Deployment

The push in Step 7.2 will automatically trigger the deployment!

### 8.2 Monitor Deployment

1. Go to your GitHub repository
2. Click the **Actions** tab
3. You should see a workflow running: "Deploy to AWS"
4. Click on it to see the progress

The workflow will:
1. ✅ Run tests
2. ✅ Build Docker images
3. ✅ Push to ECR
4. ✅ Deploy to EC2
5. ✅ Verify health

This takes about 5-10 minutes for the first deployment.

### 8.3 Watch for Success

Wait for all steps to show green checkmarks ✅

If any step fails, click on it to see the error logs.

---

## Step 9: Verify Deployment (2 minutes)

### 9.1 Test Health Endpoints

```bash
# Test frontend health
curl http://YOUR_EC2_PUBLIC_IP/health

# Test backend health
curl http://YOUR_EC2_PUBLIC_IP/api/health
```

Both should return `200 OK` and "healthy" message.

### 9.2 Access Application

Open in your browser:
- **Frontend**: `http://YOUR_EC2_PUBLIC_IP`
- **API**: `http://YOUR_EC2_PUBLIC_IP/api/v1`

You should see your LMS platform running! 🎉

### 9.3 Check Containers on EC2

```bash
ssh -i lms-production-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
cd /home/ubuntu/lms
docker-compose ps
```

You should see all containers running:
- lms-mongodb
- lms-backend
- lms-frontend
- lms-nginx

---

## 🎉 Success! Your CI/CD Pipeline is Live!

### What Happens Now?

Every time you push to the `main` branch:
1. GitHub Actions automatically runs tests
2. Builds new Docker images
3. Pushes to AWS ECR
4. Deploys to your EC2 instance
5. Verifies the deployment

**Zero manual work required!**

---

## 🔄 Making Changes

### To Deploy Changes:

```bash
# Make your code changes
git add .
git commit -m "Your change description"
git push origin main

# GitHub Actions automatically deploys!
```

### To Monitor Deployments:

1. Go to GitHub → Actions tab
2. See all deployment history
3. Click any deployment to see logs

---

## 🔒 Next Steps (Optional but Recommended)

### 1. Setup SSL/HTTPS

```bash
# SSH to EC2
ssh -i lms-production-key.pem ubuntu@YOUR_EC2_PUBLIC_IP

# Install Certbot
sudo apt install certbot -y

# Get SSL certificate (replace with your domain)
sudo certbot certonly --standalone -d your-domain.com

# Follow the prompts
```

Then update nginx configuration to use SSL.

### 2. Setup Custom Domain

1. Buy a domain (Namecheap, GoDaddy, etc.)
2. Point A record to your EC2 IP
3. Update environment variables with domain
4. Get SSL certificate for domain

### 3. Setup Monitoring

1. Enable CloudWatch on EC2
2. Create alarms for:
   - CPU usage > 80%
   - Disk usage > 80%
   - Memory usage > 80%

### 4. Setup Automated Backups

```bash
# Create backup script
cat > /home/ubuntu/backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
docker exec lms-mongodb mongodump --out /data/backup-$DATE --authenticationDatabase admin -u admin -p YOUR_PASSWORD
docker cp lms-mongodb:/data/backup-$DATE /home/ubuntu/backups/
aws s3 cp /home/ubuntu/backups/backup-$DATE s3://your-backup-bucket/ --recursive
EOF

chmod +x /home/ubuntu/backup.sh

# Add to crontab (daily at 2 AM)
(crontab -l 2>/dev/null; echo "0 2 * * * /home/ubuntu/backup.sh") | crontab -
```

---

## 🐛 Troubleshooting

### Deployment Failed in GitHub Actions

**Check the logs:**
1. Go to Actions tab
2. Click on failed workflow
3. Click on failed step
4. Read error message

**Common issues:**
- Wrong AWS credentials → Check GitHub secrets
- ECR login failed → Verify IAM permissions
- SSH failed → Check EC2_SSH_PRIVATE_KEY secret
- Health check failed → Check application logs on EC2

### Application Not Accessible

```bash
# SSH to EC2
ssh -i lms-production-key.pem ubuntu@YOUR_EC2_PUBLIC_IP

# Check containers
docker-compose ps

# Check logs
docker-compose logs -f

# Restart if needed
docker-compose restart
```

### 502 Bad Gateway

```bash
# Check backend
docker-compose logs backend

# Restart backend
docker-compose restart backend
```

### Database Connection Issues

```bash
# Check MongoDB
docker-compose logs mongodb

# Verify environment variables
docker exec lms-backend env | grep MONGO_URI
```

---

## 📊 Monitoring Your Application

### View Logs

```bash
# SSH to EC2
ssh -i lms-production-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
cd /home/ubuntu/lms

# All logs
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Check Resource Usage

```bash
# Container stats
docker stats

# Disk usage
df -h

# Memory usage
free -m
```

### View Deployment History

1. Go to GitHub → Actions
2. See all past deployments
3. Click any to see details

---

## 💰 Cost Management

### Current Setup Cost

- EC2 t3.medium: ~$30-35/month
- EBS 30GB: ~$3/month
- Data transfer: ~$5-10/month
- ECR storage: ~$0.20/month
- **Total: ~$40-50/month**

### Cost Optimization

1. **Use Reserved Instances** (save up to 72%)
2. **Stop instance when not needed** (development)
3. **Use auto-scaling** (scale down at night)
4. **Monitor with AWS Cost Explorer**

---

## ✅ Deployment Checklist

- [x] AWS CLI configured
- [x] ECR repositories created
- [x] IAM user created for GitHub Actions
- [x] EC2 instance launched
- [x] Docker installed on EC2
- [x] Environment variables configured
- [x] GitHub secrets added
- [x] First deployment successful
- [x] Application accessible
- [ ] SSL/HTTPS configured (optional)
- [ ] Custom domain configured (optional)
- [ ] Monitoring setup (optional)
- [ ] Automated backups (optional)

---

## 🎓 What You've Accomplished

✅ Production-ready AWS infrastructure  
✅ Automated CI/CD pipeline  
✅ Zero-downtime deployments  
✅ Automatic testing before deployment  
✅ Docker containerization  
✅ Nginx reverse proxy  
✅ Security best practices  
✅ Scalable architecture  

**Congratulations!** 🎉 Your LMS platform is now running on AWS with automated deployments!

---

## 📚 Additional Resources

- [AWS EC2 Documentation](https://docs.aws.amazon.com/ec2/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Documentation](https://docs.docker.com/)
- [Nginx Documentation](https://nginx.org/en/docs/)

## 🆘 Need Help?

- Check logs: `docker-compose logs -f`
- Review GitHub Actions logs
- Check [AWS-DEPLOYMENT-GUIDE.md](./AWS-DEPLOYMENT-GUIDE.md)
- Open GitHub issue

---

**Your LMS platform is live! Every push to main automatically deploys to AWS!** 🚀
