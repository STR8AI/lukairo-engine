#!/bin/bash
# LUKAIRO ENGINE - Cloudflare Deployment Script
# This script helps deploy the application to Cloudflare Workers/Pages

set -e  # Exit on error

echo "🚀 LUKAIRO ENGINE - Cloudflare Deployment"
echo "========================================"
echo ""

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "⚠️  Wrangler is not installed."
    echo "📦 Installing Wrangler globally..."
    npm install -g wrangler
    echo "✅ Wrangler installed successfully!"
    echo ""
fi

# Check if user is logged in
echo "🔐 Checking Cloudflare authentication..."
if ! wrangler whoami &> /dev/null; then
    echo "⚠️  Not logged in to Cloudflare."
    echo "🔑 Opening browser for authentication..."
    wrangler login
    echo "✅ Logged in successfully!"
    echo ""
else
    echo "✅ Already authenticated!"
    echo ""
fi

# Ask user what to deploy
echo "What would you like to deploy?"
echo "1) Workers (API backend)"
echo "2) Pages (React frontend)"
echo "3) Both"
echo ""
read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        echo ""
        echo "📦 Deploying Workers..."
        cd workers
        wrangler deploy
        echo "✅ Workers deployed successfully!"
        ;;
    2)
        echo ""
        echo "📦 Building React application..."
        npm run build
        echo ""
        echo "🚀 Deploying to Cloudflare Pages..."
        wrangler pages publish cf-pages --project-name=lukairo-engine
        echo "✅ Pages deployed successfully!"
        ;;
    3)
        echo ""
        echo "📦 Deploying Workers..."
        cd workers
        wrangler deploy
        cd ..
        echo "✅ Workers deployed!"
        echo ""
        echo "📦 Building React application..."
        npm run build
        echo ""
        echo "🚀 Deploying to Cloudflare Pages..."
        wrangler pages publish cf-pages --project-name=lukairo-engine
        echo "✅ Pages deployed successfully!"
        ;;
    *)
        echo "❌ Invalid choice. Exiting."
        exit 1
        ;;
esac

echo ""
echo "🎉 Deployment complete!"
echo "📊 Check your Cloudflare dashboard: https://dash.cloudflare.com"
echo ""