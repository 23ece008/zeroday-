import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import './AIChatbot.css';

const AIChatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      from: 'bot', 
      text: 'Hi! I\'m your AI assistant for Sri Eshwar College of Engineering. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [apiStatus, setApiStatus] = useState('checking');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open]);

  // Test API connection when component mounts
  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log('Testing Gemini API connection...');
        const isConnected = await geminiService.testConnection();
        setApiStatus(isConnected ? 'connected' : 'error');
        console.log('API connection status:', isConnected ? 'Connected' : 'Failed');
      } catch (error) {
        console.error('Connection test error:', error);
        setApiStatus('error');
      }
    };

    testConnection();
  }, []);

  const addMessage = (from, text, timestamp = new Date()) => {
    setMessages(prev => [...prev, { from, text, timestamp }]);
  };

  const simulateTyping = async () => {
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    setIsTyping(false);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    // Add user message immediately
    addMessage('user', userMessage);

    try {
      console.log('Sending message to Gemini:', userMessage);
      
      // Check if Gemini is configured
      if (!geminiService.isConfigured()) {
        await simulateTyping();
        addMessage('bot', `I'm currently in demo mode. In a real implementation, I would connect to Gemini AI to provide you with helpful responses about Sri Eshwar College of Engineering.

For now, here are some things I can help you with:
• Academic information and course details
• Campus facilities and services
• Student life and activities
• Technical support for college systems

To enable full AI functionality, please configure the Gemini API key.`);
        return;
      }

      // Show typing indicator
      setIsTyping(true);

      // Get response from Gemini AI
      const response = await geminiService.generateResponse(userMessage);
      console.log('Gemini response:', response);

      // Hide typing indicator
      setIsTyping(false);

      if (response.success) {
        addMessage('bot', response.message);
      } else {
        addMessage('bot', `Error: ${response.message}\n\nPlease try again or contact support if the issue persists.`);
      }

    } catch (error) {
      console.error('Chatbot error:', error);
      setIsTyping(false);
      addMessage('bot', `I apologize, but I'm experiencing technical difficulties: ${error.message}\n\nPlease try again later.`);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      <div className="ai-chatbot-fab" onClick={() => setOpen(true)} style={{ display: open ? 'none' : 'flex' }}>
        <MessageCircle size={28} />
        {apiStatus === 'error' && <div className="api-status-indicator error"></div>}
        {apiStatus === 'connected' && <div className="api-status-indicator connected"></div>}
      </div>
      {open && (
        <div className="ai-chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-title">
              <span>AI Assistant</span>
              <small>Sri Eshwar College</small>
              {apiStatus === 'checking' && <small className="status-text">Connecting...</small>}
              {apiStatus === 'connected' && <small className="status-text connected">Connected</small>}
              {apiStatus === 'error' && <small className="status-text error">Connection Error</small>}
            </div>
            <button className="close-btn" onClick={() => setOpen(false)}><X size={20} /></button>
          </div>
          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-msg ${msg.from}`}>
                <div className="message-content">{msg.text}</div>
                <div className="message-time">{formatTime(msg.timestamp)}</div>
              </div>
            ))}
            {isTyping && (
              <div className="chat-msg bot typing">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <form className="chatbot-input-row" onSubmit={handleSend}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={isLoading ? "Processing..." : "Type your message..."}
              disabled={isLoading}
              autoFocus
            />
            <button type="submit" disabled={isLoading || !input.trim()}>
              {isLoading ? <Loader2 size={18} className="spinner" /> : <Send size={18} />}
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default AIChatbot; 