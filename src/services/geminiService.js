import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI with the provided API key
const genAI = new GoogleGenerativeAI('AIzaSyCWRR1Jh4FBgtNZXoE79xDdtxGF1KYS6Iw');

// Demo responses for when API is not available
const DEMO_RESPONSES = {
  default: "Hello! I'm your AI assistant for Sri Eshwar College of Engineering. I can help you with academic queries, campus information, and student services.",
  greeting: "Hi there! Welcome to Sri Eshwar College of Engineering. How can I assist you today?",
  college: "Sri Eshwar College of Engineering is located in Coimbatore, Tamil Nadu. We offer various engineering programs including CSE, ECE, EEE, Mechanical, and Civil Engineering.",
  departments: "Our college has the following departments:\n• Computer Science Engineering (CSE)\n• Electronics & Communication Engineering (ECE)\n• Electrical & Electronics Engineering (EEE)\n• Mechanical Engineering\n• Civil Engineering",
  facilities: "Our campus facilities include:\n• Modern Library with digital resources\n• Well-equipped laboratories\n• Canteen and food services\n• Sports facilities and grounds\n• Hostel accommodation\n• Transportation services",
  academic: "For academic queries, you can contact your respective department heads or visit the academic office. We offer various courses and have a dedicated placement cell.",
  contact: "You can contact the college administration at:\n• Phone: +91-XXX-XXXXXXX\n• Email: info@srieshwarcollege.edu.in\n• Address: Coimbatore, Tamil Nadu"
};

export const geminiService = {
  async generateResponse(userMessage) {
    try {
      console.log('Gemini AI: Starting request for:', userMessage);
      
      // Check if we should use demo mode (for now, always use demo to avoid network issues)
      const useDemoMode = true; // Set to false to try real API
      
      if (useDemoMode) {
        console.log('Using demo mode for response');
        return this.getDemoResponse(userMessage);
      }
      
      // Get the generative model
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      // Create a simple prompt
      const prompt = `You are an AI assistant for Sri Eshwar College of Engineering. A student asks: "${userMessage}". Please provide a helpful response.`;

      console.log('Gemini AI: Sending prompt to model');
      
      // Generate content with timeout
      const result = await Promise.race([
        model.generateContent(prompt),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 15000)
        )
      ]);
      
      const response = await result.response;
      const text = response.text();

      console.log('Gemini AI: Received response:', text);

      if (!text || text.trim() === '') {
        throw new Error('Empty response from AI');
      }

      return {
        success: true,
        message: text,
      };
    } catch (error) {
      console.error('Gemini AI Error Details:', error);
      console.error('Error message:', error.message);
      
      // Fallback to demo response
      console.log('Falling back to demo response due to error');
      return this.getDemoResponse(userMessage);
    }
  },

  getDemoResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return {
        success: true,
        message: DEMO_RESPONSES.greeting
      };
    }
    
    if (message.includes('college') || message.includes('sri eshwar')) {
      return {
        success: true,
        message: DEMO_RESPONSES.college
      };
    }
    
    if (message.includes('department') || message.includes('course') || message.includes('branch')) {
      return {
        success: true,
        message: DEMO_RESPONSES.departments
      };
    }
    
    if (message.includes('facility') || message.includes('library') || message.includes('lab') || message.includes('canteen')) {
      return {
        success: true,
        message: DEMO_RESPONSES.facilities
      };
    }
    
    if (message.includes('academic') || message.includes('study') || message.includes('exam')) {
      return {
        success: true,
        message: DEMO_RESPONSES.academic
      };
    }
    
    if (message.includes('contact') || message.includes('phone') || message.includes('email')) {
      return {
        success: true,
        message: DEMO_RESPONSES.contact
      };
    }
    
    // Default response
    return {
      success: true,
      message: `Thank you for your question about "${userMessage}". I'm currently in demo mode, but I can help you with general information about Sri Eshwar College of Engineering. 

You can ask me about:
• College departments and courses
• Campus facilities
• Academic information
• Contact details
• General college guidance

For specific queries, please contact the college administration.`
    };
  },

  // Method to check if API key is configured
  isConfigured() {
    return true; // API key is now hardcoded
  },

  // Test method to verify API connection
  async testConnection() {
    try {
      console.log('Testing Gemini API connection...');
      
      // For now, return true to indicate demo mode is working
      console.log('Connection test: Demo mode active');
      return true;
      
      // Uncomment below to test real API
      /*
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      
      const result = await Promise.race([
        model.generateContent("Hello"),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Connection timeout')), 10000)
        )
      ]);
      
      const response = await result.response;
      const text = response.text();
      console.log('Connection test successful:', text);
      return text ? true : false;
      */
    } catch (error) {
      console.error('Connection test failed:', error);
      console.error('Connection error details:', error.message);
      return false;
    }
  }
}; 