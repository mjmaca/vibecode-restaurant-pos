// Quick test to check what's failing
// Run: node test-api.cjs

const admin = require('firebase-admin');

console.log('Testing Firebase Admin Setup...\n');

try {
  // Check if service account base64 exists
  const serviceAccountBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
  
  if (!serviceAccountBase64) {
    console.error('❌ FIREBASE_SERVICE_ACCOUNT_BASE64 is not set in .env');
    process.exit(1);
  }
  
  console.log('✅ Service account base64 found');
  
  // Try to decode it
  const serviceAccount = JSON.parse(
    Buffer.from(serviceAccountBase64, 'base64').toString('utf-8')
  );
  
  console.log('✅ Service account decoded successfully');
  console.log('   Project ID:', serviceAccount.project_id);
  console.log('   Client Email:', serviceAccount.client_email);
  
  // Try to initialize Firebase Admin
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log('✅ Firebase Admin initialized successfully');
  }
  
  // Test Firestore connection
  const db = admin.firestore();
  console.log('✅ Firestore connected');
  
  console.log('\n🎉 All checks passed! The API should work.');
  
} catch (error) {
  console.error('\n❌ Error:', error.message);
  console.error('\nFull error:', error);
  process.exit(1);
}

process.exit(0);
