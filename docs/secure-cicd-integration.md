# Secure CI/CD Integration Guide

## Handling GitHub Tokens and Other Secrets

This guide explains how to securely manage tokens and credentials in your CI/CD pipeline using Jenkins and Docker.

## GitHub Token Security

### Creating a Secure GitHub Token
1. Go to GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens
2. Create a token with the minimum necessary permissions:
   - Read access to metadata
   - Read and write access to code
   - Read access to pull requests

### Adding the Token to Jenkins
1. In Jenkins, go to Dashboard → Manage Jenkins → Credentials → System → Global credentials → Add credentials
2. Select "Secret text" as the kind
3. Enter the GitHub token as the secret
4. Set the ID to "github-token" (this is what's referenced in the Jenkinsfile)
5. Provide a description like "GitHub access token for portfolio project"

## Other Sensitive Credentials

Add these additional credentials to Jenkins:

1. **Docker Registry**:
   - ID: docker-registry-url
   - Type: Secret text
   - Secret: Your Docker registry URL

2. **Docker Credentials**:
   - ID: docker-credentials-id
   - Type: Username with password
   - Username: Your Docker username
   - Password: Your Docker password

3. **API Keys**:
   - ID: gemini-api-key
   - Type: Secret text
   - Secret: Your Gemini API key

   Repeat for Supabase credentials with appropriate IDs.

## Usage in CI/CD Pipeline

The Jenkins pipeline uses these credentials securely:

```groovy
environment {
    GITHUB_TOKEN = credentials('github-token')
    DOCKER_REGISTRY = credentials('docker-registry-url')
    DOCKER_CREDS = credentials('docker-credentials-id')
}
```

## Docker Compose with Secrets

For local development with Docker, use a .env file (which is gitignored):

```
# Create a .env file for local development (DO NOT COMMIT THIS FILE)
GITHUB_TOKEN=your_token_here
GEMINI_API_KEY=your_key_here
```

## IMPORTANT: Security Best Practices

1. **Never commit tokens to your repository**
2. **Never share tokens in plain text** in emails, chat, or documentation
3. **Regularly rotate tokens** (every 30-90 days)
4. **Use the minimum permissions necessary** for each token
5. **Revoke tokens** that may have been compromised

Remember: Security is a continuous process. Regularly audit your security practices and update them as needed.