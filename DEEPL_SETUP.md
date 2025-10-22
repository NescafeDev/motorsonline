# DeepL Translation Setup

This project now includes automatic translation functionality for the Privacy page using the DeepL API.

## Setup Instructions

### 1. Get DeepL API Key

1. Visit [DeepL API](https://www.deepl.com/pro-api)
2. Sign up for a free account (500,000 characters/month free)
3. Get your API key from the dashboard

### 2. Configure Environment Variables

Create a `.env` file in the project root with the following content:

```env
# DeepL API Configuration
DEEPL_API_KEY=your_deepl_api_key_here

# Other existing environment variables...
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=your_database_name
PORT=8080
NODE_ENV=development
```

### 3. How It Works

- The Privacy page content is stored in Estonian (Eesti) in the database
- When a user selects a different language from the LanguageDropdown, the page automatically translates the content using DeepL API
- The translation happens server-side for better performance and security
- If translation fails, the original Estonian content is displayed

### 4. Supported Languages

The system supports translation between:
- Estonian (ee) - Default/source language
- English (en)
- Russian (ru) 
- German (de)
- Finnish (fi)

### 5. API Usage

The translation is triggered when:
- User changes language in the LanguageDropdown component
- The Privacy page loads with a non-Estonian language selected
- The server automatically translates the content before sending it to the client

### 6. Error Handling

- If DeepL API is not configured, original content is returned
- If translation fails, original content is returned
- All errors are logged to the server console

## Testing

1. Start the development server: `npm run dev`
2. Navigate to the Privacy page
3. Change the language using the LanguageDropdown
4. The content should automatically translate to the selected language

## Cost Considerations

- DeepL free tier: 500,000 characters per month
- Each translation request counts toward your monthly limit
- Consider caching translations for frequently accessed content
