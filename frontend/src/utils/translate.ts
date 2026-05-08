/**
 * Simple translation utility using Google Translate's free API
 * Note: This is an unofficial API and should be used for simple tasks.
 */
export async function translateText(text: string, from: 'en' | 'ta', to: 'en' | 'ta'): Promise<string> {
  if (!text || text.trim() === '') return '';
  
  try {
    const response = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(text)}`
    );
    
    if (!response.ok) {
      throw new Error('Translation request failed');
    }
    
    const data = await response.json();
    
    // Google Translate API returns an array of arrays
    // data[0] contains the translated segments
    if (data && data[0]) {
      return data[0].map((segment: any) => segment[0]).join('');
    }
    
    return '';
  } catch (error) {
    console.error('Translation error:', error);
    return '';
  }
}
