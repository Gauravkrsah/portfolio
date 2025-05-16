import { useEffect, useState } from 'react';
import { toast } from 'sonner';

type ChatStatus = 'checking' | 'connected' | 'disconnected' | 'partial';

interface HealthResponse {
  status: string;
  message: string;
  services?: {
    geminiApi?: {
      status: string;
      message: string;
    };
    chatData?: {
      status: string;
      message: string;
    };
  };
}

export function ChatConfig() {
  const [status, setStatus] = useState<ChatStatus>('checking');
  
  useEffect(() => {
    const checkChatConnection = async () => {
      try {
        // Get the base API URL and chat endpoint
        const apiBase = import.meta.env.VITE_API_URL || '/api';
        const chatEndpoint = import.meta.env.VITE_GEMINI_API_ENDPOINT || '/api/gemini-chat';
        
        // Use the dedicated health check endpoint for chat service
        const healthUrl = `${apiBase}/health`;
        
        console.log(`Checking chat service at ${healthUrl}`);
        
        // First check the health endpoint
        const healthResponse = await fetch(healthUrl, { 
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }).catch((err) => {
          console.error('Network error checking health endpoint:', err);
          return null;
        });
        
        if (!healthResponse || !healthResponse.ok) {
          console.error(`Health endpoint unavailable: ${healthResponse?.status || 'network error'}`);
          setStatus('disconnected');
          toast.error('Chat assistant is unavailable - API service not detected');
          return;
        }
        
        try {
          // Check the detailed health status
          const healthData = await healthResponse.json() as HealthResponse;
          console.log('Health response:', healthData);
          
          // Check for specific issues with chat components
          if (healthData.services) {
            const { geminiApi, chatData } = healthData.services;
            
            // Log detailed service statuses
            if (geminiApi) {
              console.log(`Gemini API Status: ${geminiApi.status} - ${geminiApi.message}`);
            }
            
            if (chatData) {
              console.log(`Chat Data Status: ${chatData.status} - ${chatData.message}`);
            }
            
            // Check for specific issues
            if (geminiApi?.status === 'ERROR') {
              setStatus('disconnected');
              toast.error(`Chat assistant issue: ${geminiApi.message}`);
              return;
            }
            
            if (chatData?.status === 'ERROR') {
              setStatus('partial');
              toast.warning(`Chat assistant may have limited knowledge: ${chatData.message}`);
              // Continue to test the actual endpoint
            }
          }
          
          if (healthData.status !== 'OK' && healthData.status !== 'WARNING') {
            setStatus('disconnected');
            toast.error(`API health check failed: ${healthData.message}`);
            return;
          }
        } catch (jsonError) {
          console.error('Error parsing health response:', jsonError);
          // Continue to chat endpoint test even if health JSON parsing fails
        }
        
        // Then check if the chat endpoint responds to an actual query
        console.log(`Testing chat endpoint at: ${chatEndpoint}`);
        try {
          const response = await fetch(chatEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'Hello, this is a connection test' }),
          });
          
          if (response.ok) {
            const data = await response.json();
            if (data && data.answer) {
              console.log('Chat response received:', data.answer.substring(0, 50) + '...');
              setStatus('connected');
              // Don't show success toast to avoid cluttering the UI
            } else {
              console.warn('Chat endpoint responded but with invalid data format:', data);
              setStatus('partial');
              toast.warning('Chat assistant may have limited functionality');
            }
          } else {
            console.error(`Chat endpoint error: ${response.status} ${response.statusText}`);
            setStatus('disconnected');
            toast.error('Chat assistant cannot respond to messages');
          }
        } catch (chatError) {
          console.error('Error testing chat endpoint:', chatError);
          setStatus('disconnected');
          toast.error('Cannot connect to chat assistant service');
        }
      } catch (error) {
        console.error('Error in chat configuration check:', error);
        setStatus('disconnected');
        toast.error('Chat assistant service error');
      }
    };
    
    // Wait a moment to allow the UI to render before checking
    const timer = setTimeout(() => {
      checkChatConnection();
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Invisible component - only shows status in console and toast notifications
  return null;
}

export default ChatConfig;
