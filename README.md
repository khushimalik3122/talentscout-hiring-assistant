# TalentScout AI Hiring Assistant 🤖

A sophisticated AI-powered chatbot designed to streamline the initial candidate screening process for technology positions. Built with Next.js and powered by Groq's LLaMA model.

## 🌟 Features

### Core Functionality
- **Intelligent Greeting**: Welcomes candidates and explains the screening process

- **Systematic Information Collection**: Gathers essential candidate details:
  - Full Name
  - Email Address
  - Phone Number
  - Years of Experience
  - Desired Position(s)
  - Current Location
  - Tech Stack (languages, frameworks, tools)

- **Dynamic Technical Assessment**: Generates 3-5 relevant technical questions based on declared tech stack
- **Context-Aware Conversations**: Maintains conversation flow and handles follow-up questions
- **Graceful Exit Handling**: Recognizes conversation-ending keywords and concludes professionally
- **Fallback Mechanisms**: Handles unexpected inputs with meaningful responses

### Technical Specifications
- **Frontend**: Next.js with React
- **Backend**: Next.js API Routes
- **AI Model**: Groq LLaMA 3.3 70B (model id: `llama-3.3-70b-versatile`)
- **Deployment**: Vercel-ready
- **Styling**: Tailwind CSS (utility classes)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Groq API Key

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd talentscout-hiring-assistant
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
Create `.env.local` file:
```env
GROQ_API_KEY=your_groq_api_key_here
```

4. **Run locally**
```bash
npm run dev
```

Visit `http://localhost:3000`

### Vercel Deployment

1. **Push to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Deploy on Vercel**
- Connect your GitHub repository to Vercel
- Add environment variable: `GROQ_API_KEY`
- Deploy!

## 🎯 Usage Guide

### For Candidates
1. **Start**: Visit the application and receive an AI greeting
2. **Information Phase**: Provide requested personal and professional details
3. **Tech Stack Declaration**: Specify your programming languages, frameworks, and tools
4. **Technical Assessment**: Answer 3-5 generated technical questions
5. **Conclusion**: Receive information about next steps

### Conversation Flow Example
```
AI: "Welcome to TalentScout! Let's start with your full name."
User: "John Smith"
AI: "Thanks John! What's your email address?"
User: "john@email.com"
AI: "Great! Now, how many years of experience do you have?"
...
AI: "I see you mentioned Python and React. Here are some technical questions..."
```

## 🏗️ Architecture

### Project Structure
```
talentscout-hiring-assistant/
├── pages/
│   ├── api/
│   │   └── chat.js          # Groq API integration
│   └── index.js             # Main chat interface
├── package.json
├── next.config.js
└── README.md
```

### Key Components

#### Chat API (`pages/api/chat.js`)
- Integrates with Groq LLaMA model
- Implements system prompt for hiring context
- Handles conversation flow and context
- Manages conversation ending detection

#### Frontend (`pages/index.js`)
- React-based chat interface
- Real-time message handling
- Responsive design
- Loading states and error handling

## 🎨 Design Decisions

### Prompt Engineering
The system prompt is carefully crafted to:
- Maintain hiring focus and prevent topic deviation
- Guide systematic information collection
- Generate appropriate technical questions
- Handle edge cases and unexpected inputs

### UI/UX Design
- **Modern gradient design** for professional appearance
- **Real-time chat interface** for natural interaction
- **Responsive layout** for all device types
- **Loading indicators** for better user experience
- **Conversation reset** functionality

### Technical Choices
- **Next.js**: Full-stack framework for seamless deployment
- **Groq LLaMA**: High-performance AI model for natural conversations
- **Utility-first styling**: Clean, maintainable CSS
- **Client-side state management**: Efficient real-time updates

## 🔧 Challenges & Solutions

### Challenge 1: Context Management
**Problem**: Maintaining conversation context across multiple API calls
**Solution**: Implemented chat history passing to maintain context while excluding initial greeting

### Challenge 2: Tech Stack Question Generation
**Problem**: Generating relevant questions for diverse technology stacks
**Solution**: Designed comprehensive system prompt with example patterns for major technologies

### Challenge 3: Conversation Flow Control
**Problem**: Ensuring systematic information collection without rigid scripting
**Solution**: AI-driven flow management with clear instructions for information gathering sequence

### Challenge 4: Error Handling
**Problem**: Graceful handling of API failures and unexpected inputs
**Solution**: Comprehensive try-catch blocks with user-friendly error messages

## 🛡️ Data Privacy & Security

- **No Data Persistence**: Information is not stored beyond the session
- **Environment Variables**: Secure API key management
- **Client-side Processing**: Minimal server-side data handling
- **HTTPS Deployment**: Secure communication through Vercel

## 🚀 Performance Features

- **Efficient API Calls**: Optimized request/response handling
- **Real-time Updates**: Immediate message display
- **Responsive Design**: Fast loading on all devices
- **Error Recovery**: Automatic retry mechanisms

## 📈 Future Enhancements

### Planned Features
- **Sentiment Analysis**: Gauge candidate emotions during conversation
- **Multilingual Support**: Support for multiple languages
- **Advanced Analytics**: Detailed screening reports
- **Integration APIs**: Connect with existing HR systems

### Potential Improvements
- **Voice Interface**: Speech-to-text capabilities
- **Video Assessment**: Integration with video calling
- **Custom Branding**: White-label solutions
- **Advanced Scoring**: AI-powered candidate ranking

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support or questions:
- Create an issue in the repository
- Email: support@talentscout-ai.com
- Documentation: [Link to detailed docs]

---

**Built with ❤️ using Next.js, React, and Groq AI**

## 🎯 Deployment Checklist

- [ ] Environment variables configured
- [ ] GitHub repository connected
- [ ] Vercel deployment settings verified
- [ ] API endpoints tested
- [ ] Error handling validated
- [ ] Mobile responsiveness confirmed
- [ ] Performance optimization complete

Ready to revolutionize your hiring process with AI! 🚀