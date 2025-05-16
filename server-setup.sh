#!/bin/bash
# Server setup script for cPanel deployment

# Get the directory of the script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# Navigate to the script directory
cd "$SCRIPT_DIR" || exit

# Frontend setup
echo "Setting up frontend..."
if [ -d "./public_html" ]; then
  echo "Setting permissions for public_html..."
  chmod -R 755 ./public_html
  
  # Ensure .htaccess is present in public_html
  if [ ! -f "./public_html/.htaccess" ]; then
    echo "Creating .htaccess file in public_html..."
    cp ./frontend/public/.htaccess ./public_html/
  fi
fi

# Backend API setup
echo "Setting up backend API..."
if [ -d "./api" ]; then
  echo "Setting permissions for API directory..."
  chmod -R 755 ./api
  
  # Install backend dependencies
  echo "Installing backend dependencies..."
  cd ./api || exit
  npm ci --production
  
  # Setup PM2 to manage Node.js process (if available)
  if command -v pm2 &> /dev/null; then
    echo "Setting up PM2 for Node.js application..."
    pm2 delete api 2>/dev/null || true
    pm2 start index.js --name api
    pm2 save
  fi
fi

echo "Server setup complete!"
