# API Documentation

GraphQL API documentation for the Restaurant Inventory Management System.

## Base URL

- **Development**: `http://localhost:3000/api/graphql`
- **Production**: `https://your-domain.vercel.app/api/graphql`

## Authentication

All requests (except introspection) require a Firebase ID token.

### Headers

```
Authorization: Bearer <firebase-id-token>
```

### Getting a Token

```javascript
import { auth } from './services/firebase';

const user = auth.currentUser;
const token = await user.getIdToken();
```

## GraphQL Schema

### Enums

```graphql
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
```

## Queries

### Get Current User

```graphql
query {
  me {
    id
    email
    role
    displayName
    createdAt
  }
}
```

**Permissions**: Authenticated users

### Get Ingredients

```graphql
query GetIngredients($archived: Boolean, $category: Category, $search: String) {
  ingredients(archived: $archived, category: $category, search: $search) {
    id
    name
    category
    unit
    stock
    lowStockThreshold
    costPerUnit
    supplierId
    supplier {
      id
      name
    }
    expiryDate
    archived
    stockStatus
    totalValue
    createdAt
    updatedAt
  }
}
```

**Variables**:
```json
{
  "archived": false,
  "category": "VEGETABLES",
  "search": "tomato"
}
```

**Permissions**: Authenticated users

### Get Single Ingredient

```graphql
query GetIngredient($id: ID!) {
  ingredient(id: $id) {
    id
    name
    category
    unit
    stock
    lowStockThreshold
    costPerUnit
    supplierId
    supplier {
      id
      name
      email
      phone
    }
    expiryDate
    archived
    stockStatus
    totalValue
    createdAt
    updatedAt
  }
}
```

**Variables**:
```json
{
  "id": "ingredient-id-123"
}
```

**Permissions**: Authenticated users

### Get Low Stock Ingredients

```graphql
query {
  lowStockIngredients {
    id
    name
    stock
    lowStockThreshold
    unit
    stockStatus
  }
}
```

**Permissions**: Authenticated users

### Get Expiring Ingredients

```graphql
query GetExpiringIngredients($days: Int) {
  expiringIngredients(days: $days) {
    id
    name
    expiryDate
    stock
    unit
  }
}
```

**Variables**:
```json
{
  "days": 7
}
```

**Permissions**: Authenticated users

### Get Stock Movements

```graphql
query GetStockMovements($ingredientId: ID, $limit: Int) {
  stockMovements(ingredientId: $ingredientId, limit: $limit) {
    id
    ingredientId
    ingredient {
      id
      name
      unit
    }
    type
    quantity
    note
    performedBy
    createdAt
  }
}
```

**Variables**:
```json
{
  "ingredientId": "ingredient-id-123",
  "limit": 50
}
```

**Permissions**: Authenticated users

### Get Suppliers

```graphql
query {
  suppliers {
    id
    name
    contact
    email
    phone
    address
    createdAt
    updatedAt
  }
}
```

**Permissions**: Authenticated users

### Get Dashboard Stats

```graphql
query {
  dashboardStats {
    totalInventoryValue
    lowStockCount
    expiringCount
    totalIngredients
    recentMovements {
      id
      ingredient {
        name
        unit
      }
      type
      quantity
      note
      createdAt
    }
  }
}
```

**Permissions**: Authenticated users

## Mutations

### Create Ingredient

```graphql
mutation CreateIngredient($input: CreateIngredientInput!) {
  createIngredient(input: $input) {
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
}
```

**Variables**:
```json
{
  "input": {
    "name": "Tomatoes",
    "category": "VEGETABLES",
    "unit": "KG",
    "stock": 50,
    "lowStockThreshold": 10,
    "costPerUnit": 2.50,
    "supplierId": "supplier-id-123",
    "expiryDate": "2024-12-31"
  }
}
```

**Permissions**: ADMIN only

### Update Ingredient

```graphql
mutation UpdateIngredient($id: ID!, $input: UpdateIngredientInput!) {
  updateIngredient(id: $id, input: $input) {
    id
    name
    category
    unit
    stock
    lowStockThreshold
    costPerUnit
    supplierId
    expiryDate
    updatedAt
  }
}
```

**Variables**:
```json
{
  "id": "ingredient-id-123",
  "input": {
    "stock": 75,
    "costPerUnit": 2.75
  }
}
```

