# GitHub to cPanel Automatic Deployment

This project is now set up to automatically deploy code changes from GitHub to your cPanel hosting whenever you push to the main branch.

## What's Been Set Up

1. **GitHub Actions Workflow** (`.github/workflows/deploy.yml`):
   - Builds frontend and backend applications
   - Deploys frontend to public_html directory
   - Deploys backend to public_html/api directory
   - Sets up environment variables from GitHub secrets

2. **Backend Configuration**:
   - `ecosystem.config.json`: PM2 process manager configuration
   - `start.sh`: Script to start the Node.js application
   - `verify-cpanel-setup.sh`: Script to verify cPanel configuration

3. **Helper Scripts**:
   - `setup-github-secrets.ps1`: PowerShell script to set up GitHub secrets
   - `test-deployment.js`: NodeJS script to verify deployment success

4. **Documentation**:
   - `DEPLOYMENT.md`: Comprehensive deployment guide

## How to Use

### Initial Setup

1. **Set up GitHub repository secrets**:
   ```powershell
   # On your local machine
   .\setup-github-secrets.ps1
   ```
   This will guide you through setting up all necessary secrets.

2. **Configure your cPanel hosting**:
   - Follow the instructions in `DEPLOYMENT.md`
   - Set up Node.js in cPanel
   - Create necessary directories
   - Install PM2

### Deploying Changes

1. Make changes to your code
2. Commit and push to main branch:
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```

3. GitHub Actions will automatically:
   - Build your application
   - Deploy to cPanel
   - Set up environment variables

4. Verify deployment:
   ```bash
   node test-deployment.js
   ```

## Ongoing Maintenance

- **Monitor application**: Use PM2 commands as described in `DEPLOYMENT.md`
- **Troubleshoot issues**: Check GitHub Actions logs and server logs
- **Update configuration**: Modify workflow files as needed

## Need Help?

Refer to `docs/production-guide.md` for detailed production environment instructions.
