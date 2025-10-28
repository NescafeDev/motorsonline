# Mailchimp Newsletter Integration Setup

This guide explains how to set up Mailchimp integration for the newsletter subscription feature.

## Prerequisites

1. A Mailchimp account (free tier available)
2. A Mailchimp audience/list created

## Setup Steps

### 1. Get Your Mailchimp API Key

1. Log in to your Mailchimp account
2. Go to **Account** > **Extras** > **API keys**
3. Click **Create A Key**
4. Copy the generated API key (format: `abc123def456ghi789-us1`)

### 2. Get Your Server Prefix

The server prefix is usually included in your API key (the part after the last dash, e.g., `us1`, `us2`, `us3`).

Alternatively, you can find it in:
- **Account** > **Extras** > **API keys** (shown next to your API key)
- Or check your Mailchimp account URL (e.g., `us1.admin.mailchimp.com`)

### 3. Get Your List ID

1. Go to **Audience** > **Settings** > **Audience name and defaults**
2. Scroll down to find your **Audience ID** (format: `a1b2c3d4e5`)

### 4. Configure Environment Variables

Add these variables to your `.env` file:

```env
# Mailchimp Configuration
MAILCHIMP_API_KEY=your_mailchimp_api_key_here
MAILCHIMP_SERVER_PREFIX=us1
MAILCHIMP_LIST_ID=your_list_id_here
```

### 5. Example Configuration

```env
MAILCHIMP_API_KEY=abc123def456ghi789-us1
MAILCHIMP_SERVER_PREFIX=us1
MAILCHIMP_LIST_ID=a1b2c3d4e5
```

## API Endpoints

Once configured, the following endpoints will be available:

- `POST /api/newsletter/subscribe` - Subscribe to newsletter
- `GET /api/newsletter/check/:email` - Check subscription status
- `POST /api/newsletter/unsubscribe` - Unsubscribe from newsletter
- `GET /api/newsletter/test` - Test Mailchimp configuration

## Testing

1. Start your server
2. Visit `http://localhost:8080/api/newsletter/test` to verify configuration
3. Test the subscription form on the blog page

## Features

- ✅ Email validation
- ✅ Duplicate subscription handling
- ✅ Success/error feedback
- ✅ Loading states
- ✅ Form validation
- ✅ Responsive design

## Troubleshooting

### Common Issues

1. **"Mailchimp is not properly configured"**
   - Check that all three environment variables are set
   - Verify the API key format
   - Ensure server prefix matches your account region

2. **"Invalid API key"**
   - Verify the API key is correct
   - Check that the server prefix matches the API key
   - Ensure the API key has the necessary permissions

3. **"List not found"**
   - Verify the List ID is correct
   - Ensure the list exists in your Mailchimp account
   - Check that the API key has access to the list

### Testing Configuration

Use the test endpoint to verify your setup:

```bash
curl http://localhost:8080/api/newsletter/test
```

Expected response:
```json
{
  "configured": true,
  "message": "Mailchimp is properly configured"
}
```

