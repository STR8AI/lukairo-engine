#!/bin/bash
# LUKAIRO ENGINE - Pre-Deployment Verification Script
# Run this before deploying to ensure everything is ready

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔍 LUKAIRO ENGINE - Pre-Deployment Verification${NC}"
echo "================================================"
echo ""

ERRORS=0
WARNINGS=0

# Check 1: Verify cf-pages directory exists and has content
echo -n "✓ Checking cf-pages directory... "
if [ -d "cf-pages" ] && [ "$(ls -A cf-pages 2>/dev/null)" ]; then
    echo -e "${GREEN}OK${NC}"
else
    echo -e "${RED}FAILED${NC}"
    echo "  cf-pages directory is missing or empty"
    ERRORS=$((ERRORS + 1))
fi

# Check 2: Verify essential files in cf-pages
echo -n "✓ Checking cf-pages/index.html... "
if [ -f "cf-pages/index.html" ]; then
    echo -e "${GREEN}OK${NC}"
else
    echo -e "${RED}FAILED${NC}"
    echo "  cf-pages/index.html is missing"
    ERRORS=$((ERRORS + 1))
fi

# Check 3: Verify workers directory
echo -n "✓ Checking workers directory... "
if [ -d "workers" ]; then
    echo -e "${GREEN}OK${NC}"
else
    echo -e "${YELLOW}WARNING${NC}"
    echo "  workers directory is missing (optional)"
    WARNINGS=$((WARNINGS + 1))
fi

# Check 4: Verify workers/app.ts
echo -n "✓ Checking workers/app.ts... "
if [ -f "workers/app.ts" ]; then
    echo -e "${GREEN}OK${NC}"
else
    echo -e "${YELLOW}WARNING${NC}"
    echo "  workers/app.ts is missing (optional if not deploying workers)"
    WARNINGS=$((WARNINGS + 1))
fi

# Check 5: Verify wrangler is installed
echo -n "✓ Checking wrangler installation... "
if command -v wrangler &> /dev/null; then
    WRANGLER_VERSION=$(wrangler --version 2>&1 | head -1)
    echo -e "${GREEN}OK${NC} ($WRANGLER_VERSION)"
else
    echo -e "${YELLOW}WARNING${NC}"
    echo "  wrangler is not installed (will be installed during deployment)"
    WARNINGS=$((WARNINGS + 1))
fi

# Check 6: Verify Cloudflare authentication
echo -n "✓ Checking Cloudflare authentication... "
if command -v wrangler &> /dev/null && wrangler whoami &> /dev/null; then
    WHOAMI=$(wrangler whoami 2>&1 | grep -o "email.*" | head -1 || echo "Authenticated")
    echo -e "${GREEN}OK${NC} ($WHOAMI)"
else
    echo -e "${YELLOW}WARNING${NC}"
    echo "  Not authenticated with Cloudflare (will prompt during deployment)"
    WARNINGS=$((WARNINGS + 1))
fi

# Check 7: Verify assets directory
echo -n "✓ Checking assets directory... "
if [ -d "assets" ]; then
    echo -e "${GREEN}OK${NC}"
else
    echo -e "${YELLOW}WARNING${NC}"
    echo "  assets directory is missing (optional)"
    WARNINGS=$((WARNINGS + 1))
fi

# Check 8: Verify src directory
echo -n "✓ Checking src directory... "
if [ -d "src" ]; then
    echo -e "${GREEN}OK${NC}"
else
    echo -e "${YELLOW}WARNING${NC}"
    echo "  src directory is missing (optional)"
    WARNINGS=$((WARNINGS + 1))
fi

# Check 9: Verify deployment script
echo -n "✓ Checking deploy.sh... "
if [ -f "deploy.sh" ] && [ -x "deploy.sh" ]; then
    echo -e "${GREEN}OK${NC}"
elif [ -f "deploy.sh" ]; then
    echo -e "${YELLOW}WARNING${NC}"
    echo "  deploy.sh exists but is not executable. Run: chmod +x deploy.sh"
    WARNINGS=$((WARNINGS + 1))
else
    echo -e "${RED}FAILED${NC}"
    echo "  deploy.sh is missing"
    ERRORS=$((ERRORS + 1))
fi

# Check 10: Count files in cf-pages
FILE_COUNT=$(find cf-pages -type f | wc -l)
echo -n "✓ Checking cf-pages content... "
if [ "$FILE_COUNT" -gt 0 ]; then
    echo -e "${GREEN}OK${NC} ($FILE_COUNT files)"
else
    echo -e "${RED}FAILED${NC}"
    echo "  cf-pages directory is empty"
    ERRORS=$((ERRORS + 1))
fi

echo ""
echo "================================================"
echo ""

# Summary
if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed! Ready to deploy.${NC}"
    echo ""
    echo "Run './deploy.sh' to start deployment"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠️  Verification complete with $WARNINGS warning(s).${NC}"
    echo ""
    echo "You can proceed with deployment, but review the warnings above."
    echo "Run './deploy.sh' to start deployment"
    exit 0
else
    echo -e "${RED}❌ Verification failed with $ERRORS error(s) and $WARNINGS warning(s).${NC}"
    echo ""
    echo "Please fix the errors above before deploying."
    exit 1
fi
