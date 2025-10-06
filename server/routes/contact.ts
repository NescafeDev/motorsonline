import express from 'express';
import jwt from 'jsonwebtoken';
import { createContact, updateContact, getContactByCarId, deleteContact } from '../models/contact';

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
    const contact = await createContact(req.body);
    console.log('Contact created successfully:', contact);
    res.status(201).json(contact);
  } catch (err: any) {
    console.error('Contact creation error:', err);
    res.status(400).json({ message: 'Contact creation failed.', error: err.message });
  }
});

// Get contact by car ID
router.get('/car/:carId', async (req, res) => {
  try {
    const carId = parseInt(req.params.carId);
    console.log('Fetching contact for car ID:', carId);
    const contact = await getContactByCarId(carId);
    console.log('Contact found:', contact);
    if (!contact) {
      console.log('No contact found for car ID:', carId);
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json(contact);
  } catch (err: any) {
    console.error('Get contact error:', err);
    res.status(400).json({ message: 'Failed to get contact.', error: err.message });
  }
});

// Update contact
router.put('/car/:carId', authenticateToken, async (req, res) => {
  try {
    const carId = parseInt(req.params.carId);
    const success = await updateContact(carId, req.body);
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
router.delete('/car/:carId', authenticateToken, async (req, res) => {
  try {
    const carId = parseInt(req.params.carId);
    const success = await deleteContact(carId);
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
