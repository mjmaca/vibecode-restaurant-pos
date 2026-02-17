# Quick Start Guide

This guide will help you get the Restaurant Inventory Management System up and running quickly.

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Firebase Setup (5 minutes)

### 2.1 Create Firebase Project
1. Visit https://console.firebase.google.com/
2. Click "Add project"
3. Enter project name → Continue
4. Disable Google Analytics (optional) → Create project

### 2.2 Enable Firestore
1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Select "Start in test mode"
4. Choose a location → Enable

### 2.3 Enable Authentication
1. Go to "Authentication" → "Get started"
2. Click "Email/Password"
3. Enable → Save

### 2.4 Get Web App Config
1. Go to Project Settings (gear icon)
2. Scroll to "Your apps" → Click web icon (</>)
3. Register app with a nickname
4. Copy the config object values

### 2.5 Create Service Account
1. Project Settings → Service Accounts
2. Click "Generate new private key"
3. Save the JSON file securely

## Step 3: Configure Environment Variables

Create `.env` file in the root directory:

```env
# From step 2.4 (Firebase config)
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123

# From step 2.5 (Service account - convert to base64)
FIREBASE_SERVICE_ACCOUNT_BASE64=ewogICJ0eXBlIjog...

# API URL
VITE_GRAPHQL_API_URL=http://localhost:3000/api/graphql
```

### Converting Service Account to Base64:

**Windows (PowerShell):**
```powershell
[Convert]::ToBase64String([System.IO.File]::ReadAllBytes("path\to\serviceAccount.json")) | Out-File serviceAccount.txt
```

**Mac/Linux:**
```bash
base64 -i serviceAccount.json -o serviceAccount.txt
```

Copy the contents of `serviceAccount.txt` to `FIREBASE_SERVICE_ACCOUNT_BASE64`.

## Step 4: Create Admin User

### 4.1 Create User in Firebase Console
1. Go to Authentication → Users
2. Click "Add user"
3. Email: `admin@restaurant.com`
4. Password: `admin123` (change in production!)
5. Add user

### 4.2 Set Admin Role

Use the provided script:

```bash
node scripts/set-user-role.cjs admin admin@restaurant.com
```

This will set the ADMIN role for the user.

## Step 5: Run Development Server

```bash
npm run dev
```

Visit: http://localhost:3000

**Login with:**
- Email: `admin@restaurant.com`
- Password: `admin123`

## Step 6: Test the System

1. **Dashboard** - View statistics (will be empty initially)
2. **Suppliers** - Add a supplier (e.g., "Fresh Produce Co")
3. **Inventory** - Add an ingredient:
   - Name: Tomatoes
   - Category: VEGETABLES
   - Unit: KG
   - Stock: 50
   - Low Stock Threshold: 10
   - Cost Per Unit: 2.50
   - Supplier: Fresh Produce Co
4. **Stock Movement** - Record a movement:
   - Type: OUT
   - Quantity: 5
   - Note: Used for lunch service
5. **Dashboard** - Check updated statistics

## Optional: Seed Test Data

To quickly populate the database with sample data:

```bash
node scripts/seed-data.cjs
```

This creates:
- 3 suppliers
- 15 ingredients (various categories)
- Some items with low stock
- Some items expiring soon

## Common Issues

### "Firebase not initialized"
- Check if `.env` file exists
- Verify all environment variables are set
- Restart the dev server

### "Authentication failed"
- Verify you created the user in Firebase Console
- Check that you set the admin role
- Try signing out and back in

### "GraphQL errors"
- Check browser console for details
- Verify Firebase service account is correctly encoded
- Check that Firestore is enabled

## Next Steps

1. **Set Firestore Security Rules** (See README.md → Firestore Security Rules)
2. **Create Firestore Indexes** (See README.md → Firestore Indexes)
3. **Add more users** (Staff role for testing)
4. **Deploy to Vercel** (See README.md → Deployment section)

## Need Help?

- Check the main README.md for detailed documentation
- Review browser console for errors
- Verify Firebase Console settings
- Check network tab for API responses

---

**You're all set!** 🎉

The system is now running locally. Add ingredients, track stock movements, and explore all features.
