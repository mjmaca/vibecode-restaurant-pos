import { ingredientResolvers } from './ingredient.resolvers.js';
import { stockMovementResolvers } from './stockMovement.resolvers.js';
import { supplierResolvers } from './supplier.resolvers.js';
import { dashboardResolvers } from './dashboard.resolvers.js';

export const resolvers = {
  Query: {
    ...dashboardResolvers.Query,
    ...ingredientResolvers.Query,
    ...stockMovementResolvers.Query,
    ...supplierResolvers.Query,
  },
  Mutation: {
    ...ingredientResolvers.Mutation,
    ...stockMovementResolvers.Mutation,
    ...supplierResolvers.Mutation,
  },
  Ingredient: ingredientResolvers.Ingredient,
  StockMovement: stockMovementResolvers.StockMovement,
};
