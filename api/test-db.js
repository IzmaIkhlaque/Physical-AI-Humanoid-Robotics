// Test database connection
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

console.log('🔍 Testing database connection...');
console.log(`📍 Database URL: ${process.env.DATABASE_URL?.substring(0, 50)}...`);

async function testConnection() {
  try {
    console.log('\n⏳ Attempting to connect to database...');
    console.log('   (This may take 10-30 seconds if database is waking up)');

    await prisma.$connect();
    console.log('✅ Database connected successfully!\n');

    // Test a simple query
    console.log('🧪 Testing a simple query...');
    const userCount = await prisma.user.count();
    console.log(`✅ Query successful! Found ${userCount} users in database.\n`);

    console.log('🎉 Database is working perfectly!');

  } catch (error) {
    console.error('❌ Database connection failed!\n');
    console.error('Error details:', error.message);

    if (error.message.includes("Can't reach database")) {
      console.log('\n💡 Possible solutions:');
      console.log('1. Your Neon database may be suspended (free tier auto-pauses)');
      console.log('   → Go to https://console.neon.tech');
      console.log('   → Click your project');
      console.log('   → Click "Resume" or wait for it to auto-resume\n');
      console.log('2. Check if your database credentials changed');
      console.log('   → Get new connection string from Neon console');
      console.log('   → Update DATABASE_URL in api/.env\n');
      console.log('3. Wait 30 seconds and run this test again');
      console.log('   → Database might still be waking up\n');
    }
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
