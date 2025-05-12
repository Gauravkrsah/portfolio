# Portfolio Website Deployment for cPanel

## Deployment Structure

- `public_html` - Frontend static files to be placed in cPanel's public_html directory
- `backend` - Backend Node.js application 
- `package.json` - Dependencies and start script for Node.js application
- `.cpanel.yml` - Automated deployment configuration
- `.env.example` - Template for environment variables

## Setup Instructions for cPanel

### Step 1: Upload Files
1. Log into your cPanel account
2. Navigate to the File Manager
3. Upload the contents of this directory to your cPanel root

### Step 2: Set Up Node.js App
1. In cPanel, go to "Setup Node.js App"
2. Create a new Node.js application:
   - Set Node.js version to 18 or higher
   - Set the application directory to your home path (e.g., `/home/username/`)
   - Set the Application URL to your domain or subdomain
   - Set Application startup file to: `backend/index.js`
   - Set Application mode to: Production
   - Enable "Run NPM Install"

### Step 3: Environment Variables
1. Create a `.env` file in your home directory based on `.env.example`
2. Set all necessary environment variables

### Step 4: Start the Application
1. In the Node.js App interface, start your application
2. Your frontend will be accessible at your main domain
3. Your backend will run as a Node.js process

### Troubleshooting
- Check cPanel error logs if the application doesn't start
- Ensure all file permissions are set correctly (usually 755 for directories, 644 for files)
- Verify that your domain's DNS settings are correctly configured
