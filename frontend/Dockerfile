FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the frontend application
RUN npm run build

# Production stage
FROM nginx:alpine AS production

# Copy built files from builder stage to nginx serve directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
