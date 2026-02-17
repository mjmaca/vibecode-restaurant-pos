import { db, COLLECTIONS } from '../../lib/firebase-admin.js';
import { requireAuth, AuthContext } from '../../lib/auth.js';

export const stockMovementResolvers = {
  Query: {
    stockMovements: async (
      _: any,
      { ingredientId, limit = 50 }: { ingredientId?: string; limit?: number },
      context: AuthContext
    ) => {
      requireAuth(context);

      let query = db.collection(COLLECTIONS.STOCK_MOVEMENTS).orderBy('createdAt', 'desc');

      if (ingredientId) {
        query = query.where('ingredientId', '==', ingredientId) as any;
      }

      if (limit) {
        query = query.limit(limit);
      }

      const snapshot = await query.get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
  },

  Mutation: {
    recordStockMovement: async (
      _: any,
      { input }: { input: any },
      context: AuthContext
    ) => {
      requireAuth(context);

      const { ingredientId, type, quantity, note } = input;

      // Get ingredient
      const ingredientRef = db.collection(COLLECTIONS.INGREDIENTS).doc(ingredientId);
      const ingredientDoc = await ingredientRef.get();

      if (!ingredientDoc.exists) {
        throw new Error('Ingredient not found');
      }

      const ingredient = ingredientDoc.data();
      let newStock = ingredient!.stock;

      // Calculate new stock based on movement type
      switch (type) {
        case 'IN':
          newStock += quantity;
          break;
        case 'OUT':
          newStock -= quantity;
          break;
        case 'ADJUSTMENT':
          newStock = quantity;
          break;
        default:
          throw new Error('Invalid movement type');
      }

      // Prevent negative stock
      if (newStock < 0) {
        throw new Error('Insufficient stock. Cannot reduce below zero.');
      }

      // Create movement record
      const movementData = {
        ingredientId,
        type,
        quantity,
        note: note || null,
        performedBy: context.user!.uid,
        createdAt: new Date().toISOString(),
      };

      const movementRef = await db.collection(COLLECTIONS.STOCK_MOVEMENTS).add(movementData);

      // Update ingredient stock
      await ingredientRef.update({
        stock: newStock,
        updatedAt: new Date().toISOString(),
      });

      const movementDoc = await movementRef.get();
      return { id: movementDoc.id, ...movementDoc.data() };
    },
  },

  StockMovement: {
    ingredient: async (parent: any) => {
      const doc = await db.collection(COLLECTIONS.INGREDIENTS).doc(parent.ingredientId).get();
      if (!doc.exists) return null;
      return { id: doc.id, ...doc.data() };
    },

    performedByUser: async (parent: any) => {
      // In a real app, you'd fetch from users collection
      // For now, return minimal info
      return {
        id: parent.performedBy,
        email: 'user@example.com',
        role: 'STAFF',
        createdAt: new Date().toISOString(),
      };
    },
  },
};
