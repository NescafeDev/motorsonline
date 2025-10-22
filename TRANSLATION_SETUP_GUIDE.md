# DeepL Translation Setup Guide

## Issue Identified
The translation is not working because the DeepL API key is not configured. Here's how to fix it:

## Step 1: Get DeepL API Key

1. Go to [DeepL API](https://www.deepl.com/pro-api)
2. Sign up for a free account (500,000 characters/month free)
3. Get your API key from the dashboard

## Step 2: Configure Environment Variables

Create a `.env` file in your project root with:

```env
# DeepL API Configuration
DEEPL_API_KEY=your_deepl_api_key_here

# Your existing environment variables...
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=your_database_name
PORT=8080
NODE_ENV=development
```

## Step 3: Test the Configuration

1. Start your development server: `npm run dev`
2. Visit: `http://localhost:8080/api/privacy/test-translation`
3. You should see either:
   - `{"configured": false, "message": "DeepL API key not configured..."}` (if not configured)
   - `{"configured": true, "original": "Tere, see on test.", "translated": "Hello, this is a test."}` (if working)

## Step 4: Test the Translation

1. Navigate to your Privacy page: `http://localhost:8080/ru/privacy`
2. The content should now be translated to Russian
3. Try changing languages using the LanguageDropdown

## Files Updated

✅ **Server-side:**
- `server/services/translationService.ts` - DeepL translation service
- `server/routes/privacy.ts` - Updated to handle translation with debugging

✅ **Client-side:**
- `client/pages/Privacy.tsx` - Already updated to use language parameter
- `client/pages/PrivacyMobile.tsx` - Fixed to use language parameter
- `client/pages/Terms.tsx` - Fixed to use language parameter  
- `client/pages/TermsMobile.tsx` - Fixed to use language parameter

## How It Works Now

1. **Language Selection**: When user selects a language from LanguageDropdown
2. **API Call**: Page calls `/api/privacy?lang={selectedLanguage}`
3. **Server Translation**: If language ≠ 'ee' and DeepL is configured, content is translated
4. **Content Display**: Translated content is returned and displayed

## Debugging

Check the server console for these logs:
- `Privacy API called with language: ru`
- `DeepL service configured: true/false`
- `Attempting translation to: ru`
- `Privacy translation completed, length: 1234`

## Troubleshooting

### If translation still doesn't work:

1. **Check API Key**: Visit `/api/privacy/test-translation` to verify configuration
2. **Check Console**: Look for error messages in server console
3. **Check Network**: Use browser dev tools to see if API calls are being made
4. **Check Language**: Ensure the language dropdown is actually changing the URL

### Common Issues:

- **API Key Missing**: DeepL service not configured
- **Network Issues**: DeepL API not reachable
- **Rate Limits**: Exceeded free tier limits
- **Language Codes**: Mismatch between frontend and DeepL language codes

## Cost Considerations

- DeepL free tier: 500,000 characters/month
- Each page load with translation counts toward limit
- Consider caching translations for better performance

## Next Steps After Setup

1. Test with different languages
2. Monitor API usage in DeepL dashboard
3. Consider implementing translation caching
4. Add error handling for translation failures
