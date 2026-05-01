#!/bin/bash

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
API_URL="${API_URL:-http://localhost:3000}"
TEST_EMAIL="test-$(date +%s)@example.com"
TEST_PASSWORD="TestPassword123"
ADMIN_EMAIL="admin@example.com"

echo -e "${BLUE}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║         PARING Authentication System - Test Suite         ║${NC}"
echo -e "${BLUE}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Helper function for testing
test_endpoint() {
    local test_name="$1"
    local method="$2"
    local endpoint="$3"
    local data="$4"
    local expected_status="$5"
    local auth_token="$6"

    echo -e "${YELLOW}Testing: $test_name${NC}"

    if [ -z "$auth_token" ]; then
        response=$(curl -s -w "\n%{http_code}" -X "$method" \
            -H "Content-Type: application/json" \
            -d "$data" \
            "$API_URL$endpoint")
    else
        response=$(curl -s -w "\n%{http_code}" -X "$method" \
            -H "Content-Type: application/json" \
            -H "Cookie: access_token=$auth_token" \
            -d "$data" \
            "$API_URL$endpoint")
    fi

    status_code=$(echo "$response" | tail -n 1)
    body=$(echo "$response" | head -n -1)

    if [ "$status_code" = "$expected_status" ]; then
        echo -e "${GREEN}✓ PASSED${NC} (Status: $status_code)"
        ((TESTS_PASSED++))
        echo "$body"
    else
        echo -e "${RED}✗ FAILED${NC} (Expected: $expected_status, Got: $status_code)"
        echo "Response: $body"
        ((TESTS_FAILED++))
    fi
    echo ""
}

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}PHASE 1: Backend Authentication Tests${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Test 1: Public Registration (no auth required)
echo -e "${BLUE}Test Group 1: Public Endpoints (No Auth)${NC}"
test_endpoint \
    "Public: User Registration" \
    "POST" \
    "/users" \
    "{\"email\":\"$TEST_EMAIL\",\"passwordHash\":\"$TEST_PASSWORD\",\"fullName\":\"Test User\",\"phoneNumber\":\"08123456789\",\"role\":\"FAMILY\"}" \
    "201"

# Extract user ID from response for later use
USER_ID="test-user-id"

# Test 2: Login
echo -e "${BLUE}Test Group 2: Authentication${NC}"
test_endpoint \
    "Auth: Login with correct credentials" \
    "POST" \
    "/auth" \
    "{\"email\":\"$TEST_EMAIL\",\"passwordHash\":\"$TEST_PASSWORD\"}" \
    "200"

# For testing, we'd need to extract the token from Set-Cookie header
# This is a simplified version - in production use a proper test client

# Test 3: Protected endpoints without auth
echo -e "${BLUE}Test Group 3: Protected Endpoints (No Auth - Should Fail)${NC}"
test_endpoint \
    "Protected: GET /users without token (expect 401)" \
    "GET" \
    "/users" \
    "" \
    "401"

# Test 4: Logout without auth
test_endpoint \
    "Auth: POST /logout without token (expect 401)" \
    "POST" \
    "/auth/logout" \
    "" \
    "401"

# Test 5: Health check (if available)
test_endpoint \
    "Health: GET / (should work)" \
    "GET" \
    "/" \
    "" \
    "200"

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}PHASE 2: Frontend Route Protection Tests${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Note: These would be E2E tests with a browser
echo -e "${YELLOW}Frontend tests require E2E test runner (Cypress/Playwright)${NC}"
echo ""
echo "Frontend test scenarios:"
echo "  1. Navigate to /dashboard without login → Should redirect to /login"
echo "  2. Log in and navigate to /dashboard → Should load page"
echo "  3. Session timeout after 55 min → Should show warning"
echo "  4. Session timeout after 60 min → Should logout and redirect"
echo "  5. Page refresh → Should maintain auth state"
echo ""

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}Test Summary${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "Tests Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Tests Failed: ${RED}$TESTS_FAILED${NC}"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}✗ Some tests failed${NC}"
    exit 1
fi
