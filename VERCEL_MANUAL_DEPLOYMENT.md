# 🚀 Manual Vercel Deployment Instructions

**Status**: Ready for deployment
**Date**: May 1, 2026

## Quick Start (5 minutes)

### Option 1: Using Vercel Dashboard (Recommended for First-Time)

#### Step 1: Backend Deployment
1. Go to https://vercel.com
2. Sign in or create account
3. Click "New Project" → "Import Git Repository"
4. Select your backend repository
5. Framework: "Other"
6. Environment Variables:
   ```
   DATABASE_URL=postgresql://...
   JWT_SECRET=your-secret-key
   IS_PRODUCTION=true
   MIDTRANS_CLIENT_KEY=...
   MIDTRANS_SERVER_KEY=...
   MIDTRANS_IS_PRODUCTION=true
   ```
7. Click "Deploy"
8. Wait for completion (2-5 minutes)
9. Note the URL: `https://your-backend-*.vercel.app`

#### Step 2: Frontend Deployment
1. Go to https://vercel.com
2. Click "New Project" → "Import Git Repository"
3. Select your frontend repository
4. Framework: "Next.js"
5. Environment Variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-*.vercel.app
   ```
6. Click "Deploy"
7. Wait for completion (2-5 minutes)
8. Note the URL: `https://your-frontend-*.vercel.app`

#### Step 3: Connect Them
1. In frontend Vercel project, update `NEXT_PUBLIC_API_URL` to backend URL
2. Redeploy frontend
3. Test the connection

---

### Option 2: Using Vercel CLI (For Command Line)

#### Step 1: Install Vercel CLI
```bash
npm install -g vercel
# or using npx (no install needed):
npx vercel --version
```

#### Step 2: Deploy Backend
```bash
cd backend

# Login to Vercel
npx vercel login

# Deploy
npx vercel deploy --prod

# When prompted:
# - Link to existing? No
# - Project name? backend
# - Which directory? ./
# - Override settings? No

# Save the URL shown
# Example: https://paring-backend-xyz.vercel.app
```

#### Step 3: Deploy Frontend
```bash
cd ../web

# Deploy
npx vercel deploy --prod

# When prompted:
# - Link to existing? No
# - Project name? web
# - Which directory? ./
# - Override settings? No

# Save the URL shown
# Example: https://paring-web-xyz.vercel.app
```

#### Step 4: Set Environment Variables
```bash
# Backend - Set in Vercel Dashboard
cd ../backend
npx vercel env add DATABASE_URL
npx vercel env add JWT_SECRET
npx vercel env add IS_PRODUCTION true
npx vercel env add MIDTRANS_CLIENT_KEY
npx vercel env add MIDTRANS_SERVER_KEY
npx vercel env add MIDTRANS_IS_PRODUCTION true

# Then redeploy
npx vercel deploy --prod

# Frontend - Set in Vercel Dashboard  
cd ../web
npx vercel env add NEXT_PUBLIC_API_URL
# Enter: https://your-backend-*.vercel.app

# Then redeploy
npx vercel deploy --prod
```

---

## Post-Deployment Steps

### 1. Update Backend CORS
If you haven't already, update backend CORS configuration:

**File**: `backend/src/main.ts` or `backend/src/app.module.ts`

```typescript
app.enableCors({
  origin: [
    'https://your-frontend-*.vercel.app',
    'https://your-custom-domain.com' // if using custom domain
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
});
```

Then redeploy backend:
```bash
cd backend
npx vercel deploy --prod
```

### 2. Test Deployments

#### Test Backend
```bash
# Should return 200
curl https://your-backend-*.vercel.app/

# Should return 201 (registration)
curl -X POST https://your-backend-*.vercel.app/users \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "passwordHash":"TestPassword123",
    "fullName":"Test User",
    "phoneNumber":"08123456789",
    "role":"FAMILY"
  }'

# Should return 401 (protected, no auth)
curl https://your-backend-*.vercel.app/users
```

#### Test Frontend
1. Open https://your-frontend-*.vercel.app in browser
2. Try accessing /dashboard/bookings (should redirect to /login)
3. Go to /login
4. Try logging in with test account
5. Should be redirected to /dashboard

### 3. Verify Session Management
1. Log in successfully
2. Check browser console - no errors
3. Try accessing protected routes
4. Complete a full user flow

---

## Expected Results

### Backend Deployment
- ✅ URL like: `https://paring-backend-abc123.vercel.app`
- ✅ Health check: `https://[backend-url]/` returns 200
- ✅ Registration: `POST /users` returns 201
- ✅ Protected endpoint: `GET /users` returns 401 (no token)

### Frontend Deployment
- ✅ URL like: `https://paring-web-def456.vercel.app`
- ✅ Landing page loads
- ✅ Redirect to /login when accessing protected routes
- ✅ Login flow works
- ✅ Dashboard loads after login

