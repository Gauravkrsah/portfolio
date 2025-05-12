import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Send, X, Bot, User, Trash2, Calendar, MessageCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { fetchGeminiResponse } from '@/lib/geminiClient';
import SchedulePopup from '@/components/ui/SchedulePopup';
import MessagePopup from '@/components/ui/MessagePopup';

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
  const [showSchedulePopup, setShowSchedulePopup] = useState(false);
  const [showMessagePopup, setShowMessagePopup] = useState(false);
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

  function detectActions(text: string): { schedule: boolean, message: boolean } {
    const scheduleRegex = /\b(schedule|meeting|meet|book a meeting|appointment)\b/i;
    const messageRegex = /\b(message|contact|send.*message|reach out)\b/i;
    return {
      schedule: !!text.match(scheduleRegex),
      message: !!text.match(messageRegex),
    };
  }

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;
    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    try {
      const { text: geminiText } = await fetchGeminiResponse(userMessage.text);
      const reply = geminiText.trim() || 'Sorry, I could not generate a response right now.';
      const botMessage: Message = {
        id: userMessage.id + 1,
        text: reply,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: userMessage.id + 1,
          text: 'Sorry, I could not connect to Gemini. Please try again later.',
          sender: 'bot',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-w-[90vw] p-0 bg-gradient-to-br from-[#151515] to-neutral-900 border border-[#FFB600]/30 shadow-xl max-h-[70vh] flex flex-col rounded-xl overflow-hidden">
        <div className="bg-gradient-to-r from-[#FFB600]/40 to-[#e2eeff]/40 p-2 border-b border-neutral-800 flex justify-between items-center">
          <div className="flex items-center gap-1.5">
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
          <div className="flex items-center gap-1">
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
        
        <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-gradient-to-b from-neutral-950 to-neutral-900">
          {messages.map((message, idx) => {
            const isBot = message.sender === 'bot';
            const isLast = idx === messages.length - 1 && isBot;
            const actions: { schedule: boolean; message: boolean } = isBot
              ? detectActions(message.text)
              : { schedule: false, message: false };
            return (
              <div 
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
              >
                <div className="flex gap-1.5 max-w-[85%]">
                  {isBot && (
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
                    <p className="text-xs whitespace-pre-line">{message.text}</p>
                    <p className={`text-[10px] mt-1 ${message.sender === 'user' ? 'text-[#151515]/70' : 'text-neutral-400'}`}>
                      {formatTime(message.timestamp)}
                    </p>
                    {isLast && (actions.schedule || actions.message) && (
                      <div className="flex gap-2 mt-2">
                        {actions.schedule && (
                          <Button
                            size="sm"
                            className="px-2 py-1 h-7 rounded-lg bg-gradient-to-r from-[#FFB600] to-[#e2eeff] text-[#151515] font-semibold transition-colors text-xs flex items-center gap-1"
                            onClick={() => setShowSchedulePopup(true)}
                            type="button"
                          >
                            <Calendar className="h-3.5 w-3.5" />
                            Schedule Meeting
                          </Button>
                        )}
                        {actions.message && (
                          <Button
                            size="sm"
                            className="px-2 py-1 h-7 rounded-lg bg-gradient-to-r from-[#FFB600] to-[#e2eeff] text-[#151515] font-semibold transition-colors text-xs flex items-center gap-1"
                            onClick={() => setShowMessagePopup(true)}
                            type="button"
                          >
                            <MessageCircle className="h-3.5 w-3.5" />
                            Send a Message
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                  {message.sender === 'user' && (
                    <div className="flex-shrink-0 h-7 w-7 rounded-full bg-gradient-to-br from-[#FFB600] to-[#e2eeff] flex items-center justify-center self-end">
                      <User className="h-3.5 w-3.5 text-[#151515]" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          {isTyping && (
            <div className="flex justify-start animate-fade-in">
              <div className="flex gap-1.5">
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
          {/* Schedule Meeting and Message Popups */}
          <SchedulePopup open={showSchedulePopup} onOpenChange={setShowSchedulePopup} />
          <MessagePopup open={showMessagePopup} onOpenChange={setShowMessagePopup} />
        </div>
        
        <form onSubmit={handleSendMessage} className="border-t border-neutral-800 p-2 bg-neutral-900/50">
          <div className="flex items-center space-x-1">
            <Input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-2 py-1 h-8 rounded-full border border-neutral-700 bg-neutral-800/50 text-xs text-white focus:ring-1 focus:ring-[#FFB600] placeholder:text-neutral-500"
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
