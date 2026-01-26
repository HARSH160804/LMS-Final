#!/bin/bash

# Verification script for repository structure
# Run this to verify your repo is ready for deployment

echo "🔍 Verifying Repository Structure..."
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check function
check() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
        exit 1
    fi
}

# Check if we're in a git repository
git rev-parse --git-dir > /dev/null 2>&1
check $? "Git repository initialized"

# Check for backend folder
[ -d "backend" ]
check $? "backend/ folder exists"

# Check for frontend folder
[ -d "frontend" ]
check $? "frontend/ folder exists"

# Check for backend package.json
[ -f "backend/package.json" ]
check $? "backend/package.json exists"

# Check for frontend package.json
[ -f "frontend/package.json" ]
check $? "frontend/package.json exists"

# Check for backend entry file
[ -f "backend/index.js" ]
check $? "backend/index.js exists"

# Check for frontend entry file
[ -f "frontend/src/main.jsx" ]
check $? "frontend/src/main.jsx exists"

# Check for root .gitignore
[ -f ".gitignore" ]
check $? ".gitignore exists at root"

# Check for README
[ -f "README.md" ]
check $? "README.md exists at root"

# Check if .env is gitignored
grep -q "\.env" .gitignore
check $? ".env is in .gitignore"

# Check if node_modules is gitignored
grep -q "node_modules" .gitignore
check $? "node_modules is in .gitignore"

# Check for commits
git log --oneline > /dev/null 2>&1
check $? "Git commits exist"

# Check backend start script
grep -q '"start".*"node index.js"' backend/package.json
check $? "Backend has production start script"

# Check if PORT uses environment variable
grep -q "process.env.PORT" backend/index.js
check $? "Backend uses process.env.PORT"

# Check for health endpoint
grep -q "/api/health" backend/index.js
check $? "Backend has health check endpoint"

echo ""
echo "=================================================="
echo -e "${GREEN}✅ All checks passed!${NC}"
echo "=================================================="
echo ""
echo "📁 Repository Structure:"
echo "   ├── backend/     (Express.js API)"
echo "   ├── frontend/    (React App)"
echo "   ├── .gitignore"
echo "   └── README.md"
echo ""
echo "🎯 Next Steps:"
echo "   1. Push to GitHub (see GITHUB-SETUP.md)"
echo "   2. Deploy backend on Render"
echo "   3. Deploy frontend on Vercel"
echo ""
echo "📚 Documentation:"
echo "   • GitHub Setup: GITHUB-SETUP.md"
echo "   • Backend Deploy: backend/RENDER-DEPLOYMENT.md"
echo "   • Frontend Deploy: frontend/DEPLOY.md"
echo ""
