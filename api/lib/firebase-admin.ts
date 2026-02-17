import admin from 'firebase-admin';

// #region agent log
console.log('[DEBUG] Firebase Admin module loading - Hypothesis A', { 
  timestamp: Date.now(),
  hasAdminApps: admin.apps.length,
  hasEnvVar: !!process.env.FIREBASE_SERVICE_ACCOUNT_BASE64
});
// #endregion

// Initialize Firebase Admin
if (!admin.apps.length) {
  const serviceAccountBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;
  
  // #region agent log
  console.log('[DEBUG] Initializing Firebase Admin - Hypothesis A', { 
    timestamp: Date.now(),
    hasServiceAccount: !!serviceAccountBase64,
    base64Length: serviceAccountBase64?.length || 0
  });
  // #endregion
  
  if (!serviceAccountBase64) {
    // #region agent log
    console.error('[DEBUG] FIREBASE_SERVICE_ACCOUNT_BASE64 missing - Hypothesis A CONFIRMED', { 
      timestamp: Date.now(),
      availableEnvVars: Object.keys(process.env).filter(k => k.includes('FIREBASE'))
    });
    // #endregion
    throw new Error('FIREBASE_SERVICE_ACCOUNT_BASE64 environment variable is not set');
  }

  try {
    // #region agent log
    console.log('[DEBUG] Decoding service account - Hypothesis A', { timestamp: Date.now() });
    // #endregion
    
    const serviceAccount = JSON.parse(
      Buffer.from(serviceAccountBase64, 'base64').toString('utf-8')
    );

    // #region agent log
    console.log('[DEBUG] Service account decoded - Hypothesis A', { 
      timestamp: Date.now(),
      projectId: serviceAccount.project_id,
      hasPrivateKey: !!serviceAccount.private_key
    });
    // #endregion

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    
    // #region agent log
    console.log('[DEBUG] Firebase Admin initialized successfully - Hypothesis A', { 
      timestamp: Date.now(),
      appName: admin.app().name
    });
    // #endregion
  } catch (error) {
    // #region agent log
    console.error('[DEBUG] Firebase Admin initialization failed - Hypothesis A CONFIRMED', { 
      timestamp: Date.now(),
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    // #endregion
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
