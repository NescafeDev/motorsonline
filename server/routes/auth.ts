import express from 'express';
import jwt from 'jsonwebtoken';
import { createUser, findUserByEmail, validatePassword } from '../models/user';
import { OAuth2Client } from 'google-auth-library';
import { createJwt } from '../utils';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

const GOOGLE_CLIENT_ID = "521647250819-cjp9msd6vksihvkmbb77inp3omvkq9ga.apps.googleusercontent.com";
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

// Signup
router.post('/signup', async (req, res) => {
  const { name, email, password, admin } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  const existing = await findUserByEmail(email);
  if (existing) {
    return res.status(409).json({ message: 'Email already in use.' });
  }
  const user = await createUser(name, email, password, admin);
  res.status(201).json({ id: user.id, name: user.name, email: user.email, admin: user.admin });
});

// Login
router.post('/login', async (req, res) => {
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
  const token = jwt.sign({ id: user.id, email: user.email, admin: user.admin }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, admin: user.admin } });
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
      user = await createUser(name, email, '', false);
    }

    const token = jwt.sign({ id: user.id, email: user.email, admin: user.admin }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, admin: user.admin } });
  } catch (err) {
    console.error(err);
  }
})

export default router; 