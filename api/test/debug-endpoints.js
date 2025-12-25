/**
 * Debug script to test endpoints and see actual error responses
 */

const API_URL = 'http://localhost:5000';

async function testTranslation() {
  console.log('\n=== Testing Translation Endpoint ===\n');

  // First, create a test user
  const signupRes = await fetch(`${API_URL}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: `debug_${Date.now()}@test.com`,
      password: 'Test123!',
      name: 'Debug User',
      experienceLevel: 'intermediate',
      primaryInterest: 'robotics',
    }),
  });

  const { token, user } = await signupRes.json();
  console.log('1. Created user:', user.email);
  console.log('2. Token:', token.substring(0, 20) + '...\n');

  // Test translation tracking
  console.log('3. Testing /api/user/track-translation...');
  const transRes = await fetch(`${API_URL}/api/user/track-translation`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      chapterSlug: 'part1-chapter1-test',
    }),
  });

  console.log('   Status:', transRes.status);
  const transData = await transRes.json();
  console.log('   Response:', JSON.stringify(transData, null, 2));
}

async function testRAG() {
  console.log('\n\n=== Testing RAG Endpoint ===\n');

  // Create user
  const signupRes = await fetch(`${API_URL}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: `rag_debug_${Date.now()}@test.com`,
      password: 'Test123!',
      name: 'RAG Debug',
      experienceLevel: 'beginner',
      primaryInterest: 'ai',
    }),
  });

  const { token } = await signupRes.json();
  console.log('1. Created user with token\n');

  // Test RAG
  console.log('2. Testing /api/chat/rag...');
  const ragRes = await fetch(`${API_URL}/api/chat/rag`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      message: 'What is a robot?',
      skill: 'explain',
    }),
  });

  console.log('   Status:', ragRes.status);
  const ragData = await ragRes.json();
  console.log('   Response:', JSON.stringify(ragData, null, 2));
}

async function main() {
  try {
    await testTranslation();
    await testRAG();
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

main();
