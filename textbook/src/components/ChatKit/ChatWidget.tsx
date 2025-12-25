import React, { useState, useRef, useEffect, useCallback } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

interface Skill {
  id: string;
  name: string;
  icon: string;
  description: string;
  prompts: string[];
}

// 25+ AI Agent Skills for the book
const AGENT_SKILLS: Skill[] = [
  { id: 'explain', name: 'Explain Concept', icon: '📖', description: 'Get detailed explanation', prompts: ['Explain this concept in simple terms', 'Break down this topic'] },
  { id: 'example', name: 'Give Example', icon: '💡', description: 'Real-world examples', prompts: ['Give me a practical example', 'Show me how this works in practice'] },
  { id: 'code', name: 'Code Sample', icon: '💻', description: 'Python/C++ code', prompts: ['Write code for this', 'Show implementation'] },
  { id: 'quiz', name: 'Quiz Me', icon: '❓', description: 'Test understanding', prompts: ['Create a quiz question', 'Test my knowledge'] },
  { id: 'summary', name: 'Summarize', icon: '📝', description: 'Quick summary', prompts: ['Summarize this section', 'Give me key points'] },
  { id: 'diagram', name: 'Describe Diagram', icon: '📊', description: 'Visual explanation', prompts: ['Describe a diagram for this', 'Explain visually'] },
  { id: 'compare', name: 'Compare', icon: '⚖️', description: 'Compare concepts', prompts: ['Compare these concepts', 'What are the differences'] },
  { id: 'history', name: 'Historical Context', icon: '📜', description: 'History and evolution', prompts: ['Tell me the history', 'How did this evolve'] },
  { id: 'application', name: 'Applications', icon: '🎯', description: 'Real applications', prompts: ['Where is this used', 'Practical applications'] },
  { id: 'formula', name: 'Formula/Math', icon: '🔢', description: 'Mathematical formulas', prompts: ['Show the formula', 'Mathematical derivation'] },
  { id: 'analogy', name: 'Analogy', icon: '🔗', description: 'Simple analogy', prompts: ['Give me an analogy', 'Explain like I am 5'] },
  { id: 'prerequisite', name: 'Prerequisites', icon: '📋', description: 'What to learn first', prompts: ['What should I know first', 'Prerequisites needed'] },
  { id: 'advanced', name: 'Go Deeper', icon: '🎓', description: 'Advanced concepts', prompts: ['Tell me more advanced topics', 'Go deeper'] },
  { id: 'troubleshoot', name: 'Troubleshoot', icon: '🔧', description: 'Common issues', prompts: ['Common problems', 'How to debug'] },
  { id: 'resources', name: 'Resources', icon: '📚', description: 'Learning resources', prompts: ['Recommend resources', 'Where to learn more'] },
  { id: 'project', name: 'Project Idea', icon: '🚀', description: 'Project suggestions', prompts: ['Suggest a project', 'Hands-on exercise'] },
  { id: 'interview', name: 'Interview Prep', icon: '💼', description: 'Interview questions', prompts: ['Interview questions', 'Technical interview help'] },
  { id: 'translate', name: 'Translate Urdu', icon: '🇵🇰', description: 'Urdu translation', prompts: ['Translate to Urdu', 'اردو میں سمجھائیں'] },
  { id: 'simplify', name: 'Simplify', icon: '✨', description: 'Simplify complex', prompts: ['Make this simpler', 'Simplify explanation'] },
  { id: 'visualize', name: 'Visualize', icon: '👁️', description: 'Help visualize', prompts: ['Help me visualize', 'Mental model'] },
  { id: 'robotics', name: 'Robotics Link', icon: '🤖', description: 'Robotics connection', prompts: ['How does this apply to robots', 'Robotics application'] },
  { id: 'ai', name: 'AI Connection', icon: '🧠', description: 'AI/ML relevance', prompts: ['AI aspect of this', 'Machine learning connection'] },
  { id: 'safety', name: 'Safety Concerns', icon: '⚠️', description: 'Safety aspects', prompts: ['Safety considerations', 'What could go wrong'] },
  { id: 'future', name: 'Future Trends', icon: '🔮', description: 'Future developments', prompts: ['Future of this tech', 'Emerging trends'] },
  { id: 'career', name: 'Career Path', icon: '👔', description: 'Career guidance', prompts: ['Career opportunities', 'Jobs in this field'] },
  { id: 'research', name: 'Research Papers', icon: '📄', description: 'Academic research', prompts: ['Key research papers', 'Academic references'] },
];

