# Render Deployment with Basic Authentication

This guide explains how to deploy your MotorsOnline application to Render.com with Basic Authentication configured for production.

## 🚀 Quick Deployment Steps

### 1. **Update Environment Variables**

Before deploying, you **MUST** change the default passwords in your configuration files:

#### In `render.yaml` and `render.json`:
```yaml
# Change these values to secure passwords!
BASIC_AUTH_ADMIN_PASS: "your_secure_admin_password"
BASIC_AUTH_USER_PASS: "your_secure_user_password" 
BASIC_AUTH_TEST_PASS: "your_secure_test_password"
JWT_SECRET: "your_production_jwt_secret_here"
```

### 2. **Deploy to Render**

#### Option A: Using Render Dashboard (Recommended)

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
   
   # Database Configuration
   DB_HOST=sql12.freesqldatabase.com
   DB_USER=sql12799751
   DB_PASSWORD=QqLUJdKA4z
   DB_NAME=sql12799751
   DB_PORT=3306
   
   # JWT Secret (CHANGE THIS!)
   JWT_SECRET=your_production_jwt_secret_here
   
   # Basic Auth Credentials (CHANGE THESE!)
   BASIC_AUTH_ADMIN_USER=admin
   BASIC_AUTH_ADMIN_PASS=your_secure_admin_password
   BASIC_AUTH_USER_USER=user
   BASIC_AUTH_USER_PASS=your_secure_user_password
   BASIC_AUTH_TEST_USER=test
   BASIC_AUTH_TEST_PASS=your_secure_test_password
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Render will automatically build and deploy your application

#### Option B: Using render.yaml (Alternative)

1. **Update the `render.yaml` file** with your secure passwords
2. **Push to your repository**
3. **Go to Render Dashboard**
4. **Create New Web Service**
5. **Select "Infrastructure as Code"**
6. **Choose your repository**
7. **Render will automatically detect and use the `render.yaml` configuration**

## 🔐 Basic Auth Configuration

### Environment Variables

Your Basic Auth credentials are now configured through environment variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `BASIC_AUTH_ADMIN_USER` | Admin username | `admin` |
| `BASIC_AUTH_ADMIN_PASS` | Admin password | `SecurePass123!` |
| `BASIC_AUTH_USER_USER` | Regular user username | `user` |
| `BASIC_AUTH_USER_PASS` | Regular user password | `UserPass456!` |
| `BASIC_AUTH_TEST_USER` | Test username | `test` |
| `BASIC_AUTH_TEST_PASS` | Test password | `TestPass789!` |

### Security Best Practices

⚠️ **CRITICAL SECURITY STEPS:**

1. **Change Default Passwords**: Never use the default passwords in production
2. **Use Strong Passwords**: Minimum 12 characters with mixed case, numbers, and symbols
3. **Rotate Credentials**: Change passwords regularly
4. **Use HTTPS**: Basic Auth requires HTTPS in production
5. **Monitor Access**: Log authentication attempts

### Example Secure Passwords

```bash
# Good examples (use your own!)
BASIC_AUTH_ADMIN_PASS=MySecureAdmin2024!
BASIC_AUTH_USER_PASS=UserSecurePass456#
BASIC_AUTH_TEST_PASS=TestPassword789$
JWT_SECRET=my-super-secret-jwt-key-2024-production
```

## 🧪 Testing Your Deployment

### 1. **Test Basic Endpoints**

```bash
# Test health check
curl https://your-app.onrender.com/api/ping

# Test Basic Auth (replace with your actual credentials)
curl -H "Authorization: Basic YWRtaW46WW91clNlY3VyZUFkbWluMjAyNCE=" \
  https://your-app.onrender.com/api/auth/basic-auth-test
```

### 2. **Generate Auth Headers**

```bash
# Generate auth header for testing
curl -X POST https://your-app.onrender.com/api/auth/generate-basic-auth \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "YourSecureAdmin2024!"}'
```

### 3. **JavaScript Testing**

```javascript
// Test from browser console or client
const credentials = btoa('admin:YourSecureAdmin2024!');

fetch('https://your-app.onrender.com/api/auth/basic-auth-test', {
  headers: {
    'Authorization': `Basic ${credentials}`
  }
})
.then(response => response.json())
.then(data => console.log(data));
```

## 🔧 Production Configuration

### Environment Variables in Render Dashboard

1. **Go to your service dashboard**
2. **Click "Environment"**
3. **Add/Update these variables:**

