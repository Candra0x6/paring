# 🚀 Vercel Deployment Guide - PARING Authentication System

## Pre-Deployment Requirements

### Prerequisites
- [x] Vercel account created
- [x] GitHub/GitLab repository connected
- [x] Backend and Frontend repositories available
- [x] Environment variables ready

---

## Step 1: Prepare Backend for Vercel

### Backend Configuration
```bash
cd /home/cn/Projects/Competition/Web2/paring/backend

# Verify build works locally
npm run build

# Check vercel.json exists
cat vercel.json
```

### Environment Variables for Backend
Create in Vercel project settings:
```
DATABASE_URL=postgresql://user:password@host:5432/paring_prod
JWT_SECRET=your-production-secret-key-min-32-chars
IS_PRODUCTION=true
MIDTRANS_CLIENT_KEY=your-client-key
MIDTRANS_SERVER_KEY=your-server-key
MIDTRANS_IS_PRODUCTION=true
```

### Deploy Backend to Vercel
```bash
cd backend

# Deploy using Vercel CLI
vercel deploy --prod

# Or if not installed:
npm i -g vercel
vercel deploy --prod
```

**Expected Output:**
```
✓ Deployed to production
✓ Backend URL: https://your-backend.vercel.app
```

---

## Step 2: Prepare Frontend for Vercel

### Frontend Configuration
```bash
cd /home/cn/Projects/Competition/Web2/paring/web

# Verify build works locally
npm run build

# Verify middleware.ts exists
ls middleware.ts
```

### Environment Variables for Frontend
Create in Vercel project settings:
```
NEXT_PUBLIC_API_URL=https://your-backend.vercel.app
NEXT_PUBLIC_WHATSAPP_ADMIN=your-whatsapp-number (optional)
```

**Important**: Only variables with `NEXT_PUBLIC_` prefix are exposed to browser.

### Deploy Frontend to Vercel
```bash
cd web

# Deploy using Vercel CLI
vercel deploy --prod

# Or if not installed:
npm i -g vercel
vercel deploy --prod
```

**Expected Output:**
```
✓ Deployed to production
✓ Frontend URL: https://your-frontend.vercel.app
```

---

## Step 3: Verify Deployments

### Backend Verification
```bash
# Test health endpoint
curl https://your-backend.vercel.app/

# Test public endpoint (registration)
curl -X POST https://your-backend.vercel.app/users \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "passwordHash":"TestPassword123",
    "fullName":"Test User",
    "phoneNumber":"08123456789",
    "role":"FAMILY"
  }'

# Should return: 201 Created

# Test protected endpoint (should return 401)
curl https://your-backend.vercel.app/users

# Should return: 401 Unauthorized
```

### Frontend Verification
```bash
# Test landing page
curl https://your-frontend.vercel.app/

# Should return: HTML response

# Test login page
curl https://your-frontend.vercel.app/login

# Should return: HTML response
```

### Browser Testing
1. Navigate to `https://your-frontend.vercel.app/`
2. Try to access `/dashboard/bookings` without login
3. Should redirect to `/login` (middleware working)
4. Complete login flow
5. Should be redirected to dashboard

---

## Step 4: Configure Vercel Dashboard

### Backend Project Settings
1. Go to Vercel Dashboard → Backend Project
2. Settings → Environment Variables
3. Add all backend environment variables
4. Redeploy if variables changed:
   ```bash
   vercel deploy --prod
   ```

### Frontend Project Settings
1. Go to Vercel Dashboard → Frontend Project
2. Settings → Environment Variables
3. Add NEXT_PUBLIC_API_URL (must point to deployed backend)
4. Redeploy if variables changed:
   ```bash
   vercel deploy --prod
   ```

### Custom Domains (Optional)
1. Go to Project Settings → Domains
2. Add custom domain
3. Follow DNS configuration
4. Wait for DNS propagation (can take 24 hours)

---

## Step 5: Post-Deployment Configuration

### CORS Setup
Ensure backend CORS is configured for frontend domain:

**Backend** (src/main.ts or app.module.ts):
```typescript
app.enableCors({
  origin: [
    'https://your-frontend.vercel.app',
    'https://your-custom-domain.com', // if using custom domain
    process.env.FRONTEND_URL
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
})
```

### SSL/HTTPS
- ✅ Vercel automatically handles SSL
- ✅ All connections are HTTPS
- ✅ Certificates auto-renewed

### Monitoring & Logs

**Backend Logs:**
```bash
vercel logs backend
```

**Frontend Logs:**
```bash
vercel logs web
```

Or view in Vercel Dashboard:
1. Go to project
2. Click "Deployments"
3. Select deployment
4. View logs

---

## Step 6: Health Checks & Monitoring

### Set Up Uptime Monitoring
```bash
# Using curl
curl -X GET https://your-backend.vercel.app/ \
  --max-time 5 \
  || echo "Backend down!"

# Run periodically (e.g., every 5 minutes)
```

### Configure Error Notifications (Optional)
1. Vercel Dashboard → Integrations
2. Add Slack/Email notifications
3. Get alerted on deployment failures

---

## Troubleshooting

### Backend Deployment Issues

