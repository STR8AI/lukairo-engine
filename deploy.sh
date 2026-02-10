#!/bin/bash
# LUKAIRO ENGINE - Cloudflare Deployment Script
# This script helps deploy the application to Cloudflare Workers/Pages

set -e  # Exit on error

# Colors for better output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 LUKAIRO ENGINE - Cloudflare Deployment${NC}"
echo "========================================"
echo ""

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo -e "${YELLOW}⚠️  Wrangler is not installed.${NC}"
    echo "📦 Installing Wrangler globally..."
    npm install -g wrangler
    echo -e "${GREEN}✅ Wrangler installed successfully!${NC}"
    echo ""
fi

# Check if user is logged in
echo "🔐 Checking Cloudflare authentication..."
if ! wrangler whoami &> /dev/null; then
    echo -e "${YELLOW}⚠️  Not logged in to Cloudflare.${NC}"
    echo "🔑 Opening browser for authentication..."
    wrangler login
    echo -e "${GREEN}✅ Logged in successfully!${NC}"
    echo ""
else
    WHOAMI=$(wrangler whoami 2>&1 | grep "You are logged in" || echo "Authenticated")
    echo -e "${GREEN}✅ Already authenticated!${NC}"
    echo "$WHOAMI"
    echo ""
fi

# Display deployment options
echo "What would you like to deploy?"
echo ""
echo "  ${BLUE}1)${NC} Pages (Static Frontend)"
echo "     → Deploys the static site from cf-pages/"
echo "     → Includes: Neural Core, HTML pages, assets"
echo ""
echo "  ${BLUE}2)${NC} Workers (API Backend)"
echo "     → Deploys the Hono API from workers/"
echo "     → Includes: API endpoints, business logic"
echo ""
echo "  ${BLUE}3)${NC} Both (Full Stack)"
echo "     → Deploys both Pages and Workers"
echo "     → Complete application deployment"
echo ""
echo "  ${BLUE}4)${NC} Custom Pages Project Name"
echo "     → Deploy Pages with a custom project name"
echo ""
echo "  ${BLUE}5)${NC} Exit"
echo ""
read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        echo ""
        echo -e "${BLUE}📦 Deploying to Cloudflare Pages...${NC}"
        echo "Project name: lukairo-engine"
        echo "Source directory: cf-pages/"
        echo ""
        wrangler pages deploy cf-pages --project-name=lukairo-engine
        echo ""
        echo -e "${GREEN}✅ Pages deployed successfully!${NC}"
        echo ""
        echo "📊 View your deployment:"
        echo "   → Dashboard: https://dash.cloudflare.com"
        echo "   → URL: https://lukairo-engine.pages.dev"
        ;;
    2)
        echo ""
        echo -e "${BLUE}📦 Deploying Workers...${NC}"
        cd workers
        echo "Running: wrangler deploy"
        echo ""
        wrangler deploy
        cd ..
        echo ""
        echo -e "${GREEN}✅ Workers deployed successfully!${NC}"
        echo ""
        echo "📊 View your deployment:"
        echo "   → Dashboard: https://dash.cloudflare.com"
        ;;
    3)
        echo ""
        echo -e "${BLUE}📦 Deploying Full Stack Application...${NC}"
        echo ""
        echo "Step 1/2: Deploying Workers..."
        cd workers
        wrangler deploy
        cd ..
        echo -e "${GREEN}✅ Workers deployed!${NC}"
        echo ""
        echo "Step 2/2: Deploying Pages..."
        wrangler pages deploy cf-pages --project-name=lukairo-engine
        echo ""
        echo -e "${GREEN}✅ Full stack deployment complete!${NC}"
        echo ""
        echo "📊 View your deployments:"
        echo "   → Dashboard: https://dash.cloudflare.com"
        echo "   → Pages URL: https://lukairo-engine.pages.dev"
        ;;
    4)
        echo ""
        read -p "Enter custom project name: " project_name
        if [ -z "$project_name" ]; then
            echo -e "${RED}❌ Project name cannot be empty. Exiting.${NC}"
            exit 1
        fi
        echo ""
        echo -e "${BLUE}📦 Deploying to Cloudflare Pages...${NC}"
        echo "Project name: $project_name"
        echo "Source directory: cf-pages/"
        echo ""
        wrangler pages deploy cf-pages --project-name="$project_name"
        echo ""
        echo -e "${GREEN}✅ Pages deployed successfully!${NC}"
        echo ""
        echo "📊 View your deployment:"
        echo "   → Dashboard: https://dash.cloudflare.com"
        echo "   → URL: https://$project_name.pages.dev"
        ;;
    5)
        echo ""
        echo "👋 Deployment cancelled. Goodbye!"
        exit 0
        ;;
    *)
        echo ""
        echo -e "${RED}❌ Invalid choice. Exiting.${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}🎉 Deployment complete!${NC}"
echo ""
echo "📚 Additional resources:"
echo "   → Deployment guide: DEPLOYMENT.md"
echo "   → Cloudflare dashboard: https://dash.cloudflare.com"
echo "   → Wrangler docs: https://developers.cloudflare.com/workers/wrangler/"
echo ""