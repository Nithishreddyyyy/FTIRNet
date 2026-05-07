import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Send, 
  X, 
  Minus, 
  Sparkles, 
  Paperclip, 
  Bot, 
  User,
  ChevronDown,
  Circle
} from 'lucide-react';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      text: 'Hello! I am your Microplastics AI Assistant. How can I help you with your spectral analysis today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const suggestions = [
    "How does FTIR analysis work?",
    "What polymers can be detected?",
    "How accurate is the CNN model?",
    "View project overview"
  ];

  const handleSend = (text) => {
    const messageText = text || inputValue;
    if (!messageText.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI Response
    setTimeout(() => {
      const aiResponses = {
        "How does FTIR analysis work?": "FTIR analysis works by shining infrared light through a sample. Different chemical bonds absorb light at specific frequencies, creating a unique 'spectral fingerprint' for each polymer.",
        "What polymers can be detected?": "Our system currently identifies major microplastics including Polyethylene (PE), Polypropylene (PP), Polystyrene (PS), and PET with high accuracy.",
        "How accurate is the CNN model?": "The CNN model achieves a 98.4% accuracy rate on our validated dataset of microplastic spectral signatures.",
        "View project overview": "Microplastics AI is a state-of-the-art platform designed to automate the identification of marine pollutants using deep learning and spectral analysis."
      };

      const responseText = aiResponses[messageText] || "That's an interesting question regarding microplastics! I'll process that through our scientific database. Can you provide more specific details about your analysis?";

      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setIsTyping(false);
      setMessages(prev => [...prev, aiMessage]);
    }, 1500);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      
      {/* CHAT WINDOW */}
      <AnimatePresence>
        {isOpen && !isMinimized && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            className="mb-4 w-[380px] h-[550px] glass-card flex flex-col overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-white/10"
          >
            {/* Header */}
            <div className="p-4 bg-white/[0.03] border-b border-white/5 flex items-center justify-between relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-accent-500/10 opacity-50" />
               
               <div className="flex items-center gap-3 relative z-10">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center p-0.5">
                       <div className="w-full h-full rounded-full bg-dark-bg flex items-center justify-center">
                          <Bot className="w-5 h-5 text-primary-400" />
                       </div>
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-dark-bg rounded-full shadow-[0_0_8px_#10b981]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-tight">AI Assistant</h3>
                    <p className="text-[10px] text-gray-500 flex items-center gap-1">
                      <Circle className="w-1.5 h-1.5 fill-emerald-500 text-emerald-500" />
                      Active & Online
                    </p>
                  </div>
               </div>

               <div className="flex items-center gap-1 relative z-10">
                 <button 
                  onClick={() => setIsMinimized(true)}
                  className="p-2 hover:bg-white/5 rounded-lg text-gray-500 hover:text-white transition-colors"
                 >
                   <Minus className="w-4 h-4" />
                 </button>
                 <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/5 rounded-lg text-gray-500 hover:text-white transition-colors"
                 >
                   <X className="w-4 h-4" />
                 </button>
               </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
               {messages.map((msg) => (
                 <motion.div 
                   key={msg.id}
                   initial={{ opacity: 0, x: msg.type === 'ai' ? -10 : 10 }}
                   animate={{ opacity: 1, x: 0 }}
                   className={`flex ${msg.type === 'ai' ? 'justify-start' : 'justify-end'}`}
                 >
                    <div className={`max-w-[85%] flex flex-col ${msg.type === 'ai' ? 'items-start' : 'items-end'}`}>
                       <div className={`p-3 rounded-2xl text-sm leading-relaxed ${
                         msg.type === 'ai' 
                         ? 'bg-white/5 border border-white/5 text-gray-200 rounded-tl-none' 
                         : 'bg-primary-600 text-white rounded-tr-none shadow-[0_0_20px_rgba(14,165,233,0.3)]'
                       }`}>
                          {msg.text}
                       </div>
                       <span className="text-[9px] text-gray-600 mt-1 uppercase tracking-widest">{msg.timestamp}</span>
                    </div>
                 </motion.div>
               ))}
               
               {isTyping && (
                 <motion.div 
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   className="flex justify-start"
                 >
                    <div className="bg-white/5 border border-white/5 p-3 rounded-2xl rounded-tl-none flex gap-1 items-center">
                       {[0, 1, 2].map(i => (
                         <motion.div 
                           key={i}
                           animate={{ y: [0, -3, 0] }}
                           transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
                           className="w-1.5 h-1.5 bg-primary-400/50 rounded-full"
                         />
                       ))}
                    </div>
                 </motion.div>
               )}
               <div ref={messagesEndRef} />
            </div>

            {/* Footer / Input */}
            <div className="p-4 bg-white/[0.02] border-t border-white/5 space-y-4">
               {/* Suggestions */}
               <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                  {suggestions.map((s, i) => (
                    <button 
                      key={i}
                      onClick={() => handleSend(s)}
                      className="whitespace-nowrap px-3 py-1.5 bg-white/5 hover:bg-primary-500/20 border border-white/10 hover:border-primary-500/50 rounded-full text-[10px] text-gray-400 hover:text-primary-400 transition-all shrink-0"
                    >
                      {s}
                    </button>
                  ))}
               </div>

               <div className="relative group">
                  <div className="absolute inset-0 bg-primary-500/10 rounded-xl blur-md opacity-0 group-focus-within:opacity-100 transition-opacity" />
                  <div className="relative flex items-center gap-2">
                     <div className="flex-1 relative">
                        <input 
                          type="text" 
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                          placeholder="Ask about microplastics..."
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary-500/50 text-white placeholder:text-gray-600 transition-all"
                        />
                        <Paperclip className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 hover:text-gray-400 cursor-pointer" />
                     </div>
                     <button 
                        onClick={() => handleSend()}
                        className="p-3 bg-primary-600 hover:bg-primary-500 text-white rounded-xl shadow-lg transition-all active:scale-95"
                      >
                        <Send className="w-4 h-4" />
                     </button>
                  </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MINIMIZED VIEW / FLOATING BUTTON */}
      <div className="flex items-center gap-4 group">
        <AnimatePresence>
          {!isOpen && (
             <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: 20 }}
               className="bg-white/5 border border-white/10 px-4 py-2 rounded-full hidden md:block"
             >
                <p className="text-xs font-bold text-primary-400 uppercase tracking-widest">AI Assistant Online</p>
             </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="relative group w-14 h-14 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(14,165,233,0.3)] group"
        >
          {/* Animated Gradient Orb */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full animate-pulse blur-[2px]" />
          <div className="absolute inset-1 bg-dark-bg rounded-full border border-white/10 flex items-center justify-center overflow-hidden">
             <div className="absolute inset-0 bg-primary-500/10 group-hover:bg-primary-500/20 transition-colors" />
             <Sparkles className="w-6 h-6 text-primary-400 group-hover:rotate-12 transition-transform" />
          </div>
          
          {/* Notification Pulse */}
          <div className="absolute top-0 right-0 w-4 h-4">
             <div className="absolute inset-0 bg-accent-500 rounded-full animate-ping opacity-75" />
             <div className="absolute inset-1 bg-accent-500 rounded-full border-2 border-dark-bg" />
          </div>
        </motion.button>
      </div>

    </div>
  );
};

export default ChatBot;
