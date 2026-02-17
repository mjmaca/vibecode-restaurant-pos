import { db, COLLECTIONS } from '../../lib/firebase-admin.js';
import { requireAuth, requireRole, AuthContext } from '../../lib/auth.js';

export const supplierResolvers = {
  Query: {
    suppliers: async (_: any, __: any, context: AuthContext) => {
      requireAuth(context);

      const snapshot = await db.collection(COLLECTIONS.SUPPLIERS).orderBy('name').get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    supplier: async (_: any, { id }: { id: string }, context: AuthContext) => {
      requireAuth(context);

      const doc = await db.collection(COLLECTIONS.SUPPLIERS).doc(id).get();
      if (!doc.exists) {
        throw new Error('Supplier not found');
      }

      return { id: doc.id, ...doc.data() };
    },
  },

  Mutation: {
    createSupplier: async (
      _: any,
      { input }: { input: any },
      context: AuthContext
    ) => {
      requireRole(context, ['ADMIN']);

      const now = new Date().toISOString();
      const supplierData = {
        ...input,
        createdAt: now,
        updatedAt: now,
      };

      const docRef = await db.collection(COLLECTIONS.SUPPLIERS).add(supplierData);
      const doc = await docRef.get();

      return { id: doc.id, ...doc.data() };
    },

    updateSupplier: async (
      _: any,
      { id, input }: { id: string; input: any },
      context: AuthContext
    ) => {
      requireRole(context, ['ADMIN']);

      const docRef = db.collection(COLLECTIONS.SUPPLIERS).doc(id);
      const doc = await docRef.get();

      if (!doc.exists) {
        throw new Error('Supplier not found');
      }

      const updateData = {
        ...input,
        updatedAt: new Date().toISOString(),
      };

      await docRef.update(updateData);
      const updatedDoc = await docRef.get();

      return { id: updatedDoc.id, ...updatedDoc.data() };
    },
  },
};
