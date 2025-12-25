/**
 * Qdrant Textbook Indexer
 *
 * This script indexes all textbook lessons into Qdrant vector database
 * for RAG (Retrieval Augmented Generation) in the ChatKit AI assistant.
 *
 * Usage: node api/scripts/index-textbook.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { QdrantClient } from '@qdrant/qdrant-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

// ES module dirname workaround
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Initialize clients
const qdrant = new QdrantClient({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIzaSyAdYcDO6sT-DUJMoft7U80MRNLi7A1js4A');

// Configuration
const COLLECTION_NAME = 'textbook_lessons';
const EMBEDDING_DIMENSION = 768; // Gemini embedding dimension
const TEXTBOOK_PATH = path.join(__dirname, '../../textbook/docs');

/**
 * Extract frontmatter and content from markdown
 */
function parseMarkdown(content) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return { frontmatter: {}, content: content.trim() };
  }

  const [, frontmatterText, markdownContent] = match;
  const frontmatter = {};

  // Parse YAML-like frontmatter
  frontmatterText.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      let value = line.substring(colonIndex + 1).trim();
      // Remove quotes
      value = value.replace(/^["']|["']$/g, '');
      frontmatter[key] = value;
    }
  });

  return { frontmatter, content: markdownContent.trim() };
}

/**
 * Generate embedding using Gemini
 */
async function generateEmbedding(text) {
  try {
    const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
    const result = await model.embedContent(text);
    return result.embedding.values;
  } catch (error) {
    console.error('  ❌ Embedding error:', error.message);
    throw error;
  }
}

/**
 * Recursively find all markdown files
 */
function findMarkdownFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      findMarkdownFiles(filePath, fileList);
    } else if (file.endsWith('.md')) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

/**
 * Create or recreate Qdrant collection
 */
async function setupCollection() {
  console.log('\n📦 Setting up Qdrant collection...');

  try {
    // Check if collection exists
    const collections = await qdrant.getCollections();
    const exists = collections.collections.some(c => c.name === COLLECTION_NAME);

    if (exists) {
      console.log(`  ⚠️  Collection "${COLLECTION_NAME}" exists. Deleting...`);
      await qdrant.deleteCollection(COLLECTION_NAME);
    }

    // Create new collection
    await qdrant.createCollection(COLLECTION_NAME, {
      vectors: {
        size: EMBEDDING_DIMENSION,
        distance: 'Cosine',
      },
    });

    console.log(`  ✅ Created collection "${COLLECTION_NAME}"`);
    console.log(`     - Vector dimension: ${EMBEDDING_DIMENSION}`);
    console.log(`     - Distance metric: Cosine`);
  } catch (error) {
    console.error('  ❌ Collection setup failed:', error.message);
    throw error;
  }
}

/**
 * Index a single lesson
 */
async function indexLesson(filePath, index) {
  const relativePath = path.relative(TEXTBOOK_PATH, filePath);
  const content = fs.readFileSync(filePath, 'utf-8');
  const { frontmatter, content: markdownContent } = parseMarkdown(content);

  // Extract metadata from path
  const pathParts = relativePath.split(path.sep);
  const part = pathParts[0]; // e.g., "part1"
  const chapter = pathParts[1] || ''; // e.g., "chapter1-what-is-physical-ai"
  const lesson = pathParts[2] || ''; // e.g., "lesson1-defining-physical-ai.md"

  // Create search text (combines title, description, and content)
  const searchText = [
    frontmatter.title || '',
    frontmatter.description || '',
    markdownContent.substring(0, 2000), // First 2000 chars for context
  ].filter(Boolean).join('\n\n');

  // Generate embedding
  console.log(`  [${index}] Embedding: ${relativePath}`);
  const embedding = await generateEmbedding(searchText);

  // Create payload
  const payload = {
    path: relativePath,
    part,
    chapter,
    lesson,
    title: frontmatter.title || lesson.replace('.md', ''),
    description: frontmatter.description || '',
    content: markdownContent.substring(0, 5000), // Store first 5000 chars
    fullContent: markdownContent, // Store full content for retrieval
  };

  // Upsert to Qdrant
  await qdrant.upsert(COLLECTION_NAME, {
    wait: true,
    points: [
      {
        id: index,
        vector: embedding,
        payload,
      },
    ],
  });

  return payload;
}

/**
 * Main indexing function
 */
async function main() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('📚 TEXTBOOK QDRANT INDEXER - RAG Pipeline Setup');
  console.log('═══════════════════════════════════════════════════════════\n');

  console.log('📍 Configuration:');
  console.log(`   Textbook Path: ${TEXTBOOK_PATH}`);
  console.log(`   Qdrant URL: ${process.env.QDRANT_URL}`);
  console.log(`   Collection: ${COLLECTION_NAME}`);
  console.log(`   Embedding Model: Gemini text-embedding-004`);

  // Find all markdown files
  console.log('\n🔍 Scanning for markdown files...');
  const markdownFiles = findMarkdownFiles(TEXTBOOK_PATH);
  console.log(`   Found ${markdownFiles.length} lessons\n`);

  // Setup collection
  await setupCollection();

  // Index all lessons
  console.log('\n📝 Indexing lessons (this will take ~5-10 minutes)...\n');

  const results = [];
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < markdownFiles.length; i++) {
    try {
      const payload = await indexLesson(markdownFiles[i], i + 1);
      results.push(payload);
      successCount++;
      console.log(`     ✅ Indexed: ${payload.title}`);

      // Rate limiting for Gemini API
      if ((i + 1) % 5 === 0 && i < markdownFiles.length - 1) {
        console.log(`     ⏳ Rate limit pause (13s)...\n`);
        await new Promise(resolve => setTimeout(resolve, 13000));
      } else {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      failCount++;
      console.error(`     ❌ Failed: ${markdownFiles[i]}`);
      console.error(`        Error: ${error.message}\n`);
    }
  }

  // Summary
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('✅ INDEXING COMPLETE!');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`   Total Lessons: ${markdownFiles.length}`);
  console.log(`   ✅ Successful: ${successCount}`);
  console.log(`   ❌ Failed: ${failCount}`);
  console.log(`   📦 Collection: ${COLLECTION_NAME}`);
  console.log(`   🔍 Ready for RAG queries!\n`);

  // Test query
  console.log('🧪 Running test query...');
  try {
    const testQuery = 'What is inverse kinematics?';
    const testEmbedding = await generateEmbedding(testQuery);
    const searchResults = await qdrant.search(COLLECTION_NAME, {
      vector: testEmbedding,
      limit: 3,
    });

    console.log(`\n   Query: "${testQuery}"`);
    console.log(`   Top 3 results:\n`);
    searchResults.forEach((result, i) => {
      console.log(`   ${i + 1}. ${result.payload.title} (score: ${result.score.toFixed(3)})`);
      console.log(`      Path: ${result.payload.path}`);
    });
  } catch (error) {
    console.error('   ❌ Test query failed:', error.message);
  }

  console.log('\n✨ All done! RAG pipeline is ready.\n');
}

// Run
main().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