// Simulated AI response generator
function generateAIResponse(message: string, skill?: Skill): string {
  const topicKeywords = message.toLowerCase();

  // Context-aware responses based on skill and content
  if (skill) {
    switch (skill.id) {
      case 'explain':
        return `Let me explain this concept for you:\n\n${message.includes('robot') ? 'Robotics involves the design, construction, and operation of robots. In humanoid robotics specifically, we aim to create machines that can mimic human form and movement.' : 'This is a fundamental concept in Physical AI that connects how machines interact with the physical world through sensors and actuators.'}`;
      case 'code':
        return `Here's a Python code example:\n\n\`\`\`python\nimport numpy as np\nfrom robot_controller import HumanoidRobot\n\n# Initialize the robot\nrobot = HumanoidRobot()\n\n# Basic motion control\ndef move_arm(angle):\n    robot.set_joint_angle('arm', angle)\n    robot.execute_motion()\n\nif __name__ == '__main__':\n    move_arm(45)\n\`\`\``;
      case 'quiz':
        return `Let's test your knowledge!\n\n**Question:** What is the primary purpose of inverse kinematics in humanoid robots?\n\nA) To calculate joint angles from desired end-effector position\nB) To measure robot speed\nC) To control power consumption\nD) To detect obstacles\n\n<details><summary>Show Answer</summary>A) Inverse kinematics calculates the joint angles needed to achieve a desired position of the robot's end-effector (hand, foot, etc.)</details>`;
      case 'translate':
        return `**اردو ترجمہ:**\n\n${message.includes('robot') ? 'روبوٹکس مشینوں کی تعمیر اور کنٹرول کا علم ہے۔ ہیومینوائڈ روبوٹس انسانی شکل کی نقل کرتے ہیں۔' : 'فزیکل AI مصنوعی ذہانت کی وہ شاخ ہے جو حقیقی دنیا میں کام کرتی ہے۔'}`;
      case 'analogy':
        return `Here's a simple analogy:\n\nThink of a humanoid robot's control system like a orchestra conductor. The conductor (main controller) coordinates all the musicians (motors and sensors) to play in harmony. Each musician follows their own sheet music (local controllers), but they all respond to the conductor's movements to create a unified performance.`;
      default:
        break;
    }
  }

  // General response
  if (topicKeywords.includes('sensor')) {
    return "Sensors are the 'eyes and ears' of a robot. They collect data from the environment - from cameras for vision, to force sensors for touch, to IMUs for balance. This sensory data is processed to help the robot understand and interact with its surroundings.";
  } else if (topicKeywords.includes('actuator') || topicKeywords.includes('motor')) {
    return "Actuators are the 'muscles' of a robot. They convert energy into motion. Common types include electric motors (DC, servo, stepper), hydraulic actuators for high force, and pneumatic actuators for faster movement. The choice depends on the application's requirements for speed, force, and precision.";
  } else if (topicKeywords.includes('kinematics')) {
    return "Kinematics is the study of motion without considering forces. In robotics:\n\n**Forward Kinematics:** Given joint angles → Calculate end-effector position\n**Inverse Kinematics:** Given desired position → Calculate required joint angles\n\nThis is fundamental for robot arm manipulation and humanoid walking.";
  }

  return `Great question about "${message.slice(0, 50)}${message.length > 50 ? '...' : ''}"!\n\nIn the context of Physical AI and Humanoid Robotics, this relates to how intelligent systems interact with and manipulate the physical world. The key aspects include:\n\n1. **Perception** - Understanding the environment through sensors\n2. **Decision Making** - Processing information and planning actions\n3. **Action** - Executing movements through actuators\n\nWould you like me to elaborate on any specific aspect?`;
}

