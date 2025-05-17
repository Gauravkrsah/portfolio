# Project Overview

This repository contains a full-stack application with clean separation of frontend and backend components for ease of understanding and development.

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