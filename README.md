# Restaurant & Café Inventory Management System

A production-level inventory management system built with React, TypeScript, GraphQL, and Firebase.

## 🚀 Features

- **Authentication**: Firebase Auth with role-based access (ADMIN, STAFF)
- **Dashboard**: Real-time statistics, low stock alerts, expiring items tracking
- **Inventory Management**: Complete CRUD operations for ingredients
- **Stock Movements**: Track IN/OUT/ADJUSTMENT movements with automatic stock updates
- **Suppliers Management**: Manage supplier information and link to ingredients
- **Modern UI**: Material-UI with responsive design, dark/light mode support
- **Real-time Updates**: Apollo Client with cache management
- **TypeScript**: Fully typed for better developer experience

## 📋 Tech Stack

### Frontend
- React 18 with TypeScript
- Vite (build tool)
- Material-UI (component library)
- Tailwind CSS (utility styles)
- TanStack Table (data tables)
- React Hook Form (form handling)
- Apollo Client (GraphQL client)
- Recharts (charts)

### Backend
- GraphQL (Apollo Server)
- Firebase Firestore (database)
- Firebase Authentication
- Firebase Admin SDK

### Deployment
- Vercel (frontend + serverless API)

## 🛠️ Installation

### Prerequisites
- Node.js 18+ and npm
- Firebase project
- Vercel account (for deployment)

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd vibecode-restaurant-pos
```

### 2. Install dependencies

```bash
npm install
```

### 3. Firebase Setup

#### Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Firestore Database
4. Enable Authentication (Email/Password)

#### Get Firebase Config
1. Go to Project Settings → General
2. Scroll to "Your apps" section
3. Click "Web app" icon to create a web app
4. Copy the config values

#### Create Service Account
1. Go to Project Settings → Service Accounts
2. Click "Generate New Private Key"
3. Download the JSON file (keep it secure!)
4. Convert to base64:

```bash
# Linux/Mac
base64 -i serviceAccount.json -o serviceAccount.txt

# Windows (PowerShell)
[Convert]::ToBase64String([System.IO.File]::ReadAllBytes("serviceAccount.json")) | Out-File serviceAccount.txt
```

### 4. Environment Variables

Create a `.env` file in the root directory:

```env
# Firebase Client Configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Firebase Admin SDK (Base64 encoded service account JSON)
FIREBASE_SERVICE_ACCOUNT_BASE64=your_base64_encoded_service_account_json

# GraphQL API URL (use /api/graphql for production)
VITE_GRAPHQL_API_URL=http://localhost:3000/api/graphql
```

### 5. Firestore Security Rules

Set up Firestore security rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isAdmin() {
      return isAuthenticated() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'ADMIN';
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
    
    // Ingredients collection
    match /ingredients/{ingredientId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
    
    // Stock movements
    match /stockMovements/{movementId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update, delete: if isAdmin();
    }
    
    // Suppliers
    match /suppliers/{supplierId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
  }
}
```

### 6. Firestore Indexes

Create these indexes in Firestore Console:

1. **Stock Movements by Date**
   - Collection: `stockMovements`
   - Fields: `createdAt` (Descending)
   - Query scope: Collection

2. **Stock Movements by Ingredient**
   - Collection: `stockMovements`
   - Fields: `ingredientId` (Ascending), `createdAt` (Descending)
   - Query scope: Collection

3. **Ingredients by Category**
   - Collection: `ingredients`
   - Fields: `archived` (Ascending), `category` (Ascending)
   - Query scope: Collection

### 7. Create Admin User

Use Firebase Console to create the first user:

1. Go to Authentication → Users
2. Add user (e.g., admin@restaurant.com)
3. Set custom claims using the provided script:

```bash
node scripts/set-user-role.cjs admin admin@restaurant.com
```

### 8. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## 🚀 Deployment to Vercel

### 1. Install Vercel CLI

```bash
npm install -g vercel
```

### 2. Login to Vercel

```bash
vercel login
```

### 3. Deploy

```bash
vercel
```

