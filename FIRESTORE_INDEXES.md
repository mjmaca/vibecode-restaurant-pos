# Firestore Indexes Configuration

Below are the indexes you need to create for optimal performance.

## How to Create Indexes

### Option 1: Firebase Console (Manual)
1. Go to Firebase Console → Firestore Database
2. Click on "Indexes" tab
3. Click "Create Index"
4. Add the fields and settings as specified below

### Option 2: Firebase CLI (Automated)
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init firestore`
4. Deploy: `firebase deploy --only firestore:indexes`

## Required Indexes

### 1. Stock Movements by Creation Date (Descending)
**Purpose**: For recent stock movements query

- **Collection**: `stockMovements`
- **Fields**:
  - `createdAt` (Descending)
- **Query Scope**: Collection
- **Status**: Required for dashboard

### 2. Stock Movements by Ingredient and Date
**Purpose**: For filtering movements by specific ingredient

- **Collection**: `stockMovements`
- **Fields**:
  - `ingredientId` (Ascending)
  - `createdAt` (Descending)
- **Query Scope**: Collection
- **Status**: Required for ingredient movement history

### 3. Ingredients by Archive Status and Category
**Purpose**: For filtering active ingredients by category

- **Collection**: `ingredients`
- **Fields**:
  - `archived` (Ascending)
  - `category` (Ascending)
- **Query Scope**: Collection
- **Status**: Optional (improves performance)

### 4. Ingredients by Archive Status
**Purpose**: For getting all active/archived ingredients

- **Collection**: `ingredients`
- **Fields**:
  - `archived` (Ascending)
- **Query Scope**: Collection
- **Status**: Required for inventory listing

### 5. Suppliers by Name
**Purpose**: For alphabetically sorted supplier list

- **Collection**: `suppliers`
- **Fields**:
  - `name` (Ascending)
- **Query Scope**: Collection
- **Status**: Optional (improves performance)

## Firestore Index Configuration File

If using Firebase CLI, create `firestore.indexes.json`:

```json
{
  "indexes": [
    {
      "collectionGroup": "stockMovements",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "createdAt",
          "order": "DESCENDING"
        }
      ]
    },
    {
      "collectionGroup": "stockMovements",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "ingredientId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "createdAt",
          "order": "DESCENDING"
        }
      ]
    },
    {
      "collectionGroup": "ingredients",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "archived",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "category",
          "order": "ASCENDING"
        }
      ]
    },
    {
      "collectionGroup": "ingredients",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "archived",
          "order": "ASCENDING"
        }
      ]
    },
    {
      "collectionGroup": "suppliers",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "name",
          "order": "ASCENDING"
        }
      ]
    }
  ],
  "fieldOverrides": []
}
```

## Automatic Index Creation

Firestore will suggest indexes when you run queries that need them:

1. Run your app
2. Check browser console for index creation links
3. Click the link to automatically create the index
4. Wait 2-5 minutes for index to build

## Testing Indexes

After creating indexes, test these queries:

```javascript
// 1. Recent stock movements
db.collection('stockMovements')
  .orderBy('createdAt', 'desc')
  .limit(10)

// 2. Movements for specific ingredient
db.collection('stockMovements')
  .where('ingredientId', '==', 'some-id')
  .orderBy('createdAt', 'desc')

// 3. Active ingredients by category
db.collection('ingredients')
  .where('archived', '==', false)
  .where('category', '==', 'VEGETABLES')

// 4. All active ingredients
db.collection('ingredients')
  .where('archived', '==', false)

// 5. Suppliers alphabetically
db.collection('suppliers')
  .orderBy('name')
```

## Index Status

Check index build status:
1. Firebase Console → Firestore → Indexes
2. Look for "Building" or "Enabled" status
3. Building usually takes 2-5 minutes

## Troubleshooting

### "Missing index" error
- Click the provided link in the error message
- Or manually create the index as specified above

### Index taking too long to build
- Large collections can take longer
- Check Firebase Console for progress
- Typically completes within 10 minutes

### Query still slow after index
- Verify index is "Enabled" (not "Building")
- Check you're using the exact field names
- Ensure query matches index configuration

## Cost Considerations

Indexes increase:
- Storage costs (minimal)
- Write costs (one write per indexed field)

However, they dramatically improve:
- Query performance
- User experience
- App scalability

For this app, index costs are negligible compared to benefits.

## Monitoring

Monitor index usage:
1. Firebase Console → Usage tab
2. Check "Reads" and "Writes" metrics
3. Look for slow queries in logs

## Additional Resources

- [Firestore Indexing Guide](https://firebase.google.com/docs/firestore/query-data/indexing)
- [Index Best Practices](https://firebase.google.com/docs/firestore/best-practices)
- [Query Performance](https://firebase.google.com/docs/firestore/query-data/queries)
