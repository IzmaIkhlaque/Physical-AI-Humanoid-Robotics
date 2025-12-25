/**
 * RAG Chat Endpoint
 *
 * This route handles AI chat with Retrieval-Augmented Generation (RAG).
 * It uses Qdrant for vector search and Gemini for response generation.
 */

import express from 'express';
import { QdrantClient } from '@qdrant/qdrant-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Initialize clients (use process.env directly - loaded by server.js)
const qdrant = new QdrantClient({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
});

// Create Gemini client lazily to ensure env is loaded
const getGenAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY not found in environment variables');
  }
  return new GoogleGenerativeAI(apiKey);
};

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

const COLLECTION_NAME = 'textbook_lessons';

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

/**
 * Generate embedding for a text query
 */
async function generateEmbedding(text) {
  const genAI = getGenAI();
  const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
  const result = await model.embedContent(text);
  return result.embedding.values;
}

/**
 * Retrieve relevant context from Qdrant
 */
async function retrieveContext(query, limit = 3) {
  try {
    // Generate query embedding
    const queryEmbedding = await generateEmbedding(query);

    // Search Qdrant
    const searchResults = await qdrant.search(COLLECTION_NAME, {
      vector: queryEmbedding,
      limit,
      with_payload: true,
    });

    return searchResults.map(result => ({
      title: result.payload.title,
      content: result.payload.fullContent || result.payload.content,
      path: result.payload.path,
      score: result.score,
    }));
  } catch (error) {
    console.error('RAG retrieval error:', error);
    // Return empty context if retrieval fails
    return [];
  }
}

/**
 * Generate AI response with RAG
 */
async function generateRAGResponse(userMessage, skill, context) {
  // Build system prompt
  let systemPrompt = `You are an expert AI tutor for Physical AI and Humanoid Robotics. You help students learn by:
- Explaining complex concepts clearly
- Providing practical examples
- Encouraging hands-on learning
- Adapting to different skill levels

The user is learning from a comprehensive textbook on Physical AI and Humanoid Robotics.`;

  // Add skill-specific instructions
  if (skill) {
    const skillInstructions = {
      'explain': 'Provide a detailed explanation with clear structure and examples.',
      'example': 'Give concrete, real-world examples with specific applications.',
      'code': 'Provide Python or C++ code samples with explanations. Use proper syntax highlighting.',
      'quiz': 'Create an engaging quiz question with multiple choice options and a detailed answer explanation.',
      'summary': 'Provide a concise summary with key bullet points.',
      'diagram': 'Describe how to visualize this concept with a diagram or flowchart.',
      'compare': 'Compare and contrast concepts, highlighting key differences and similarities.',
      'analogy': 'Use a simple, relatable analogy to explain the concept.',
      'translate': 'Translate the explanation to Urdu (اردو). Use proper RTL formatting.',
      'simplify': 'Break down the concept into simple terms for beginners.',
    };

    const instruction = skillInstructions[skill];
    if (instruction) {
      systemPrompt += `\n\n**Current Task:** ${instruction}`;
    }
  }

  // Add retrieved context
  if (context && context.length > 0) {
    systemPrompt += `\n\n**Relevant Textbook Content:**\n\n`;
    context.forEach((ctx, i) => {
      systemPrompt += `[Source ${i + 1}: ${ctx.title}]\n${ctx.content.substring(0, 1500)}\n\n`;
    });
    systemPrompt += `Use this content to provide accurate, textbook-grounded responses.`;
  }

  // Generate response
  const genAI = getGenAI();
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  const chat = model.startChat({
    history: [
      {
        role: 'user',
        parts: [{ text: systemPrompt }],
      },
      {
        role: 'model',
        parts: [{ text: 'I understand. I will provide helpful, accurate responses based on the textbook content, adapting to the requested skill or format.' }],
      },
    ],
  });

  const result = await chat.sendMessage(userMessage);
  const response = result.response;
  return response.text();
}

/**
 * POST /api/chat/rag
 *
 * Main RAG chat endpoint
 *
 * Body:
 * - message: User's question/message
 * - skill: Optional skill ID (e.g., 'explain', 'code', 'quiz')
 * - context: Optional additional context from the page
 */
router.post('/rag', authenticateToken, async (req, res) => {
  try {
    const { message, skill, context: userContext } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log(`\n🤖 RAG Chat Request:`)
    console.log(`   User: ${req.user.userId}`);
    console.log(`   Message: "${message.substring(0, 50)}${message.length > 50 ? '...' : ''}"`);
    console.log(`   Skill: ${skill || 'general'}`);

    // Retrieve relevant context from Qdrant
    const retrievedContext = await retrieveContext(message, 3);
    console.log(`   Retrieved: ${retrievedContext.length} relevant lessons`);

    if (retrievedContext.length > 0) {
      console.log(`   Top match: ${retrievedContext[0].title} (score: ${retrievedContext[0].score.toFixed(3)})`);
    }

    // Generate RAG response
    const response = await generateRAGResponse(message, skill, retrievedContext);

    // Add sources to response
    let finalResponse = response;
    if (retrievedContext.length > 0) {
      finalResponse += '\n\n---\n**📚 Sources:**\n';
      retrievedContext.forEach((ctx, i) => {
        finalResponse += `${i + 1}. ${ctx.title} (${ctx.path})\n`;
      });
    }

    console.log(`   ✅ Response generated (${response.length} chars)\n`);

    res.json({
      response: finalResponse,
      sources: retrievedContext.map(ctx => ({
        title: ctx.title,
        path: ctx.path,
        score: ctx.score,
      })),
      skill,
    });
  } catch (error) {
    console.error('❌ RAG chat error:', error);
    res.status(500).json({
      error: 'Failed to generate response',
      message: error.message,
    });
  }
});

/**
 * GET /api/chat/health
 *
 * Check if RAG system is ready
 */
router.get('/health', async (req, res) => {
  try {
    // Check if collection exists
    const collections = await qdrant.getCollections();
    const collectionExists = collections.collections.some(c => c.name === COLLECTION_NAME);

    if (!collectionExists) {
      return res.json({
        status: 'not_ready',
        message: `Collection "${COLLECTION_NAME}" not found. Run indexing script first.`,
        collection: null,
      });
    }

    // Get collection info
    const collectionInfo = await qdrant.getCollection(COLLECTION_NAME);

    res.json({
      status: 'ready',
      message: 'RAG system is operational',
      collection: {
        name: COLLECTION_NAME,
        vectorsCount: collectionInfo.vectors_count,
        pointsCount: collectionInfo.points_count,
      },
    });
  } catch (error) {
    res.json({
      status: 'error',
      message: error.message,
    });
  }
});

export default router;
