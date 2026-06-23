import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Brain, Cpu } from 'lucide-react';
import api from '../services/api';

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: `Hi! I am the **SteelSense AI Assistant**. I have live access to the steel plant's database, predictions, alerts, and maintenance logs.

You can ask me questions like:
- *"What is the current status of CNC Machine A12?"*
- *"Which machines are currently at risk of failing?"*
- *"Show me the upcoming maintenance schedule."*
- *"List the temperature values of all machines."*
- *"Why is the vibration level on Conveyor Motor C21 abnormal?"*

How can I help you support Vizag Steel Plant operations today?`
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userText = inputVal;
    setInputVal('');
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setLoading(true);

    try {
      const { data } = await api.post('/assistant/chat', { message: userText });
      setMessages(prev => [...prev, { sender: 'bot', text: data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'bot', text: '⚠️ *Error connecting to AI Assistant service. Please try again.*' }]);
    } finally {
      setLoading(false);
    }
  };

  const parseBoldAndCode = (str) => {
    const parts = str.split(/(\*\*|`)/g);
    let isBold = false;
    let isCode = false;

    return parts.map((part, index) => {
      if (part === '**') {
        isBold = !isBold;
        return null;
      }
      if (part === '`') {
        isCode = !isCode;
        return null;
      }
      if (isBold) {
        return <strong key={index} className="text-white font-bold">{part}</strong>;
      }
      if (isCode) {
        return <code key={index} className="bg-white/10 px-1.5 py-0.5 rounded font-mono text-[10px] text-indigo-300">{part}</code>;
      }
      return part;
    }).filter(Boolean);
  };

  const parseMarkdown = (text) => {
    return text.split('\n').map((line, i) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('###')) {
        return <h3 key={i} className="text-sm font-bold text-indigo-400 mt-3 mb-1.5 first:mt-0">{parseBoldAndCode(trimmed.replace(/^###\s*/, ''))}</h3>;
      }
      if (trimmed.startsWith('####')) {
        return <h4 key={i} className="text-xs font-bold text-slate-300 mt-2 mb-1">{parseBoldAndCode(trimmed.replace(/^####\s*/, ''))}</h4>;
      }
      if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
        return <li key={i} className="text-xs text-slate-300 ml-4 list-disc mb-1 leading-relaxed">{parseBoldAndCode(trimmed.replace(/^[-*]\s*/, ''))}</li>;
      }
      if (trimmed === '') return <div key={i} className="h-2" />;
      return <p key={i} className="text-xs text-slate-300 leading-relaxed mb-1.5">{parseBoldAndCode(trimmed)}</p>;
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="w-80 sm:w-96 h-[500px] rounded-3xl border border-white/10 bg-[#09090b]/90 backdrop-blur-2xl shadow-2xl flex flex-col overflow-hidden mb-4"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white leading-none">SteelSense AI Assistant</h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] text-white/50 font-semibold uppercase tracking-wider">ONLINE</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 custom-scrollbar bg-white/[0.01]">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 text-sm shadow-md border ${
                      msg.sender === 'user'
                        ? 'bg-indigo-500/20 border-indigo-500/30 text-white rounded-br-none'
                        : 'bg-white/5 border-white/10 text-slate-100 rounded-bl-none'
                    }`}
                  >
                    {parseMarkdown(msg.text)}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/10 rounded-2xl rounded-bl-none p-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form
              onSubmit={handleSend}
              className="p-3 border-t border-white/10 bg-white/[0.02] flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask me about machines, telemetry or schedules..."
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                disabled={loading}
                className="flex-1 bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.05] transition-colors"
              />
              <button
                type="submit"
                disabled={!inputVal.trim() || loading}
                className="p-2 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 text-white rounded-xl transition-all shadow-[0_0_10px_rgba(99,102,241,0.3)] flex items-center justify-center"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-[0_8px_30px_rgb(99,102,241,0.4)] border border-white/10 hover:shadow-[0_8px_35px_rgb(99,102,241,0.6)] transition-all cursor-pointer"
      >
        <MessageSquare className="w-6 h-6" />
      </motion.button>
    </div>
  );
};

export default AIAssistant;
