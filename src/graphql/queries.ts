import { gql } from '@apollo/client';

// Fragments
export const INGREDIENT_FRAGMENT = gql`
  fragment IngredientFields on Ingredient {
    id
    name
    category
    unit
    stock
    lowStockThreshold
    costPerUnit
    supplierId
    expiryDate
    archived
    stockStatus
    totalValue
    createdAt
    updatedAt
  }
`;

export const STOCK_MOVEMENT_FRAGMENT = gql`
  fragment StockMovementFields on StockMovement {
    id
    ingredientId
    type
    quantity
    note
    performedBy
    createdAt
  }
`;

export const SUPPLIER_FRAGMENT = gql`
  fragment SupplierFields on Supplier {
    id
    name
    contact
    email
    phone
    address
    createdAt
    updatedAt
  }
`;

// Queries
export const GET_INGREDIENTS = gql`
  ${INGREDIENT_FRAGMENT}
  query GetIngredients($archived: Boolean, $category: Category, $search: String) {
    ingredients(archived: $archived, category: $category, search: $search) {
      ...IngredientFields
      supplier {
        id
        name
      }
    }
  }
`;

export const GET_INGREDIENT = gql`
  ${INGREDIENT_FRAGMENT}
  query GetIngredient($id: ID!) {
    ingredient(id: $id) {
      ...IngredientFields
      supplier {
        id
        name
        email
        phone
      }
    }
  }
`;

export const GET_LOW_STOCK_INGREDIENTS = gql`
  ${INGREDIENT_FRAGMENT}
  query GetLowStockIngredients {
    lowStockIngredients {
      ...IngredientFields
    }
  }
`;

export const GET_EXPIRING_INGREDIENTS = gql`
  ${INGREDIENT_FRAGMENT}
  query GetExpiringIngredients($days: Int) {
    expiringIngredients(days: $days) {
      ...IngredientFields
    }
  }
`;

export const GET_STOCK_MOVEMENTS = gql`
  ${STOCK_MOVEMENT_FRAGMENT}
  query GetStockMovements($ingredientId: ID, $limit: Int) {
    stockMovements(ingredientId: $ingredientId, limit: $limit) {
      ...StockMovementFields
      ingredient {
        id
        name
        unit
      }
    }
  }
`;

export const GET_SUPPLIERS = gql`
  ${SUPPLIER_FRAGMENT}
  query GetSuppliers {
    suppliers {
      ...SupplierFields
    }
  }
`;

export const GET_DASHBOARD_STATS = gql`
  query GetDashboardStats {
    dashboardStats {
      totalInventoryValue
      lowStockCount
      expiringCount
      totalIngredients
    }
  }
`;

export const GET_ME = gql`
  query GetMe {
    me {
      id
      email
      role
      displayName
    }
  }
`;

// Mutations
export const CREATE_INGREDIENT = gql`
  ${INGREDIENT_FRAGMENT}
  mutation CreateIngredient($input: CreateIngredientInput!) {
    createIngredient(input: $input) {
      ...IngredientFields
    }
  }
`;

export const UPDATE_INGREDIENT = gql`
  ${INGREDIENT_FRAGMENT}
  mutation UpdateIngredient($id: ID!, $input: UpdateIngredientInput!) {
    updateIngredient(id: $id, input: $input) {
      ...IngredientFields
    }
  }
`;

export const ARCHIVE_INGREDIENT = gql`
  ${INGREDIENT_FRAGMENT}
  mutation ArchiveIngredient($id: ID!) {
    archiveIngredient(id: $id) {
      ...IngredientFields
    }
  }
`;

export const RECORD_STOCK_MOVEMENT = gql`
  ${STOCK_MOVEMENT_FRAGMENT}
  mutation RecordStockMovement($input: RecordStockMovementInput!) {
    recordStockMovement(input: $input) {
      ...StockMovementFields
    }
  }
`;

export const CREATE_SUPPLIER = gql`
  ${SUPPLIER_FRAGMENT}
  mutation CreateSupplier($input: CreateSupplierInput!) {
    createSupplier(input: $input) {
      ...SupplierFields
    }
  }
`;

export const UPDATE_SUPPLIER = gql`
  ${SUPPLIER_FRAGMENT}
  mutation UpdateSupplier($id: ID!, $input: UpdateSupplierInput!) {
    updateSupplier(id: $id, input: $input) {
      ...SupplierFields
    }
  }
`;
