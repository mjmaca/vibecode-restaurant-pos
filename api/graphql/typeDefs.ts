import { gql } from 'apollo-server-micro';

export const typeDefs = gql`
  # Enums
  enum Role {
    ADMIN
    STAFF
  }

  enum Unit {
    KG
    PCS
    LITERS
    GRAMS
    ML
  }

  enum Category {
    VEGETABLES
    FRUITS
    MEAT
    SEAFOOD
    DAIRY
    GRAINS
    SPICES
    BEVERAGES
    CONDIMENTS
    OTHER
  }

  enum StockStatus {
    SAFE
    LOW
    CRITICAL
  }

  enum MovementType {
    IN
    OUT
    ADJUSTMENT
  }

  # Types
  type User {
    id: ID!
    email: String!
    role: Role!
    displayName: String
    createdAt: String!
  }

  type Supplier {
    id: ID!
    name: String!
    contact: String
    email: String
    phone: String
    address: String
    createdAt: String!
    updatedAt: String!
  }

  type Ingredient {
    id: ID!
    name: String!
    category: Category!
    unit: Unit!
    stock: Float!
    lowStockThreshold: Float!
    costPerUnit: Float!
    supplierId: ID
    supplier: Supplier
    expiryDate: String
    archived: Boolean!
    stockStatus: StockStatus!
    totalValue: Float!
    createdAt: String!
    updatedAt: String!
  }

  type StockMovement {
    id: ID!
    ingredientId: ID!
    ingredient: Ingredient
    type: MovementType!
    quantity: Float!
    note: String
    performedBy: ID!
    performedByUser: User
    createdAt: String!
  }

  type DashboardStats {
    totalInventoryValue: Float!
    lowStockCount: Int!
    expiringCount: Int!
    totalIngredients: Int!
    recentMovements: [StockMovement!]!
  }

  # Inputs
  input CreateIngredientInput {
    name: String!
    category: Category!
    unit: Unit!
    stock: Float!
    lowStockThreshold: Float!
    costPerUnit: Float!
    supplierId: ID
    expiryDate: String
  }

  input UpdateIngredientInput {
    name: String
    category: Category
    unit: Unit
    stock: Float
    lowStockThreshold: Float
    costPerUnit: Float
    supplierId: ID
    expiryDate: String
  }

  input RecordStockMovementInput {
    ingredientId: ID!
    type: MovementType!
    quantity: Float!
    note: String
  }

  input CreateSupplierInput {
    name: String!
    contact: String
    email: String
    phone: String
    address: String
  }

  input UpdateSupplierInput {
    name: String
    contact: String
    email: String
    phone: String
    address: String
  }

  # Queries
  type Query {
    # Current user
    me: User

    # Ingredients
    ingredients(archived: Boolean, category: Category, search: String): [Ingredient!]!
    ingredient(id: ID!): Ingredient
    lowStockIngredients: [Ingredient!]!
    expiringIngredients(days: Int): [Ingredient!]!

    # Stock Movements
    stockMovements(ingredientId: ID, limit: Int): [StockMovement!]!

    # Suppliers
    suppliers: [Supplier!]!
    supplier(id: ID!): Supplier

    # Dashboard
    dashboardStats: DashboardStats!
  }

  # Mutations
  type Mutation {
    # Ingredients
    createIngredient(input: CreateIngredientInput!): Ingredient!
    updateIngredient(id: ID!, input: UpdateIngredientInput!): Ingredient!
    archiveIngredient(id: ID!): Ingredient!

    # Stock Movements
    recordStockMovement(input: RecordStockMovementInput!): StockMovement!

    # Suppliers
    createSupplier(input: CreateSupplierInput!): Supplier!
    updateSupplier(id: ID!, input: UpdateSupplierInput!): Supplier!
  }
`;
