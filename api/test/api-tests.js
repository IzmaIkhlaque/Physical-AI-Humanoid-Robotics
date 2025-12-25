/**
 * API Integration Tests
 *
 * Quick test suite to validate critical backend functionality
 *
 * Usage: node api/test/api-tests.js
 */

import dotenv from 'dotenv';
dotenv.config();

const API_URL = process.env.API_URL || 'http://localhost:5000';

// Test results tracking
const results = {
  passed: 0,
  failed: 0,
  tests: [],
};

/**
 * Helper function to make API requests
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await response.json();
  return { status: response.status, data };
}

/**
 * Test assertion helper
 */
function assert(condition, testName, message = '') {
  if (condition) {
    console.log(`  ✅ ${testName}`);
    results.passed++;
    results.tests.push({ name: testName, status: 'PASS', message });
  } else {
    console.log(`  ❌ ${testName}`);
    console.log(`     ${message}`);
    results.failed++;
    results.tests.push({ name: testName, status: 'FAIL', message });
  }
}

// Test state
let testUser = {
  email: `test_${Date.now()}@example.com`,
  password: 'TestPassword123!',
  token: null,
};

/**
 * Test Suite 1: Health Check
 */
async function testHealthCheck() {
  console.log('\n📍 Test Suite 1: Health Check');

  try {
    const { status, data } = await apiRequest('/api/health');
    assert(status === 200, 'Health endpoint returns 200');
    assert(data.status === 'ok', 'Health status is ok');
  } catch (error) {
    assert(false, 'Health endpoint accessible', error.message);
  }
}

/**
 * Test Suite 2: Authentication
 */
async function testAuthentication() {
  console.log('\n🔐 Test Suite 2: Authentication');

  // Test 1: Signup
  try {
    const { status, data } = await apiRequest('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password,
        name: 'Test User',
        experienceLevel: 'intermediate',
        primaryInterest: 'humanoid-robotics',
      }),
    });

    assert(status === 201, 'Signup returns 201');
    assert(data.user && data.token, 'Signup returns user and token');
    assert(data.user.email === testUser.email, 'User email matches');

    if (data.token) {
      testUser.token = data.token;
      testUser.userId = data.user.id;
    }
  } catch (error) {
    assert(false, 'Signup endpoint works', error.message);
  }

  // Test 2: Login
  try {
    const { status, data } = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password,
      }),
    });

    assert(status === 200, 'Login returns 200');
    assert(data.user && data.token, 'Login returns user and token');
  } catch (error) {
    assert(false, 'Login endpoint works', error.message);
  }

  // Test 3: Token verification
  try {
    const { status, data } = await apiRequest('/api/auth/me', {
      headers: {
        Authorization: `Bearer ${testUser.token}`,
      },
    });

    assert(status === 200, 'Token verification returns 200');
    assert(data.user && data.user.email === testUser.email, 'Token returns correct user');
  } catch (error) {
    assert(false, 'Token verification works', error.message);
  }

  // Test 4: Invalid token
  try {
    const { status } = await apiRequest('/api/auth/me', {
      headers: {
        Authorization: 'Bearer invalid_token_12345',
      },
    });

    assert(status === 401, 'Invalid token returns 401');
  } catch (error) {
    assert(false, 'Invalid token handling works', error.message);
  }
}

/**
 * Test Suite 3: Translation Tracking (Hackathon Feature)
 */
