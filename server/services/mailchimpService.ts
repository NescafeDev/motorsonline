import axios from 'axios';

export interface MailchimpConfig {
  apiKey: string;
  serverPrefix: string; // e.g., 'us1', 'us2', etc.
  listId: string;
}

export interface SubscriptionRequest {
  email: string;
  firstName?: string;
  lastName?: string;
  tags?: string[];
}

export interface SubscriptionResponse {
  success: boolean;
  message: string;
  memberId?: string;
}

export class MailchimpService {
  private config: MailchimpConfig;
  private baseUrl: string;

  constructor() {
    // Get configuration from environment variables
    this.config = {
      apiKey: process.env.MAILCHIMP_API_KEY || '',
      serverPrefix: process.env.MAILCHIMP_SERVER_PREFIX || 'us1',
      listId: process.env.MAILCHIMP_LIST_ID || ''
    };
    
    this.baseUrl = `https://${this.config.serverPrefix}.api.mailchimp.com/3.0`;
    
    if (!this.config.apiKey || !this.config.listId) {
      console.warn('Mailchimp configuration incomplete. Please set MAILCHIMP_API_KEY, MAILCHIMP_SERVER_PREFIX, and MAILCHIMP_LIST_ID environment variables.');
    }
  }

  /**
   * Check if Mailchimp is properly configured
   */
  isConfigured(): boolean {
    return !!(this.config.apiKey && this.config.serverPrefix && this.config.listId);
  }

  /**
   * Subscribe an email to the Mailchimp list
   */
  async subscribe(request: SubscriptionRequest): Promise<SubscriptionResponse> {
    if (!this.isConfigured()) {
      throw new Error('Mailchimp is not properly configured');
    }

    try {
      // Create member data
      const memberData = {
        email_address: request.email,
        status: 'subscribed',
        merge_fields: {
          FNAME: request.firstName || '',
          LNAME: request.lastName || ''
        },
        tags: request.tags || []
      };

      // Make API call to Mailchimp
      const response = await axios.post(
        `${this.baseUrl}/lists/${this.config.listId}/members`,
        memberData,
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        message: 'Successfully subscribed to newsletter',
        memberId: response.data.id
      };

    } catch (error: any) {
      console.error('Mailchimp subscription error:', error.response?.data || error.message);
      
      // Handle specific Mailchimp errors
      if (error.response?.status === 400) {
        const errorData = error.response.data;
        if (errorData.title === 'Member Exists') {
          return {
            success: false,
            message: 'This email is already subscribed to our newsletter'
          };
        }
        return {
          success: false,
          message: errorData.detail || 'Invalid email address'
        };
      }

      return {
        success: false,
        message: 'Failed to subscribe. Please try again later.'
      };
    }
  }

  /**
   * Check if an email is already subscribed
   */
  async checkSubscription(email: string): Promise<boolean> {
    if (!this.isConfigured()) {
      throw new Error('Mailchimp is not properly configured');
    }

    try {
      // Create MD5 hash of email (Mailchimp requirement)
      const crypto = require('crypto');
      const emailHash = crypto.createHash('md5').update(email.toLowerCase()).digest('hex');

      const response = await axios.get(
        `${this.baseUrl}/lists/${this.config.listId}/members/${emailHash}`,
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`
          }
        }
      );

      return response.data.status === 'subscribed';
    } catch (error: any) {
      if (error.response?.status === 404) {
        return false; // Email not found, not subscribed
      }
      throw error;
    }
  }

  /**
   * Unsubscribe an email from the list
   */
  async unsubscribe(email: string): Promise<SubscriptionResponse> {
    if (!this.isConfigured()) {
      throw new Error('Mailchimp is not properly configured');
    }

    try {
      const crypto = require('crypto');
      const emailHash = crypto.createHash('md5').update(email.toLowerCase()).digest('hex');

      await axios.patch(
        `${this.baseUrl}/lists/${this.config.listId}/members/${emailHash}`,
        {
          status: 'unsubscribed'
        },
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        message: 'Successfully unsubscribed from newsletter'
      };
    } catch (error: any) {
      console.error('Mailchimp unsubscribe error:', error.response?.data || error.message);
      return {
        success: false,
        message: 'Failed to unsubscribe. Please try again later.'
      };
    }
  }
}

// Export singleton instance
export const mailchimpService = new MailchimpService();

