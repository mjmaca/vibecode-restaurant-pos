import { ingredientResolvers } from './ingredient.resolvers';
import { stockMovementResolvers } from './stockMovement.resolvers';
import { supplierResolvers } from './supplier.resolvers';
import { dashboardResolvers } from './dashboard.resolvers';

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
