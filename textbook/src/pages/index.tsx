import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import { useAuth } from '../hooks/useAuth';
import styles from './index.module.css';

// Book Cover Component
function BookCover() {
  return (
    <div className={styles.bookCover}>
      <svg viewBox="0 0 400 560" className={styles.bookSvg}>
        {/* Book Background with Gradient */}
        <defs>
          <linearGradient id="bookGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#001F3F" />
            <stop offset="50%" stopColor="#003366" />
            <stop offset="100%" stopColor="#001F3F" />
          </linearGradient>
          <linearGradient id="accentGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4a9eff" />
            <stop offset="100%" stopColor="#7ab8ff" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Book Shape */}
        <rect x="20" y="20" width="360" height="520" rx="8" fill="url(#bookGradient)" stroke="#4a9eff" strokeWidth="2"/>

        {/* Spine Effect */}
        <rect x="20" y="20" width="25" height="520" fill="rgba(0,0,0,0.3)" rx="8"/>

        {/* Circuit Pattern */}
        <g stroke="#4a9eff" strokeWidth="1" opacity="0.3" fill="none">
          <path d="M60 80 L200 80 L200 120 L340 120" />
          <path d="M60 160 L150 160 L150 200 L300 200" />
          <path d="M60 440 L250 440 L250 480 L340 480" />
          <circle cx="200" cy="80" r="4" fill="#4a9eff"/>
          <circle cx="340" cy="120" r="4" fill="#4a9eff"/>
          <circle cx="150" cy="160" r="4" fill="#4a9eff"/>
        </g>

        {/* Humanoid Robot Silhouette */}
        <g transform="translate(120, 180)" filter="url(#glow)">
          {/* Head */}
          <ellipse cx="80" cy="30" rx="35" ry="30" fill="none" stroke="url(#accentGradient)" strokeWidth="2"/>
          <circle cx="65" cy="25" r="8" fill="#4a9eff" opacity="0.8"/>
          <circle cx="95" cy="25" r="8" fill="#4a9eff" opacity="0.8"/>

          {/* Body */}
          <path d="M45 60 L80 70 L115 60 L110 140 L50 140 Z" fill="none" stroke="url(#accentGradient)" strokeWidth="2"/>

          {/* Arms */}
          <path d="M45 70 L20 100 L15 140" fill="none" stroke="url(#accentGradient)" strokeWidth="2"/>
          <path d="M115 70 L140 100 L145 140" fill="none" stroke="url(#accentGradient)" strokeWidth="2"/>

          {/* Legs */}
          <path d="M55 140 L50 200 L45 220" fill="none" stroke="url(#accentGradient)" strokeWidth="2"/>
          <path d="M105 140 L110 200 L115 220" fill="none" stroke="url(#accentGradient)" strokeWidth="2"/>

          {/* AI Brain Glow */}
          <circle cx="80" cy="30" r="15" fill="url(#accentGradient)" opacity="0.3">
            <animate attributeName="opacity" values="0.3;0.6;0.3" dur="2s" repeatCount="indefinite"/>
          </circle>
        </g>

        {/* Title */}
        <text x="200" y="460" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold" fontFamily="Inter, sans-serif">
          Physical AI &amp;
        </text>
        <text x="200" y="485" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold" fontFamily="Inter, sans-serif">
          Humanoid Robotics
        </text>
        <text x="200" y="515" textAnchor="middle" fill="#4a9eff" fontSize="14" fontFamily="Inter, sans-serif">
          By Izma
        </text>
      </svg>
    </div>
  );
}

// Feature Card Component
interface FeatureProps {
  title: string;
  icon: React.ReactNode;
  description: string;
  link: string;
}

function FeatureCard({ title, icon, description, link }: FeatureProps) {
  return (
    <Link to={link} className={styles.featureCard}>
      <div className={styles.featureIcon}>{icon}</div>
      <h3 className={styles.featureTitle}>{title}</h3>
      <p className={styles.featureDescription}>{description}</p>
      <span className={styles.featureArrow}>→</span>
    </Link>
  );
}

// Stats Component
function Stats() {
  const stats = [
    { number: '4', label: 'Parts' },
    { number: '19', label: 'Chapters' },
    { number: '100+', label: 'Lessons' },
    { number: '2', label: 'Languages' },
  ];

  return (
    <div className={styles.statsContainer}>
      {stats.map((stat, idx) => (
        <div key={idx} className={styles.statItem}>
          <span className={styles.statNumber}>{stat.number}</span>
          <span className={styles.statLabel}>{stat.label}</span>
        </div>
      ))}
    </div>
  );
}