```
# Required for Basic Auth
BASIC_AUTH_ADMIN_USER=admin
BASIC_AUTH_ADMIN_PASS=YourSecureAdminPassword123!
BASIC_AUTH_USER_USER=user
BASIC_AUTH_USER_PASS=YourSecureUserPassword456!
BASIC_AUTH_TEST_USER=test
BASIC_AUTH_TEST_PASS=YourSecureTestPassword789!

# JWT Secret (use a strong, random string)
JWT_SECRET=your-super-secret-jwt-key-for-production-2024

# Database (already configured)
DB_HOST=sql12.freesqldatabase.com
DB_USER=sql12799751
DB_PASSWORD=QqLUJdKA4z
DB_NAME=sql12799751
DB_PORT=3306
```

### Custom Domain Setup

If you're using a custom domain:

1. **Add Custom Domain** in Render dashboard
2. **Configure DNS** as instructed
3. **Test Basic Auth** with your custom domain:
   ```bash
   curl -H "Authorization: Basic YWRtaW46WW91clNlY3VyZUFkbWluMjAyNCE=" \
     https://yourdomain.com/api/auth/basic-auth-test
   ```

## 🛠️ Troubleshooting

### Common Issues

#### 1. **401 Unauthorized Errors**
```bash
# Check if credentials are correct
curl -v -H "Authorization: Basic YWRtaW46WW91clNlY3VyZUFkbWluMjAyNCE=" \
  https://your-app.onrender.com/api/auth/basic-auth-test
```

#### 2. **Environment Variables Not Working**
- Check Render dashboard → Environment tab
- Ensure variable names match exactly (case-sensitive)
- Redeploy after changing environment variables

#### 3. **Build Failures**
- Check build logs in Render dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility

#### 4. **Database Connection Issues**
- Verify database credentials in environment variables
- Check if database allows connections from Render IPs
- Test database connection separately

### Debug Commands

```bash
# Test environment variables (add this to your app temporarily)
console.log('Basic Auth Users:', process.env.BASIC_AUTH_ADMIN_USER);

# Test auth header generation
curl -X POST https://your-app.onrender.com/api/auth/generate-basic-auth \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "YourSecureAdmin2024!"}'
```

## 📊 Monitoring

### Health Checks

Your app includes health check endpoints:

- **Basic Health**: `GET /api/ping`
- **Auth Test**: `GET /api/auth/basic-auth-test` (requires Basic Auth)

### Logs

Monitor your application:

1. **Render Dashboard** → **Logs** tab
2. **Check for authentication errors**
3. **Monitor database connections**
4. **Watch for build/runtime errors**

## 🔄 Updates and Maintenance

### Updating Credentials

1. **Change environment variables** in Render dashboard
2. **Redeploy** the application
3. **Test** with new credentials
4. **Update client applications** if needed

### Adding New Users

To add new Basic Auth users:

1. **Add environment variables**:
   ```
   BASIC_AUTH_NEWUSER_USER=newuser
   BASIC_AUTH_NEWUSER_PASS=NewUserPassword123!
   ```

2. **Update your auth configuration** in `server/routes/auth.ts`:
   ```typescript
   const basicAuthUsers = {
     [process.env.BASIC_AUTH_ADMIN_USER || 'admin']: process.env.BASIC_AUTH_ADMIN_PASS || 'admin123',
     [process.env.BASIC_AUTH_USER_USER || 'user']: process.env.BASIC_AUTH_USER_PASS || 'user123',
     [process.env.BASIC_AUTH_TEST_USER || 'test']: process.env.BASIC_AUTH_TEST_PASS || 'test123',
     [process.env.BASIC_AUTH_NEWUSER_USER || 'newuser']: process.env.BASIC_AUTH_NEWUSER_PASS || 'newuser123'
   };
   ```

3. **Redeploy** the application

## 🎯 Next Steps

After successful deployment:

1. ✅ **Test all Basic Auth endpoints**
2. ✅ **Verify HTTPS is working**
3. ✅ **Update any client applications** with new credentials
4. ✅ **Set up monitoring and alerts**
5. ✅ **Document credentials** for your team
6. ✅ **Consider implementing rate limiting**
7. ✅ **Set up automated deployments**

Your application with Basic Authentication is now ready for production! 🚀

## 📞 Support

If you encounter issues:

1. **Check Render logs** for error messages
2. **Verify environment variables** are set correctly
3. **Test locally** with the same configuration
4. **Check Render documentation**: https://render.com/docs
5. **Review this guide** for common solutions
