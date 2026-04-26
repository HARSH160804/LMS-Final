# My LMS Deployment Information

**Date**: April 27, 2026  
**AWS Account**: 055392178569  
**Region**: us-east-1

---

## ✅ Step 1: ECR Repositories - COMPLETED

### Backend Repository
- **Name**: lms-backend
- **URI**: `055392178569.dkr.ecr.us-east-1.amazonaws.com/lms-backend`
- **ARN**: arn:aws:ecr:us-east-1:055392178569:repository/lms-backend
- **Status**: ✅ Created

### Frontend Repository
- **Name**: lms-frontend
- **URI**: `055392178569.dkr.ecr.us-east-1.amazonaws.com/lms-frontend`
- **ARN**: arn:aws:ecr:us-east-1:055392178569:repository/lms-frontend
- **Status**: ✅ Created

---

## 📋 Step 2: Create IAM User for GitHub Actions

### Instructions:

1. Go to [IAM Console](https://console.aws.amazon.com/iam/)
2. Click **Users** → **Create user**
3. Username: `github-actions-lms`
4. Click **Next**
5. Select **Attach policies directly**
6. Add these policies:
   - ✅ `AmazonEC2ContainerRegistryPowerUser`
   - ✅ `AmazonEC2ReadOnlyAccess`
7. Click **Create user**
8. Click on the user → **Security credentials**
9. Click **Create access key** → **Command Line Interface (CLI)**
10. **SAVE THESE VALUES** (you won't see them again):

```
Access Key ID: _________________________________
Secret Access Key: _________________________________
```

---

## 📋 Step 3: Launch EC2 Instance

### Instructions:

1. Go to [EC2 Console](https://console.aws.amazon.com/ec2/)
2. Click **Launch Instance**

### Configuration:

**Name and tags:**
- Name: `lms-production`

**Application and OS Images:**
- AMI: **Ubuntu Server 22.04 LTS (HVM), SSD Volume Type**
- Architecture: **64-bit (x86)**

**Instance type:**
- Select: **t3.medium** (2 vCPU, 4 GB RAM)
- Cost: ~$30-35/month
- For testing: **t2.micro** (free tier eligible, but slower)

**Key pair:**
- Click **Create new key pair**
- Name: `lms-production-key`
- Type: **RSA**
- Format: **.pem** (Mac/Linux) or **.ppk** (Windows)
- Click **Create key pair**
- **SAVE THE FILE!** Location: _________________________________

**Network settings:**
- Click **Edit**
- Auto-assign public IP: **Enable**
- Firewall: **Create security group**
- Security group name: `lms-production-sg`

**Security group rules:**
1. SSH - Port 22 - Source: My IP
2. HTTP - Port 80 - Source: Anywhere (0.0.0.0/0)
3. HTTPS - Port 443 - Source: Anywhere (0.0.0.0/0)

**Storage:**
- Size: **30 GB**
- Volume type: **gp3**

### After Launch:

**EC2 Public IP**: _________________________________

---

## 📋 Step 4: Configure EC2 Instance

### Connect to EC2:

```bash
chmod 400 lms-production-key.pem
ssh -i lms-production-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

### Install Docker:

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

# Logout and login again
exit
```

### Reconnect and verify:

```bash
ssh -i lms-production-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
docker --version
docker-compose --version
aws --version
```

### Configure AWS on EC2:

```bash
aws configure
# Enter your AWS credentials (same as local)
```

### Create application directory:

```bash
mkdir -p /home/ubuntu/lms
cd /home/ubuntu/lms
```

### Create .env file:

```bash
nano .env
```

**Paste this content (replace values):**

```env
# MongoDB Configuration
MONGO_URI=mongodb://admin:CHANGE_THIS_PASSWORD@mongodb:27017/lms?authSource=admin
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=CHANGE_THIS_PASSWORD

# JWT Configuration (generate: openssl rand -base64 48)
JWT_SECRET=CHANGE_THIS_TO_RANDOM_STRING_MIN_32_CHARS
JWT_EXPIRES_IN=7d

# Cloudinary Configuration (get from https://cloudinary.com)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Razorpay Configuration (get from https://razorpay.com)
RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret

# CORS Configuration
CLIENT_URL=http://YOUR_EC2_PUBLIC_IP

# Frontend Configuration
VITE_BACKEND_URL=http://YOUR_EC2_PUBLIC_IP/api/v1

# AWS Configuration
AWS_REGION=us-east-1

# ECR Configuration
ECR_REGISTRY=055392178569.dkr.ecr.us-east-1.amazonaws.com
ECR_REPOSITORY_BACKEND=lms-backend
ECR_REPOSITORY_FRONTEND=lms-frontend
```

**Generate secure passwords:**

```bash
# MongoDB password
openssl rand -base64 32

# JWT secret
openssl rand -base64 48
```

Save and exit: `Ctrl+X`, `Y`, `Enter`

---

## 📋 Step 5: Configure GitHub Secrets

### Go to GitHub:

1. Open your repository: https://github.com/HARSH160804/LMS-Final
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** for each:

### Secrets to Add:

| Secret Name | Value | Where to Get |
|-------------|-------|--------------|
| `AWS_ACCESS_KEY_ID` | From Step 2 | IAM user access key |
| `AWS_SECRET_ACCESS_KEY` | From Step 2 | IAM user secret key |
| `EC2_SSH_PRIVATE_KEY` | Content of .pem file | Open lms-production-key.pem and copy ALL content |
| `EC2_HOST` | Your EC2 public IP | From Step 3 |
| `EC2_USER` | `ubuntu` | Default for Ubuntu |
| `VITE_BACKEND_URL` | `http://YOUR_EC2_IP/api/v1` | Replace with your EC2 IP |

### Get Private Key Content:

```bash
cat lms-production-key.pem
```

Copy the entire output including:
```
-----BEGIN RSA PRIVATE KEY-----
...
-----END RSA PRIVATE KEY-----
```

---

## 📋 Step 6: Deploy!

### Trigger Deployment:

```bash
git add .
git commit -m "Trigger AWS deployment"
git push origin main
```

### Monitor Deployment:

1. Go to: https://github.com/HARSH160804/LMS-Final/actions
2. Watch the "Deploy to AWS" workflow
3. Wait for all steps to complete (5-10 minutes)

### Verify Deployment:

```bash
# Test health endpoints
curl http://YOUR_EC2_PUBLIC_IP/health
curl http://YOUR_EC2_PUBLIC_IP/api/health

# Both should return 200 OK
```

### Access Application:

- **Frontend**: http://YOUR_EC2_PUBLIC_IP
- **API**: http://YOUR_EC2_PUBLIC_IP/api/v1

---

## 📊 Deployment Checklist

- [x] AWS CLI configured
- [x] ECR repositories created
- [ ] IAM user created for GitHub Actions
- [ ] EC2 instance launched
- [ ] Docker installed on EC2
- [ ] Environment variables configured on EC2
- [ ] GitHub secrets added
- [ ] First deployment triggered
- [ ] Application accessible

---

## 🔑 Important Credentials (Keep Secure!)

### AWS
- Account ID: 055392178569
- Region: us-east-1
- IAM User: github-actions-lms
- Access Key ID: _________________________________
- Secret Access Key: _________________________________

### EC2
- Instance ID: _________________________________
- Public IP: _________________________________
- Key Pair: lms-production-key.pem
- Security Group: lms-production-sg

### Application
- MongoDB Password: _________________________________
- JWT Secret: _________________________________

### External Services
- Cloudinary Cloud Name: _________________________________
- Cloudinary API Key: _________________________________
- Razorpay Key ID: _________________________________

---

## 🆘 Troubleshooting

### Can't SSH to EC2
```bash
chmod 400 lms-production-key.pem
ssh -i lms-production-key.pem ubuntu@YOUR_EC2_IP
```

### GitHub Actions Failing
- Check secrets are correct
- Verify EC2 is running
- Check EC2 security group allows SSH from GitHub IPs

### Application Not Accessible
```bash
# SSH to EC2
ssh -i lms-production-key.pem ubuntu@YOUR_EC2_IP
cd /home/ubuntu/lms

# Check containers
docker-compose ps

# Check logs
docker-compose logs -f
```

---

## 📞 Support

- **Setup Guide**: [SETUP-GUIDE-OPTION-1.md](./SETUP-GUIDE-OPTION-1.md)
- **Checklist**: [DEPLOYMENT-CHECKLIST.md](./DEPLOYMENT-CHECKLIST.md)
- **AWS Guide**: [AWS-DEPLOYMENT-GUIDE.md](./AWS-DEPLOYMENT-GUIDE.md)

---

**Next Step**: Create IAM user for GitHub Actions (Step 2 above)
