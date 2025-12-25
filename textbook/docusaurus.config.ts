import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

const config: Config = {
  title: "Izma's Physical AI & Humanoid Robotics Textbook",
  tagline: 'Master the Future of Robotics - From Fundamentals to Advanced Applications',
  favicon: 'img/favicon.ico',

  // Production URL - update this when deploying
  url: 'https://physical-ai-humanoid-robotics-6qjj.vercel.app/',
  baseUrl: '/',

  customFields: {
    // In production (Vercel), API is on same domain at /api
    // In development, use localhost backend
    apiUrl: process.env.NODE_ENV === 'production'
      ? (process.env.API_URL || '') // Empty string means same-origin /api routes
      : (process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000'),
  },

  organizationName: 'izma',
  projectName: 'physical-ai-textbook',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Internationalization - English and Urdu
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ur'],
    localeConfigs: {
      en: {
        label: 'English',
        direction: 'ltr',
        htmlLang: 'en-US',
      },
      ur: {
        label: 'اردو',
        direction: 'rtl',
        htmlLang: 'ur-PK',
      },
    },
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
          // Remove edit links for production
        },
        blog: false, // Disable blog
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Social card image
    image: 'img/book-cover.svg',
    stylesheets: [
      {
        href: 'https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css',
        type: 'text/css',
      },
    ],

    // Color mode configuration
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },

    navbar: {
      title: "Izma's Textbook",
      logo: {
        // alt: 'Physical AI Textbook Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Start Reading',
        },
        {
          type: 'localeDropdown',
          position: 'left',
        },
        {
          href: 'https://github.com/IzmaIkhlaque/Physical-AI-Humanoid-Robotics/textbook',
          label: 'GitHub',
          position: 'right',
        },
        {
          to: '/login',
          label: 'Login',
          position: 'right',
        },
        {
          to: '/signup',
          label: 'Sign Up',
          position: 'right',
          className: 'primary',
        },
      ],
    },

    footer: {
      style: 'dark',
      links: [
        {
          title: 'Content',
          items: [
            {
              label: 'Part 1: Introduction to Physical AI',
              to: '/part1/chapter1-what-is-physical-ai/lesson1-defining-physical-ai',
            },
            {
              label: 'Part 2: Humanoid Robotics',
              to: '/part2/chapter1-humanoid-design/lesson1-biped-mechanics',
            },
            {
              label: 'Part 3: Sensors & Perception', // Renamed to AI for Robotics earlier, let's keep consistent with existing files
              to: '/part3/chapter1-perception-ai/lesson1',
            },
            {
              label: 'Part 4: Advanced Applications',
              to: '/part4/chapter1-industrial-applications/lesson1',
            },
            {
              label: 'Part 5: Societal Integration and Advanced Concepts',
              to: '/part5/intro',
            },
          ],
        },
        {
          title: 'Resources',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/IzmaIkhlaque/Physical-AI-Humanoid-Robotics/textbook',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Izma's Physical AI & Humanoid Robotics Textbook. Built with Docusaurus.`,
    },



    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['python', 'bash', 'cpp', 'json'],
    },

    // Announcement bar (optional - for important updates)
    announcementBar: {
      id: 'welcome',
      content: 'Welcome to the Physical AI & Humanoid Robotics Textbook! <a href="/part1/chapter1/lesson1">Start learning now →</a>',
      backgroundColor: '#001F3F',
      textColor: '#ffffff',
      isCloseable: true,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
