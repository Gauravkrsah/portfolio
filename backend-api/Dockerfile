FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript files
RUN npm run build

# Expose the API port
EXPOSE 4000

# Set environment variables
ENV NODE_ENV=production

# Start the application
CMD ["node", "dist/index.js"]
