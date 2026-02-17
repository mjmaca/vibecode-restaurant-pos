import { db, COLLECTIONS } from '../../lib/firebase-admin';
import { requireAuth, requireRole, AuthContext } from '../../lib/auth';
import { addDays, isBefore } from 'date-fns';

interface Ingredient {
  id: string;
  name: string;
  category: string;
  unit: string;
  stock: number;
  lowStockThreshold: number;
  costPerUnit: number;
  supplierId?: string;
  expiryDate?: string;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Calculate stock status based on current stock and threshold
 */
function getStockStatus(stock: number, threshold: number): string {
  if (stock <= 0) return 'CRITICAL';
  if (stock <= threshold) return 'LOW';
  return 'SAFE';
}

export const ingredientResolvers = {
  Query: {
    ingredients: async (
      _: any,
      { archived = false, category, search }: { archived?: boolean; category?: string; search?: string },
      context: AuthContext
    ) => {
      requireAuth(context);

      let query = db.collection(COLLECTIONS.INGREDIENTS).where('archived', '==', archived);

      if (category) {
        query = query.where('category', '==', category);
      }

      const snapshot = await query.get();
      let ingredients = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Ingredient[];

      // Filter by search if provided
      if (search) {
        const searchLower = search.toLowerCase();
        ingredients = ingredients.filter(ing => 
          ing.name.toLowerCase().includes(searchLower)
        );
      }

      return ingredients;
    },

    ingredient: async (_: any, { id }: { id: string }, context: AuthContext) => {
      requireAuth(context);

      const doc = await db.collection(COLLECTIONS.INGREDIENTS).doc(id).get();
      if (!doc.exists) {
        throw new Error('Ingredient not found');
      }

      return { id: doc.id, ...doc.data() };
    },

    lowStockIngredients: async (_: any, __: any, context: AuthContext) => {
      requireAuth(context);

      const snapshot = await db
        .collection(COLLECTIONS.INGREDIENTS)
        .where('archived', '==', false)
        .get();

      const ingredients = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as Ingredient))
        .filter(ing => ing.stock <= ing.lowStockThreshold);

      return ingredients;
    },

    expiringIngredients: async (
      _: any,
      { days = 7 }: { days?: number },
      context: AuthContext
    ) => {
      requireAuth(context);

      const snapshot = await db
        .collection(COLLECTIONS.INGREDIENTS)
        .where('archived', '==', false)
        .get();

      const expiryDate = addDays(new Date(), days);

      const ingredients = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as Ingredient))
        .filter(ing => {
          if (!ing.expiryDate) return false;
          return isBefore(new Date(ing.expiryDate), expiryDate);
        });

      return ingredients;
    },
  },

  Mutation: {
    createIngredient: async (
      _: any,
      { input }: { input: any },
      context: AuthContext
    ) => {
      requireRole(context, ['ADMIN']);

      const now = new Date().toISOString();
      const ingredientData = {
        ...input,
        archived: false,
        createdAt: now,
        updatedAt: now,
      };

      const docRef = await db.collection(COLLECTIONS.INGREDIENTS).add(ingredientData);
      const doc = await docRef.get();

      return { id: doc.id, ...doc.data() };
    },

    updateIngredient: async (
      _: any,
      { id, input }: { id: string; input: any },
      context: AuthContext
    ) => {
      requireRole(context, ['ADMIN']);

      const docRef = db.collection(COLLECTIONS.INGREDIENTS).doc(id);
      const doc = await docRef.get();

      if (!doc.exists) {
        throw new Error('Ingredient not found');
      }

      const updateData = {
        ...input,
        updatedAt: new Date().toISOString(),
      };

      await docRef.update(updateData);
      const updatedDoc = await docRef.get();

      return { id: updatedDoc.id, ...updatedDoc.data() };
    },

    archiveIngredient: async (
      _: any,
      { id }: { id: string },
      context: AuthContext
    ) => {
      requireRole(context, ['ADMIN']);

      const docRef = db.collection(COLLECTIONS.INGREDIENTS).doc(id);
      const doc = await docRef.get();

      if (!doc.exists) {
        throw new Error('Ingredient not found');
      }

      await docRef.update({
        archived: true,
        updatedAt: new Date().toISOString(),
      });

      const updatedDoc = await docRef.get();
      return { id: updatedDoc.id, ...updatedDoc.data() };
    },
  },

  Ingredient: {
    stockStatus: (parent: Ingredient) => {
      return getStockStatus(parent.stock, parent.lowStockThreshold);
    },

    totalValue: (parent: Ingredient) => {
      return parent.stock * parent.costPerUnit;
    },

    supplier: async (parent: Ingredient) => {
      if (!parent.supplierId) return null;

      const doc = await db.collection(COLLECTIONS.SUPPLIERS).doc(parent.supplierId).get();
      if (!doc.exists) return null;

      return { id: doc.id, ...doc.data() };
    },
  },
};