// Main Hero Section
function HeroSection() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <section className={styles.hero}>
      <div className={styles.heroBackground}>
        <div className={styles.heroGlow} />
      </div>

      <div className={styles.heroContent}>
        <div className={styles.heroText}>
          <span className={styles.heroTag}>Interactive Digital Textbook</span>
          <h1 className={styles.heroTitle}>
            Physical AI &<br />
            <span className={styles.heroTitleAccent}>Humanoid Robotics</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Master the future of robotics with comprehensive lessons on AI-powered humanoids,
            sensor systems, control algorithms, and real-world applications.
          </p>

          <div className={styles.heroButtons}>
            <Link to="/part1/intro" className={styles.primaryButton}>
              Start Reading
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
            <Link to="/part1/chapter1-what-is-physical-ai/lesson1-defining-physical-ai" className={styles.secondaryButton}>
              Browse Chapters
            </Link>
          </div>

          <Stats />
        </div>

        <div className={styles.heroVisual}>
          <BookCover />
        </div>
      </div>
    </section>
  );
}

// Parts Section
function PartsSection() {
  const parts = [
    {
      title: 'Part 1: Introduction to Physical AI',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 6v6l4 2"/>
        </svg>
      ),
      description: 'Foundations of Physical AI, embodied intelligence, history, and core concepts.',
      link: '/part1/intro',
    },
    {
      title: 'Part 2: Humanoid Robotics',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="7" r="4"/>
          <path d="M5.5 21v-2a7 7 0 0 1 13 0v2"/>
        </svg>
      ),
      description: 'Humanoid robot design, kinematics, dynamics, and bipedal locomotion.',
      link: '/part2/intro',
    },
    {
      title: 'Part 3: Sensors & Perception',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3"/>
          <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
        </svg>
      ),
      description: 'Vision systems, tactile sensors, proprioception, and sensor fusion.',
      link: '/part3/intro',
    },
    {
      title: 'Part 4: Advanced Applications',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
      ),
      description: 'Industrial automation, healthcare, space exploration, and future trends.',
      link: '/part4/intro',
    },
  ];

  return (
    <section className={styles.partsSection}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Explore the Textbook</h2>
        <p className={styles.sectionSubtitle}>
          Comprehensive coverage of Physical AI and Humanoid Robotics
        </p>
      </div>

      <div className={styles.partsGrid}>
        {parts.map((part, idx) => (
          <FeatureCard key={idx} {...part} />
        ))}
      </div>
    </section>
  );
}

// Learning Features Section
function LearningFeatures() {
  const features = [
    {
      icon: '🤖',
      title: 'AI-Powered Learning',
      description: 'Get instant help with our ChatKit assistant powered by OpenAI Agents SDK.',
    },
    {
      icon: '🌐',
      title: 'Bilingual Support',
      description: 'Available in English and Urdu with full RTL support.',
    },
    {
      icon: '📊',
      title: 'Interactive Diagrams',
      description: '35+ technical diagrams explaining complex robotics concepts.',
    },
    {
      icon: '✅',
      title: 'Self-Assessment',
      description: 'MCQs and exercises to test your understanding.',
    },
    {
      icon: '💡',
      title: 'Personalized Tips',
      description: 'Learning recommendations based on your experience level.',
    },
    {
      icon: '🔒',
      title: 'Premium Features',
      description: 'Access ChatKit, translations, and more with your account.',
    },
  ];

  return (
    <section className={styles.featuresSection}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Why Learn With Us?</h2>
        <p className={styles.sectionSubtitle}>
          Modern learning experience designed for the future of robotics
        </p>
      </div>

      <div className={styles.featuresGrid}>
        {features.map((feature, idx) => (
          <div key={idx} className={styles.featureItem}>
            <span className={styles.featureEmoji}>{feature.icon}</span>
            <h4>{feature.title}</h4>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// CTA Section
function CTASection() {
  return (
    <section className={styles.ctaSection}>
      <div className={styles.ctaContent}>
        <h2>Ready to Master Physical AI?</h2>
        <p>Join thousands of learners exploring the future of humanoid robotics.</p>
        <div className={styles.ctaButtons}>
          <Link to="/signup" className={styles.ctaPrimary}>
            Create Free Account
          </Link>
          <Link to="/part1/intro" className={styles.ctaSecondary}>
            Start Reading Now
          </Link>
        </div>
      </div>
    </section>
  );
}

// Main Home Component
export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  const { user } = useAuth();

  return (
    <Layout
      title="Physical AI & Humanoid Robotics Textbook"
      description="Master the future of robotics with comprehensive lessons on AI-powered humanoids, sensor systems, control algorithms, and real-world applications.">
      <main className={styles.main}>
        <HeroSection />
        <PartsSection />
        <LearningFeatures />
        {!user && <CTASection />}
      </main>
    </Layout>
  );
}
