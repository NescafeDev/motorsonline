import express from 'express';
import jwt from 'jsonwebtoken';
import { createContact, updateContact, getContactByUserId, deleteContact } from '../models/contact';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Middleware to authenticate token
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  console.log('Contact route auth - Auth header:', authHeader);
  console.log('Contact route auth - Token:', token);
  console.log('Contact route auth - JWT_SECRET:', JWT_SECRET);

  if (!token) {
    console.log('Contact route auth - No token provided');
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      console.log('Contact route auth - JWT verification failed:', err.message);
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    console.log('Contact route auth - JWT verification successful, user:', user);
    req.user = user;
    next();
  });
};

// Create contact
router.post('/', authenticateToken, async (req: any, res) => {
  try {
    console.log('Creating contact with data:', req.body);
    console.log('Language field type:', typeof req.body.language, 'Value:', req.body.language);
    console.log('User making request:', req.user);
    
    // Use the authenticated user's ID
    const contactData = {
      ...req.body,
      user_id: req.user.id
    };
    
    const contact = await createContact(contactData);
    console.log('Contact created successfully:', contact);
    res.status(201).json(contact);
  } catch (err: any) {
    console.error('Contact creation error:', err);
    res.status(400).json({ message: 'Contact creation failed.', error: err.message });
  }
});

// Get contact by authenticated user
router.get('/user', authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user.id;
    console.log('Fetching contact for user ID:', userId);
    const contact = await getContactByUserId(userId);
    console.log('Contact found:', contact);
    if (!contact) {
      console.log('No contact found for user ID:', userId);
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json(contact);
  } catch (err: any) {
    console.error('Get contact error:', err);
    res.status(400).json({ message: 'Failed to get contact.', error: err.message });
  }
});

// Get contact by user ID (public endpoint for car pages)
router.get('/user/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    console.log('Fetching contact for user ID:', userId);
    const contact = await getContactByUserId(userId);
    console.log('Contact found:', contact);
    if (!contact) {
      console.log('No contact found for user ID:', userId);
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json(contact);
  } catch (err: any) {
    console.error('Get contact error:', err);
    res.status(400).json({ message: 'Failed to get contact.', error: err.message });
  }
});

// Update contact
router.put('/user', authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const success = await updateContact(userId, req.body);
    if (!success) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json({ message: 'Contact updated successfully' });
  } catch (err: any) {
    console.error('Contact update error:', err);
    res.status(400).json({ message: 'Contact update failed.', error: err.message });
  }
});

// Delete contact
router.delete('/user', authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const success = await deleteContact(userId);
    if (!success) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json({ message: 'Contact deleted successfully' });
  } catch (err: any) {
    console.error('Contact deletion error:', err);
    res.status(400).json({ message: 'Contact deletion failed.', error: err.message });
  }
});

export default router;
