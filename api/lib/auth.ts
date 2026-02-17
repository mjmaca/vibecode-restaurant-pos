import { auth } from './firebase-admin.js';

export interface AuthContext {
  user: {
    uid: string;
    email: string;
    role: 'ADMIN' | 'STAFF';
  } | null;
}

/**
 * Verify Firebase ID token and extract user information
 */
export async function verifyToken(token: string): Promise<AuthContext['user']> {
  try {
    const decodedToken = await auth.verifyIdToken(token);
    
    // Get custom claims for role
    const userRecord = await auth.getUser(decodedToken.uid);
    const role = (userRecord.customClaims?.role as 'ADMIN' | 'STAFF') || 'STAFF';

    return {
      uid: decodedToken.uid,
      email: decodedToken.email || '',
      role,
    };
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

/**
 * Check if user has required role
 */
export function requireRole(context: AuthContext, allowedRoles: string[]): void {
  if (!context.user) {
    throw new Error('Authentication required');
  }

  if (!allowedRoles.includes(context.user.role)) {
    throw new Error('Insufficient permissions');
  }
}

/**
 * Ensure user is authenticated
 */
export function requireAuth(context: AuthContext): void {
  if (!context.user) {
    throw new Error('Authentication required');
  }
}
