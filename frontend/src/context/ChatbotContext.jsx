import React, { createContext, useState, useCallback } from 'react';
import api from '../services/api';

const ChatbotContext = createContext();

export const useChatbot = () => {
  const context = React.useContext(ChatbotContext);
  if (!context) {
    throw new Error('useChatbot must be used within ChatbotProvider');
  }
  return context;
};

export const ChatbotProvider = ({ children }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      text: 'Hello! I am your SpectraVision Assistant. How can I help you with your spectral analysis today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = useCallback(async (userMessage) => {
    if (!userMessage.trim()) return;

    const userMsg = {
      id: Date.now(),
      type: 'user',
      text: userMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const response = await api.post('/chatbot/chat', { message: userMessage });

      const aiMsg = {
        id: Date.now() + 1,
        type: 'ai',
        text: response.data.response || "I'm still learning. Could you rephrase that?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      const errorMsg = {
        id: Date.now() + 1,
        type: 'ai',
        text: 'Sorry, I encountered an error. Please try again or check if the chatbot service is available.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true,
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  }, []);

  const clearChatbot = useCallback(() => {
    setMessages([
      {
        id: 1,
        type: 'ai',
        text: 'Hello! I am your SpectraVision Assistant. How can I help you with your spectral analysis today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  }, []);

  return (
    <ChatbotContext.Provider
      value={{
        messages,
        isTyping,
        sendMessage,
        clearChatbot,
        setMessages,
      }}
    >
      {children}
    </ChatbotContext.Provider>
  );
};