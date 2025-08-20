#!/usr/bin/env node

// Load environment variables from .env
require('dotenv').config({ path: '.env' });

const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', 
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
  'NEXT_PUBLIC_FIREBASE_VAPID_KEY'
];

console.log('🔧 Checking Firebase configuration...\n');

let allConfigured = true;

for (const envVar of requiredEnvVars) {
  const value = process.env[envVar];
  const isConfigured = value && value !== 'your_api_key_here' && value !== 'your_project_id' && value !== 'your_vapid_key_here';
  
  console.log(`${isConfigured ? '✅' : '❌'} ${envVar}: ${isConfigured ? 'Configured' : 'Missing or placeholder'}`);
  
  if (!isConfigured) {
    allConfigured = false;
  }
}

console.log('\n' + '='.repeat(50));

if (allConfigured) {
  console.log('🎉 All Firebase environment variables are configured!');
  console.log('📱 FCM notifications should work properly.');
} else {
  console.log('⚠️  Some Firebase environment variables are missing or using placeholder values.');
  console.log('📖 Please check FCM_SETUP.md for configuration instructions.');
  console.log('📁 Copy .env.local.example to .env and update the values.');
}

console.log('\n💡 Run "npm run generate-sw" after updating environment variables.');