import { useAuth } from '../../hooks/useAuth';

export default function ChatWidget() {
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: 'Hello! I\'m your Physical AI learning assistant. I can help you understand concepts, provide examples, quiz you, and much more. Select any text in the book or ask me a question!',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [showSkills, setShowSkills] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Text selection handler
  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection()?.toString().trim();
      if (selection && selection.length > 5 && isAuthenticated) {
        setSelectedText(selection);
        // Auto-open chat and show the selected text
        if (selection.length > 10) {
          setIsOpen(true);
          setShowSkills(true);
        }
      }
    };

    document.addEventListener('mouseup', handleSelection);
    return () => document.removeEventListener('mouseup', handleSelection);
  }, [isAuthenticated]);

  const sendMessage = useCallback(async (content: string, skill?: Skill) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: skill ? `[${skill.name}] ${content}` : content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setSelectedText('');
    setShowSkills(false);
    setIsLoading(true);

    try {
      // Call RAG backend API
      const apiUrl = (window as any).docusaurusConfig?.customFields?.apiUrl || '';
      const token = localStorage.getItem('token');

      const ragResponse = await fetch(`${apiUrl}/api/chat/rag`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: content,
          skill: skill?.id,
          context: window.location.pathname, // Current lesson path
        }),
      });

      if (!ragResponse.ok) {
        throw new Error('RAG API request failed');
      }

      const data = await ragResponse.json();

      const response: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || generateAIResponse(content, skill),
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, response]);
    } catch (error) {
      console.error('RAG error:', error);

      // Fallback to simulated response if RAG fails
      const response: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateAIResponse(content, skill),
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, response]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSkillClick = (skill: Skill) => {
    const text = selectedText || input || 'this topic';
    sendMessage(text, skill);
  };

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <>
        {/* Login Prompt Button */}
        <button
          onClick={() => window.location.href = '/login'}
          style={{
            position: 'fixed',
            bottom: '1.5rem',
            right: '1.5rem',
            width: '60px',
            height: '60px',
            background: 'linear-gradient(135deg, #001F3F, #003366)',
            borderRadius: '50%',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(0, 31, 63, 0.4)',
            zIndex: 1000,
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
          title="Login to use AI Assistant"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M12 15v-3m0 0V9m0 3h3m-3 0H9"/>
            <circle cx="12" cy="12" r="10"/>
          </svg>
        </button>
      </>
    );
  }

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) setShowSkills(false);
        }}
        style={{
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
          width: '60px',
          height: '60px',
          background: 'linear-gradient(135deg, #4a9eff, #7ab8ff)',
          borderRadius: '50%',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(74, 158, 255, 0.4)',
          zIndex: 1000,
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
      >
        {isOpen ? (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        ) : (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        )}
      </button>

      {/* Selected Text Indicator */}
      {selectedText && isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '5.5rem',
            right: '5.5rem',
            background: '#4a9eff',
            color: 'white',
            padding: '0.5rem 0.75rem',
            borderRadius: '1rem',
            fontSize: '0.75rem',
            zIndex: 1001,
            maxWidth: '150px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          Selected: "{selectedText.slice(0, 20)}..."
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '5.5rem',
            right: '1.5rem',
            width: '380px',
            height: '550px',
            background: 'rgba(255, 255, 255, 0.98)',
            borderRadius: '1rem',
            boxShadow: '0 10px 50px rgba(0, 31, 63, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 999,
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '1rem',
              background: 'linear-gradient(135deg, #001F3F, #003366)',
              color: 'white',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '36px',
                height: '36px',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                🤖
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>
                  AI Learning Assistant
                </h3>
                <p style={{ margin: 0, fontSize: '0.75rem', opacity: 0.8 }}>
                  25+ Skills • RAG-Powered • Gemini
                </p>
              </div>
            </div>
          </div>

          {/* Skills Grid (toggleable) */}
          {showSkills && (
            <div style={{
              padding: '0.75rem',
              background: '#f8fafc',
              borderBottom: '1px solid #e5e7eb',
              maxHeight: '180px',
              overflowY: 'auto',
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.5rem',
              }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#666' }}>
                  Select a skill:
                </span>
                <button
                  onClick={() => setShowSkills(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    color: '#999',
                  }}
                >
                  ×
                </button>
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '0.5rem',
              }}>
                {AGENT_SKILLS.slice(0, 12).map((skill) => (
                  <button
                    key={skill.id}
                    onClick={() => handleSkillClick(skill)}
                    title={skill.description}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      padding: '0.5rem',
                      background: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <span style={{ fontSize: '1.25rem' }}>{skill.icon}</span>
                    <span style={{ fontSize: '0.65rem', color: '#333', marginTop: '0.25rem' }}>
                      {skill.name.split(' ')[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <div
                  style={{
                    maxWidth: '85%',
                    padding: '0.75rem 1rem',
                    borderRadius: msg.role === 'user'
                      ? '1rem 1rem 0.25rem 1rem'
                      : '1rem 1rem 1rem 0.25rem',
                    background: msg.role === 'user'
                      ? 'linear-gradient(135deg, #4a9eff, #7ab8ff)'
                      : '#f1f5f9',
                    color: msg.role === 'user' ? 'white' : '#333',
                    fontSize: '0.9rem',
                    lineHeight: 1.5,
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '1rem',
                    background: '#f1f5f9',
                    color: '#666',
                  }}
                >
                  <span style={{ animation: 'pulse 1.5s infinite' }}>Thinking...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div
            style={{
              padding: '0.75rem 1rem',
              borderTop: '1px solid #e5e7eb',
              background: 'white',
            }}
          >
            {/* Quick action buttons */}
            <div style={{
              display: 'flex',
              gap: '0.5rem',
              marginBottom: '0.5rem',
              overflowX: 'auto',
              paddingBottom: '0.5rem',
            }}>
              <button
                onClick={() => setShowSkills(!showSkills)}
                style={{
                  padding: '0.4rem 0.75rem',
                  background: showSkills ? '#4a9eff' : '#f1f5f9',
                  color: showSkills ? 'white' : '#333',
                  border: 'none',
                  borderRadius: '1rem',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                🎯 Skills
              </button>
              {['Explain', 'Example', 'Quiz'].map((quick) => (
                <button
                  key={quick}
                  onClick={() => {
                    const skill = AGENT_SKILLS.find(s => s.name.includes(quick));
                    if (skill) handleSkillClick(skill);
                  }}
                  style={{
                    padding: '0.4rem 0.75rem',
                    background: '#f1f5f9',
                    color: '#333',
                    border: 'none',
                    borderRadius: '1rem',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {quick}
                </button>
              ))}
            </div>

            {/* Text input */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage(input);
                  }
                }}
                placeholder={selectedText ? `Ask about "${selectedText.slice(0, 20)}..."` : 'Ask anything about robotics...'}
                style={{
                  flex: 1,
                  padding: '0.75rem 1rem',
                  border: '2px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  fontSize: '0.9rem',
                  outline: 'none',
                }}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() && !selectedText}
                style={{
                  padding: '0.75rem 1rem',
                  background: input.trim() || selectedText
                    ? 'linear-gradient(135deg, #4a9eff, #7ab8ff)'
                    : '#e5e7eb',
                  color: input.trim() || selectedText ? 'white' : '#999',
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: input.trim() || selectedText ? 'pointer' : 'not-allowed',
                  fontWeight: 600,
                }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </>
  );
}
