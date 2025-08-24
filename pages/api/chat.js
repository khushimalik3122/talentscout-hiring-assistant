import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// System prompt for the hiring assistant
const SYSTEM_PROMPT = `You are TalentScout's intelligent Hiring Assistant chatbot. Your primary role is to conduct initial candidate screening by gathering essential information and generating relevant technical questions.

CORE RESPONSIBILITIES:
1. Greet candidates warmly and explain your purpose
2. Collect candidate information systematically
3. Generate 3-5 technical questions based on their tech stack
4. Maintain conversation context and flow
5. Handle unexpected inputs gracefully
6. End conversations professionally

CONVERSATION FLOW:
1. GREETING: Welcome the candidate and explain the process
2. INFORMATION GATHERING: Collect the following in order:
   - Full Name
   - Email Address  
   - Phone Number
   - Years of Experience
   - Desired Position(s)
   - Current Location
   - Tech Stack (programming languages, frameworks, databases, tools)
3. TECHNICAL ASSESSMENT: Generate 3-5 relevant technical questions based on their declared tech stack
4. CONCLUSION: Thank them and explain next steps

IMPORTANT RULES:
- Stay focused on hiring and recruitment topics
- Be professional but friendly
- Ask for one piece of information at a time
- Generate technical questions that match the candidate's experience level
- If someone tries to deviate from the hiring process, politely redirect
- Handle conversation-ending keywords like "bye", "quit", "exit", "stop"
- Never store or remember personal information beyond the current session

TECHNICAL QUESTION EXAMPLES:
- For Python: "Can you explain the difference between lists and tuples in Python?"
- For React: "How do you handle state management in React applications?"
- For SQL: "What's the difference between INNER JOIN and LEFT JOIN?"

Always maintain a helpful, professional tone and ensure the conversation flows naturally.`;

export default async function handler(req, res) {
  console.log('API route called with method:', req.method);

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { message, chatHistory = [] } = req.body;
    console.log('Received message:', message);

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    // Check API key
    if (!process.env.GROQ_API_KEY) {
      console.error('GROQ_API_KEY not found in environment variables');
      return res.status(500).json({
        message: 'Server configuration error. Please contact support.'
      });
    }

    // Check for conversation ending keywords
    const endingKeywords = ['bye', 'quit', 'exit', 'stop', 'goodbye', 'end'];
    if (endingKeywords.some(keyword => message.toLowerCase().includes(keyword))) {
      return res.status(200).json({
        message: "Thank you for your time! Your information has been recorded and our recruitment team will review your profile. You can expect to hear back from us within 2-3 business days. Have a great day! 👋",
        isEnding: true
      });
    }

    // Prepare messages for Groq API
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...chatHistory,
      { role: 'user', content: message }
    ];

    console.log('Calling Groq API...');
    const completion = await groq.chat.completions.create({
      messages: messages,
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 1000,
    });

    const aiResponse = completion.choices[0]?.message?.content || 
      "I apologize, but I'm having trouble processing your request. Could you please try again?";

    console.log('API response received successfully');
    return res.status(200).json({
      message: aiResponse,
      isEnding: false
    });

  } catch (error) {
    console.error('Chat API Error Details:', {
      message: error.message,
      name: error.name,
      status: error.status,
      code: error.code
    });
    
    let errorMessage = 'I apologize, but I\'m experiencing technical difficulties. ';
    
    if (error.status === 401) {
      errorMessage += 'Authentication failed. Please check API configuration.';
    } else if (error.status === 429) {
      errorMessage += 'Too many requests. Please try again in a moment.';
    } else if (error.status === 500) {
      errorMessage += 'Server error. Please try again later.';
    } else {
      errorMessage += 'Please try again in a moment.';
    }

    return res.status(500).json({
      message: errorMessage
    });
  }
}