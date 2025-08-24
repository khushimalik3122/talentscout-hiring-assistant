import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConversationEnded, setIsConversationEnded] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [showIntroMore, setShowIntroMore] = useState(false);
  const [candidateName, setCandidateName] = useState('');
  const [tone, setTone] = useState('casual'); // 'casual' | 'formal'
  const [showConfetti, setShowConfetti] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize dark mode from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('ts-dark');
    if (stored === '1') setDarkMode(true);
  }, []);

  // Sync dark mode class & storage
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('ts-dark', '1');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('ts-dark', '0');
    }
  }, [darkMode]);

  useEffect(() => {
    // Initial greeting with typing animation (split into small, friendly bubbles)
    setIsTyping(true);
    setTimeout(() => {
      const first = {
        role: 'assistant',
        content: `👋 Hey there! I’m TalentScout.`,
      };
      const second = {
        role: 'assistant',
        content: `We’ll breeze through a quick screening. Ready? ✨`,
      };
      const third = {
        role: 'assistant',
        content: `First up: what’s your full name? 🙂`,
      };
      setMessages([first, second, third]);
      setIsTyping(false);
    }, 900);
  }, []);

  // Persist messages for Save & Resume
  useEffect(() => {
    if (messages.length) {
      try { localStorage.setItem('ts-messages', JSON.stringify(messages)); } catch {}
    }
  }, [messages]);
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ts-messages');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length) setMessages(parsed);
      }
    } catch {}
  }, []);

  // ----- Step tracking helpers -----
  const steps = [
    { key: 'info', label: 'Info', icon: '📇', match: [/name|email|contact/i] },
    { key: 'experience', label: 'Experience', icon: '💼', match: [/experience|years|role|company/i] },
    { key: 'tech', label: 'Tech Stack', icon: '⚙️', match: [/stack|skills|tech|framework|language/i] },
    { key: 'questions', label: 'Questions', icon: '🎯', match: [/question|quiz|challenge|solve/i] },
    { key: 'summary', label: 'Summary', icon: '🧾', match: [/summary|review|confirm/i] }
  ];

  const getCurrentStepIndex = () => {
    // Infer step from the latest assistant message content
    const lastAssistant = [...messages].reverse().find(m => m.role === 'assistant');
    if (!lastAssistant) return 0;
    const text = lastAssistant.content || '';
    for (let i = steps.length - 1; i >= 0; i--) {
      if (steps[i].match.some(r => r.test(text))) return Math.min(i, steps.length - 1);
    }
    return 0;
  };

  const progressIndex = isConversationEnded ? steps.length - 1 : getCurrentStepIndex();
  const progressPct = ((progressIndex + 1) / steps.length) * 100;

  const getSectionFromText = (text = '') => {
    for (let i = 0; i < steps.length; i++) {
      if (steps[i].match.some(r => r.test(text))) return steps[i];
    }
    return null;
  };

  const getMicroHint = (secKey) => {
    switch (secKey) {
      case 'info':
        return tone === 'formal' ? 'Thank you.' : 'Awesome, thanks! 🙌';
      case 'experience':
        return tone === 'formal'
          ? (candidateName ? `Nice to meet you, ${candidateName.split(' ')[0]}. Let’s discuss your experience.` : 'Great. Let’s discuss your experience.')
          : (candidateName ? `Nice to meet you, ${candidateName.split(' ')[0]}! 🚀 Let’s talk experience.` : 'Great! 🚀 Let’s talk experience.');
      case 'tech':
        return tone === 'formal' ? 'Noted on your skills.' : 'Nice skills! 💡 You’re on fire 🔥';
      case 'questions':
        return tone === 'formal' ? 'Proceeding with a few questions.' : 'Ready? 🧠 Quick questions ahead!';
      case 'summary':
        return tone === 'formal' ? 'Almost done. Please review and confirm.' : 'Almost done! ✅ Review & confirm.';
      default:
        return null;
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading || isConversationEnded) return;

    const userMessage = { 
      role: 'user', 
      content: inputMessage,
    };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputMessage('');
    setIsLoading(true);

    // Personalize: infer name early from user content
    if (!candidateName) {
      const m = userMessage.content.match(/(?:i am|i'm|name is|this is)\s+([A-Za-z][A-Za-z\-']+(?:\s+[A-Za-z][A-Za-z\-']+)*)/i);
      if (m && m[1]) setCandidateName(m[1].trim());
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          chatHistory: messages.slice(1)
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.isEnding) {
        setIsConversationEnded(true);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }

      // Typewriter effect for assistant message
      const fullText = String(data.message || '');
      const base = { role: 'assistant', content: '' };
      setIsTyping(true);
      setMessages(prev => [...prev, base]);
      let i = 0;
      const speed = 12; // chars per tick
      const interval = setInterval(() => {
        i = Math.min(fullText.length, i + speed);
        setMessages(prev => {
          const copy = [...prev];
          copy[copy.length - 1] = { ...copy[copy.length - 1], content: fullText.slice(0, i) };
          return copy;
        });
        if (i >= fullText.length) {
          clearInterval(interval);
          setIsTyping(false);
        }
      }, 30);

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        role: 'assistant',
        content: `I apologize for the technical issue. Let me try to help you anyway! Could you please tell me your full name to get started with the screening process?`,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    // Enter = send, Shift+Enter = newline
    if (e.key === 'Enter') {
      if (e.shiftKey) return; // allow newline
      e.preventDefault();
      sendMessage();
    }
  };

  // Auto-resize textarea height based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [inputMessage]);

  const handleCopy = async (index, text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1200);
    } catch (err) {
      console.error('Copy failed', err);
    }
  };

  const resetConversation = () => {
    setMessages([{
      role: 'assistant',
      content: `👋 Hello! Welcome back to TalentScout's AI Hiring Assistant!

Ready to start a new screening session? Let's begin with your full name! 😊`,
    }]);
    setIsConversationEnded(false);
    setInputMessage('');
  };

  return (
    <>
      <Head>
        <title>TalentScout - AI Hiring Assistant</title>
        <meta name="description" content="Intelligent hiring assistant for technical candidate screening" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-pink-50 dark:from-slate-900 dark:via-indigo-950 dark:to-black">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-300/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-indigo-300/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute inset-0 bg-diag opacity-30"></div>
        </div>

        {/* Header */}
        <header className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-lg border-b border-white/20 dark:border-gray-700">
          <div className="max-w-6xl mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-300"
                  aria-label="Toggle Dark Mode"
                >
                  {darkMode ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293a8 8 0 01-10.586-10.586 8 8 0 1010.586 10.586z"/></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a.75.75 0 01.75.75V4a.75.75 0 01-1.5 0V2.75A.75.75 0 0110 2zm0 12a.75.75 0 01.75.75V18a.75.75 0 01-1.5 0v-3.25A.75.75 0 0110 14zm8-4a.75.75 0 01.75.75h1.25a.75.75 0 010 1.5H18.75A.75.75 0 0118 10zm-15.75.75A.75.75 0 012.25 10H1a.75.75 0 010-1.5h1.25a.75.75 0 01.75.75zM15.657 4.343a.75.75 0 011.06 1.06l-.883.883a.75.75 0 11-1.06-1.06l.883-.883zM5.166 14.834a.75.75 0 011.06 1.06l-.883.883a.75.75 0 11-1.06-1.06l.883-.883zM4.343 4.343a.75.75 0 10-1.06 1.06l.883.883a.75.75 0 001.06-1.06l-.883-.883zm10.491 10.491a.75.75 0 10-1.06 1.06l.883.883a.75.75 0 001.06-1.06l-.883-.883z"/></svg>
                  )}
                </button>
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-xl">TS</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    TalentScout
                  </h1>
                  <p className="text-sm text-gray-600 font-medium">AI-Powered Hiring Assistant</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="hidden sm:flex items-center space-x-2 bg-green-50 px-3 py-1 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-green-700 font-medium">Online</span>
                </div>
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="relative max-w-6xl mx-auto px-6 py-8">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            {/* Progress / Step Tracker */}
            <div className="px-8 pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-gray-600">
                  Step {Math.min(progressIndex + 1, steps.length)} of {steps.length} 
                  <span className="ml-2">• {steps[Math.min(progressIndex, steps.length - 1)].label}</span>
                </p>
                <div className="flex items-center space-x-2 text-xs">
                  {steps.slice(0, 4).map((s, idx) => {
                    const active = idx === progressIndex;
                    return (
                      <div
                        key={s.key}
                        className={`flex items-center space-x-1 px-2 py-1 rounded-full transition-all ${
                          active
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        <span>{s.icon}</span>
                        <span className="font-medium">{s.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-600 to-purple-600" style={{ width: `${progressPct}%` }}></div>
              </div>
            </div>

            {/* Chat Header */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <span className="text-2xl">🤖</span>
                    </div>
                    {(isLoading || isTyping) && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-bounce"></div>
                    )}
                  </div>
                  <div>
                    <h2 className="text-white font-semibold text-lg">AI Hiring Assistant</h2>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <p className="text-white/90 text-sm">
                        {isLoading ? 'Analyzing your response...' : isTyping ? 'Preparing questions...' : 'Ready to assist'}
                      </p>
                    </div>
                  </div>
                </div>
                
                {isConversationEnded && (
                  <button
                    onClick={resetConversation}
                    className="group bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 border border-white/30"
                  >
                    <span className="mr-2">✨</span>
                    New Session
                  </button>
                )}
              </div>
            </div>

            {/* Intro banner (expandable) */}
            {!messages.some(m => m.role === 'user') && (
              <div className="mx-8 mt-4 mb-2 bg-white border border-gray-100 rounded-xl p-4 text-sm text-gray-600">
                <div className="flex items-start justify-between">
                  <div>
                    This short screening covers Info, Experience, Tech Stack, and a few quick questions.
                  </div>
                  <button className="text-blue-600 hover:underline ml-4" onClick={() => setShowIntroMore(v => !v)}>
                    {showIntroMore ? 'Hide' : 'More info'}
                  </button>
                </div>
                {showIntroMore && (
                  <div className="mt-2 text-xs text-gray-500 space-y-1">
                    <p>• Estimated time: 5–10 minutes</p>
                    <p>• You can use Enter for new lines and Ctrl/Cmd+Enter to send</p>
                    <p>• We only use this info to assist screening</p>
                  </div>
                )}
              </div>
            )}

            {/* Messages */}
            <div className="min-h-[50vh] h-[60vh] max-h-[65vh] overflow-y-auto p-8 space-y-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} group`}
                >
                  <div className={`flex items-end space-x-3 max-w-2xl ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    {/* Avatar */}
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.role === 'user' 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
                        : 'bg-gradient-to-r from-gray-100 to-gray-200'
                    }`}>
                      {message.role === 'user' ? (
                        <span className="text-white text-sm font-medium">👤</span>
                      ) : (
                        <span className="text-gray-600 text-sm">🤖</span>
                      )}
                    </div>
                    
                    {/* Message Bubble */}
                    <div className={`relative px-6 py-4 rounded-3xl shadow-[0_10px_30px_rgba(17,24,39,0.08)] ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                        : 'bg-white/90 backdrop-blur-sm border border-gray-100 text-gray-800'
                    } ${message.role === 'user' ? 'rounded-br-md' : 'rounded-bl-md'}`}>
                      {/* Section hint for assistant messages */}
                      {message.role !== 'user' && (() => {
                        const sec = getSectionFromText(message.content);
                        return sec ? (
                          <div className="mb-1 -mt-1 text-[11px] text-gray-500 flex items-center space-x-1">
                            <span>{sec.icon}</span>
                            <span className="font-medium">{sec.label}</span>
                          </div>
                        ) : null;
                      })()}
                      {/* Copy button (assistant only) */}
                      {message.role !== 'user' && (
                        <div className="absolute top-2 right-2 flex items-center space-x-2">
                          {copiedIndex === index && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">Copied</span>
                          )}
                          <button
                            onClick={() => handleCopy(index, message.content)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-gray-600"
                            title="Copy message"
                            aria-label="Copy message"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16h8a2 2 0 002-2V8m-6 8H8a2 2 0 01-2-2V8m6 8V6a2 2 0 012-2h2m-4 0H8a2 2 0 00-2 2v2" />
                            </svg>
                          </button>
                        </div>
                      )}
                      <div className="whitespace-pre-wrap text-sm leading-relaxed font-medium">
                        {message.content}
                      </div>
                      {message.role !== 'user' && (() => {
                        const sec = getSectionFromText(message.content);
                        const hint = sec ? getMicroHint(sec.key) : null;
                        return hint ? (
                          <div className="mt-2 text-xs text-gray-500">{hint}</div>
                        ) : null;
                      })()}
                      {/* Timestamp */}
                      {message.timestamp && (
                        <div className={`text-xs mt-2 opacity-70 ${
                          message.role === 'user' ? 'text-white/70' : 'text-gray-500'
                        }`}>
                          {message.timestamp}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Typing Indicator */}
              {(isLoading || isTyping) && (
                <div className="flex justify-start group">
                  <div className="flex items-end space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 text-sm">🤖</span>
                    </div>
                    <div className="bg-white border border-gray-100 px-6 py-4 rounded-2xl rounded-bl-md shadow-md">
                      <div className="flex items-center space-x-3">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-sm text-gray-600 font-medium">
                          {isLoading ? 'Processing...' : 'Typing...'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area / Summary at end */}
            <div className="border-t border-gray-100 bg-gray-50/50 p-6">
              {isConversationEnded ? (
                <div className="max-w-3xl mx-auto">
                  <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold flex items-center space-x-2"><span>🧾</span><span>Review your details</span></h3>
                      <span className="text-xs text-gray-500">Step 5 of 5 • Summary</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      {(() => {
                        const userMsgs = messages.filter(m => m.role === 'user');
                        const guess = (regex) => userMsgs.map(m => m.content).reverse().find(t => regex.test(t));
                        const name = guess(/name|i am|i'm|am\s+[A-Z]/i) || userMsgs[0]?.content || '—';
                        const experience = guess(/\b(\d+\s*(\+)?\s*years?)\b|experience/i) || '—';
                        const tech = guess(/react|node|python|java|sql|aws|docker|kubernetes|typescript|next|tailwind/i) || '—';
                        return (
                          <>
                            <div className="bg-gray-50 rounded-lg p-3"><div className="text-gray-500 text-xs mb-1">Name</div><div className="font-medium">{name}</div></div>
                            <div className="bg-gray-50 rounded-lg p-3"><div className="text-gray-500 text-xs mb-1">Experience</div><div className="font-medium">{experience}</div></div>
                            <div className="bg-gray-50 rounded-lg p-3 md:col-span-2"><div className="text-gray-500 text-xs mb-1">Tech Stack</div><div className="font-medium break-words">{tech}</div></div>
                          </>
                        );
                      })()}
                    </div>
                    <div className="mt-5 flex items-center justify-end space-x-3">
                      <button
                        onClick={() => setIsConversationEnded(false)}
                        className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
                      >Edit</button>
                      <button
                        onClick={() => { console.log('Submitted candidate summary'); resetConversation(); }}
                        className="px-5 py-2 rounded-lg text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-md"
                      >Confirm & Submit</button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-end space-x-4">
                  <div className="flex-1">
                    <div className="relative">
                      <textarea
                        ref={textareaRef}
                        rows={1}
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type your message... (Ctrl/Cmd + Enter to send)"
                        className="w-full border border-gray-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm text-gray-800 placeholder-gray-400 font-medium transition-all duration-300 resize-none max-h-40"
                        disabled={isLoading}
                      />
                      <div className="absolute right-4 -bottom-6 text-xs text-gray-400 select-none">Press Ctrl/Cmd + Enter to send</div>
                    </div>
                  </div>
                  <button
                    onClick={sendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 font-medium"
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span>Send</span>
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2m0 0v-8" />
                        </svg>
                      </div>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Enhanced Footer */}
            <footer className="text-center mt-8 space-y-3">
              <div className="flex items-center justify-center space-x-4 text-gray-600 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Secure Connection</span>
                </div>
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <div className="flex items-center space-x-2">
                  <span>⚡</span>
                  <span>AI-Powered</span>
                </div>
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <div className="flex items-center space-x-2">
                  <span>🔒</span>
                  <span>GDPR Compliant</span>
                </div>
              </div>
              <p className="text-gray-500 text-sm">
                &copy; 2024 TalentScout AI Hiring Assistant - Revolutionizing Recruitment
              </p>
            </footer>
          </div>
        </main>
      </div>

      <style jsx global>{`
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        .scrollbar-thin {
          scrollbar-width: thin;
        }
        
        .scrollbar-thumb-gray-300::-webkit-scrollbar-thumb {
          background-color: #d1d5db;
          border-radius: 9999px;
        }
        
        .scrollbar-track-transparent::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        
        @keyframes bounce {
          0%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-8px);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
        
        .animate-bounce {
          animation: bounce 1.4s infinite;
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        
        .font-inter {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        /* Subtle animated diagonal pattern for background overlay */
        .bg-diag {
          background-image: repeating-linear-gradient(
            135deg,
            rgba(99, 102, 241, 0.06) 0px,
            rgba(99, 102, 241, 0.06) 2px,
            rgba(255, 255, 255, 0.0) 2px,
            rgba(255, 255, 255, 0.0) 10px
          );
          background-size: 200px 200px;
          animation: diagMove 22s linear infinite;
        }

        @keyframes diagMove {
          from { background-position: 0 0; }
          to { background-position: 200px 200px; }
        }
      `}</style>
    </>
  );
}