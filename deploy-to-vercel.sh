#!/bin/bash

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║        PARING Authentication System - Vercel Deployment     ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if we're in the right directory
if [ ! -f "backend/vercel.json" ] && [ ! -d "backend" ]; then
    echo -e "${RED}✗ Error: Please run this script from /paring directory${NC}"
    exit 1
fi

echo -e "${YELLOW}Step 1: Deploying Backend to Vercel...${NC}"
echo ""

cd backend

# Check if already deployed
if [ -f ".vercel/project.json" ]; then
    echo -e "${GREEN}✓ Backend already has Vercel configuration${NC}"
    cat .vercel/project.json
    echo ""
else
    echo -e "${YELLOW}No Vercel configuration found. Creating new project...${NC}"
fi

# Build backend
echo -e "${YELLOW}Building backend...${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Backend build failed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Backend build successful${NC}"
echo ""

# Deploy backend
echo -e "${YELLOW}Deploying backend to Vercel...${NC}"
echo ""
echo "Note: When prompted:"
echo "  - Link to existing project? No (unless you want to link to existing)"
echo "  - Project name? backend (or your choice)"
echo "  - Which directory? Current directory (./)"
echo "  - Override settings? No"
echo ""

npx vercel deploy --prod --yes 2>&1 | tee backend_deploy.log

if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Backend deployment may have issues${NC}"
    echo "Check backend_deploy.log for details"
else
    echo -e "${GREEN}✓ Backend deployed${NC}"
fi

BACKEND_URL=$(grep "https://" backend_deploy.log | head -1 | tr -d ' ')

echo ""
echo -e "${YELLOW}Step 2: Deploying Frontend to Vercel...${NC}"
echo ""

cd ../web

# Build frontend
echo -e "${YELLOW}Building frontend...${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Frontend build failed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Frontend build successful${NC}"
echo ""

# Create .vercel directory if needed
if [ ! -d ".vercel" ]; then
    mkdir -p .vercel
fi

# Deploy frontend
echo -e "${YELLOW}Deploying frontend to Vercel...${NC}"
echo ""
echo "Note: When prompted:"
echo "  - Link to existing project? No (unless you want to link to existing)"
echo "  - Project name? web (or your choice)"
echo "  - Which directory? Current directory (./)"
echo "  - Override settings? No"
echo ""

npx vercel deploy --prod --yes 2>&1 | tee web_deploy.log

if [ $? -ne 0 ]; then
    echo -e "${RED}✗ Frontend deployment may have issues${NC}"
    echo "Check web_deploy.log for details"
else
    echo -e "${GREEN}✓ Frontend deployed${NC}"
fi

FRONTEND_URL=$(grep "https://" web_deploy.log | head -1 | tr -d ' ')

echo ""
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}Deployment Summary${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${GREEN}Backend URL:${NC}  $BACKEND_URL"
echo -e "${GREEN}Frontend URL:${NC} $FRONTEND_URL"
echo ""

echo -e "${YELLOW}Important Next Steps:${NC}"
echo "1. Set environment variables in Vercel Dashboard:"
echo "   Backend:"
echo "     - DATABASE_URL"
echo "     - JWT_SECRET"
echo "     - IS_PRODUCTION=true"
echo "     - MIDTRANS settings"
echo ""
echo "   Frontend:"
echo "     - NEXT_PUBLIC_API_URL=$BACKEND_URL"
echo ""
echo "2. Update backend CORS to allow frontend domain:"
echo "     - Redeploy backend after CORS changes"
echo ""
echo "3. Test deployments:"
echo "     - Backend: curl $BACKEND_URL/"
echo "     - Frontend: Visit $FRONTEND_URL"
echo ""
echo "4. Complete user flow test:"
echo "     - Register a new user"
echo "     - Login"
echo "     - Access protected routes"
echo ""

echo -e "${GREEN}✓ Deployment script complete!${NC}"
echo ""
echo "See VERCEL_DEPLOYMENT_GUIDE.md for detailed instructions"