**"Build failed"**
```bash
# Check local build first
npm run build

# Verify dist/ folder created
ls dist/

# Check vercel.json configuration
cat vercel.json
```

**"Environment variables not found"**
```bash
# Verify in Vercel Dashboard
# Settings → Environment Variables
# Make sure all required vars are set

# Redeploy to apply changes
vercel deploy --prod
```

**"Cannot connect to database"**
```bash
# Verify DATABASE_URL is correct
# Check if database accepts external connections
# Ensure IP allowlist includes Vercel IPs

# Vercel IPs: vercel.com/docs/concepts/deployments/environments#securing-environment-variables
```

### Frontend Deployment Issues

**"API calls return CORS error"**
```bash
# Verify NEXT_PUBLIC_API_URL is correct
# Verify backend CORS allows frontend domain
# Check browser console for actual error
```

**"Middleware not working"**
```bash
# Verify middleware.ts exists in root
# Check matcher pattern in middleware.ts
# Vercel supports Next.js middleware natively
```

**"Environment variables not showing in browser"**
```bash
# Only NEXT_PUBLIC_ variables are exposed
# Regular variables are server-side only
# Redeploy after adding env vars
```

### Connection Issues Between Backend & Frontend

**"Backend unreachable"**
1. Verify backend URL in frontend env vars
2. Test backend health: `curl https://backend-url/`
3. Check CORS settings on backend
4. Verify API_URL has no trailing slash

**"CORS errors in console"**
1. Add frontend domain to backend CORS allowlist
2. Ensure credentials: true on frontend
3. Ensure withCredentials: true in axios
4. Redeploy backend after CORS changes

---

## Rollback Procedure

### Rollback Backend
```bash
# List recent deployments
vercel ls backend

# Rollback to previous version
vercel rollback backend

# Or manually redeploy previous code
git checkout previous-commit
npm run build
vercel deploy --prod
```

### Rollback Frontend
```bash
# List recent deployments
vercel ls web

# Rollback to previous version
vercel rollback web

# Or manually redeploy previous code
git checkout previous-commit
npm run build
vercel deploy --prod
```

---

## Monitoring Post-Deployment

### First 24 Hours
- [ ] Check backend health every hour
- [ ] Monitor frontend page loads
- [ ] Watch error logs
- [ ] Verify database connections
- [ ] Test complete user flows

### Ongoing Monitoring
- [ ] Daily health checks
- [ ] Weekly error log review
- [ ] Monthly performance analysis
- [ ] Regular security audits
- [ ] Dependency updates

### Set Up Monitoring Alerts
```bash
# Using Vercel CLI
vercel analytics enable
vercel analytics
```

---

## Production Checklist

- [x] Backend builds successfully
- [x] Frontend builds successfully
- [x] All environment variables set
- [x] Database accessible from Vercel
- [x] CORS properly configured
- [x] SSL/HTTPS enabled
- [x] Health endpoints tested
- [x] Full user flow tested
- [x] Error logging working
- [x] Monitoring configured

---

## URLs After Deployment

**Backend**
- Health: `https://your-backend.vercel.app/`
- API: `https://your-backend.vercel.app/users` (protected)
- Docs: `https://your-backend.vercel.app/docs` (if Swagger enabled)

**Frontend**
- Landing: `https://your-frontend.vercel.app/`
- Login: `https://your-frontend.vercel.app/login`
- Dashboard: `https://your-frontend.vercel.app/dashboard` (protected)

---

## Cost Optimization

### For Hobby Projects
- Vercel free tier: up to 100 GB/month bandwidth
- Backend: Serverless functions included
- Frontend: Unlimited static deployments

### For Production
- Vercel Pro: $20/month
- Priority support
- More serverless function concurrency
- Analytics included

### Database Considerations
- Use managed database (AWS RDS, PlanetScale, Neon, etc.)
- Don't host on Vercel (databases need persistent storage)
- Ensure auto-scaling for production traffic

---

## Final Verification

After both deployments are live:

1. **Test Public Endpoints**
   ```bash
   # Registration should work
   curl -X POST https://backend-url/users ...
   
   # Browse nurses should work
   curl https://backend-url/nurses
   ```

2. **Test Protected Endpoints**
   ```bash
   # Without token should fail
   curl https://backend-url/users
   # Expected: 401 Unauthorized
   
   # With token should work
   # (After login and getting JWT)
   ```

3. **Test Frontend Routes**
   ```
   https://frontend-url/dashboard/bookings (no login)
   → Should redirect to /login
   
   https://frontend-url/login
   → Should load login form
   
   Complete login flow
   → Should redirect to dashboard
   ```

4. **Test Session Management**
   - Log in
   - Wait 55 minutes → warning toast
   - Wait 60 minutes → auto-logout
   - Page refresh → maintains auth

---

## Success!

If all tests pass:
✅ Backend deployed to Vercel
✅ Frontend deployed to Vercel
✅ Systems connected
✅ Session management working
✅ Production ready!

---

## Support

**Deployment Issues:**
- See DEPLOYMENT_GUIDE.md (general deployment)
- See Vercel docs: vercel.com/docs

**Backend Issues:**
- See backend/PHASE1_COMPLETION_REPORT.md

**Frontend Issues:**
- See web/PHASE2_COMPLETION_REPORT.md
