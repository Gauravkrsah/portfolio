# Portfolio Website Deployment Guide

This guide explains how to deploy the portfolio website to cPanel hosting via GitHub Actions.

## Project Structure

- **Frontend**: React/Vite application with ShadcnUI components
- **Backend API**: Node.js API server
- **Database**: PostgreSQL database

## Deployment Setup

### Prerequisites

1. GitHub repository with the project code
2. cPanel hosting account with:
   - Node.js support
   - SSH access enabled
   - Git Version Deployment enabled
   - PostgreSQL database

### GitHub Secrets Setup

Add the following secrets to your GitHub repository:

- `CPANEL_FTP_SERVER`: Your cPanel server hostname (e.g., `server.gauravsah.com.np`)
- `CPANEL_FTP_USERNAME`: Your cPanel username
- `CPANEL_FTP_PASSWORD`: Your cPanel password

### cPanel Setup

1. Create a subdomain or setup the main domain for your application
2. Setup Node.js app in cPanel:
   - Go to "Setup Node.js App" in cPanel
   - Create a new application for the backend
   - Set the application path to `/api`
   - Choose Node.js version 20+
   - Set the Application mode to "Production"
   - Set the Application root to the path where backend files will be stored
   - Set the Application URL to `https://gauravsah.com.np/api`
   - Start the application with command `node index.js`

3. Setup PostgreSQL Database:
   - Go to "PostgreSQL Databases" in cPanel
   - Create a new database and user
   - Set the database credentials in `.env` file

### Local Environment Setup

1. Clone the repository
2. Create `.env` files:
   - Copy `.env.example` to `.env` in both frontend and backend-api directories
   - Fill in the correct environment variables

## Automatic Deployment

The GitHub Actions workflows will automatically deploy your code when you push to the main branch:

- Changes to frontend/ will trigger frontend deployment
- Changes to backend-api/ will trigger backend deployment

## Manual Deployment

If needed, you can manually deploy:

1. Frontend:
   ```bash
   cd frontend
   npm ci
   npm run build
   ```
   Then upload the contents of the `dist` folder to the `public_html` directory

2. Backend API:
   ```bash
   cd backend-api
   npm ci
   ```
   Then upload the backend-api files to the API directory on your server

## Testing the Deployment

1. Visit `https://gauravsah.com.np` to verify the frontend is working
2. Check `https://gauravsah.com.np/api/health` to verify the backend API is working

## Troubleshooting

- Check the application logs in cPanel
- Verify environment variables are set correctly
- Ensure database connection is working properly
