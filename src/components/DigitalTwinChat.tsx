"use client";

import { useChat } from "@ai-sdk/react";
import { Bot, X, Send, User } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function DigitalTwinChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputLocal, setInputLocal] = useState("");
  const { messages, sendMessage, status } = useChat();
  const isLoading = status === 'submitted' || status === 'streaming';
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputLocal.trim() || isLoading) return;
    
    // Fallback TS ignore for ui SDK mismatch 
    // @ts-ignore
    sendMessage({ role: "user", content: inputLocal });
    setInputLocal("");
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              onClick={() => setIsOpen(true)}
              className="bg-brand-cyan text-background p-4 rounded-full shadow-2xl hover:bg-white hover:scale-110 transition-all duration-300 flex items-center justify-center group relative border border-white/20"
            >
              <Bot size={28} />
              <span className="absolute -top-10 right-0 bg-brand-slate text-white text-xs py-1 px-3 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Chat with my Digital Twin
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-[350px] sm:w-[400px] h-[550px] flex flex-col bg-brand-slate/95 backdrop-blur-xl border border-brand-cyan/20 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="glass-cyan p-4 flex justify-between items-center border-b border-brand-cyan/20">
              <div className="flex items-center gap-3">
                <div className="bg-brand-cyan/20 p-2 rounded-full text-brand-cyan">
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-white text-sm">J. Renato Twin <span className="text-brand-cyan text-xs font-mono ml-1">v1.0</span></h3>
                  <p className="text-xs text-brand-gray/80">Ask me about my experience</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-brand-gray hover:text-white transition-colors"
                aria-label="Close chat"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-brand-gray text-sm mt-10 space-y-4">
                  <Bot size={40} className="mx-auto text-brand-cyan/50" />
                  <p>Hello! I'm the digital twin of José Renato. How can I help you today?</p>
                </div>
              )}
              
              {messages.map((m: any) => (
                <div
                  key={m.id}
                  className={`flex gap-3 ${
                    m.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      m.role === "user" ? "bg-white/10 text-white" : "bg-brand-cyan/20 text-brand-cyan"
                    }`}
                  >
                    {m.role === "user" ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-white/10 text-white rounded-tr-sm"
                        : "glass text-brand-gray rounded-tl-sm border border-brand-cyan/10"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-3 flex-row items-center text-brand-cyan/70" data-testid="loading-indicator">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-brand-cyan/10 flex items-center justify-center">
                    <Bot size={16} />
                  </div>
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-brand-cyan rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 bg-brand-cyan rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 bg-brand-cyan rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <div className="p-4 border-t border-white/5 bg-background/50">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={inputLocal}
                  onChange={(e) => setInputLocal(e.target.value)}
                  placeholder="Ask a question..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 text-sm text-white placeholder-brand-gray/50 focus:outline-none focus:border-brand-cyan/50 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!inputLocal.trim() || isLoading}
                  className="bg-brand-cyan hover:bg-white text-background p-2 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  aria-label="Send message"
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