async function testTranslationTracking() {
  console.log('\n🌐 Test Suite 3: Translation Tracking');

  if (!testUser.token) {
    console.log('  ⚠️  Skipping: No auth token available');
    return;
  }

  // Test 1: Track first translation
  try {
    const { status, data } = await apiRequest('/api/user/track-translation', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${testUser.token}`,
      },
      body: JSON.stringify({
        chapterSlug: 'part1-chapter1-what-is-physical-ai',
      }),
    });

    assert(status === 200, 'Translation tracking returns 200');
    assert(data.pointsEarned === 5, 'First translation awards 5 points');
    assert(data.totalPoints === 5, 'Total points is 5');
    assert(data.isNewTranslation === true, 'Marked as new translation');
  } catch (error) {
    assert(false, 'Translation tracking works', error.message);
  }

  // Test 2: Track same chapter again (no duplicate points)
  try {
    const { status, data } = await apiRequest('/api/user/track-translation', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${testUser.token}`,
      },
      body: JSON.stringify({
        chapterSlug: 'part1-chapter1-what-is-physical-ai',
      }),
    });

    assert(status === 200, 'Duplicate translation returns 200');
    assert(data.pointsEarned === 0, 'Duplicate translation awards 0 points');
    assert(data.alreadyTranslated === true, 'Marked as already translated');
  } catch (error) {
    assert(false, 'Duplicate translation handling works', error.message);
  }

  // Test 3: Track multiple chapters
  const chapters = [
    'part1-chapter2-foundations-of-robotics',
    'part1-chapter3-ai-fundamentals',
    'part2-chapter1-bipedal-locomotion',
  ];

  for (const chapter of chapters) {
    try {
      const { status, data } = await apiRequest('/api/user/track-translation', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${testUser.token}`,
        },
        body: JSON.stringify({ chapterSlug: chapter }),
      });

      assert(status === 200, `Translation tracking for ${chapter} works`);
      assert(data.pointsEarned === 5, `Earned 5 points for ${chapter}`);
    } catch (error) {
      assert(false, `Track ${chapter}`, error.message);
    }
  }

  // Test 4: Verify total points
  try {
    const { status, data } = await apiRequest('/api/auth/me', {
      headers: {
        Authorization: `Bearer ${testUser.token}`,
      },
    });

    const expectedPoints = 5 + 5 + 5 + 5; // 4 chapters * 5 points
    assert(
      data.user.translationPoints === expectedPoints,
      `Total points is ${expectedPoints}`,
      `Expected ${expectedPoints}, got ${data.user.translationPoints}`
    );
  } catch (error) {
    assert(false, 'Points accumulation works', error.message);
  }

  // Test 5: Max points limit (50)
  console.log('  ⏳ Testing max points limit...');
  const moreChapters = Array.from({ length: 10 }, (_, i) => `test-chapter-${i}`);

  for (const chapter of moreChapters) {
    try {
      await apiRequest('/api/user/track-translation', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${testUser.token}`,
        },
        body: JSON.stringify({ chapterSlug: chapter }),
      });
    } catch (error) {
      // Ignore errors for this stress test
    }
  }

  try {
    const { data } = await apiRequest('/api/auth/me', {
      headers: {
        Authorization: `Bearer ${testUser.token}`,
      },
    });

    assert(
      data.user.translationPoints <= 50,
      'Points capped at maximum 50',
      `Got ${data.user.translationPoints} points`
    );
  } catch (error) {
    assert(false, 'Max points cap works', error.message);
  }
}

/**
 * Test Suite 4: RAG Chat (if indexed)
 */
async function testRAGChat() {
  console.log('\n🤖 Test Suite 4: RAG Chat');

  if (!testUser.token) {
    console.log('  ⚠️  Skipping: No auth token available');
    return;
  }

  // Test 1: RAG health check
  try {
    const { status, data } = await apiRequest('/api/chat/health');

    if (data.status === 'ready') {
      assert(true, 'RAG system is ready');
      assert(data.collection.pointsCount > 0, `Qdrant has ${data.collection.pointsCount} vectors`);
    } else if (data.status === 'not_ready') {
      console.log('  ⚠️  RAG not ready: Indexing not complete yet');
      return;
    } else {
      assert(false, 'RAG health check works', data.message);
      return;
    }
  } catch (error) {
    console.log('  ⚠️  RAG endpoint not available (still indexing)');
    return;
  }

  // Test 2: Simple RAG query
  try {
    const { status, data } = await apiRequest('/api/chat/rag', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${testUser.token}`,
      },
      body: JSON.stringify({
        message: 'What is inverse kinematics?',
        skill: 'explain',
      }),
    });

    assert(status === 200, 'RAG query returns 200');
    assert(data.response && data.response.length > 50, 'RAG returns meaningful response');
    assert(data.sources && Array.isArray(data.sources), 'RAG includes sources');
    assert(data.sources.length > 0, 'RAG found relevant sources');

    if (data.sources.length > 0) {
      console.log(`     📚 Retrieved ${data.sources.length} relevant lessons`);
      console.log(`     Top source: ${data.sources[0].title} (score: ${data.sources[0].score.toFixed(3)})`);
    }
  } catch (error) {
    assert(false, 'RAG query works', error.message);
  }

  // Test 3: RAG with different skills
  const testQueries = [
    { message: 'Explain sensors in robotics', skill: 'explain' },
    { message: 'Give an example of bipedal locomotion', skill: 'example' },
    { message: 'Write code for robot control', skill: 'code' },
  ];

  for (const query of testQueries) {
    try {
      const { status, data } = await apiRequest('/api/chat/rag', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${testUser.token}`,
        },
        body: JSON.stringify(query),
      });

      assert(status === 200, `RAG with skill "${query.skill}" works`);
    } catch (error) {
      assert(false, `RAG skill ${query.skill}`, error.message);
    }
  }
}

