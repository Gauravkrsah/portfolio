# Project Overview

This repository contains a full-stack application with clean separation of frontend and backend components for ease of understanding, development, and deployment.

## Folder Structure

### frontend/
The frontend React application built using TypeScript, Vite, and Tailwind CSS.

- `public/`: Static assets like images, favicon, and robots.txt.
- `src/`: Source code with the following subfolders:
  - `assets/`: Images, fonts, icons, and other static resources.
  - `components/`: Reusable React UI components.
  - `hooks/`: Custom React hooks.
  - `pages/`: Page components representing routes.
  - `styles/`: Global and modular stylesheet files.
  - `utils/`: Utility functions and helpers.
- Configuration files like `package.json`, `tsconfig.json`, `vite.config.ts`, etc.

### backend-api/
The backend API built using Node.js, Express, and TypeScript.

- `src/`: Backend source code with the following subfolders:
  - `controllers/`: API endpoint controllers handling request logic.
  - `middlewares/`: Express middleware functions.
  - `models/`: Data models and database schema definitions.
  - `routes/`: API routes definitions.
  - `services/`: Business logic and external service integrations.
  - `utils/`: Utility functions and helpers.
- `config/`: Configuration files and environment setup.
- Root configuration files like `package.json`, `tsconfig.json`.

## Running the Application

- Frontend:
  ```bash
  cd frontend
  npm install
  npm run dev
  ```

- Backend:
  ```bash
  cd backend-api
  npm install
  npm run dev
  ```

This structure ensures maintainability, scalability, and professional organization for your project.

## Deployment

This project will be configured for CI/CD pipeline using Git, Jenkins, and Docker.

**Future Deployment Strategy:**
- Source code management with Git
- Continuous Integration with Jenkins
- Containerization using Docker
- Automated testing and deployment

The previous deployment configuration has been removed in favor of this more robust approach.

## Docker Setup

This project includes Docker configuration for both development and production environments.

### Development with Docker

To run the application using Docker in development mode:

```bash
docker-compose up
```

This will start both the frontend and backend services.

### CI/CD with Jenkins

The project is configured with a Jenkinsfile for CI/CD pipeline integration:

1. **Pipeline Stages**:
   - Checkout code from repository
   - Install dependencies
   - Run tests
   - Build application
   - Build and push Docker images
   - Deploy to production

2. **Required Jenkins Credentials**:
   - Docker registry credentials
   - API keys (Gemini, Supabase)

3. **Running Production Deployment**:
   
   The production deployment uses a separate docker-compose file:
   
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
   ```