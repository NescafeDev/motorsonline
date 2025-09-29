# Deploy to Render.com - Step by Step Guide

This guide will help you deploy your MotorsOnline project to Render.com without Docker.

## Prerequisites

1. A Render.com account (free tier available)
2. Your project pushed to a Git repository (GitHub, GitLab, or Bitbucket)
3. A MySQL database (you can use the existing FreeSQL database or set up a new one)

## Step 1: Prepare Your Repository

Your project is already configured for production deployment. The key files are:

- `package.json` - Contains build and start scripts
- `server/node-build.ts` - Production server entry point
- `vite.config.server.ts` - Server build configuration
- `server/db.ts` - Database configuration (now uses environment variables)

## Step 2: Deploy to Render.com

### Option A: Using Render Dashboard (Recommended)

1. **Go to [Render.com](https://render.com) and sign in**

2. **Create a New Web Service**
   - Click "New +" → "Web Service"
   - Connect your Git repository
   - Select your repository and branch

3. **Configure the Service**
   - **Name**: `motorsonline` (or your preferred name)
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node dist/server/node-build.mjs`
   - **Plan**: Free (or choose a paid plan)

4. **Set Environment Variables**
   Click "Advanced" and add these environment variables:
   ```
   NODE_ENV=production
   PORT=10000
   DB_HOST=sql12.freesqldatabase.com
   DB_USER=sql12799751
   DB_PASSWORD=QqLUJdKA4z
   DB_NAME=sql12799751
   DB_PORT=3306
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Render will automatically build and deploy your application

### Option B: Using render.yaml (Alternative)

If you prefer using the YAML configuration:

1. **Push the `render.yaml` file to your repository**
2. **Go to Render Dashboard**
3. **Create New Web Service**
4. **Select "Infrastructure as Code"**
5. **Choose your repository**
6. **Render will automatically detect and use the `render.yaml` configuration**

## Step 3: Database Setup

### Using Your Current FreeSQL Database
Your current database configuration should work as-is. The environment variables will use your existing FreeSQL database.

### Setting Up a New Database (Optional)
If you want to use a different database:

1. **Create a MySQL database on Render**
   - Go to Render Dashboard
   - Click "New +" → "PostgreSQL" (or use external MySQL service)
   - Configure your database

2. **Update Environment Variables**
   ```
   DB_HOST=your-new-db-host
   DB_USER=your-new-db-user
   DB_PASSWORD=your-new-db-password
   DB_NAME=your-new-db-name
   DB_PORT=3306
   ```

## Step 4: Verify Deployment

1. **Check Build Logs**
   - Go to your service dashboard
   - Click "Logs" to see build and runtime logs
   - Ensure the build completes successfully

2. **Test Your Application**
   - Visit your Render URL (e.g., `https://motorsonline.onrender.com`)
   - Test the API endpoint: `https://motorsonline.onrender.com/api/ping`
   - Verify all functionality works

## Step 5: Custom Domain (Optional)

1. **Add Custom Domain**
   - Go to your service settings
   - Click "Custom Domains"
   - Add your domain
   - Follow DNS configuration instructions

## Environment Variables Reference

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `PORT` | Server port | `10000` |
| `DB_HOST` | Database host | `sql12.freesqldatabase.com` |
| `DB_USER` | Database username | `sql12799751` |
| `DB_PASSWORD` | Database password | `QqLUJdKA4z` |
| `DB_NAME` | Database name | `sql12799751` |
| `DB_PORT` | Database port | `3306` |

## Troubleshooting

### Common Issues

1. **Build Fails**
   - Check Node.js version (should be 18+)
   - Verify all dependencies are in `package.json`
   - Check build logs for specific errors

2. **Database Connection Issues**
   - Verify environment variables are set correctly
   - Check database credentials
   - Ensure database is accessible from Render

3. **Application Won't Start**
   - Check start command: `node dist/server/node-build.mjs`
   - Verify the build output exists
   - Check runtime logs for errors

4. **Static Files Not Loading**
   - Ensure build process creates `dist/spa` directory
   - Check that static file serving is configured correctly

5. **ES Module Errors (`__dirname is not defined`)**
   - This has been fixed in the codebase
   - The server now uses `process.cwd()` instead of `__dirname`
   - If you encounter this error, ensure you're using the latest code

### Getting Help

- Check Render documentation: https://render.com/docs
- Review build and runtime logs in Render dashboard
- Ensure all environment variables are set correctly

## Production Considerations

1. **Database Security**
   - Consider using a managed database service
   - Use strong passwords
   - Enable SSL connections

2. **Performance**
   - Monitor resource usage
   - Consider upgrading to a paid plan for better performance
   - Implement caching strategies

3. **Monitoring**
   - Set up health checks
   - Monitor application logs
   - Configure alerts for downtime

## Next Steps

After successful deployment:

1. Test all application features
2. Set up monitoring and alerts
3. Configure custom domain (if needed)
4. Set up automated deployments
5. Consider database backups and security measures

Your application should now be live on Render.com! 🚀
