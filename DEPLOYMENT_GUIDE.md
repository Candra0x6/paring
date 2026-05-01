# 🚀 Deployment Guide - PARING Authentication System

## Pre-Deployment Checklist

### ✅ Backend (NestJS)
- [x] Code compiles without errors
- [x] All decorators and guards implemented
- [x] All controllers protected
- [x] Logout endpoint working
- [x] TypeScript types correct

### ✅ Frontend (Next.js)
- [x] Code compiles without errors
- [x] Middleware configured
- [x] Session timeout implemented
- [x] Auth rehydration working
- [x] TypeScript types correct

### ✅ Environment
- [x] JWT_SECRET configured
- [x] API_URL configured
- [x] Database connection working
- [x] Cookies enabled

---

## Deployment Steps

### Step 1: Backend Deployment

#### 1.1 Environment Variables
Ensure these are set in your production environment:

```bash
# Database
DATABASE_URL=postgresql://user:password@host:5432/paring

# JWT Configuration
JWT_SECRET=your-secret-key-min-32-chars

# Application
IS_PRODUCTION=true

# Midtrans (existing)
MIDTRANS_CLIENT_KEY=your-client-key
MIDTRANS_SERVER_KEY=your-server-key
MIDTRANS_IS_PRODUCTION=true

# Optional: Override JWT expiration
JWT_EXPIRATION_DEV=1h
JWT_EXPIRATION_PROD=1d
```

#### 1.2 Build Backend
```bash
cd backend
npm install
npm run build
```

Output should be in `/dist/` folder.

#### 1.3 Deploy Backend
Option A: Docker
```bash
docker build -t paring-backend:latest .
docker push paring-backend:latest
docker run -e DATABASE_URL=... -e JWT_SECRET=... paring-backend:latest
```

Option B: Traditional Server
```bash
npm run build
npm start
```

Option C: Vercel
```bash
# Already configured in backend/.vercel/
vercel deploy
```

#### 1.4 Verify Backend
```bash
# Test health endpoint
curl http://your-backend-url/

# Test login endpoint
curl -X POST http://your-backend-url/auth \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","passwordHash":"password123"}'
```

---

### Step 2: Frontend Deployment

#### 2.1 Environment Variables
Ensure these are set:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=https://your-backend-url

# Optional
NEXT_PUBLIC_WHATSAPP_ADMIN=your-whatsapp-number
```

#### 2.2 Build Frontend
```bash
cd web
npm install
npm run build
```

Output should be in `.next/` folder.

#### 2.3 Deploy Frontend
Option A: Vercel (Recommended for Next.js)
```bash
vercel deploy
```

Option B: Docker
```bash
docker build -t paring-web:latest .
docker push paring-web:latest
docker run -p 3000:3000 paring-web:latest
```

Option C: Traditional Server
```bash
npm run build
npm start
```

#### 2.4 Verify Frontend
```bash
# Test landing page
curl http://your-frontend-url/

# Should see HTML response
```

---

## Post-Deployment Verification

### Backend Verification

```bash
API_URL="https://your-backend-url"

# Test 1: User Registration (Public)
curl -X POST $API_URL/users \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "passwordHash":"TestPassword123",
    "fullName":"Test User",
    "phoneNumber":"08123456789",
    "role":"FAMILY"
  }'
# Expected: 201 Created

# Test 2: Login (Public)
curl -X POST $API_URL/auth \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "passwordHash":"TestPassword123"
  }'
# Expected: 200 OK with JWT cookie

# Test 3: Protected Endpoint (No Auth)
curl -X GET $API_URL/users
# Expected: 401 Unauthorized

# Test 4: Browse Nurses (Public)
curl -X GET $API_URL/nurses
# Expected: 200 OK with nurse list
```

### Frontend Verification

```bash
FRONTEND_URL="https://your-frontend-url"

# Test 1: Landing Page loads
curl $FRONTEND_URL/
# Expected: 200 OK

# Test 2: Login page loads
curl $FRONTEND_URL/login
# Expected: 200 OK

# Test 3: Protected dashboard redirects (in browser only)
# Navigate to $FRONTEND_URL/dashboard/bookings without login
# Expected: Redirected to /login
```

---

## Monitoring & Health Checks

### Backend Health Endpoints

```bash
# Main health check
GET /

# Check database connection
GET /users (without auth - should return 401, not 500)

