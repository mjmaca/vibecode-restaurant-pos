export type Role = 'ADMIN' | 'STAFF';

export type Unit = 'KG' | 'PCS' | 'LITERS' | 'GRAMS' | 'ML';

export type Category =
  | 'VEGETABLES'
  | 'FRUITS'
  | 'MEAT'
  | 'SEAFOOD'
  | 'DAIRY'
  | 'GRAINS'
  | 'SPICES'
  | 'BEVERAGES'
  | 'CONDIMENTS'
  | 'OTHER';

export type StockStatus = 'SAFE' | 'LOW' | 'CRITICAL';

export type MovementType = 'IN' | 'OUT' | 'ADJUSTMENT';

export interface User {
  id: string;
  email: string;
  role: Role;
  displayName?: string;
  createdAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  contact?: string;
  email?: string;
  phone?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Ingredient {
  id: string;
  name: string;
  category: Category;
  unit: Unit;
  stock: number;
  lowStockThreshold: number;
  costPerUnit: number;
  supplierId?: string;
  supplier?: Supplier;
  expiryDate?: string;
  archived: boolean;
  stockStatus: StockStatus;
  totalValue: number;
  createdAt: string;
  updatedAt: string;
}

export interface StockMovement {
  id: string;
  ingredientId: string;
  ingredient?: Ingredient;
  type: MovementType;
  quantity: number;
  note?: string;
  performedBy: string;
  performedByUser?: User;
  createdAt: string;
}

export interface DashboardStats {
  totalInventoryValue: number;
  lowStockCount: number;
  expiringCount: number;
  totalIngredients: number;
  recentMovements: StockMovement[];
}

export interface CreateIngredientInput {
  name: string;
  category: Category;
  unit: Unit;
  stock: number;
  lowStockThreshold: number;
  costPerUnit: number;
  supplierId?: string;
  expiryDate?: string;
}

export interface UpdateIngredientInput {
  name?: string;
  category?: Category;
  unit?: Unit;
  stock?: number;
  lowStockThreshold?: number;
  costPerUnit?: number;
  supplierId?: string;
  expiryDate?: string;
}

export interface RecordStockMovementInput {
  ingredientId: string;
  type: MovementType;
  quantity: number;
  note?: string;
}

export interface CreateSupplierInput {
  name: string;
  contact?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface UpdateSupplierInput {
  name?: string;
  contact?: string;
  email?: string;
  phone?: string;
  address?: string;
}
