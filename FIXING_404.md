# Development Setup Guide - Fixing 404 Error

The 404 error occurs because the GraphQL API (`/api/graphql`) needs to run as a serverless function, which requires Vercel CLI in development.

## ✅ Solution: Use Vercel CLI for Local Development

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Stop Current Dev Server

Press `Ctrl+C` to stop the current `npm run dev` if it's running.

### Step 3: Login to Vercel (First Time Only)

```bash
vercel login
```

Follow the prompts to authenticate.

### Step 4: Link Project (First Time Only)

```bash
vercel link
```

When prompted:
- Set up and deploy? **N** (No - we just want to develop locally)
- Link to existing project? **N** (No - create new)
- What's your project's name? **vibecode-restaurant-pos** (or press Enter for auto-name)
- In which directory is your code located? **./** (press Enter)

### Step 5: Start Development Server

```bash
npm run dev
```

This will now use `vercel dev` which:
- ✅ Runs Vite frontend on port 3000
- ✅ Runs API functions on `/api/*` routes
- ✅ Works exactly like production

### Step 6: Access Your App

Visit: **http://localhost:3000**

The API will now work at: **http://localhost:3000/api/graphql**

---

## 🔧 Alternative: Quick Test Without Vercel CLI

If you want to test without Vercel CLI right now, you can temporarily point to a different GraphQL endpoint, but I recommend using Vercel CLI as it's the proper development setup.

---

## ✅ Verify It's Working

After running `npm run dev` with Vercel CLI:

1. You should see output like:
```
Vercel CLI 28.x.x
> Ready! Available at http://localhost:3000
```

2. Login to your app
3. The dashboard should load without errors
4. You should see suppliers, ingredients, etc.

---

## 📝 What Changed

I updated `package.json`:
- `npm run dev` → now uses `vercel dev`
- `npm run dev:vite` → direct Vite (for frontend-only work)

This is the standard setup for Vercel serverless function development.

---

## 🎯 Next Steps

1. Install Vercel CLI globally
2. Run `vercel login`
3. Run `vercel link`
4. Run `npm run dev`
5. Your app should work perfectly!

The 404 error will be gone and you can start using all features including seeding data.