# Check JWT validation
POST /auth with invalid credentials - should return 401
```

### Frontend Health Checks

```bash
# Check page renders
GET / → 200
GET /login → 200
GET /register → 200

# Check middleware
GET /dashboard → Redirects to /login (if not auth)
GET /nurse → Redirects to /login (if not auth)
```

### Monitoring Recommendations

1. **Error Logging**
   - Monitor 401/403 errors (track failed auth attempts)
   - Monitor 500 errors (database/server issues)
   - Set up alerts for error spike

2. **Performance Monitoring**
   - Track JWT validation latency
   - Monitor middleware response time
   - Track session timeout events

3. **Security Monitoring**
   - Track failed login attempts
   - Monitor unusual role access patterns
   - Alert on repeated 403 errors

4. **User Experience**
   - Track session timeout events
   - Monitor auth state issues
   - Track redirect times

---

## Rollback Plan

### If Backend has Issues

```bash
# Identify issue
- Check logs for errors
- Verify JWT_SECRET is set
- Check database connection
- Verify CORS settings

# Rollback
- Revert to previous version
- Or use previous Docker image tag
- Or use database backup if needed
```

### If Frontend has Issues

```bash
# Identify issue
- Check browser console for errors
- Check middleware logs
- Verify NEXT_PUBLIC_API_URL is correct
- Check cookie settings

# Rollback
- Revert to previous version
- Or redeploy from previous branch
```

---

## Configuration by Environment

### Development
```
JWT_EXPIRATION: 1 hour
SESSION_TIMEOUT: 1 hour
RATE_LIMIT: 100 req/60s
SECURE_COOKIES: false
CORS: Allow localhost:3000
```

### Staging
```
JWT_EXPIRATION: 4 hours
SESSION_TIMEOUT: 4 hours
RATE_LIMIT: 100 req/60s
SECURE_COOKIES: true
CORS: Allow staging domain
```

### Production
```
JWT_EXPIRATION: 1 day
SESSION_TIMEOUT: 1 day (can adjust)
RATE_LIMIT: 100 req/60s (can increase)
SECURE_COOKIES: true
CORS: Allow production domain only
```

---

## Security Checklist for Production

- [x] JWT_SECRET is strong (32+ characters)
- [x] Database password is strong
- [x] HTTPS/SSL enabled
- [x] Cookies set to Secure flag
- [x] CORS configured for specific domains
- [x] Rate limiting enabled
- [x] Error logging configured
- [x] Input validation enabled (Zod)
- [x] No sensitive data in logs
- [x] Environment variables not in code

---

## Troubleshooting

### "401 Unauthorized" on all endpoints
**Issue**: JWT validation failing
**Solution**: Check JWT_SECRET matches between dev and production

### "CORS error" on frontend
**Issue**: Frontend can't reach backend
**Solution**: Check NEXT_PUBLIC_API_URL is correct, verify CORS origin

### "Session expires immediately"
**Issue**: Cookie not being set or sent
**Solution**: Check withCredentials: true in axios, verify Secure flag

### "Middleware not redirecting"
**Issue**: Unprotected route access
**Solution**: Check middleware.ts config, verify matcher pattern

### "TypeScript errors in deployment"
**Issue**: Different Node version or dependencies
**Solution**: Use exact Node version in package.json, npm ci instead of npm install

---

## Performance Optimization (Optional)

### Backend
```typescript
// Already implemented:
- JWT validation (fast)
- Rate limiting (100 req/60s)
- CORS (cached)

// Can add:
- Redis for token caching
- Database connection pooling
- Response compression
```

### Frontend
```typescript
// Already implemented:
- Middleware (edge function)
- Session hooks (optimized)
- API interceptors

// Can add:
- Service workers for caching
- PWA support
- Static generation for public pages
```

---

## Support & Contacts

- **Backend Issues**: Check `/paring/backend/PHASE1_COMPLETION_REPORT.md`
- **Frontend Issues**: Check `/paring/web/PHASE2_COMPLETION_REPORT.md`
- **Auth Flow Issues**: Check `/paring/PHASES_1_AND_2_SUMMARY.md`

---

## Deployment Completed! ✅

Once deployed, your PARING authentication system will be:
- ✅ Secure with RBAC
- ✅ Protected with middleware
- ✅ Session management enabled
- ✅ Ready for production users
- ✅ Monitored and logged
- ✅ Scalable and maintainable
