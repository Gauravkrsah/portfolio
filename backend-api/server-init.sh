#!/bin/bash
# Server initialization script for ensuring the chatbot works properly

echo "Starting server initialization for chatbot..."

# Set the environment
export NODE_ENV=production

# Create directories
mkdir -p docs

# Check if the chatdata.md file exists in backend-api/docs
if [ ! -f "./docs/chatdata.md" ]; then
  echo "chatdata.md not found in ./docs/, creating default version..."
  
  # Create a minimal version of chatdata.md if it's missing
  cat > ./docs/chatdata.md << EOF
**Gaurav Kr Sah - Portfolio Summary**

---

**Introduction:**

Hello! My name is Gaurav Kr Sah. I am currently pursuing my Bachelor's degree in Computer Applications (BCA). I have a deep interest in technology, design, and marketing, and over the past year, I have gained hands-on experience working as a freelancer in various domains. I specialize in product designing, especially for websites, digital marketing in all its forms, UI/UX designing, and overall website product strategy.

---

**Skills and Expertise:**

1. **Product Designing (Website & App)**
   * Design strategy from wireframes to high-fidelity UI
   * Use of Figma, Adobe XD, Canva, and Illustrator
   * Web layout planning, responsive design, and user flow design

2. **UI/UX Design**
   * User research, persona creation, and empathy mapping
   * Journey maps, information architecture, and prototype testing

3. **Website Design & Development**
   * HTML, CSS, JavaScript
   * React basics and UI integration
   * Hosting and domain setup, basic SEO

4. **Digital Marketing (All Domains)**
   * Search Engine Optimization (SEO): on-page, off-page, technical SEO
   * Social Media Marketing: content strategy, growth tactics
EOF
  
  echo "Default chatdata.md created!"
fi

# Check for the environment file
if [ ! -f "./.env" ]; then
  echo ".env not found, creating one with default values..."
  
  cat > ./.env << EOF
PORT=8000
NODE_ENV=production
FRONTEND_URL=https://gauravsah.com.np
GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
EOF
  
  echo ".env file created! Make sure to update GEMINI_API_KEY"
else
  echo ".env file exists, checking for GEMINI_API_KEY..."
  if ! grep -q "GEMINI_API_KEY" ./.env; then
    echo "GEMINI_API_KEY not found in .env, adding it..."
    echo "GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE" >> ./.env
    echo "Added GEMINI_API_KEY to .env, please update it!"
  fi
fi

# Print instructions
echo ""
echo "===================================="
echo "Server initialization complete!"
echo "===================================="
echo "Make sure to:"
echo "1. Update the GEMINI_API_KEY in .env with your actual API key"
echo "2. Ensure the Node.js application is set to start with 'node dist/index.js'"
echo "3. Restart the Node.js application after any changes"
echo ""

# Exit successfully
exit 0
