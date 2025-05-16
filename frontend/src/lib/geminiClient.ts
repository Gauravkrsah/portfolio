export async function fetchGeminiResponse(userMessage: string): Promise<{ text: string }> {
  // Use environment variable for API URL or fall back to relative path
  const apiUrl = import.meta.env.VITE_GEMINI_API_ENDPOINT || '/api/gemini-chat';
  
  // Max retries and timeout settings
  const MAX_RETRIES = 2;
  const TIMEOUT_MS = 10000; // 10 seconds
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
  
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      if (attempt > 0) {
        console.log(`Retrying API call, attempt ${attempt} of ${MAX_RETRIES}`);
      }
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
        signal: controller.signal
      });
      
      // Clear the timeout since we got a response
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        console.error(`API error: ${response.status} ${response.statusText}`);
        if (attempt === MAX_RETRIES) {
          return { 
            text: 'Sorry, I could not process your question right now. Please try again or contact Gaurav directly.' 
          };
        }
        // If not the last attempt, continue to the next iteration (retry)
        continue;
      }
      
      const data = await response.json();
      return { 
        text: typeof data.answer === 'string' && data.answer 
          ? data.answer 
          : 'I apologize, I received an empty response. Please try asking again.'
      };
      
    } catch (error) {
      console.error('API fetch error:', error);
      // Don't retry on abort errors (timeout)
      if (error instanceof DOMException && error.name === 'AbortError') {
        return { text: 'Sorry, the request timed out. Please try again or contact Gaurav directly.' };
      }
      
      if (attempt === MAX_RETRIES) {
        return { text: 'Sorry, I could not connect to the chat service. Please try again or contact Gaurav directly.' };
      }
      // Wait briefly before retrying
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  // This should never be reached due to the returns in the loop, but TypeScript needs it
  return { text: 'Sorry, an unexpected error occurred. Please try again or contact Gaurav directly.' };
}