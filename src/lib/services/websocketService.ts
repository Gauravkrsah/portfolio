
import { useState, useEffect, useCallback } from 'react';

// Store all event listeners
interface WebSocketEventListeners {
  [key: string]: Function[];
}

const eventListeners: WebSocketEventListeners = {};
let isConnected = false;
let reconnectInterval: ReturnType<typeof setInterval> | null = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 10;
const RECONNECT_DELAY = 2000;

// Function to initialize the WebSocket connection
export const initWebSocket = () => {
  if (isConnected) {
    return true; // Already connected
  }
  
  try {
    // In a real app, this would establish a real WebSocket connection
    // For this demo, we're simulating the functionality
    isConnected = true;
    console.log('WebSocket connected');
    
    // Reset reconnect attempts on successful connection
    reconnectAttempts = 0;
    
    // Clear any existing reconnect interval
    if (reconnectInterval) {
      clearInterval(reconnectInterval);
      reconnectInterval = null;
    }
    
    // Listen for custom websocket events from the API service
    document.addEventListener('websocket_event', ((event: CustomEvent) => {
      const { type } = event.detail;
      
      // Notify all listeners for this event type
      if (eventListeners[type]) {
        eventListeners[type].forEach(callback => callback());
      }
    }) as EventListener);
    
    // Dispatch a connection event
    const statusEvent = new CustomEvent('websocket_status_change');
    document.dispatchEvent(statusEvent);
    
    return true;
  } catch (error) {
    console.error('WebSocket connection error:', error);
    isConnected = false;
    
    // Attempt to reconnect
    startReconnect();
    return false;
  }
};

// Function to close the WebSocket connection
export const closeWebSocket = () => {
  isConnected = false;
  console.log('WebSocket disconnected');
  
  // Remove the event listener
  document.removeEventListener('websocket_event', (() => {}) as EventListener);
  
  // Dispatch a status change event
  const statusEvent = new CustomEvent('websocket_status_change');
  document.dispatchEvent(statusEvent);
};

// Function to start reconnection attempts
const startReconnect = () => {
  if (reconnectInterval) {
    clearInterval(reconnectInterval);
  }
  
  reconnectInterval = setInterval(() => {
    if (isConnected) {
      clearInterval(reconnectInterval!);
      reconnectInterval = null;
      return;
    }
    
    console.log(`Attempting to reconnect (${reconnectAttempts + 1}/${MAX_RECONNECT_ATTEMPTS})...`);
    reconnectAttempts++;
    
    const success = initWebSocket();
    
    if (success) {
      console.log('Reconnection successful');
      clearInterval(reconnectInterval!);
      reconnectInterval = null;
      return;
    }
    
    if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      console.log('Maximum reconnection attempts reached');
      clearInterval(reconnectInterval!);
      reconnectInterval = null;
      // Try again after a longer delay
      setTimeout(() => {
        reconnectAttempts = 0;
        startReconnect();
      }, RECONNECT_DELAY * 5);
    }
  }, RECONNECT_DELAY);
};

// Hook to listen for WebSocket events
export const useWebSocketEvent = (eventType: string, callback: () => void) => {
  useEffect(() => {
    // Add the callback to the list of listeners for this event type
    if (!eventListeners[eventType]) {
      eventListeners[eventType] = [];
    }
    
    eventListeners[eventType].push(callback);
    
    // Clean up when the component unmounts
    return () => {
      if (eventListeners[eventType]) {
        const index = eventListeners[eventType].indexOf(callback);
        if (index !== -1) {
          eventListeners[eventType].splice(index, 1);
        }
      }
    };
  }, [eventType, callback]);
};

// Hook to get the current connection status
export const useWebSocketStatus = (): boolean => {
  const [connected, setConnected] = useState(isConnected);
  
  const handleStatusChange = useCallback(() => {
    setConnected(isConnected);
  }, []);
  
  useEffect(() => {
    // Initially set the connection status
    setConnected(isConnected);
    
    // Listen for status changes
    window.addEventListener('websocket_status_change', handleStatusChange);
    
    // Attempt to initialize connection if not connected
    if (!isConnected) {
      initWebSocket();
    }
    
    // Clean up
    return () => {
      window.removeEventListener('websocket_status_change', handleStatusChange);
    };
  }, [handleStatusChange]);
  
  return connected;
};

// Function to manually emit a WebSocket event (for testing/demo purposes)
export const emitWebSocketEvent = (eventType: string) => {
  if (!isConnected) {
    console.warn('WebSocket is not connected');
    return false;
  }
  
  // Create a custom event that will be caught by our document event listener
  const wsEvent = new CustomEvent('websocket_event', { 
    detail: { type: eventType } 
  });
  document.dispatchEvent(wsEvent);
  
  return true;
};
