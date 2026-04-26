# AWS Deployment Checklist - Option 1: Automated CI/CD

Use this checklist to track your deployment progress. Estimated time: 30-40 minutes.

---

## ☑️ Pre-Deployment Setup

### Local Machine Setup
- [ ] AWS CLI installed (`aws --version`)
- [ ] AWS CLI configured (`aws configure`)
- [ ] Git installed and repository cloned
- [ ] SSH client available (Terminal/PuTTY)

### AWS Account Setup
- [ ] AWS account created and verified
- [ ] Credit card added (for billing)
- [ ] IAM user with admin access created
- [ ] AWS credentials saved securely

---

## ☑️ Step 1: AWS ECR Repositories (5 min)

- [ ] Logged into AWS CLI (`aws sts get-caller-identity`)
- [ ] Created `lms-backend` ECR repository
- [ ] Created `lms-frontend` ECR repository
- [ ] Saved ECR repository URIs
- [ ] Noted AWS Account ID

**Commands:**
```bash
aws ecr create-repository --repository-name lms-backend --region us-east-1
aws ecr create-repository --repository-name lms-frontend --region us-east-1
```

**Save these values:**
- Backend URI: `_________________________________`
- Frontend URI: `_________________________________`
- AWS Account ID: `_________________________________`

---

## ☑️ Step 2: IAM User for GitHub Actions (5 min)

- [ ] Created IAM user `github-actions-lms`
- [ ] Attached `AmazonEC2ContainerRegistryPowerUser` policy
- [ ] Attached `AmazonEC2ReadOnlyAccess` policy
- [ ] Created access key for CLI
- [ ] Saved Access Key ID
- [ ] Saved Secret Access Key

**Save these values:**
- Access Key ID: `_________________________________`
- Secret Access Key: `_________________________________`

---

## ☑️ Step 3: EC2 Instance Launch (10 min)

### Instance Configuration
- [ ] Opened EC2 Console
- [ ] Clicked "Launch Instance"
- [ ] Named instance: `lms-production`
- [ ] Selected Ubuntu Server 22.04 LTS
- [ ] Selected instance type: `t3.medium` (or `t2.micro` for testing)

### Key Pair
- [ ] Created new key pair: `lms-production-key`
- [ ] Downloaded .pem file
- [ ] Saved .pem file securely
- [ ] Set permissions: `chmod 400 lms-production-key.pem` (Mac/Linux)

### Security Group
- [ ] Created security group: `lms-production-sg`
- [ ] Added SSH rule (port 22) - My IP
- [ ] Added HTTP rule (port 80) - Anywhere
- [ ] Added HTTPS rule (port 443) - Anywhere

### Storage
- [ ] Set storage to 30 GB
- [ ] Selected gp3 volume type

### Launch
- [ ] Launched instance
- [ ] Waited for instance to start (2-3 minutes)
- [ ] Noted Public IPv4 address

**Save these values:**
- EC2 Public IP: `_________________________________`
- Key pair location: `_________________________________`

---

## ☑️ Step 4: EC2 Instance Configuration (10 min)

### Connect to EC2
- [ ] Connected via SSH: `ssh -i lms-production-key.pem ubuntu@YOUR_IP`
- [ ] Connection successful

### Install Docker
- [ ] Updated system: `sudo apt update && sudo apt upgrade -y`
- [ ] Installed Docker: `curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh`
- [ ] Added user to docker group: `sudo usermod -aG docker ubuntu`
- [ ] Installed Docker Compose
- [ ] Installed AWS CLI: `sudo apt install awscli -y`
- [ ] Logged out and back in
- [ ] Verified Docker: `docker --version`
- [ ] Verified Docker Compose: `docker-compose --version`
- [ ] Verified AWS CLI: `aws --version`

### Configure AWS on EC2
- [ ] Ran `aws configure` on EC2
- [ ] Entered AWS credentials
- [ ] Verified: `aws sts get-caller-identity`

### Create Application Directory
- [ ] Created directory: `mkdir -p /home/ubuntu/lms`
- [ ] Changed to directory: `cd /home/ubuntu/lms`

