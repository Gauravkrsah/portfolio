# Secure CI/CD Integration Guide

This document provides guidance for securely connecting your GitHub repository with Jenkins and Docker for CI/CD deployment.

## Security Best Practices

### GitHub Token Management

1. **Create a GitHub Personal Access Token (PAT)**:
   - Go to GitHub → Settings → Developer Settings → Personal Access Tokens → Fine-grained tokens
   - Create a new token with the minimum required permissions:
     - `repo` access for private repositories
     - `read:packages` and `write:packages` if using GitHub Packages
   - Set an appropriate expiration date (e.g., 90 days)

2. **Store the token securely in Jenkins**:
   - In Jenkins, navigate to Dashboard → Manage Jenkins → Manage Credentials
   - Add a new credential of type "Secret text"
   - Enter your GitHub token in the "Secret" field
   - Set the ID to something descriptive like `github-token`
   - Add a description for future reference

3. **Never**:
   - Store tokens in code or configuration files
   - Share tokens in chat, email, or other communication channels
   - Commit tokens to version control
   - Use tokens with more permissions than necessary

### Docker Integration

1. **Docker Hub Credentials**:
   - Create dedicated Docker Hub access tokens rather than using your password
   - Store Docker Hub credentials in Jenkins using the same credential system

2. **Docker Image Security**:
   - Use specific image tags instead of `latest`
   - Implement image scanning for vulnerabilities
   - Sign your Docker images for authenticity verification

### Jenkins Pipeline Configuration

1. **Secure Pipeline Variables**:
   - Use credentials binding for all sensitive values
   - Mask sensitive output in build logs
   - Don't expose secrets in shell scripts or commands

2. **Jenkins Security**:
   - Keep Jenkins updated to the latest version
   - Use role-based access control
   - Enable build authorization
   - Run builds in isolated environments

## Setting Up the Integration

### 1. Configure GitHub Webhook

1. In your GitHub repository:
   - Go to Settings → Webhooks → Add webhook
   - Set the payload URL to `https://your-jenkins-server/github-webhook/`
   - Select content type: `application/json`
   - Choose which events should trigger the webhook (typically push events)
   - Ensure the webhook is active

### 2. Configure Jenkins

1. Install required plugins:
   - GitHub Integration
   - Docker Pipeline
   - Credentials Binding

2. Create a new Pipeline job:
   - Select "Pipeline script from SCM"
   - Choose Git as SCM
   - Enter your repository URL
   - Select the GitHub credential you created earlier
   - Specify the branch to build (e.g., `*/main`)
   - Path to Jenkinsfile: `Jenkinsfile`
   - Under "Build Triggers", check "GitHub hook trigger for GITScm polling"

### 3. Configure Docker Registry

1. In your Jenkins Pipeline:
   - Use the Docker registry credential to authenticate
   - Push images with unique tags (e.g., BUILD_NUMBER)
   - Configure Docker to use secure connections

## Testing the Integration

After setup, perform these validation steps:

1. Make a small change to your repository and commit it
2. Verify Jenkins automatically triggers a build
3. Check that Docker images are built and pushed securely
4. Confirm deployment completes successfully
5. Review logs to ensure no secrets were exposed

## Rotating Credentials

Implement a credential rotation policy:

1. GitHub tokens: Rotate every 90 days
2. Docker credentials: Rotate every 90 days
3. API keys: Rotate according to service provider recommendations
4. After rotation, update all credentials in Jenkins

## Troubleshooting

If you encounter issues with the integration:
- Verify webhook is properly configured and active
- Check Jenkins credentials are correctly set up
- Ensure Jenkins has proper permissions
- Review build logs for specific error messages
- Test connections manually to isolate the issue