import AsyncStorage from '@react-native-async-storage/async-storage';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  topic: string;
}

interface GeminiResponse {
  candidates?: {
    content?: {
      parts?: {
        text?: string;
      }[];
    };
  }[];
}

export async function generateQuestions(topic: string, count: number = 5): Promise<Question[]> {
  try {
    // Fetch the API key from AsyncStorage
    const apiKey = await AsyncStorage.getItem('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error("API key not found. Please set it in the settings.");
    }

    const prompt = `Generate ${count} multiple-choice questions about "${topic}" in the following JSON format:
    {
      "questions": [
        {
          "text": "Question text",
          "options": ["Option1", "Option2", "Option3", "Option4"],
          "correctAnswer": 0,
          "explanation": "Explanation of the correct answer",
          "topic": "${topic}"
        }
      ]
    }`;

    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      }),
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data: GeminiResponse = await response.json();
    console.log('API Response:', JSON.stringify(data, null, 2));

    // Validate API response
    const textResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!textResponse) {
      throw new Error("Invalid API response: Unexpected structure");
    }

    // Extract JSON from Markdown code block
    const jsonMatch = textResponse.match(/```json\n([\s\S]*?)\n```/);
    if (!jsonMatch || !jsonMatch[1]) {
      throw new Error("Invalid API response: JSON not found in Markdown code block");
    }

    const parsedData = JSON.parse(jsonMatch[1]);
    if (!parsedData.questions || !Array.isArray(parsedData.questions)) {
      throw new Error("Invalid response format: Questions array not found.");
    }

    return parsedData.questions.map((q, index) => ({
      ...q,
      id: `${topic}-${index}`,
    }));
  } catch (error: any) {
    console.error('❌ Error generating questions:', error.message || error);
    throw new Error("Failed to generate questions. Please try again.");
  }
}