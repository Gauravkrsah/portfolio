import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Send, X, Bot, User, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ChatPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const initialMessages: Message[] = [
  {
    id: 1,
    text: "Hi there! I'm Gaurav's virtual assistant. How can I help you today?",
    sender: 'bot',
    timestamp: new Date()
  }
];

const ChatPopup: React.FC<ChatPopupProps> = ({ open, onOpenChange }) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const clearConversation = () => {
    setMessages(initialMessages);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (open) {
      scrollToBottom();
    }
  }, [messages, open]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    
    // Simulate bot response
    setTimeout(() => {
      const botResponses = [
        "Thanks for your message! Gaurav will get back to you soon.",
        "I'll make sure Gaurav sees this.",
        "Great question! Let me find the best answer for you.",
        "I've noted your message and will pass it along to Gaurav.",
        "Thanks for reaching out! Is there anything else you'd like to know?",
        "Let me check my knowledge base for that information.",
        "That's an interesting question! Let me help you with that.",
        "I'm here to assist with any questions about Gaurav's work.",
      ];
      
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      
      const botMessage: Message = {
        id: messages.length + 2,
        text: randomResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 bg-gradient-to-br from-[#151515] to-neutral-900 border border-[#FFB600]/30 shadow-xl max-h-[80vh] flex flex-col rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-[#FFB600]/40 to-[#e2eeff]/40 p-3 border-b border-neutral-800 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-[#FFB600] to-[#e2eeff]">
              <Bot className="h-4 w-4 text-[#151515]" />
            </div>
            <div>
              <h3 className="text-white font-medium text-sm">Chat with Gaurav</h3>
              <div className="flex items-center text-green-400 text-xs">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1"></span>
                Online now
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={clearConversation}
              className="p-1 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-red-400 transition-colors"
              title="Clear conversation"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <button 
              onClick={() => onOpenChange(false)}
              className="p-1 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gradient-to-b from-neutral-950 to-neutral-900">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
            >
              <div className="flex gap-2 max-w-[85%]">
                {message.sender === 'bot' && (
                  <div className="flex-shrink-0 h-7 w-7 rounded-full bg-gradient-to-br from-[#FFB600] to-[#e2eeff] flex items-center justify-center self-end">
                    <Bot className="h-3.5 w-3.5 text-[#151515]" />
                  </div>
                )}
                
                <div 
                  className={`p-2.5 rounded-xl ${
                    message.sender === 'user' 
                      ? 'bg-gradient-to-r from-[#FFB600] to-[#e2eeff] text-[#151515] font-medium rounded-tr-none' 
                      : 'bg-gradient-to-r from-neutral-800 to-neutral-700 text-white rounded-tl-none'
                  }`}
                >
                  <p className="text-xs">{message.text}</p>
                  <p className={`text-[10px] mt-1 ${message.sender === 'user' ? 'text-[#151515]/70' : 'text-neutral-400'}`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
                
                {message.sender === 'user' && (
                  <div className="flex-shrink-0 h-7 w-7 rounded-full bg-gradient-to-br from-[#FFB600] to-[#e2eeff] flex items-center justify-center self-end">
                    <User className="h-3.5 w-3.5 text-[#151515]" />
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start animate-fade-in">
              <div className="flex gap-2">
                <div className="flex-shrink-0 h-7 w-7 rounded-full bg-gradient-to-br from-[#FFB600] to-[#e2eeff] flex items-center justify-center self-end">
                  <Bot className="h-3.5 w-3.5 text-[#151515]" />
                </div>
                
                <div className="bg-gradient-to-r from-neutral-800 to-neutral-700 text-white p-2.5 rounded-xl rounded-tl-none">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-neutral-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-neutral-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-neutral-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        <form onSubmit={handleSendMessage} className="border-t border-neutral-800 p-3 bg-neutral-900/50">
          <div className="flex items-center space-x-1.5">
            <Input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-3 py-1.5 h-9 rounded-full border border-neutral-700 bg-neutral-800/50 text-xs text-white focus:ring-1 focus:ring-[#FFB600] placeholder:text-neutral-500"
            />
            <Button
              type="submit"
              disabled={!inputValue.trim()}
              className="p-1.5 rounded-full bg-[#FFB600] hover:bg-[#FFB600]/90 text-[#151515] transition-colors disabled:opacity-70 disabled:bg-neutral-700 h-9 w-9"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChatPopup;