**Permissions**: ADMIN only

### Archive Ingredient

```graphql
mutation ArchiveIngredient($id: ID!) {
  archiveIngredient(id: $id) {
    id
    archived
    updatedAt
  }
}
```

**Variables**:
```json
{
  "id": "ingredient-id-123"
}
```

**Permissions**: ADMIN only

### Record Stock Movement

```graphql
mutation RecordStockMovement($input: RecordStockMovementInput!) {
  recordStockMovement(input: $input) {
    id
    ingredientId
    type
    quantity
    note
    performedBy
    createdAt
  }
}
```

**Variables**:
```json
{
  "input": {
    "ingredientId": "ingredient-id-123",
    "type": "OUT",
    "quantity": 5,
    "note": "Used for lunch service"
  }
}
```

**Business Logic**:
- `IN`: Adds to current stock
- `OUT`: Subtracts from current stock (prevents negative)
- `ADJUSTMENT`: Sets stock to exact quantity

**Permissions**: Authenticated users

### Create Supplier

```graphql
mutation CreateSupplier($input: CreateSupplierInput!) {
  createSupplier(input: $input) {
    id
    name
    contact
    email
    phone
    address
    createdAt
    updatedAt
  }
}
```

**Variables**:
```json
{
  "input": {
    "name": "Fresh Produce Co",
    "contact": "John Doe",
    "email": "john@freshproduce.com",
    "phone": "+1234567890",
    "address": "123 Market St, City, State 12345"
  }
}
```

**Permissions**: ADMIN only

### Update Supplier

```graphql
mutation UpdateSupplier($id: ID!, $input: UpdateSupplierInput!) {
  updateSupplier(id: $id, input: $input) {
    id
    name
    contact
    email
    phone
    address
    updatedAt
  }
}
```

**Variables**:
```json
{
  "id": "supplier-id-123",
  "input": {
    "email": "newemail@freshproduce.com",
    "phone": "+9876543210"
  }
}
```

**Permissions**: ADMIN only

## Error Handling

### Authentication Errors

```json
{
  "errors": [
    {
      "message": "Authentication required",
      "extensions": {
        "code": "UNAUTHENTICATED"
      }
    }
  ]
}
```

### Permission Errors

```json
{
  "errors": [
    {
      "message": "Insufficient permissions",
      "extensions": {
        "code": "FORBIDDEN"
      }
    }
  ]
}
```

### Validation Errors

```json
{
  "errors": [
    {
      "message": "Insufficient stock. Cannot reduce below zero.",
      "extensions": {
        "code": "BAD_USER_INPUT"
      }
    }
  ]
}
```

## Rate Limiting

No rate limiting currently implemented. For production, consider:
- Vercel's automatic rate limiting
- Custom middleware for GraphQL rate limiting
- Firebase security rules

## Testing with curl

### Get Ingredients

```bash
curl -X POST https://your-domain.vercel.app/api/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -d '{
    "query": "query { ingredients(archived: false) { id name stock unit } }"
  }'
```

### Create Ingredient

```bash
curl -X POST https://your-domain.vercel.app/api/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_FIREBASE_TOKEN" \
  -d '{
    "query": "mutation($input: CreateIngredientInput!) { createIngredient(input: $input) { id name } }",
    "variables": {
      "input": {
        "name": "Tomatoes",
        "category": "VEGETABLES",
        "unit": "KG",
        "stock": 50,
        "lowStockThreshold": 10,
        "costPerUnit": 2.50
      }
    }
  }'
```

## GraphQL Playground

Visit your GraphQL endpoint in the browser to access the interactive playground:

- Development: http://localhost:3000/api/graphql
- Production: https://your-domain.vercel.app/api/graphql

The playground includes:
- Schema documentation
- Query/mutation autocomplete
- Built-in testing interface

## Best Practices

1. **Batch Queries**: Use GraphQL fragments and query batching
2. **Caching**: Apollo Client automatically caches responses
3. **Error Handling**: Always check for errors in responses
4. **Pagination**: Use `limit` parameter for large datasets
5. **Security**: Never expose Firebase tokens in logs or URLs

## Support

For API issues:
- Check browser console for detailed error messages
- Review Function Logs in Vercel Dashboard
- Verify Firebase token is valid
- Check network tab for full request/response