### Create Environment File
- [ ] Created .env file: `nano .env`
- [ ] Generated strong MongoDB password
- [ ] Generated strong JWT secret (32+ characters)
- [ ] Added Cloudinary credentials
- [ ] Added Razorpay credentials
- [ ] Updated EC2 IP in CLIENT_URL
- [ ] Updated EC2 IP in VITE_BACKEND_URL
- [ ] Updated AWS Account ID in ECR_REGISTRY
- [ ] Saved and exited

**Environment Variables Configured:**
- [ ] MONGO_URI
- [ ] MONGO_ROOT_USERNAME
- [ ] MONGO_ROOT_PASSWORD
- [ ] JWT_SECRET
- [ ] JWT_EXPIRES_IN
- [ ] CLOUDINARY_CLOUD_NAME
- [ ] CLOUDINARY_API_KEY
- [ ] CLOUDINARY_API_SECRET
- [ ] RAZORPAY_KEY_ID
- [ ] RAZORPAY_KEY_SECRET
- [ ] CLIENT_URL
- [ ] VITE_BACKEND_URL
- [ ] ECR_REGISTRY
- [ ] ECR_REPOSITORY_BACKEND
- [ ] ECR_REPOSITORY_FRONTEND

---

## ☑️ Step 5: GitHub Secrets Configuration (5 min)

### Get Private Key Content
- [ ] Opened .pem file locally
- [ ] Copied entire content (including BEGIN/END lines)

### Add Secrets to GitHub
- [ ] Opened GitHub repository
- [ ] Went to Settings → Secrets and variables → Actions
- [ ] Added `AWS_ACCESS_KEY_ID`
- [ ] Added `AWS_SECRET_ACCESS_KEY`
- [ ] Added `EC2_SSH_PRIVATE_KEY`
- [ ] Added `EC2_HOST`
- [ ] Added `EC2_USER` (value: `ubuntu`)
- [ ] Added `VITE_BACKEND_URL`
- [ ] Verified all 6 secrets are listed

**GitHub Secrets Added:**
- [ ] AWS_ACCESS_KEY_ID
- [ ] AWS_SECRET_ACCESS_KEY
- [ ] EC2_SSH_PRIVATE_KEY
- [ ] EC2_HOST
- [ ] EC2_USER
- [ ] VITE_BACKEND_URL

---

## ☑️ Step 6: GitHub Actions Workflow (2 min)

- [ ] Verified `.github/workflows/deploy.yml` exists
- [ ] Checked AWS_REGION matches your region
- [ ] Committed any changes
- [ ] Pushed to main branch

---

## ☑️ Step 7: First Deployment (5-10 min)

### Trigger Deployment
- [ ] Pushed code to main branch
- [ ] Opened GitHub → Actions tab
- [ ] Saw "Deploy to AWS" workflow running

### Monitor Progress
- [ ] Watched "Test" job complete
- [ ] Watched "Build and Push" job complete
- [ ] Watched "Deploy" job complete
- [ ] Watched "Notify" job complete
- [ ] All jobs showed green checkmarks ✅

**Deployment Status:**
- [ ] Tests passed
- [ ] Docker images built
- [ ] Images pushed to ECR
- [ ] Deployed to EC2
- [ ] Health checks passed

---

## ☑️ Step 8: Verify Deployment (2 min)

### Test Health Endpoints
- [ ] Tested frontend: `curl http://YOUR_IP/health` → 200 OK
- [ ] Tested backend: `curl http://YOUR_IP/api/health` → 200 OK

### Access Application
- [ ] Opened `http://YOUR_IP` in browser
- [ ] Frontend loaded successfully
- [ ] Can navigate pages
- [ ] API requests working

### Check Containers on EC2
- [ ] SSH'd to EC2
- [ ] Ran `docker-compose ps`
- [ ] All containers running:
  - [ ] lms-mongodb
  - [ ] lms-backend
  - [ ] lms-frontend
  - [ ] lms-nginx

---

## ☑️ Post-Deployment Verification

### Functional Testing
- [ ] Can access homepage
- [ ] Can sign up new user
- [ ] Can log in
- [ ] Can browse courses
- [ ] Can view course details
- [ ] Instructor dashboard works
- [ ] Can create course (instructor)
- [ ] Can upload media (Cloudinary)
- [ ] Can enroll in course
- [ ] Can view course content
- [ ] Progress tracking works

