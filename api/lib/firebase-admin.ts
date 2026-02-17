import admin from 'firebase-admin';

// Initialize Firebase Admin
if (!admin.apps.length) {
  const serviceAccountBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
  
  if (!serviceAccountBase64) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_BASE64 environment variable is not set');
  }

  try {
    const serviceAccount = JSON.parse(
      Buffer.from(serviceAccountBase64, 'base64').toString('utf-8')
    );

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (error) {
    console.error('Failed to initialize Firebase Admin:', error);
    throw error;
  }
}

export const db = admin.firestore();
export const auth = admin.auth() as admin.auth.Auth;

// Firestore collections
export const COLLECTIONS = {
  USERS: 'users',
  INGREDIENTS: 'ingredients',
  STOCK_MOVEMENTS: 'stockMovements',
  SUPPLIERS: 'suppliers',
};
