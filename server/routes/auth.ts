import express from 'express';
import jwt from 'jsonwebtoken';
import { createUser, findUserByEmail, validatePassword } from '../models/user';
import { OAuth2Client } from 'google-auth-library';
import { createJwt } from '../utils';
import { basicAuth, generateBasicAuthHeader } from '../middleware/basicAuth';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

const GOOGLE_CLIENT_ID = "604481839237-v5sgfq8jli9es2t6r9o82enqnpmdfa2q.apps.googleusercontent.com";
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, admin , userType} = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    const existing = await findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ message: 'Email already in use.' });
    }
    const user = await createUser(name, email, password, admin, userType);
    res.status(201).json({ id: user.id, name: user.name, email: user.email, admin: user.admin, userType: user.userType });
  } catch (err: any) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Signup failed.', error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required.' });
    }
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const valid = await validatePassword(user, password);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const token = jwt.sign({ id: user.id, email: user.email, admin: user.admin, userType: user.userType }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, admin: user.admin, userType: user.userType } });
  } catch (err: any) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Login failed.', error: err.message });
  }
});

// Google
router.post('/google', async (req, res) => {
  try {
    const { name, email } = req.body;
    console.log('email:', email);
    console.log('name:', name);

    // Check if user exists
    let user = await findUserByEmail(email);
    if (!user) {
      user = await createUser(name, email, '', false, 'user');
    }

    const token = jwt.sign({ id: user.id, email: user.email, admin: user.admin, userType: user.userType }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, admin: user.admin, userType: user.userType } });
  } catch (err: any) {
    console.error('Google auth error:', err);
    res.status(500).json({ message: 'Google authentication failed.', error: err.message });
  }
});

// Basic Auth protected route example
// This route requires Basic Authentication
// In production, use environment variables for credentials
const basicAuthUsers = {
  [process.env.BASIC_AUTH_ADMIN_USER || 'admin']: process.env.BASIC_AUTH_ADMIN_PASS || 'admin123',
  [process.env.BASIC_AUTH_USER_USER || 'user']: process.env.BASIC_AUTH_USER_PASS || 'user123',
  [process.env.BASIC_AUTH_TEST_USER || 'test']: process.env.BASIC_AUTH_TEST_PASS || 'test123'
};

router.get('/basic-auth-test', basicAuth({
  users: basicAuthUsers,
  realm: 'API Access',
  message: 'Please provide valid credentials'
}), (req, res) => {
  // This route is now protected by Basic Auth
  const user = (req as any).user;
  res.json({ 
    message: 'Successfully authenticated with Basic Auth',
    user: user.username,
    timestamp: new Date().toISOString()
  });
});

// Generate Basic Auth header endpoint (for testing)
router.post('/generate-basic-auth', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ 
      error: 'Username and password are required' 
    });
  }

  const authHeader = generateBasicAuthHeader(username, password);
  
  res.json({
    username,
    authHeader,
    usage: {
      curl: `curl -H "Authorization: ${authHeader}" http://localhost:8080/api/auth/basic-auth-test`,
      javascript: `fetch('/api/auth/basic-auth-test', {
        headers: {
          'Authorization': '${authHeader}'
        }
      })`
    }
  });
});

export default router; 