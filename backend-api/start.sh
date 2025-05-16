#!/bin/bash

# The directory where the app is located
APP_DIR="/home8/cropsayc/public_html/gauravsah.com.np/api"

# Change to the app directory
cd $APP_DIR

# Install dependencies if package.json exists and node_modules doesn't
if [ -f "package.json" ] && [ ! -d "node_modules" ]; then
    npm install --production
fi

# Start the Node.js application
NODE_ENV=production exec node dist/index.js
