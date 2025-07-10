import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, User, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';

const pageVariants = {
  initial: {
    opacity: 0,
  },
  in: {
    opacity: 1,
  },
  out: {
    opacity: 0,
  },
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5,
};

const Chat: React.FC = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'bot'; content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatId, setChatId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedChatId = localStorage.getItem('chatId');
    if (savedChatId) {
      setChatId(parseInt(savedChatId, 10));
      const savedChatHistory = localStorage.getItem(`chatHistory_${savedChatId}`);
      if (savedChatHistory) {
        setChatHistory(JSON.parse(savedChatHistory));
      }
    }
  }, []);

  useEffect(() => {
    if (chatId) {
      localStorage.setItem('chatId', chatId.toString());
      localStorage.setItem(`chatHistory_${chatId}`, JSON.stringify(chatHistory));
    }
  }, [chatId, chatHistory]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const newChatHistory = [...chatHistory, { role: 'user', content: message }];
    setChatHistory(newChatHistory);
    setMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, chatId }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from the bot.');
      }

      const data = await response.json();
      setChatHistory((prevHistory) => [...prevHistory, { role: 'bot', content: data.reply }]);
      if (data.chatId) {
        setChatId(data.chatId);
      }
    } catch (error) {
      console.error(error);
      setChatHistory((prevHistory) => [...prevHistory, { role: 'bot', content: 'An error occurred. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      <div className="flex flex-col h-[calc(100vh-4rem)] bg-dark-bg text-dark-text p-4">
        <div className="flex-1 overflow-y-auto p-4 rounded-lg bg-dark-card shadow-lg mb-4 custom-scrollbar">
          <div className="max-w-3xl mx-auto">
            {chatHistory.map((chat, index) => (
              <div key={index} className={cn(
                "flex mb-4 animate-fade-in",
                chat.role === 'user' ? 'justify-end' : 'justify-start'
              )}>
                {chat.role === 'bot' && (
                  <div className="flex-shrink-0 mr-3 mt-1">
                    <Bot className="h-8 w-8 text-accent-green" />
                  </div>
                )}
                <div className={cn(
                  "relative max-w-[75%]",
                  chat.role === 'user' ? 'ml-auto' : 'mr-auto'
                )}>
                  <div className={cn(
                    "rounded-lg px-4 py-2 break-words border border-dark-muted/30 shadow-md transition-all duration-200 md:hover:shadow-glow-green data-hover-target",
                    chat.role === 'user'
                      ? 'bg-accent-green text-white'
                      : 'bg-dark-muted/20 text-dark-text'
                  )} data-faint-green-hover="true">
                    {chat.role === 'user' ? <div>{chat.content}</div> : <div className="prose prose-invert max-w-none"><ReactMarkdown>{chat.content}</ReactMarkdown></div>}
                  </div>
                  {chat.role === 'user' ? (
                    <div className="absolute right-[-6px] top-1/2 w-0 h-0 border-t-8 border-t-transparent border-l-8 border-l-accent-green border-b-8 border-b-transparent transform -translate-y-1/2"></div>
                  ) : (
                    <div className="absolute left-[-6px] top-1/2 w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-dark-muted/20 border-b-8 border-b-transparent transform -translate-y-1/2"></div>
                  )}
                </div>
                {chat.role === 'user' && (
                  <div className="flex-shrink-0 ml-3 mt-1">
                    <User className="h-8 w-8 text-accent-blue" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start mb-4 animate-fade-in">
                <div className="flex-shrink-0 mr-3 mt-1">
                  <Bot className="h-8 w-8 text-accent-green" />
                </div>
                <div className="rounded-lg px-4 py-2 bg-dark-muted/20 text-dark-text">
                  <div className="flex items-center space-x-1">
                    <span className="dot-flashing"></span>
                    <span className="dot-flashing dot-flashing-2"></span>
                    <span className="dot-flashing dot-flashing-3"></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
        <div className="p-4 bg-dark-card rounded-lg shadow-lg">
          <div className="max-w-3xl mx-auto flex space-x-2">
            <Input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..."
              className="flex-1 bg-gray-800 border-gray-600 text-white placeholder-gray-300 focus:border-accent-green h-12 data-hover-target" data-input-hover="true"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              className="bg-accent-green hover:bg-accent-green/80 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
              disabled={isLoading}
            >
              <Send className="h-5 w-5" />
            </Button>
            <Button
              onClick={() => {
                setChatId(null);
                setChatHistory([]);
                localStorage.removeItem('chatId');
                localStorage.removeItem(`chatHistory_${chatId}`);
              }}
              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
            >
              New Chat
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Chat;