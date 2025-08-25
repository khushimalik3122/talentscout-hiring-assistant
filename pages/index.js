import { useState, useEffect, useRef } from 'react';

export default function EnhancedTalentScout() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const messagesEndRef = useRef(null);

  const steps = [
    { key: 'info', label: 'Personal Info', icon: '👤', color: 'from-blue-500 to-blue-600' },
    { key: 'experience', label: 'Experience', icon: '💼', color: 'from-purple-500 to-purple-600' },
    { key: 'tech', label: 'Tech Stack', icon: '⚡', color: 'from-indigo-500 to-indigo-600' },
    { key: 'questions', label: 'Assessment', icon: '🎯', color: 'from-pink-500 to-pink-600' },
    { key: 'summary', label: 'Review', icon: '✅', color: 'from-green-500 to-green-600' }
  ];

  useEffect(() => {
    // Initialize with welcome messages
    const welcomeMessages = [
      {
        role: 'assistant',
        content: '👋 Welcome to TalentScout! I\'m your AI Hiring Assistant.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      {
        role: 'assistant', 
        content: 'I\'ll guide you through a quick 5-step screening process. Ready to get started? ✨',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      {
        role: 'assistant',
        content: 'First, let\'s start with your full name. What should I call you? 😊',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
    setMessages(welcomeMessages);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setIsTyping(true);

    // Simulate API response with typing delay
    setTimeout(() => {
      const responses = [
        "Thank you! That's a great name. Now, could you please share your email address?",
        "Perfect! How many years of professional experience do you have?",
        "Excellent! What technologies do you work with? (e.g., React, Python, AWS)",
        "Impressive tech stack! Let me ask you a quick technical question...",
        "Great answer! Let's review your information before we conclude."
      ];
      
      const response = {
        role: 'assistant',
        content: responses[Math.min(currentStep, responses.length - 1)],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, response]);
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
      setIsLoading(false);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-300 ${darkMode ? 'dark' : ''}`}>
      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900">
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full bg-slate-100/20 dark:bg-slate-800/20 bg-[radial-gradient(circle_at_20%_50%,rgba(120,119,198,0.3),transparent),radial-gradient(circle_at_80%_50%,rgba(255,119,198,0.3),transparent)]"></div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-indigo-200/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Header */}
      <header className="relative z-10">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-white/20 shadow-2xl">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Logo & Branding */}
              <div className="flex items-center space-x-4">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl blur opacity-60 group-hover:opacity-100 transition duration-300"></div>
                  <div className="relative w-14 h-14 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-xl">
                    <span className="text-white font-bold text-2xl">TS</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-4 border-white animate-pulse shadow-lg"></div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 via-blue-800 to-purple-800 bg-clip-text text-transparent dark:from-white dark:to-blue-200">
                    TalentScout
                  </h1>
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 tracking-wide">
                    AI-Powered Hiring Assistant
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center space-x-6">
                <div className="hidden md:flex items-center space-x-3 bg-green-50 dark:bg-green-900/30 px-4 py-2 rounded-full border border-green-200 dark:border-green-700">
                  <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse shadow-sm"></div>
                  <span className="text-sm font-semibold text-green-700 dark:text-green-300">Online & Ready</span>
                </div>
                
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="relative p-3 rounded-xl bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-gray-700/80 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/30"
                >
                  {darkMode ? (
                    <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/30 dark:border-gray-700/30 overflow-hidden">
          
          {/* Enhanced Progress Bar */}
          <div className="relative bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-800 px-8 py-6 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                  Screening Progress
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Step {currentStep + 1} of {steps.length} • {steps[currentStep].label}
                </p>
              </div>
              <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
              </div>
            </div>
            
            <div className="relative h-3 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden shadow-inner">
              <div 
                className="absolute h-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-full shadow-lg transition-all duration-1000 ease-out"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </div>
            </div>

            {/* Step Pills */}
            <div className="flex justify-between mt-4 space-x-2">
              {steps.map((step, idx) => (
                <div
                  key={step.key}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-300 ${
                    idx <= currentStep
                      ? `bg-gradient-to-r ${step.color} text-white shadow-lg transform scale-105`
                      : 'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                  }`}
                >
                  <span className="text-sm">{step.icon}</span>
                  <span className="hidden sm:inline">{step.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Chat Header */}
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 px-8 py-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
                            <div className="absolute inset-0 opacity-10">
                  <div className="w-full h-full bg-white/5 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)]"></div>
                </div>
            
            <div className="relative flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30 shadow-xl">
                    <span className="text-3xl">🤖</span>
                  </div>
                  {(isLoading || isTyping) && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-bounce border-2 border-white shadow-lg"></div>
                  )}
                </div>
                <div>
                  <h2 className="text-white font-bold text-xl tracking-wide">AI Hiring Assistant</h2>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse shadow-sm"></div>
                    <p className="text-white/90 text-sm font-medium">
                      {isLoading ? 'Analyzing your response...' : isTyping ? 'Generating questions...' : 'Ready to assist you'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="hidden md:block text-white/80 text-right text-sm">
                  <p className="font-semibold">Professional Screening</p>
                  <p className="text-xs">Powered by Advanced AI</p>
                </div>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="h-[60vh] overflow-y-auto p-8 space-y-6 bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-800/50 dark:to-gray-800">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} group`}
              >
                <div className={`flex items-end space-x-3 max-w-2xl ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  {/* Enhanced Avatar */}
                  <div className={`flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg border-2 ${
                    message.role === 'user' 
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 border-white' 
                      : 'bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-600 dark:to-gray-700 border-gray-200 dark:border-gray-500'
                  }`}>
                    {message.role === 'user' ? (
                      <span className="text-white font-semibold">👤</span>
                    ) : (
                      <span className="text-2xl">🤖</span>
                    )}
                  </div>
                  
                  {/* Enhanced Message Bubble */}
                  <div className={`relative px-6 py-4 rounded-3xl shadow-xl border transition-all duration-300 hover:shadow-2xl ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-blue-200 rounded-br-lg'
                      : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border-gray-200 dark:border-gray-600 rounded-bl-lg'
                  }`}>
                    {/* Message Content */}
                    <div className="font-medium leading-relaxed">
                      {message.content}
                    </div>
                    
                    {/* Timestamp */}
                    {message.timestamp && (
                      <div className={`text-xs mt-2 opacity-70 ${
                        message.role === 'user' ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {message.timestamp}
                      </div>
                    )}

                    {/* Message Tail */}
                    <div className={`absolute w-0 h-0 ${
                      message.role === 'user'
                        ? 'border-l-[20px] border-l-transparent border-t-[20px] border-t-blue-600 right-0 bottom-0'
                        : 'border-r-[20px] border-r-transparent border-t-[20px] border-t-white dark:border-t-gray-700 left-0 bottom-0'
                    }`}></div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Enhanced Typing Indicator */}
            {(isLoading || isTyping) && (
              <div className="flex justify-start group">
                <div className="flex items-end space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-600 dark:to-gray-700 rounded-2xl flex items-center justify-center shadow-lg border-2 border-gray-200 dark:border-gray-500">
                    <span className="text-2xl">🤖</span>
                  </div>
                  <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 px-6 py-4 rounded-3xl rounded-bl-lg shadow-xl">
                    <div className="flex items-center space-x-4">
                      <div className="flex space-x-1">
                        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
                        <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                        {isLoading ? 'Processing your response...' : 'Preparing your next question...'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Enhanced Input Area */}
          <div className="border-t border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 p-6">
            <div className="flex items-end space-x-4">
              <div className="flex-1 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl blur-sm"></div>
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your response here... (Press Enter to send)"
                  className="relative w-full border-2 border-gray-200 dark:border-gray-600 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 font-medium transition-all duration-300 resize-none shadow-lg backdrop-blur-sm"
                  rows={1}
                  disabled={isLoading}
                />
                <div className="absolute right-4 bottom-2 text-xs text-gray-400 dark:text-gray-500 pointer-events-none">
                  Press Enter to send
                </div>
              </div>
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="group relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-xl"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center space-x-2">
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span>Send</span>
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </>
                  )}
                </div>
              </button>
            </div>
          </div>

          {/* Enhanced Footer */}
          <footer className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900 px-8 py-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                  <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-semibold">Secure & Encrypted</span>
                </div>
                <div className="w-1 h-1 bg-gray-300 dark:bg-gray-500 rounded-full"></div>
                <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
                  <span>⚡</span>
                  <span className="font-semibold">AI-Powered</span>
                </div>
                <div className="w-1 h-1 bg-gray-300 dark:bg-gray-500 rounded-full"></div>
                <div className="flex items-center space-x-2 text-purple-600 dark:text-purple-400">
                  <span>🔒</span>
                  <span className="font-semibold">GDPR Compliant</span>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                © 2024 TalentScout AI • Revolutionizing Recruitment
              </p>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
