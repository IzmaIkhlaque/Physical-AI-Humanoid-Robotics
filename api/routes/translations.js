import express from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// POST /api/user/track-translation
// Track when a user translates a chapter to Urdu
router.post('/track-translation', authenticateToken, async (req, res) => {
  try {
    const { chapterSlug } = req.body;
    const userId = req.user.userId; // JWT payload has userId, not id

    if (!chapterSlug) {
      return res.status(400).json({ error: 'Chapter slug required' });
    }

    // Check if this chapter was already translated by this user
    const existing = await prisma.chapterTranslation.findUnique({
      where: {
        userId_chapterSlug: {
          userId,
          chapterSlug
        }
      }
    });

    if (existing) {
      // Already translated - no new points
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { translationPoints: true }
      });

      return res.json({
        pointsEarned: 0,
        totalPoints: user.translationPoints,
        message: 'Chapter already translated',
        alreadyTranslated: true
      });
    }

    // Get user's current points
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { translationPoints: true }
    });

    // Calculate points (5 points per chapter, max 50 total)
    const currentPoints = user.translationPoints || 0;
    const maxPoints = 50;
    const pointsPerChapter = 5;

    if (currentPoints >= maxPoints) {
      // Already at max points
      return res.json({
        pointsEarned: 0,
        totalPoints: currentPoints,
        message: 'Maximum points already earned!',
        maxReached: true
      });
    }

    // Award points
    const pointsToAward = Math.min(pointsPerChapter, maxPoints - currentPoints);

    // Create translation record and update user points in a transaction
    const result = await prisma.$transaction([
      prisma.chapterTranslation.create({
        data: {
          userId,
          chapterSlug,
          pointsEarned: pointsToAward
        }
      }),
      prisma.user.update({
        where: { id: userId },
        data: {
          translationPoints: currentPoints + pointsToAward
        }
      })
    ]);

    const updatedUser = result[1];

    return res.json({
      pointsEarned: pointsToAward,
      totalPoints: updatedUser.translationPoints,
      message: `+${pointsToAward} points earned!`,
      isNewTranslation: true
    });

  } catch (error) {
    console.error('Translation tracking error:', error);
    return res.status(500).json({ error: 'Failed to track translation' });
  }
});

// GET /api/user/translation-stats
// Get user's translation statistics
router.get('/translation-stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        chapterTranslations: {
          orderBy: { translatedAt: 'desc' }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({
      totalPoints: user.translationPoints,
      maxPoints: 50,
      chaptersTranslated: user.chapterTranslations.length,
      recentTranslations: user.chapterTranslations.slice(0, 5),
      progressPercentage: Math.round((user.translationPoints / 50) * 100)
    });

  } catch (error) {
    console.error('Stats fetch error:', error);
    return res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export default router;
