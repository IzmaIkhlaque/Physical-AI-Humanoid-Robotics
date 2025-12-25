import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useHistory } from '@docusaurus/router';

interface PersonalizeTipsProps {
  lessonSlug?: string;
}

interface Tip {
  icon: string;
  title: string;
  content: string;
}

export default function PersonalizeTips({ lessonSlug }: PersonalizeTipsProps): JSX.Element {
  const { isAuthenticated, user, isLoading } = useAuth();
  const history = useHistory();
  const [showOverlay, setShowOverlay] = useState(false);
  const [tips, setTips] = useState<Tip[]>([]);

  // Generate tips based on user level
  useEffect(() => {
    if (user && showOverlay) {
      const level = user.experienceLevel || 'beginner';
      const hardware = user.hardwareAccess || '';

      let levelTips: Tip[] = [];

      if (level === 'beginner') {
        levelTips = [
          {
            icon: '📚',
            title: 'Start with Fundamentals',
            content: 'Focus on understanding core concepts before diving into advanced topics. Don\'t rush - robotics is a journey!'
          },
          {
            icon: '💡',
            title: 'Visual Learning',
            content: 'Pay close attention to diagrams and illustrations. They simplify complex mechanical and electrical concepts.'
          },
          {
            icon: '🎯',
            title: 'Practice Activities',
            content: 'Complete the hands-on activities at the end of each lesson. Learning by doing is the best way to build intuition.'
          },
          {
            icon: '🤝',
            title: 'Join Communities',
            content: 'Connect with robotics communities online (Reddit r/robotics, Discord servers) to ask questions and share progress.'
          }
        ];
      } else if (level === 'intermediate') {
        levelTips = [
          {
            icon: '🔬',
            title: 'Deep Dive into Algorithms',
            content: 'Focus on understanding the math behind algorithms. Implement them from scratch to truly master the concepts.'
          },
          {
            icon: '🛠️',
            title: 'Build Projects',
            content: 'Apply what you learn by building actual robots. Start with simple bipedal walkers and gradually increase complexity.'
          },
          {
            icon: '📊',
            title: 'Benchmark Performance',
            content: 'Measure and optimize your implementations. Compare with state-of-the-art approaches and identify bottlenecks.'
          },
          {
            icon: '🔄',
            title: 'Iterate Rapidly',
            content: 'Don\'t aim for perfection initially. Build, test, learn, and iterate. Real-world robotics is all about continuous improvement.'
          }
        ];
      } else {
        // Advanced
        levelTips = [
          {
            icon: '🚀',
            title: 'Research Papers',
            content: 'Read cutting-edge research from ICRA, IROS, CoRL conferences. Stay updated with latest breakthroughs in humanoid robotics.'
          },
          {
            icon: '⚡',
            title: 'Optimize Everything',
            content: 'Focus on real-time performance, energy efficiency, and robustness. Profile your code and use hardware acceleration (CUDA, TensorRT).'
          },
          {
            icon: '🎓',
            title: 'Contribute to Open Source',
            content: 'Contribute to ROS2, MuJoCo, or other robotics frameworks. Share your innovations with the community.'
          },
          {
            icon: '🏆',
            title: 'Challenge Yourself',
            content: 'Participate in robotics competitions (DARPA, RoboCup). Solve unsolved problems in manipulation, navigation, or HRI.'
          }
        ];
      }

      // Add hardware-specific tip if user has specified hardware
      if (hardware && hardware.trim().length > 0) {
        levelTips.push({
          icon: '🔧',
          title: 'Your Hardware',
          content: `Great! You have access to: ${hardware}. Look for lessons and activities that leverage your specific setup. Hands-on practice with real hardware is invaluable!`
        });
      }

      setTips(levelTips);
    }
  }, [user, showOverlay]);

  const handleClick = () => {
    if (!isAuthenticated) {
      // Redirect to login
      history.push('/login');

      // Show toast
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('show-toast', {
          detail: {
            message: 'Login required to access personalized tips',
            type: 'info'
          }
        });
        window.dispatchEvent(event);
      }
      return;
    }

    setShowOverlay(true);
  };

  const handleClose = () => {
    setShowOverlay(false);
  };

  // Don't render while loading
  if (isLoading) {
    return null;
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={handleClick}
        style={{
          position: 'fixed',
          bottom: isAuthenticated ? '100px' : '30px', // Adjust if ChatKit button is present
          right: '30px',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          border: 'none',
          boxShadow: '0 4px 20px rgba(245, 87, 108, 0.4)',
          cursor: 'pointer',
          fontSize: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999,
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 6px 30px rgba(245, 87, 108, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(245, 87, 108, 0.4)';
        }}
        title={isAuthenticated ? 'Get Personalized Tips' : 'Login for Personalized Tips'}
      >
        💡
      </button>

      {/* Overlay Modal */}
      {showOverlay && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
          }}
          onClick={handleClose}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 147, 251, 0.1) 100%)',
              borderRadius: '20px',
              padding: '40px',
              maxWidth: '700px',
              width: '100%',
              maxHeight: '80vh',
              overflowY: 'auto',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'rgba(0, 0, 0, 0.1)',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                fontSize: '24px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(0, 0, 0, 0.1)';
              }}
            >
              ✕
            </button>

            {/* Header */}
            <div style={{ marginBottom: '30px' }}>
              <h2 style={{
                fontSize: '2rem',
                fontWeight: 800,
                background: 'linear-gradient(135deg, #f093fb, #f5576c)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                margin: '0 0 10px 0',
              }}>
                💡 Personalized Tips
              </h2>
              <p style={{
                fontSize: '1rem',
                color: '#666',
                margin: 0,
              }}>
                Tailored for <strong>{user?.experienceLevel || 'beginner'}</strong> level learners
              </p>
            </div>

            {/* Tips Grid */}
            <div style={{
              display: 'grid',
              gap: '20px',
            }}>
              {tips.map((tip, index) => (
                <div
                  key={index}
                  style={{
                    background: 'white',
                    borderRadius: '12px',
                    padding: '20px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '15px' }}>
                    <span style={{ fontSize: '32px', flexShrink: 0 }}>{tip.icon}</span>
                    <div>
                      <h3 style={{
                        fontSize: '1.2rem',
                        fontWeight: 700,
                        color: '#333',
                        margin: '0 0 8px 0',
                      }}>
                        {tip.title}
                      </h3>
                      <p style={{
                        fontSize: '0.95rem',
                        color: '#666',
                        margin: 0,
                        lineHeight: '1.6',
                      }}>
                        {tip.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div style={{
              marginTop: '30px',
              padding: '20px',
              background: 'rgba(245, 87, 108, 0.1)',
              borderRadius: '12px',
              textAlign: 'center',
            }}>
              <p style={{
                fontSize: '0.9rem',
                color: '#666',
                margin: 0,
              }}>
                💪 You can update your experience level and hardware in your profile settings.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