/**
 * Test Suite 5: Progress & Bookmarks
 */
async function testProgressAndBookmarks() {
  console.log('\n📊 Test Suite 5: Progress & Bookmarks');

  if (!testUser.token) {
    console.log('  ⚠️  Skipping: No auth token available');
    return;
  }

  // Test 1: Create progress
  try {
    const { status, data } = await apiRequest('/api/progress', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${testUser.token}`,
      },
      body: JSON.stringify({
        lessonPath: 'part1/chapter1/lesson1',
        completed: true,
        timeSpent: 300,
        quizScore: 85,
      }),
    });

    assert(status === 200, 'Progress creation works');
    assert(data.progress.completed === true, 'Progress marked as completed');
  } catch (error) {
    assert(false, 'Progress tracking works', error.message);
  }

  // Test 2: Get progress
  try {
    const { status, data } = await apiRequest('/api/progress', {
      headers: {
        Authorization: `Bearer ${testUser.token}`,
      },
    });

    assert(status === 200, 'Get progress returns 200');
    assert(Array.isArray(data.progress), 'Progress is an array');
    assert(data.progress.length >= 1, 'Progress includes created entry');
  } catch (error) {
    assert(false, 'Get progress works', error.message);
  }

  // Test 3: Create bookmark
  try {
    const { status, data } = await apiRequest('/api/bookmarks', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${testUser.token}`,
      },
      body: JSON.stringify({
        lessonPath: 'part1/chapter1/lesson1',
        lessonTitle: 'Test Lesson',
        notes: 'Important concept to review',
      }),
    });

    assert(status === 201, 'Bookmark creation returns 201');
    assert(data.bookmark.notes === 'Important concept to review', 'Bookmark notes saved');
  } catch (error) {
    assert(false, 'Bookmark creation works', error.message);
  }

  // Test 4: Get bookmarks
  try {
    const { status, data } = await apiRequest('/api/bookmarks', {
      headers: {
        Authorization: `Bearer ${testUser.token}`,
      },
    });

    assert(status === 200, 'Get bookmarks returns 200');
    assert(Array.isArray(data.bookmarks), 'Bookmarks is an array');
    assert(data.bookmarks.length >= 1, 'Bookmarks includes created entry');
  } catch (error) {
    assert(false, 'Get bookmarks works', error.message);
  }
}

/**
 * Main test runner
 */
async function runTests() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('🧪 API INTEGRATION TESTS - Physical AI Textbook');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`📍 Testing API: ${API_URL}`);
  console.log(`🕐 Started: ${new Date().toLocaleString()}\n`);

  const startTime = Date.now();

  try {
    await testHealthCheck();
    await testAuthentication();
    await testTranslationTracking();
    await testProgressAndBookmarks();
    await testRAGChat();
  } catch (error) {
    console.error('\n❌ Fatal error during tests:', error);
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('📊 TEST RESULTS');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`📊 Total:  ${results.passed + results.failed}`);
  console.log(`⏱️  Duration: ${duration}s`);

  const passRate = ((results.passed / (results.passed + results.failed)) * 100).toFixed(1);
  console.log(`📈 Pass Rate: ${passRate}%`);

  if (results.failed === 0) {
    console.log('\n🎉 All tests passed!');
  } else {
    console.log('\n⚠️  Some tests failed. Review output above.');
  }

  console.log('\n💾 Test user created:');
  console.log(`   Email: ${testUser.email}`);
  console.log(`   Password: ${testUser.password}`);
  console.log(`   Token: ${testUser.token ? testUser.token.substring(0, 20) + '...' : 'N/A'}`);

  console.log('\n');

  // Exit with error code if tests failed
  process.exit(results.failed > 0 ? 1 : 0);
}

// Run tests
runTests().catch(error => {
  console.error('\n❌ Unhandled error:', error);
  process.exit(1);
});
