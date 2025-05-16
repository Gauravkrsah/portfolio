import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Send, X, Bot, User, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { fetchGeminiResponse } from '@/lib/geminiClient';

interface ChatPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenMeetingPopup: () => void;
  onOpenSubscribePopup: () => void;
  onOpenMessagePopup: () => void;
}

interface ActionButton {
  label: string;
  onClick: () => void;
}

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  actions?: ActionButton[];
}

const initialMessages: Message[] = [
  {
    id: 1,
    text: "Welcome! I'm Gaurav's professional assistant. I can help you explore Gaurav's portfolio, schedule a meeting, discuss project opportunities, or answer any questions about his work and expertise in UI/UX design, web development, and digital marketing.",
    sender: 'bot',
    timestamp: new Date()
  }
];

const ChatPopup: React.FC<ChatPopupProps> = ({
  open,
  onOpenChange,
  onOpenMeetingPopup,
  onOpenSubscribePopup,
  onOpenMessagePopup
}) => {
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
  // Returns { text: string, actions?: ActionButton[] } for a given user text
  function detectIntentActions(userText: string): { botText?: string; actions?: ActionButton[] } {
    const text = userText.toLowerCase();
    
    // Meeting/Call intent detection - more comprehensive patterns
    if (
      /(set|book|schedule|arrange|plan|setup|organize)[^\w]? ?(a |an )?(meeting|appointment|call|chat|session|consultation|interview|time)/i.test(text) ||
      /\bmeeting\b|\bappointment\b|\bcalendar\b|\bcall\b|\binterview\b|\btalk to (you|gaurav)\b|\bmeet (you|gaurav)\b/i.test(text) ||
      /\bwhen (are|can|could) (you|gaurav) (available|free)\b/i.test(text) ||
      /\b(your|gaurav'?s?) availability\b/i.test(text) ||
      /\b(i (want|would like) to|let'?s) (meet|talk|discuss|chat)\b/i.test(text)
    ) {      return {
        botText: "I'd be happy to help you schedule a meeting with Gaurav. You can use his calendar to find a convenient time slot that works for your discussion:",
        actions: [{ label: 'Schedule Meeting', onClick: onOpenMeetingPopup }]
      };
    }
      // Subscribe intent detection
    if (
      /\b(subscribe|subscription|newsletter|notifications|updates|alert|follow|news|keep (me )?updated|notify me)\b/i.test(text) ||
      /\b(want|get|receive) (to )?(receive )?(regular |occasional )?(updates|newsletter|emails|notifications)\b/i.test(text) ||
      /\b(email( me)?|send me) (when|about|regarding).*new\b/i.test(text)
    ) {
      return {
        botText: "You can subscribe to receive updates about Gaurav's latest projects, articles, and professional insights. The newsletter includes exclusive content not published elsewhere:",
        actions: [{ label: 'Subscribe', onClick: onOpenSubscribePopup }]
      };
    }
      // Message/Contact intent detection
    if (
      /\b(message|contact|email|reach out|get in touch|connect|write to|communicate|ping|send (a|an)? (message|email))\b/i.test(text) ||
      /\bhow (can|do) (i|we) (reach|contact|get a hold of|connect with) (you|gaurav)\b/i.test(text) ||
      /\b(your|gaurav'?s?) (email|contact|information)\b/i.test(text) ||
      /\blet'?s (connect|chat|talk|discuss)\b/i.test(text) ||
      /\b(i (want|would like) to|let'?s) (send|write) (you|gaurav) (a|an)? (message|email)\b/i.test(text)
    ) {
      return {
        botText: "I'd be happy to help you get in touch with Gaurav. You can send him a detailed message through our secure contact form:",
        actions: [{ label: 'Send Message', onClick: onOpenMessagePopup }]
      };
    }
    
    return {};
  }  const handleBotResponse = async (userMessage: string, alreadyHandledIntent?: boolean) => {
    setIsTyping(true);
    try {
      // If we already detected an intent, provide a professional follow-up rather than calling Gemini
      if (alreadyHandledIntent) {
        // Skip adding response if we already handled the intent - just use a professional follow-up
        const botMessage: Message = {
          id: messages.length + 2,
          text: "Is there anything else you'd like to know about Gaurav's work, expertise, or services? I'm here to assist you with any questions.",
          sender: 'bot',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
        return;
      }
      
      // Call Gemini for non-intent messages with retry logic built-in
      console.log('Sending message to Gemini API:', userMessage.substring(0, 30) + '...');
      const response = await fetchGeminiResponse(userMessage);
      console.log('Received response from Gemini API');
      let botText = response.text || 'I apologize, but I\'m unable to provide an answer at the moment. Please try rephrasing your question or ask me something else.';
      // Add action buttons to Gemini responses based on content heuristics
      let actions: ActionButton[] | undefined = undefined;
      
      // Check for potential intent actions in Gemini responses
      if (/meet|schedule|book|calendar|appointment|call|set up a time|let'?s talk/i.test(botText)) {
        actions = [{ label: 'Schedule Meeting', onClick: onOpenMeetingPopup }];
      }
      // Check for message/contact related content
      else if (/message|contact|email|reach out|get in touch/i.test(botText)) {
        actions = [{ label: 'Send Message', onClick: onOpenMessagePopup }];
      }
      // Check for subscribe/newsletter related content
      else if (/subscribe|newsletter|updates|notification/i.test(botText)) {
        actions = [{ label: 'Subscribe', onClick: onOpenSubscribePopup }];
      }
      
      // Professional response enhancement - clean up text, ensure proper grammar and professional tone
      botText = botText
        .replace(/^(sorry|i apologize|unfortunately)/i, "I apologize,")
        .replace(/can't|cannot/i, "cannot")
        .replace(/don't|do not/i, "do not")
        .replace(/won't|will not/i, "will not")
        .replace(/\bi\b/g, "I")
        .replace(/\s{2,}/g, " ")
        .trim();
      
      if (botText.length > 500) {
        botText = botText.substring(0, 500) + "...";
      }
      
      const botMessage: Message = {
        id: messages.length + 2,
        text: botText,
        sender: 'bot',
        timestamp: new Date(),
        actions
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error getting response from Gemini:', error);
      const errorMessage: Message = {
        id: messages.length + 2,
        text: 'I apologize, but I\'m currently experiencing some technical difficulties. To ensure you receive the assistance you need, would you like to schedule a meeting with Gaurav or send him a direct message?',
        sender: 'bot',
        timestamp: new Date(),
        actions: [
          { label: 'Schedule Meeting', onClick: onOpenMeetingPopup },
          { label: 'Send Message', onClick: onOpenMessagePopup }
        ]
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    
    // Store user message to pass to functions
    const userText = userMessage.text;
    
    // Simulate typing delay for more natural conversation flow
    const typingDelay = Math.min(1000, Math.max(500, userText.length * 20));
    
    // Action/intent detection BEFORE Gemini API call
    const intentResult = detectIntentActions(userText);
    
    setTimeout(() => {
      if (intentResult.actions) {
        // Add a bot message for intent action
        setMessages(prev => [
          ...prev,
          {
            id: prev.length + 2,
            text: intentResult.botText || 'Here is what you can do:',
            sender: 'bot',
            timestamp: new Date(),
            actions: intentResult.actions
          }
        ]);
        
        // Still call Gemini but with a flag so it knows we already handled the primary intent
        // This allows it to provide additional contextual information if needed
        setTimeout(() => handleBotResponse(userText, true), 300);
      } else {
        // No specific intent detected, let Gemini handle the full response
        handleBotResponse(userText, false);
      }
    }, typingDelay);
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
            <div>              <h3 className="text-white font-medium text-sm">Gaurav's Assistant</h3>
              <div className="flex items-center text-green-400 text-xs">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1"></span>
                Available to assist
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
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
            >
              <div className="flex gap-1.5 max-w-[85%]">
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
                  <p className="text-xs whitespace-pre-wrap">{message.text}</p>
                  {message.actions && (
                    <div className="mt-2 flex space-x-2">
                      {message.actions.map((action, idx) => (
                        <Button
                          key={idx}
                          variant="outline"
                          size="sm"
                          onClick={action.onClick}
                        >
                          {action.label}
                        </Button>
                      ))}
                    </div>
                  )}
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
              <div className="flex gap-1.5">
                <div className="flex-shrink-0 h-7 w-7 rounded-full bg-gradient-to-br from-[#FFB600] to-[#e2eeff] flex items-center justify-center self-end">
                  <Bot className="h-3.5 w-3.5 text-[#151515]" />
                </div>
                  <div className="bg-gradient-to-r from-neutral-800 to-neutral-700 text-white p-2.5 rounded-xl rounded-tl-none">
                  <div className="flex space-x-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#FFB600]/70 animate-pulse" style={{ animationDuration: '0.8s', animationDelay: '0ms' }}></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-[#FFB600]/50 animate-pulse" style={{ animationDuration: '0.8s', animationDelay: '200ms' }}></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-[#FFB600]/30 animate-pulse" style={{ animationDuration: '0.8s', animationDelay: '400ms' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        <form onSubmit={handleSendMessage} className="border-t border-neutral-800 p-2 bg-neutral-900/50">
          <div className="flex items-center space-x-1">
            <Input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}              placeholder="Ask about Gaurav's expertise, projects, or schedule a meeting..."
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
