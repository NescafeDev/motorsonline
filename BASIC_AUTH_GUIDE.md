# Basic Authentication Implementation Guide

This guide explains how to use the Basic Authentication implementation in your application.

## Overview

Basic Authentication is a simple authentication scheme built into the HTTP protocol. It sends credentials (username and password) encoded in Base64 format within the Authorization header.

## Implementation

### 1. Basic Auth Middleware

The middleware is located at `server/middleware/basicAuth.ts` and provides:

- **`basicAuth(options)`**: Middleware function for protecting routes
- **`generateBasicAuthHeader(username, password)`**: Utility to generate auth headers
- **`parseBasicAuthHeader(authHeader)`**: Utility to parse auth headers

### 2. Usage Examples

#### Protecting a Route

```typescript
import { basicAuth } from '../middleware/basicAuth';

// Define users and their passwords
const users = {
  'admin': 'admin123',
  'user': 'user123',
  'test': 'test123'
};

// Protect a route
router.get('/protected', basicAuth({
  users: users,
  realm: 'API Access',
  message: 'Please provide valid credentials'
}), (req, res) => {
  const user = (req as any).user;
  res.json({ message: 'Access granted', user: user.username });
});
```

#### Client-Side Usage

**JavaScript/Fetch:**
```javascript
// Generate credentials
const username = 'admin';
const password = 'admin123';
const credentials = btoa(`${username}:${password}`);

// Make authenticated request
fetch('/api/auth/basic-auth-test', {
  headers: {
    'Authorization': `Basic ${credentials}`
  }
})
.then(response => response.json())
.then(data => console.log(data));
```

**cURL:**
```bash
curl -H "Authorization: Basic YWRtaW46YWRtaW4xMjM=" http://localhost:8080/api/auth/basic-auth-test
```

**Using the Generator Endpoint:**
```javascript
// First, generate the auth header
const response = await fetch('/api/auth/generate-basic-auth', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'admin', password: 'admin123' })
});

const { authHeader } = await response.json();

// Then use it for authenticated requests
fetch('/api/auth/basic-auth-test', {
  headers: { 'Authorization': authHeader }
});
```

## Available Endpoints

### 1. Test Basic Auth
- **URL**: `GET /api/auth/basic-auth-test`
- **Auth**: Required (Basic Auth)
- **Response**: Success message with user info

### 2. Generate Auth Header
- **URL**: `POST /api/auth/generate-basic-auth`
- **Body**: `{ "username": "admin", "password": "admin123" }`
- **Response**: Generated auth header and usage examples

## Security Considerations

⚠️ **Important Security Notes:**

1. **Use HTTPS**: Basic Auth sends credentials in Base64 (not encrypted). Always use HTTPS in production.

2. **Strong Passwords**: Use complex passwords for better security.

3. **Environment Variables**: Store credentials in environment variables, not in code:
   ```typescript
   const users = {
     [process.env.ADMIN_USER]: process.env.ADMIN_PASS,
     [process.env.API_USER]: process.env.API_PASS
   };
   ```

4. **Rate Limiting**: Implement rate limiting to prevent brute force attacks.

5. **Logging**: Monitor authentication attempts for suspicious activity.

## Advanced Usage

### Custom User Validation

```typescript
// For database-backed authentication
router.get('/db-protected', async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Basic ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');

    // Validate against database
    const user = await findUserByUsername(username);
    if (!user || !await validatePassword(user, password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    (req as any).user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid credentials' });
  }
}, (req, res) => {
  res.json({ message: 'Database authentication successful' });
});
```

### Multiple Authentication Methods

```typescript
// Support both JWT and Basic Auth
function flexibleAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  
  if (authHeader?.startsWith('Bearer ')) {
    // Handle JWT token
    return handleJWT(req, res, next);
  } else if (authHeader?.startsWith('Basic ')) {
    // Handle Basic Auth
    return basicAuth({ users: basicAuthUsers })(req, res, next);
  } else {
    return res.status(401).json({ error: 'Authentication required' });
  }
}
```

## Testing

### Manual Testing

1. **Start your server**: `npm run dev`
2. **Test without auth**: `curl http://localhost:8080/api/auth/basic-auth-test`
3. **Test with auth**: `curl -H "Authorization: Basic YWRtaW46YWRtaW4xMjM=" http://localhost:8080/api/auth/basic-auth-test`

### Automated Testing

```typescript
// Example test
describe('Basic Auth', () => {
  it('should require authentication', async () => {
    const response = await request(app)
      .get('/api/auth/basic-auth-test');
    
    expect(response.status).toBe(401);
  });

  it('should allow access with valid credentials', async () => {
    const credentials = Buffer.from('admin:admin123').toString('base64');
    
    const response = await request(app)
      .get('/api/auth/basic-auth-test')
      .set('Authorization', `Basic ${credentials}`);
    
    expect(response.status).toBe(200);
    expect(response.body.user).toBe('admin');
  });
});
```

## Troubleshooting

### Common Issues

1. **401 Unauthorized**: Check that credentials are correctly encoded
2. **Missing WWW-Authenticate header**: Ensure the middleware is properly configured
3. **CORS issues**: Make sure CORS is configured to allow Authorization headers

### Debug Tips

```typescript
// Add logging to debug auth issues
console.log('Auth header:', req.headers.authorization);
console.log('Decoded credentials:', Buffer.from(base64Credentials, 'base64').toString('ascii'));
```

## References

- [RFC 7617 - The 'Basic' HTTP Authentication Scheme](https://tools.ietf.org/html/rfc7617)
- [MDN Basic Authentication](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication)
- [Basic Auth Header Generator](https://www.debugbear.com/basic-auth-header-generator)
