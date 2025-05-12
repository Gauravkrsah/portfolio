export async function fetchGeminiResponse(userMessage: string): Promise<{ text: string }> {
  // Adjust the URL to your backend server running port
  const apiUrl = 'http://localhost:4000/api/gemini-chat';

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