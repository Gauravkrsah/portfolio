# Deployment Checklist

## Before pushing to GitHub
- [x] Frontend configuration
  - [x] Updated Vite config for production builds
  - [x] Fixed hardcoded API URL in geminiClient.ts
  - [x] Created .htaccess for SPA routing
  - [x] Added environment variable examples

- [x] Backend configuration
  - [x] Created .htaccess for API routing
  - [x] Backend build process configured
  - [x] API endpoints properly structured
  - [x] Environment variables set up

- [x] Deployment workflow
  - [x] GitHub Actions workflows created
  - [x] CPanel deployment configuration (.cpanel.yml)
  - [x] Server setup script created

## GitHub Repository Setup
1. Add these secrets to your GitHub repository:
   - [ ] CPANEL_FTP_SERVER (e.g., server.gauravsah.com.np)
   - [ ] CPANEL_FTP_USERNAME (your cPanel username)
   - [ ] CPANEL_FTP_PASSWORD (your cPanel password)

## CPanel Setup
1. [ ] Create or configure your domain (gauravsah.com.np)
2. [ ] Setup Node.js app in cPanel:
   - [ ] Go to "Setup Node.js App" in cPanel
   - [ ] Create a new application for the backend
   - [ ] Set the application path to `/api`
   - [ ] Choose Node.js version 20+
   - [ ] Set the Application mode to "Production"
   - [ ] Set the Application URL to `https://gauravsah.com.np/api`
   - [ ] Start the application with command `node index.js`
3. [ ] Setup PostgreSQL Database if needed:
   - [ ] Create database and user
   - [ ] Update backend .env file with credentials

## Environment Variables
1. [ ] Frontend (.env)
   ```
   VITE_API_URL=https://gauravsah.com.np/api
   VITE_WEBSITE_URL=https://gauravsah.com.np
   VITE_GEMINI_API_ENDPOINT=/api/gemini-chat
   ```

2. [ ] Backend (.env)
   ```
   PORT=8000
   NODE_ENV=production
   FRONTEND_URL=https://gauravsah.com.np
   DATABASE_URL=postgres://username:password@localhost:5432/database_name
   GEMINI_API_KEY=your_gemini_api_key
   EMAIL_SERVICE=your_email_service
   EMAIL_USERNAME=your_email_username
   EMAIL_PASSWORD=your_email_password
   ```

## Git Push and Deployment
1. [ ] Commit all changes
   ```
   git add .
   git commit -m "Prepare for cPanel deployment"
   git push origin main
   ```
2. [ ] Verify GitHub Actions workflows triggered
3. [ ] Check deployment success in GitHub Actions

## Verify Deployment
1. [ ] Visit `https://gauravsah.com.np` to check the frontend
2. [ ] Test the chatbot functionality
3. [ ] Try various routes to ensure SPA routing works
4. [ ] Check API response at `https://gauravsah.com.np/api/health`

## Troubleshooting
1. [ ] Check cPanel error logs
2. [ ] Verify environment variables are set correctly
3. [ ] Check Node.js application logs
4. [ ] Verify database connection if applicable
5. [ ] Check for CORS issues in browser dev tools
