# Deploying to Vercel

Complete guide to deploy the Restaurant Inventory Management System to Vercel.

## Prerequisites

- Vercel account (sign up at https://vercel.com)
- GitHub/GitLab/Bitbucket account (for continuous deployment)
- Completed Firebase setup

## Option 1: Deploy via Vercel Dashboard (Recommended)

### 1. Push Code to Git Repository

```bash
# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Restaurant POS"

# Add remote (GitHub example)
git remote add origin https://github.com/yourusername/restaurant-pos.git

# Push
git push -u origin main
```

### 2. Import Project to Vercel

1. Go to https://vercel.com/new
2. Click "Import Project"
3. Select your Git provider (GitHub/GitLab/Bitbucket)
4. Import the repository
5. Configure project:
   - **Framework Preset**: Vite
   - **Root Directory**: ./
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 3. Add Environment Variables

In the project settings, add these environment variables:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
FIREBASE_SERVICE_ACCOUNT_BASE64=your_base64_encoded_service_account
VITE_GRAPHQL_API_URL=/api/graphql
```

**Important**: Set `VITE_GRAPHQL_API_URL=/api/graphql` for production!

### 4. Deploy

Click "Deploy" and wait for the build to complete.

## Option 2: Deploy via Vercel CLI

### 1. Install Vercel CLI

```bash
npm install -g vercel
```

### 2. Login

```bash
vercel login
```

### 3. Link Project

```bash
vercel link
```

### 4. Set Environment Variables

```bash
# Production environment variables
vercel env add VITE_FIREBASE_API_KEY production
vercel env add VITE_FIREBASE_AUTH_DOMAIN production
vercel env add VITE_FIREBASE_PROJECT_ID production
vercel env add VITE_FIREBASE_STORAGE_BUCKET production
vercel env add VITE_FIREBASE_MESSAGING_SENDER_ID production
vercel env add VITE_FIREBASE_APP_ID production
vercel env add FIREBASE_SERVICE_ACCOUNT_BASE64 production
vercel env add VITE_GRAPHQL_API_URL production
```

When prompted, enter the values. For `VITE_GRAPHQL_API_URL`, use `/api/graphql`.

### 5. Deploy to Production

```bash
vercel --prod
```

## Post-Deployment Configuration

### 1. Update Firebase Authorized Domains

1. Go to Firebase Console → Authentication → Settings
2. Under "Authorized domains", add your Vercel domain:
   - `your-project.vercel.app`
   - Any custom domains you've added

### 2. Verify Deployment

Visit your Vercel URL and test:
- Login functionality
- Dashboard loads
- Can create ingredients
- Can record stock movements
- GraphQL API responds correctly

### 3. Check Logs

If something doesn't work:
1. Go to Vercel Dashboard → Your Project → Deployments
2. Click on the latest deployment
3. Check "Build Logs" and "Function Logs"

## Environment-Specific Configuration

### Development
```env
VITE_GRAPHQL_API_URL=http://localhost:3000/api/graphql
```

### Production (Vercel)
```env
VITE_GRAPHQL_API_URL=/api/graphql
```

### Preview (Vercel)
```env
VITE_GRAPHQL_API_URL=/api/graphql
```

## Custom Domain Setup (Optional)

### 1. Add Domain in Vercel

1. Go to Project Settings → Domains
2. Add your domain (e.g., `inventory.yourcompany.com`)
3. Follow DNS configuration instructions

### 2. Update Firebase

Add the custom domain to Firebase authorized domains.

### 3. Update Environment Variables (if needed)

If using absolute URLs, update `VITE_GRAPHQL_API_URL` to include your domain.

## Continuous Deployment

Once set up via Git, Vercel automatically deploys:
- **Production**: When you push to `main` branch
- **Preview**: For every pull request
- **Development**: Other branches (optional)

```bash
# Make changes
git add .
git commit -m "Add new feature"
git push

# Vercel automatically deploys!
```

## Troubleshooting

### Build Fails

**Error: "Module not found"**
- Check `package.json` dependencies
- Run `npm install` locally to verify

**Error: "Environment variable missing"**
- Verify all env vars are set in Vercel Dashboard
- Check variable names (case-sensitive)

### Runtime Errors

**Error: "Firebase initialization failed"**
- Check environment variables are correct
- Verify `FIREBASE_SERVICE_ACCOUNT_BASE64` is properly encoded
- Check browser console for details

**Error: "GraphQL endpoint not found"**
- Verify `vercel.json` is in root directory
- Check `VITE_GRAPHQL_API_URL=/api/graphql`
- Check Function Logs in Vercel Dashboard

**Error: "CORS issues"**
- Verify `vercel.json` has correct CORS headers
- Check `api/graphql.ts` CORS configuration

### Database Connection Issues

**Error: "Firestore permission denied"**
- Check Firestore security rules
- Verify user is authenticated
- Check custom claims are set correctly

## Monitoring and Performance

### Enable Vercel Analytics

1. Go to Project Settings → Analytics
2. Enable Web Analytics
3. View metrics on dashboard

### Enable Speed Insights

1. Install package:
```bash
npm install @vercel/speed-insights
```

2. Add to `src/main.tsx`:
```typescript
import { SpeedInsights } from '@vercel/speed-insights/react';

// In your render:
<SpeedInsights />
```

3. Redeploy

## Security Checklist

- [ ] All environment variables set in Vercel (not in code)
- [ ] Service account JSON not committed to Git
- [ ] Firebase authorized domains updated
- [ ] Firestore security rules applied
- [ ] HTTPS enforced (automatic on Vercel)
- [ ] Strong passwords for admin users
- [ ] Custom claims set for roles

## Rollback (If Needed)

If a deployment breaks something:

1. Go to Vercel Dashboard → Deployments
2. Find the last working deployment
3. Click "Promote to Production"

Or via CLI:
```bash
vercel rollback
```

## Cost Optimization

Vercel Free Tier includes:
- 100GB bandwidth/month
- Unlimited API requests
- 100GB-hrs serverless function execution

For production, consider:
- Vercel Pro ($20/month) for better limits
- Firebase Blaze plan for Firestore scaling

## Support

- Vercel Docs: https://vercel.com/docs
- Vercel Support: https://vercel.com/support
- Check GitHub issues for common problems

---

**Your app is now live!** 🚀

Share your Vercel URL with your team and start managing inventory in production.
