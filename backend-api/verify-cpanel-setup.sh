#!/bin/bash
# Script to verify cPanel Node.js setup
# Save this as verify-cpanel-setup.sh

echo "=== Checking cPanel Node.js Setup ==="

# Check Node.js version
echo -n "Node.js version: "
node -v

# Check npm version
echo -n "npm version: "
npm -v

# Check if PM2 is installed
echo -n "PM2 installed: "
if command -v pm2 &> /dev/null; then
    echo "Yes"
    echo "PM2 version: $(pm2 -v)"
else
    echo "No - Please install PM2: npm install -g pm2"
fi

# Check directory structure
echo "=== Directory Structure ==="
echo "Current directory: $(pwd)"
if [ -d "dist" ]; then
    echo "✓ dist/ directory exists"
else
    echo "✗ dist/ directory missing"
fi

if [ -f "package.json" ]; then
    echo "✓ package.json exists"
else
    echo "✗ package.json missing"
fi

if [ -f "start.sh" ]; then
    echo "✓ start.sh exists"
    echo -n "✓ start.sh is executable: "
    if [ -x "start.sh" ]; then
        echo "Yes"
    else
        echo "No - Please run: chmod +x start.sh"
    fi
else
    echo "✗ start.sh missing"
fi

if [ -f "ecosystem.config.json" ]; then
    echo "✓ ecosystem.config.json exists"
else
    echo "✗ ecosystem.config.json missing"
fi

if [ -d "logs" ]; then
    echo "✓ logs/ directory exists"
else
    echo "✗ logs/ directory missing - Please create it: mkdir -p logs"
fi

# Check environment variables
echo "=== Environment Variables ==="
if [ -f ".env" ]; then
    echo "✓ .env file exists"
    
    # Count environment variables without displaying them
    echo "Environment variables found: $(grep -c "=" .env)"
    
    # Check specific environment variables (without showing values)
    if grep -q "GEMINI_API_KEY=" .env; then
        echo "✓ GEMINI_API_KEY found"
    else
        echo "✗ GEMINI_API_KEY missing"
    fi
    
    if grep -q "SUPABASE_URL=" .env; then
        echo "✓ SUPABASE_URL found"
    else
        echo "✗ SUPABASE_URL missing"
    fi
    
    if grep -q "NODE_ENV=" .env; then
        echo "✓ NODE_ENV found"
    else
        echo "✗ NODE_ENV missing"
    fi
else
    echo "✗ .env file missing"
fi

echo "=== Done ==="
echo "Run 'pm2 start ecosystem.config.json' to start the application"
