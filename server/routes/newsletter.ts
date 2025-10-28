import { Router, Request, Response } from "express";
import { mailchimpService } from "../services/mailchimpService";

const router = Router();

// Subscribe to newsletter
router.post('/subscribe', async (req: Request, res: Response) => {
  try {
    const { email, firstName, lastName } = req.body;
    
    // Validate email
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ 
        success: false, 
        message: 'Email address is required' 
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please enter a valid email address' 
      });
    }

    // Check if Mailchimp is configured
    if (!mailchimpService.isConfigured()) {
      console.error('Mailchimp not configured');
      return res.status(500).json({ 
        success: false, 
        message: 'Newsletter service is temporarily unavailable' 
      });
    }

    // Subscribe to Mailchimp
    const result = await mailchimpService.subscribe({
      email: email.toLowerCase().trim(),
      firstName: firstName?.trim(),
      lastName: lastName?.trim(),
      tags: ['website', 'blog']
    });

    if (result.success) {
      res.json({
        success: true,
        message: result.message
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message
      });
    }

  } catch (error: any) {
    console.error('Newsletter subscription error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to subscribe. Please try again later.' 
    });
  }
});

// Check subscription status
router.get('/check/:email', async (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email address is required' 
      });
    }

    if (!mailchimpService.isConfigured()) {
      return res.status(500).json({ 
        success: false, 
        message: 'Newsletter service is temporarily unavailable' 
      });
    }

    const isSubscribed = await mailchimpService.checkSubscription(email);
    
    res.json({
      success: true,
      subscribed: isSubscribed
    });

  } catch (error: any) {
    console.error('Check subscription error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to check subscription status' 
    });
  }
});

// Unsubscribe from newsletter
router.post('/unsubscribe', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ 
        success: false, 
        message: 'Email address is required' 
      });
    }

    if (!mailchimpService.isConfigured()) {
      return res.status(500).json({ 
        success: false, 
        message: 'Newsletter service is temporarily unavailable' 
      });
    }

    const result = await mailchimpService.unsubscribe(email.toLowerCase().trim());

    if (result.success) {
      res.json({
        success: true,
        message: result.message
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message
      });
    }

  } catch (error: any) {
    console.error('Newsletter unsubscribe error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to unsubscribe. Please try again later.' 
    });
  }
});

// Test endpoint to check Mailchimp configuration
router.get('/test', async (req: Request, res: Response) => {
  try {
    const isConfigured = mailchimpService.isConfigured();
    
    res.json({
      configured: isConfigured,
      message: isConfigured 
        ? 'Mailchimp is properly configured' 
        : 'Mailchimp configuration missing. Please set MAILCHIMP_API_KEY, MAILCHIMP_SERVER_PREFIX, and MAILCHIMP_LIST_ID environment variables.'
    });
  } catch (error: any) {
    res.status(500).json({
      configured: false,
      message: 'Error checking Mailchimp configuration',
      error: error.message
    });
  }
});

export default router;