### 4. Set Environment Variables in Vercel

In Vercel Dashboard → Project Settings → Environment Variables, add:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `FIREBASE_SERVICE_ACCOUNT_BASE64`
- `VITE_GRAPHQL_API_URL` (set to `/api/graphql`)

### 5. Deploy to Production

```bash
vercel --prod
```

## 📁 Project Structure

```
vibecode-restaurant-pos/
├── api/
│   ├── graphql/
│   │   ├── resolvers/
│   │   │   ├── dashboard.resolvers.ts
│   │   │   ├── ingredient.resolvers.ts
│   │   │   ├── stockMovement.resolvers.ts
│   │   │   ├── supplier.resolvers.ts
│   │   │   └── index.ts
│   │   └── typeDefs.ts
│   ├── lib/
│   │   ├── auth.ts
│   │   └── firebase-admin.ts
│   └── graphql.ts
├── src/
│   ├── components/
│   │   ├── inventory/
│   │   │   ├── IngredientModal.tsx
│   │   │   └── StockMovementModal.tsx
│   │   ├── layout/
│   │   │   └── DashboardLayout.tsx
│   │   └── suppliers/
│   │       └── SupplierModal.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── graphql/
│   │   └── queries.ts
│   ├── pages/
│   │   ├── DashboardPage.tsx
│   │   ├── InventoryPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── StockMovementsPage.tsx
│   │   └── SuppliersPage.tsx
│   ├── services/
│   │   ├── apollo.ts
│   │   └── firebase.ts
│   ├── types/
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── vercel.json
├── vite.config.ts
└── README.md
```

## 🔒 Security

- Firebase Authentication with secure token verification
- Role-based access control (ADMIN, STAFF)
- Firestore security rules
- Service account credentials stored as base64 in environment variables
- HTTPS enforced in production

## 📊 Data Models

### Ingredient
- name, category, unit
- stock, lowStockThreshold, costPerUnit
- supplierId, expiryDate
- archived flag
- Calculated: stockStatus, totalValue

### StockMovement
- ingredientId, type (IN/OUT/ADJUSTMENT)
- quantity, note
- performedBy, createdAt

### Supplier
- name, contact, email, phone, address

## 🎨 UI Features

- Responsive sidebar layout
- Material-UI components
- Stock status indicators (Safe/Low/Critical)
- Data tables with sorting and filtering
- Modal forms for CRUD operations
- Real-time dashboard statistics
- Charts for inventory visualization

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # Check TypeScript types
```

## 📝 Usage Guide

### Admin Features
- Create, update, archive ingredients
- Manage suppliers
- View all stock movements
- Access to all dashboard statistics

### Staff Features
- View ingredients
- Record stock movements (IN/OUT/ADJUSTMENT)
- View suppliers (read-only)
- View dashboard statistics

### Common Workflows

1. **Adding New Ingredient**
   - Go to Inventory page
   - Click "Add Ingredient"
   - Fill in details (name, category, unit, etc.)
   - Save

2. **Recording Stock Movement**
   - Go to Inventory page
   - Find ingredient
   - Click "Stock" button
   - Select movement type (IN/OUT/ADJUSTMENT)
   - Enter quantity and note
   - Submit

3. **Monitoring Low Stock**
   - Check Dashboard for low stock count
   - Filter inventory by stock status
   - Record stock IN movement to restock

## 🐛 Troubleshooting

### Firebase Connection Issues
- Verify all environment variables are set correctly
- Check Firebase project settings
- Ensure Firestore is enabled
- Verify service account has correct permissions

### GraphQL Errors
- Check browser console for detailed error messages
- Verify Firebase token is valid
- Check network tab for API responses

### Build Errors
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear cache: `npm run build -- --force`

## 📈 Future Enhancements

- Recipe management (ingredients → dishes)
- Automated low stock alerts (email/SMS)
- Reporting and analytics
- Multi-location support
- Barcode scanning
- Purchase order management
- Waste tracking

## 📄 License

MIT License

## 🤝 Support

For issues or questions, please open an issue on GitHub.
