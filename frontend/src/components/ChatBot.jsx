import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatbot } from '../context/ChatbotContext';
import {
  MessageSquare,
  Send,
  X,
  Minus,
  Sparkles,
  Bot,
  User,
  ChevronDown,
  Circle,
  RefreshCw,
} from 'lucide-react';

const ChatBot = () => {
  const { messages, isTyping, sendMessage: apiSendMessage, clearChatbot } = useChatbot();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const suggestions = [
    'How does FTIR analysis work?',
    'What polymers can be detected?',
    'How accurate is the CNN model?',
    'View project overview',
  ];

  const handleSend = async (text) => {
    const messageText = text || inputValue;
    if (!messageText.trim() || isSending) return;

    setIsSending(true);
    setInputValue('');

    try {
      await apiSendMessage(messageText);
    } catch (err) {
      console.error('Chatbot send error:', err);
      // Error is already handled in context
    } finally {
      setIsSending(false);
    }
  };

  const handleReset = () => {
    clearChatbot();
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && !isMinimized && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            className="mb-6 w-[400px] h-[600px] glass-card flex flex-col overflow-hidden shadow-[0_25px_60px_rgba(15,23,42,0.3)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.7)] border-2 border-primary-500/30 dark:border-white/10 bg-white dark:bg-dark-bg"
          >
            {/* Header */}
            <div className="p-5 bg-white dark:bg-white/[0.03] border-b-2 border-primary-500/20 dark:border-white/5 flex items-center justify-between relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 to-accent-600/10 opacity-70" />

              <div className="flex items-center gap-4 relative z-10">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-700 to-accent-700 flex items-center justify-center p-0.5 shadow-lg">
                    <div className="w-full h-full rounded-full bg-white dark:bg-dark-bg flex items-center justify-center">
                      <Bot className="w-6 h-6 text-primary-700 dark:text-primary-400" />
                    </div>
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-dark-bg rounded-full shadow-[0_0_10px_#10b981]" />
                </div>
                <div>
                  <h3 className="text-base font-black text-gray-950 dark:text-white tracking-tight">
                    AI Assistant
                  </h3>
                  <p className="text-[11px] font-black text-gray-700 dark:text-emerald-400 flex items-center gap-1.5 uppercase tracking-widest">
                    <Circle className="w-2 h-2 fill-emerald-500 text-emerald-500 animate-pulse" />
                    SYSTEM ONLINE
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 relative z-10">
                <button
                  onClick={handleReset}
                  className="p-2.5 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl text-gray-600 hover:text-gray-950 dark:hover:text-white transition-all border border-transparent hover:border-gray-200"
                  title="New Chat"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setIsMinimized(true)}
                  className="p-2.5 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl text-gray-600 hover:text-gray-950 dark:hover:text-white transition-all border border-transparent hover:border-gray-200"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2.5 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl text-gray-600 hover:text-red-600 dark:hover:text-red-400 transition-all border border-transparent hover:border-red-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-hide bg-gray-50/50 dark:bg-transparent">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, x: msg.type === 'ai' ? -15 : 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${msg.type === 'ai' ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`max-w-[85%] flex flex-col ${msg.type === 'ai' ? 'items-start' : 'items-end'}`}>
                    <div
                      className={`p-4 rounded-[1.5rem] text-sm font-bold leading-relaxed shadow-xl ${
                        msg.type === 'ai'
                          ? 'bg-white dark:bg-white/5 border-2 border-primary-500/20 dark:border-white/5 text-gray-900 dark:text-gray-200 rounded-tl-none'
                          : 'bg-primary-700 text-white rounded-tr-none shadow-[0_10px_25px_rgba(3,105,161,0.4)]'
                      } ${msg.isError ? 'border-red-500/30 bg-red-50 dark:bg-red-500/5' : ''}`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-gray-600 dark:text-gray-500 mt-2 uppercase font-black tracking-[0.2em]">
                      {msg.timestamp}
                    </span>
                  </div>
                </motion.div>
              ))}

              {(isTyping || isSending) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-white dark:bg-white/5 border-2 border-primary-500/20 p-4 rounded-[1.5rem] rounded-tl-none flex gap-1.5 items-center shadow-lg">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ y: [0, -4, 0] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: i * 0.1,
                        }}
                        className="w-2 h-2 bg-primary-700 dark:bg-primary-400 rounded-full"
                      />
                    ))}
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Footer / Input */}
            <div className="p-5 bg-white dark:bg-white/[0.02] border-t-2 border-primary-500/20 dark:border-white/5 space-y-5 shadow-2xl">
              {/* Suggestions */}
              <div className="flex gap-2.5 overflow-x-auto scrollbar-hide pb-1">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(s)}
                    className="whitespace-nowrap px-4 py-2 bg-white dark:bg-white/5 hover:bg-primary-700 hover:text-white border-2 border-primary-500/30 dark:border-white/10 rounded-full text-[10px] font-black text-primary-800 dark:text-gray-400 transition-all shrink-0 uppercase tracking-widest shadow-md hover:-translate-y-1 active:translate-y-0"
                  >
                    {s}
                  </button>
                ))}
              </div>

              <div className="relative group">
                <div className="absolute inset-0 bg-primary-600/20 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
                <div className="relative flex items-center gap-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Ask about microplastics..."
                      className="w-full bg-gray-50 dark:bg-white/5 border-2 border-primary-500/30 dark:border-white/10 rounded-2xl py-4 pl-6 pr-6 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary-500/20 text-gray-950 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-600 transition-all shadow-inner"
                    />
                  </div>
                  <button
                    onClick={() => handleSend()}
                    disabled={isSending}
                    className="p-4 bg-primary-700 hover:bg-primary-600 text-white rounded-2xl shadow-[0_10px_25px_rgba(3,105,161,0.4)] transition-all hover:-translate-y-1 active:translate-y-0 active:scale-[0.98] border-b-4 border-primary-900 disabled:opacity-50"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MINIMIZED VIEW / FLOATING BUTTON */}
      <div className="flex items-center gap-4 group">
        <motion.button
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="relative group w-14 h-14 rounded-full flex items-center justify-center shadow-[0_8px_30px_rgba(14,165,233,0.4)] group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-accent-600 rounded-full animate-pulse blur-[2px]" />
          <div className="absolute inset-1 bg-white dark:bg-dark-bg rounded-full border border-primary-500/10 dark:border-white/10 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-primary-500/5 dark:bg-primary-500/10 group-hover:bg-primary-500/20 transition-colors" />
            <Sparkles className="w-6 h-6 text-primary-600 dark:text-primary-400 group-hover:rotate-12 transition-transform" />
          </div>
          <div className="absolute top-0 right-0 w-4 h-4">
            <div className="absolute inset-0 bg-accent-500 rounded-full animate-ping opacity-75" />
            <div className="absolute inset-1 bg-accent-500 rounded-full border-2 border-white dark:border-dark-bg" />
          </div>
        </motion.button>
      </div>
    </div>
  );
};

export default ChatBot;