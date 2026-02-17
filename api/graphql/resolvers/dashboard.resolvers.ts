import { db, COLLECTIONS } from '../../lib/firebase-admin.js';
import { requireAuth, AuthContext } from '../../lib/auth.js';
import { addDays, isBefore } from 'date-fns';

export const dashboardResolvers = {
  Query: {
    me: async (_: any, __: any, context: AuthContext) => {
      if (!context.user) return null;

      return {
        id: context.user.uid,
        email: context.user.email,
        role: context.user.role,
        displayName: context.user.email,
        createdAt: new Date().toISOString(),
      };
    },

    dashboardStats: async (_: any, __: any, context: AuthContext) => {
      requireAuth(context);

      // Get all active ingredients
      const ingredientsSnapshot = await db
        .collection(COLLECTIONS.INGREDIENTS)
        .where('archived', '==', false)
        .get();

      const ingredients = ingredientsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as any[];

      // Calculate total inventory value
      const totalInventoryValue = ingredients.reduce(
        (sum, ing) => sum + ing.stock * ing.costPerUnit,
        0
      );

      // Count low stock items
      const lowStockCount = ingredients.filter(
        ing => ing.stock <= ing.lowStockThreshold
      ).length;

      // Count expiring items (within 7 days)
      const expiryDate = addDays(new Date(), 7);
      const expiringCount = ingredients.filter(ing => {
        if (!ing.expiryDate) return false;
        return isBefore(new Date(ing.expiryDate), expiryDate);
      }).length;

      // Get recent stock movements
      const movementsSnapshot = await db
        .collection(COLLECTIONS.STOCK_MOVEMENTS)
        .orderBy('createdAt', 'desc')
        .limit(10)
        .get();

      const recentMovements = movementsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      return {
        totalInventoryValue,
        lowStockCount,
        expiringCount,
        totalIngredients: ingredients.length,
        recentMovements,
      };
    },
  },
};
