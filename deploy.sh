#!/bin/bash
# install wrangler if needed (one time)
npm install -g @cloudflare/wrangler

# login to Cloudflare (interactive)
wrangler login

# publish cf-pages immediately
cd ~/Projects/lukairo-engine
wrangler pages publish cf-pages --project-name=lukairo-engine