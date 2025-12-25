import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import { useAuth } from '../../../src/hooks/useAuth';
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
        <text x="200" y="460" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold" fontFamily="'Noto Nastaliq Urdu', sans-serif">
          فزیکل AI اور
        </text>
        <text x="200" y="485" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold" fontFamily="'Noto Nastaliq Urdu', sans-serif">
          ہیومنائڈ روبوٹکس
        </text>
        <text x="200" y="515" textAnchor="middle" fill="#4a9eff" fontSize="14" fontFamily="'Noto Nastaliq Urdu', sans-serif">
          از عزمیٰ
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
    { number: '4', label: 'حصے' },
    { number: '19', label: 'ابواب' },
    { number: '100+', label: 'اسباق' },
    { number: '2', label: 'زبانیں' },
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
          <span className={styles.heroTag}>انٹرایکٹو ڈیجیٹل نصابی کتاب</span>
          <h1 className={styles.heroTitle}>
            فزیکل AI اور<br />
            <span className={styles.heroTitleAccent}>ہیومنائڈ روبوٹکس</span>
          </h1>
          <p className={styles.heroSubtitle}>
            AI سے چلنے والے ہیومنائڈز، سینسر سسٹمز، کنٹرول الگورتھمز اور حقیقی دنیا کی ایپلیکیشنز پر جامع اسباق کے ساتھ روبوٹکس کے مستقبل میں مہارت حاصل کریں۔
          </p>

          <div className={styles.heroButtons}>
            <Link to="/part1/intro" className={styles.primaryButton}>
              پڑھنا شروع کریں
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
            <Link to="/part1/chapter1-what-is-physical-ai/lesson1-defining-physical-ai" className={styles.secondaryButton}>
              ابواب دیکھیں
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
      title: 'حصہ 1: فزیکل AI کا تعارف',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 6v6l4 2"/>
        </svg>
      ),
      description: 'فزیکل AI کی بنیادیں، مجسم ذہانت، تاریخ اور بنیادی تصورات۔',
      link: '/part1/intro',
    },
    {
      title: 'حصہ 2: ہیومنائڈ روبوٹکس',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="7" r="4"/>
          <path d="M5.5 21v-2a7 7 0 0 1 13 0v2"/>
        </svg>
      ),
      description: 'ہیومنائڈ روبوٹ ڈیزائن، کائنیمیٹکس، ڈائنامکس اور دوپائی حرکت۔',
      link: '/part2/intro',
    },
    {
      title: 'حصہ 3: سینسرز اور ادراک',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3"/>
          <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
        </svg>
      ),
      description: 'بصارت کے نظام، لمسی سینسرز، اندرونی حس اور سینسر فیوژن۔',
      link: '/part3/intro',
    },
    {
      title: 'حصہ 4: جدید ایپلیکیشنز',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
      ),
      description: 'صنعتی آٹومیشن، صحت کی دیکھ بھال، خلائی تحقیق اور مستقبل کے رجحانات۔',
      link: '/part4/intro',
    },
  ];

  return (
    <section className={styles.partsSection}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>نصابی کتاب دریافت کریں</h2>
        <p className={styles.sectionSubtitle}>
          فزیکل AI اور ہیومنائڈ روبوٹکس کی جامع کوریج
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
      title: 'AI سے چلنے والی تعلیم',
      description: 'OpenAI Agents SDK سے چلنے والے ہمارے ChatKit اسسٹنٹ کے ساتھ فوری مدد حاصل کریں۔',
    },
    {
      icon: '🌐',
      title: 'دو لسانی سپورٹ',
      description: 'مکمل RTL سپورٹ کے ساتھ انگریزی اور اردو میں دستیاب۔',
    },
    {
      icon: '📊',
      title: 'انٹرایکٹو ڈایاگرامز',
      description: '35+ تکنیکی ڈایاگرامز جو پیچیدہ روبوٹکس تصورات کی وضاحت کرتے ہیں۔',
    },
    {
      icon: '✅',
      title: 'خود تشخیص',
      description: 'اپنی سمجھ کو جانچنے کے لیے MCQs اور مشقیں۔',
    },
    {
      icon: '💡',
      title: 'ذاتی نوعیت کے مشورے',
      description: 'آپ کی تجربے کی سطح کی بنیاد پر سیکھنے کی سفارشات۔',
    },
    {
      icon: '🔒',
      title: 'پریمیم خصوصیات',
      description: 'اپنے اکاؤنٹ کے ساتھ ChatKit، ترجمے اور مزید تک رسائی حاصل کریں۔',
    },
  ];

  return (
    <section className={styles.featuresSection}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>ہمارے ساتھ کیوں سیکھیں؟</h2>
        <p className={styles.sectionSubtitle}>
          روبوٹکس کے مستقبل کے لیے ڈیزائن کیا گیا جدید سیکھنے کا تجربہ
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
        <h2>فزیکل AI میں مہارت حاصل کرنے کے لیے تیار ہیں؟</h2>
        <p>ہزاروں سیکھنے والوں کے ساتھ شامل ہوں جو ہیومنائڈ روبوٹکس کے مستقبل کی تلاش کر رہے ہیں۔</p>
        <div className={styles.ctaButtons}>
          <Link to="/signup" className={styles.ctaPrimary}>
            مفت اکاؤنٹ بنائیں
          </Link>
          <Link to="/part1/intro" className={styles.ctaSecondary}>
            ابھی پڑھنا شروع کریں
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
      title="فزیکل AI اور ہیومنائڈ روبوٹکس کی نصابی کتاب"
      description="AI سے چلنے والے ہیومنائڈز، سینسر سسٹمز، کنٹرول الگورتھمز اور حقیقی دنیا کی ایپلیکیشنز پر جامع اسباق کے ساتھ روبوٹکس کے مستقبل میں مہارت حاصل کریں۔">
      <main className={styles.main}>
        <HeroSection />
        <PartsSection />
        <LearningFeatures />
        {!user && <CTASection />}
      </main>
    </Layout>
  );
}
