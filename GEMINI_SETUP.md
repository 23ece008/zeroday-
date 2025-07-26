# Gemini AI Chatbot Setup Guide

## 🚀 Getting Started with Gemini AI

The chatbot in this application is integrated with Google's Gemini AI to provide intelligent responses about Sri Eshwar College of Engineering.

### Step 1: Get Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key (it starts with `AIza...`)

### Step 2: Configure Environment Variables

1. Create a `.env` file in the project root directory
2. Add your API key:

```env
REACT_APP_GEMINI_API_KEY=your_actual_api_key_here
```

### Step 3: Restart the Application

After adding the API key, restart your development server:

```bash
npm run dev
```

### Features

✅ **College-Specific AI**: Trained on Sri Eshwar College information  
✅ **Real-time Responses**: Powered by Gemini Pro model  
✅ **Error Handling**: Graceful fallbacks if API is unavailable  
✅ **Typing Indicators**: Visual feedback during response generation  
✅ **Message History**: Timestamps and conversation tracking  

### Demo Mode

If no API key is configured, the chatbot will run in demo mode with sample responses about college services.

### Troubleshooting

- **API Key Error**: Make sure your API key is correct and has proper permissions
- **Rate Limiting**: Gemini has usage limits; wait a moment and try again
- **Network Issues**: Check your internet connection

### Security Note

Never commit your API key to version control. The `.env` file should be in your `.gitignore`. 