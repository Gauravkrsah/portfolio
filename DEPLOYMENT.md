# Portfolio Project GitHub to cPanel Deployment

This project uses GitHub Actions to automatically deploy updates from the GitHub repository to your cPanel hosting whenever changes are pushed to the main branch.

## Setup Instructions

### 1. GitHub Repository Setup

1. Make sure you have a GitHub repository for your project.
2. Push your code to the repository.
3. Go to your GitHub repository > Settings > Secrets and Variables > Actions.
4. Add the following repository secrets:
   - `CPANEL_FTP_SERVER`: Your cPanel FTP server address (usually ftp.yourdomain.com)
   - `CPANEL_FTP_USERNAME`: Your cPanel FTP username
   - `CPANEL_FTP_PASSWORD`: Your cPanel FTP password
   - `GEMINI_API_KEY`: Your Google Gemini API key
   - `SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_ANON_KEY`: Your Supabase anonymous key
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key

### 2. cPanel Server Configuration

1. Log into your cPanel account.
2. Set up Node.js for your cPanel hosting:
   - Go to Software > Setup Node.js App
   - Create a new Node.js application with the following settings:
     - Node.js version: 18 (or latest LTS)
     - Application mode: Production
     - Application root: `/public_html/api`
     - Application URL: `yourdomain.com/api`
     - Application startup file: `start.sh`
     - Save the configuration

3. Install PM2 globally:
   ```bash
   ssh username@yourdomain.com
   cd ~/public_html/api
   npm install -g pm2
   mkdir -p logs
   ```

4. Set up the directory structure:
   - `/public_html` will contain the frontend files
   - `/public_html/api` will contain the backend API files

### 3. How It Works

The GitHub Actions workflow does the following:
1. Builds the frontend React/Vite application
2. Builds the backend Node.js/Express application
3. Creates environment files with proper configuration
4. Deploys the frontend files to the main public_html directory
5. Deploys the backend files to the public_html/api directory

### 4. Testing the Deployment

After setting up GitHub Actions and connecting to your cPanel hosting:

1. Make a change to your code
2. Commit and push to the main branch
3. Go to the GitHub repository > Actions tab to monitor the deployment workflow
4. Once complete, visit your website to see the changes

You can use the included `test-deployment.js` script to verify that both the frontend and backend are working:

```bash
node test-deployment.js
```

### 5. Troubleshooting

- Check GitHub Actions logs for deployment errors
- Verify FTP credentials are correct
- Ensure Node.js is properly set up in cPanel
- Check PM2 status with `pm2 list`
- Review logs in the `/public_html/api/logs` directory

## Management

### Monitoring the Application

```bash
# SSH into your server
ssh username@yourdomain.com

# Navigate to your API directory
cd ~/public_html/api

# Check PM2 status
pm2 list

# View logs
pm2 logs portfolio-api

# Monitor resources
pm2 monit
```

### Restarting the Application

```bash
pm2 restart portfolio-api
```

### Updating Environment Variables

If you need to update environment variables:

1. Update the GitHub repository secrets
2. Push a new commit to trigger redeployment, or
3. Manually update the `.env` file on the server

## Additional Resources

For more detailed instructions, refer to:
- [Production Guide](./docs/production-guide.md)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)