### Technical Verification
- [ ] All containers healthy: `docker-compose ps`
- [ ] No errors in logs: `docker-compose logs`
- [ ] MongoDB connected
- [ ] Cloudinary uploads working
- [ ] API responses correct
- [ ] Frontend routing works

---

## ☑️ Optional: Production Enhancements

### SSL/HTTPS Setup
- [ ] Purchased/configured domain name
- [ ] Pointed A record to EC2 IP
- [ ] Installed Certbot on EC2
- [ ] Obtained SSL certificate
- [ ] Updated nginx configuration
- [ ] Enabled HTTPS in nginx
- [ ] Tested HTTPS access
- [ ] Setup auto-renewal cron job

### Monitoring Setup
- [ ] Enabled CloudWatch on EC2
- [ ] Created CPU usage alarm (>80%)
- [ ] Created disk usage alarm (>80%)
- [ ] Created memory usage alarm (>80%)
- [ ] Setup SNS notifications
- [ ] Tested alarms

### Backup Setup
- [ ] Created S3 bucket for backups
- [ ] Created backup script
- [ ] Tested backup script
- [ ] Setup cron job for daily backups
- [ ] Verified backups in S3
- [ ] Tested restore process

### Security Hardening
- [ ] Changed default MongoDB password
- [ ] Rotated JWT secret
- [ ] Setup fail2ban on EC2
- [ ] Enabled AWS GuardDuty
- [ ] Setup AWS WAF (if using ALB)
- [ ] Reviewed security group rules
- [ ] Enabled MFA on AWS account
- [ ] Setup AWS CloudTrail

---

## 🎉 Deployment Complete!

### What You've Achieved:

✅ **Infrastructure**
- EC2 instance running Ubuntu 22.04
- Docker and Docker Compose installed
- Nginx reverse proxy configured
- MongoDB database running

✅ **CI/CD Pipeline**
- Automated testing on every push
- Automatic Docker image builds
- Automatic deployment to EC2
- Health check verification

✅ **Application**
- Frontend (React) running
- Backend (Node.js) running
- Database (MongoDB) running
- All services containerized

✅ **Security**
- Security groups configured
- Non-root Docker containers
- Environment variables secured
- Rate limiting enabled

### Next Push Automatically Deploys!

Every time you push to `main`:
1. Tests run automatically
2. Docker images build
3. Images push to ECR
4. Application deploys to EC2
5. Health checks verify deployment

**Zero manual work required!** 🚀

---

## 📊 Deployment Summary

**Total Time Spent:** _______ minutes

**Services Running:**
- Frontend: http://YOUR_IP
- Backend API: http://YOUR_IP/api/v1
- Health Check: http://YOUR_IP/health

**Monthly Cost:** ~$40-50

**Deployment Method:** Automated CI/CD via GitHub Actions

**Status:** ✅ Production Ready

---

## 📝 Important Information to Save

### AWS Resources
- EC2 Instance ID: `_________________________________`
- EC2 Public IP: `_________________________________`
- Security Group ID: `_________________________________`
- ECR Backend URI: `_________________________________`
- ECR Frontend URI: `_________________________________`

### Credentials (Store Securely!)
- MongoDB Password: `_________________________________`
- JWT Secret: `_________________________________`
- AWS Access Key ID: `_________________________________`
- EC2 Key Pair Location: `_________________________________`

### URLs
- Application: `http://_________________________________`
- API: `http://_________________________________/api/v1`
- GitHub Actions: `https://github.com/YOUR_USERNAME/YOUR_REPO/actions`

---

## 🆘 Troubleshooting Checklist

If something goes wrong:

- [ ] Checked GitHub Actions logs
- [ ] Checked EC2 container logs: `docker-compose logs -f`
- [ ] Verified all GitHub secrets are correct
- [ ] Verified .env file on EC2 is correct
- [ ] Checked security group rules
- [ ] Verified EC2 instance is running
- [ ] Checked disk space: `df -h`
- [ ] Checked memory: `free -m`
- [ ] Restarted containers: `docker-compose restart`
- [ ] Reviewed [SETUP-GUIDE-OPTION-1.md](./SETUP-GUIDE-OPTION-1.md)

---

**Congratulations on your successful deployment!** 🎉

For detailed instructions, see [SETUP-GUIDE-OPTION-1.md](./SETUP-GUIDE-OPTION-1.md)
