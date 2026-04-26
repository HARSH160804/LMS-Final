# AWS CLI Configuration Instructions

## Step 1: Get Your AWS Credentials

Before configuring AWS CLI, you need your AWS credentials:

### Option A: If you already have an AWS account with credentials

1. Go to [AWS Console](https://console.aws.amazon.com/)
2. Click your username (top right) → **Security credentials**
3. Scroll to **Access keys**
4. If you have existing keys, use those
5. If not, click **Create access key** → **Command Line Interface (CLI)**

### Option B: If you need to create a new AWS account

1. Go to [AWS Sign Up](https://aws.amazon.com/)
2. Click **Create an AWS Account**
3. Follow the registration process (requires credit card)
4. After account creation, follow Option A above

## Step 2: Configure AWS CLI

Run this command in your terminal:

```bash
aws configure
```

You'll be prompted for 4 values:

### 1. AWS Access Key ID
```
AWS Access Key ID [None]: AKIAIOSFODNN7EXAMPLE
```
- Get this from AWS Console → Security credentials → Access keys
- Format: Starts with `AKIA...`
- Example: `AKIAIOSFODNN7EXAMPLE`

### 2. AWS Secret Access Key
```
AWS Secret Access Key [None]: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
```
- Get this from AWS Console (shown only once when creating key)
- Format: Long alphanumeric string
- Example: `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY`
- ⚠️ **IMPORTANT**: Save this securely! You can't retrieve it later.

### 3. Default Region Name
```
Default region name [None]: us-east-1
```
- Recommended: `us-east-1` (US East - N. Virginia)
- Other options:
  - `us-west-2` (US West - Oregon)
  - `eu-west-1` (Europe - Ireland)
  - `ap-south-1` (Asia Pacific - Mumbai)
  - See all regions: https://docs.aws.amazon.com/general/latest/gr/rande.html

### 4. Default Output Format
```
Default output format [None]: json
```
- Recommended: `json`
- Other options: `yaml`, `text`, `table`

## Step 3: Verify Configuration

After configuration, verify it works:

```bash
# Check your AWS identity
aws sts get-caller-identity
```

Expected output:
```json
{
    "UserId": "AIDACKCEVSQ6C2EXAMPLE",
    "Account": "123456789012",
    "Arn": "arn:aws:iam::123456789012:user/your-username"
}
```

If you see your account details, configuration is successful! ✅

## Step 4: Test AWS Access

```bash
# List ECR repositories (should return empty list if none exist)
aws ecr describe-repositories --region us-east-1
```

Expected output:
```json
{
    "repositories": []
}
```

## Troubleshooting

### Error: "Unable to locate credentials"
- Run `aws configure` again
- Make sure you entered the correct Access Key ID and Secret Access Key

### Error: "The security token included in the request is invalid"
- Your credentials are incorrect
- Go to AWS Console and create new access keys
- Run `aws configure` again with new credentials

### Error: "An error occurred (UnrecognizedClientException)"
- Your region might be wrong
- Run `aws configure` and set region to `us-east-1`

### Error: "Access Denied"
- Your IAM user doesn't have necessary permissions
- Go to AWS Console → IAM → Users → Your User
- Attach policy: `AdministratorAccess` (for full access)
- Or attach specific policies as needed

## Security Best Practices

1. **Never share your Secret Access Key**
2. **Don't commit credentials to Git**
3. **Use IAM users instead of root account**
4. **Enable MFA (Multi-Factor Authentication)**
5. **Rotate access keys regularly**
6. **Use least privilege principle** (only grant necessary permissions)

## What's Next?

After AWS CLI is configured, you can:

1. **Create ECR repositories** for Docker images
2. **Launch EC2 instance** for hosting
3. **Setup GitHub Actions** for CI/CD
4. **Deploy your application**

Follow the main deployment guide: [SETUP-GUIDE-OPTION-1.md](./SETUP-GUIDE-OPTION-1.md)

## Quick Reference

```bash
# Configure AWS CLI
aws configure

# Verify configuration
aws sts get-caller-identity

# Check current configuration
aws configure list

# Set specific values
aws configure set aws_access_key_id YOUR_KEY
aws configure set aws_secret_access_key YOUR_SECRET
aws configure set region us-east-1
aws configure set output json

# View configuration files
cat ~/.aws/credentials
cat ~/.aws/config
```

## Configuration Files Location

- **Credentials**: `~/.aws/credentials`
- **Config**: `~/.aws/config`

These files are created automatically when you run `aws configure`.

---

**Ready?** Run `aws configure` in your terminal now! 🚀
