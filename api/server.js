import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { QdrantClient } from '@qdrant/qdrant-js';
import translationsRouter from './routes/translations.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Prisma Client
const prisma = new PrismaClient();

// Initialize Qdrant Client
const qdrant = new QdrantClient({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
});

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);

    // Check if origin is in allowed list or matches Vercel preview deployments
    if (allowedOrigins.includes(origin) || origin.includes('.vercel.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

// ==================== AUTH ENDPOINTS ====================

// Signup endpoint
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, name, experienceLevel, primaryInterest } = req.body;

    // Validate required fields
    if (!email || !password || !experienceLevel || !primaryInterest) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || email.split('@')[0],
        experienceLevel,
        primaryInterest,
        preferredLanguage: 'en',
      },
    });

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: '7d',
    });

    // Return user data (without password) and token
    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        experienceLevel: user.experienceLevel,
        primaryInterest: user.primaryInterest,
        preferredLanguage: user.preferredLanguage,
      },
      token,
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Signup failed' });
  }
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: '7d',
    });

    // Return user data (without password) and token
    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        experienceLevel: user.experienceLevel,
        primaryInterest: user.primaryInterest,
        preferredLanguage: user.preferredLanguage,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Verify token endpoint
app.get('/api/auth/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        experienceLevel: user.experienceLevel,
        primaryInterest: user.primaryInterest,
        preferredLanguage: user.preferredLanguage,
      },
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Middleware to authenticate JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (token == null) return res.status(401).json({ error: 'Authentication token required' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

// Update user endpoint
app.put('/api/user/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, experienceLevel, primaryInterest, preferredLanguage } = req.body;

    // Ensure the authenticated user is updating their own profile
    if (req.user.userId !== id) {
      return res.status(403).json({ error: 'Unauthorized to update this user profile' });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name,
        experienceLevel,
        primaryInterest,
        preferredLanguage,
      },
    });

    res.json({
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        experienceLevel: updatedUser.experienceLevel,
        primaryInterest: updatedUser.primaryInterest,
        preferredLanguage: updatedUser.preferredLanguage,
      },
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user profile' });
  }
});
// ==================== PROGRESS ENDPOINTS ====================

// Get user progress
app.get('/api/progress', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET);

    const progress = await prisma.learningProgress.findMany({
      where: { userId: decoded.userId },
      orderBy: { updatedAt: 'desc' },
    });

    res.json({ progress });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ error: 'Failed to get progress' });
  }
});

// Update lesson progress
app.post('/api/progress', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET);

    const { lessonPath, completed, timeSpent, quizScore } = req.body;

    // Parse lesson path to get part, chapter, lesson numbers
    const match = lessonPath.match(/part(\d+)\/chapter(\d+)\/lesson(\d+)/);
    if (!match) {
      return res.status(400).json({ error: 'Invalid lesson path' });
    }

    const [, partNumber, chapterNumber, lessonNumber] = match;

    const progress = await prisma.learningProgress.upsert({
      where: {
        userId_lessonPath: {
          userId: decoded.userId,
          lessonPath,
        },
      },
      update: {
        completed,
        completedAt: completed ? new Date() : null,
        timeSpent,
        quizScore,
      },
      create: {
        userId: decoded.userId,
        lessonPath,
        partNumber: parseInt(partNumber),
        chapterNumber: parseInt(chapterNumber),
        lessonNumber: parseInt(lessonNumber),
        completed,
        completedAt: completed ? new Date() : null,
        timeSpent,
        quizScore,
      },
    });

    res.json({ progress });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ error: 'Failed to update progress' });
  }
});

// ==================== BOOKMARK ENDPOINTS ====================

// Get user bookmarks
app.get('/api/bookmarks', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET);

    const bookmarks = await prisma.bookmark.findMany({
      where: { userId: decoded.userId },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ bookmarks });
  } catch (error) {
    console.error('Get bookmarks error:', error);
    res.status(500).json({ error: 'Failed to get bookmarks' });
  }
});

// Add bookmark
app.post('/api/bookmarks', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET);

    const { lessonPath, lessonTitle, notes } = req.body;

    const bookmark = await prisma.bookmark.create({
      data: {
        userId: decoded.userId,
        lessonPath,
        lessonTitle,
        notes,
      },
    });

    res.status(201).json({ bookmark });
  } catch (error) {
    console.error('Add bookmark error:', error);
    res.status(500).json({ error: 'Failed to add bookmark' });
  }
});

// Delete bookmark
app.delete('/api/bookmarks/:id', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET);

    await prisma.bookmark.deleteMany({
      where: {
        id: req.params.id,
        userId: decoded.userId,
      },
    });

    res.json({ message: 'Bookmark deleted' });
  } catch (error) {
    console.error('Delete bookmark error:', error);
    res.status(500).json({ error: 'Failed to delete bookmark' });
  }
});

// ==================== CHAT HISTORY ENDPOINTS ====================

// Get chat history
app.get('/api/chat/history', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET);

    const history = await prisma.chatHistory.findMany({
      where: { userId: decoded.userId },
      orderBy: { createdAt: 'desc' },
      take: 50, // Limit to last 50 messages
    });

    res.json({ history });
  } catch (error) {
    console.error('Get chat history error:', error);
    res.status(500).json({ error: 'Failed to get chat history' });
  }
});

// Save chat message
app.post('/api/chat/message', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET);

    const { message, response, skill, context } = req.body;

    const chatMessage = await prisma.chatHistory.create({
      data: {
        userId: decoded.userId,
        message,
        response,
        skill,
        context,
      },
    });

    res.status(201).json({ chatMessage });
  } catch (error) {
    console.error('Save chat message error:', error);
    res.status(500).json({ error: 'Failed to save chat message' });
  }
});

// Register translation routes (Hackathon feature - Chapter translation tracking)
app.use('/api/user', translationsRouter);

// Start server only if not running in Vercel serverless environment
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`✅ Backend API server running on http://localhost:${PORT}`);
    console.log(`✅ CORS enabled for: http://localhost:3000, http://localhost:3001`);
    console.log(`✅ Database: ${process.env.DATABASE_URL ? 'Connected to Neon PostgreSQL' : 'No DATABASE_URL found'}`);
    console.log(`✅ Qdrant: ${process.env.QDRANT_URL ? 'Connected to Qdrant' : 'No QDRANT_URL found'}`);
  });

  // Graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\n👋 Shutting down gracefully...');
    await prisma.$disconnect();
    process.exit(0);
  });
}

// Export for Vercel serverless
export default app;
