export async function fetchGeminiResponse(userMessage: string): Promise<{ text: string }> {
  // Use environment variable for API URL or fall back to relative path
  const apiUrl = import.meta.env.VITE_GEMINI_API_ENDPOINT || '/api/gemini-chat';

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: userMessage }),
  });

  if (!response.ok) {
    return { text: 'Sorry, I could not process your question right now. Please try again or contact Gaurav directly.' };
  }

  const data = await response.json();
  return { text: typeof data.answer === 'string' ? data.answer : '' };
}