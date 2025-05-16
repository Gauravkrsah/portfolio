# Production Deployment Guide for Portfolio

This guide will help you set up and manage your portfolio application in production using PM2.

## Prerequisites

- Access to your cPanel account
- Node.js setup in cPanel
- All files deployed via GitHub Actions

## Setting up PM2

PM2 is a process manager for Node.js applications that helps keep your app running and enables zero-downtime reloads.

### Installation

1. SSH into your server or use the cPanel Terminal:
   ```
   ssh cropsayc@cropsay.com
   ```

2. Navigate to your application directory:
   ```
   cd public_html/gauravsah.com.np/api
   ```

3. Install PM2 globally:
   ```
   npm install -g pm2
   ```

4. Create a logs directory:
   ```
   mkdir -p logs
   ```

### Starting your application with PM2

1. Start the application using the provided ecosystem.config.json:
   ```
   pm2 start ecosystem.config.json
   ```

2. Save the PM2 process list:
   ```
   pm2 save
   ```

3. Set up PM2 to start on system reboot:
   ```
   pm2 startup
   ```
   Follow any instructions provided by this command.

### Monitoring your application

1. View all running processes:
   ```
   pm2 list
   ```

2. Monitor resource usage in real-time:
   ```
   pm2 monit
   ```

3. View logs:
   ```
   pm2 logs portfolio-api
   ```

### Managing your application

1. Restart the application:
   ```
   pm2 restart portfolio-api
   ```

2. Reload the application with zero downtime:
   ```
   pm2 reload portfolio-api
   ```

3. Stop the application:
   ```
   pm2 stop portfolio-api
   ```

## Troubleshooting

### Application not starting
Check the error logs:
```
cat logs/error.log
```

### Memory issues
If you see the application restarting frequently, you might need to increase the memory limit in the ecosystem.config.json file.

### 502 Bad Gateway errors
This usually indicates that your Node.js application is not running. Start it using PM2.

## Additional Resources

- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