### Integration
- ✅ Frontend can reach backend (no CORS errors)
- ✅ API calls succeed
- ✅ Authentication works end-to-end
- ✅ Session timeout warnings appear

---

## Troubleshooting

### Backend Won't Deploy
```
Error: "Build failed"
Solution: 
  1. npm run build locally
  2. Check dist/ folder
  3. Verify vercel.json exists
  4. Check for missing dependencies
```

### Frontend Won't Deploy
```
Error: "Build failed"
Solution:
  1. npm run build locally
  2. Check for TypeScript errors
  3. Verify all env vars have NEXT_PUBLIC_ prefix
  4. Check middleware.ts syntax
```

### Backend and Frontend Can't Connect
```
Error: "CORS error" in frontend console
Solution:
  1. Verify NEXT_PUBLIC_API_URL is correct in frontend env vars
  2. Add frontend URL to backend CORS allowlist
  3. Redeploy backend after CORS changes
  4. Check that credentials are being sent (withCredentials: true)
```

### Database Connection Failed
```
Error: "Cannot connect to database"
Solution:
  1. Verify DATABASE_URL is correct
  2. Check if database accepts external connections
  3. Whitelist Vercel IPs (see Vercel docs)
  4. Test connection locally first
```

### Session Timeout Not Working
```
Error: "Session never times out" or "Times out immediately"
Solution:
  1. Check SESSION_DURATION in useSessionTimeout.ts
  2. Verify backend JWT_EXPIRATION
  3. Check frontend and backend are synchronized
  4. Test with longer timeout first (for debugging)
```

---

## Custom Domains (Optional)

### Add Custom Domain to Backend
1. Go to Vercel Backend Project
2. Settings → Domains
3. Add your domain (e.g., `api.yourdomain.com`)
4. Follow DNS configuration instructions
5. Update frontend NEXT_PUBLIC_API_URL to new domain
6. Redeploy frontend

### Add Custom Domain to Frontend
1. Go to Vercel Frontend Project
2. Settings → Domains
3. Add your domain (e.g., `yourdomain.com`)
4. Follow DNS configuration instructions
5. DNS typically takes 24 hours to propagate

---

## Monitoring

### View Logs
```bash
# Backend logs
npx vercel logs backend

# Frontend logs
npx vercel logs web

# Or in Vercel Dashboard:
# Project → Deployments → Select deployment → Logs
```

### Set Up Alerts
1. Vercel Dashboard → Settings
2. Integrations → Add Slack/Email
3. Configure alerts for deployment failures

### Monitor Performance
1. Vercel Dashboard → Analytics
2. View response times, errors, etc.
3. Monitor for performance degradation

---

## Environment Variables Reference

### Backend Variables
```
DATABASE_URL         - PostgreSQL connection string
JWT_SECRET          - JWT signing secret (min 32 chars)
IS_PRODUCTION       - Set to "true" for production
MIDTRANS_CLIENT_KEY - Midtrans payment gateway key
MIDTRANS_SERVER_KEY - Midtrans payment gateway secret
MIDTRANS_IS_PRODUCTION - Set to "true" for production
```

### Frontend Variables
```
NEXT_PUBLIC_API_URL      - Backend URL (must have NEXT_PUBLIC_ prefix)
NEXT_PUBLIC_WHATSAPP_ADMIN - Optional: WhatsApp number for support
```

---

## Rollback

### Rollback Backend
1. Vercel Dashboard → Backend Project → Deployments
2. Find previous successful deployment
3. Click "..." menu → "Promote to Production"

### Rollback Frontend
1. Vercel Dashboard → Frontend Project → Deployments
2. Find previous successful deployment
3. Click "..." menu → "Promote to Production"

---

## Final Checklist

Before considering deployment complete:

- [ ] Backend deployed and responding
- [ ] Frontend deployed and loading
- [ ] All environment variables set
- [ ] Backend and frontend can communicate
- [ ] Public endpoints work (no auth needed)
- [ ] Protected endpoints return 401 (no token)
- [ ] User can register
- [ ] User can login
- [ ] User can access dashboard
- [ ] Session management works
- [ ] Logs show no errors
- [ ] Performance acceptable

---

## Success! 🎉

Once all checks pass:
- ✅ Backend is live and protected
- ✅ Frontend is live and routing correctly
- ✅ Authentication system is working
- ✅ Ready for production users

### Next Steps
1. Share URLs with team
2. Create user guides
3. Monitor for issues
4. Gather feedback
5. Plan Phase 3 enhancements (optional)

---

## Support

For detailed information:
- **General Deployment**: See `DEPLOYMENT_GUIDE.md`
- **Backend Details**: See `backend/PHASE1_COMPLETION_REPORT.md`
- **Frontend Details**: See `web/PHASE2_COMPLETION_REPORT.md`
- **Vercel Help**: https://vercel.com/docs
