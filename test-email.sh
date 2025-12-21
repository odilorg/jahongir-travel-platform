#!/bin/bash

# Email Service Test Script
# Tests the contact form email functionality

set -e

echo "================================================"
echo "  Email Service Test"
echo "  Testing contact form email notifications"
echo "================================================"
echo ""

API_URL="http://localhost:4000/api/contact"

# Check if API is running
echo "🔍 Checking if API is running at $API_URL..."

if ! curl -s --connect-timeout 5 "$API_URL" > /dev/null 2>&1; then
    echo "❌ Error: API is not running at $API_URL"
    echo ""
    echo "Please start the API server first:"
    echo "  cd /home/odil/projects/jahongir-travel-platform"
    echo "  pnpm dev"
    exit 1
fi

echo "✅ API is running"
echo ""

# Test data
TEST_NAME="SMTP Test User"
TEST_EMAIL="test@example.com"
TEST_PHONE="+998901234567"
TEST_MESSAGE="This is a test message to verify SMTP configuration with Brevo."

echo "📧 Sending test contact form submission..."
echo "----------------------------------------"
echo "Name: $TEST_NAME"
echo "Email: $TEST_EMAIL"
echo "Phone: $TEST_PHONE"
echo "Message: $TEST_MESSAGE"
echo ""

# Send POST request
RESPONSE=$(curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"$TEST_NAME\",
    \"email\": \"$TEST_EMAIL\",
    \"phone\": \"$TEST_PHONE\",
    \"message\": \"$TEST_MESSAGE\"
  }")

echo "📩 Response from API:"
echo "----------------------------------------"
echo "$RESPONSE" | jq '.' 2>/dev/null || echo "$RESPONSE"
echo ""

# Check if submission was successful
if echo "$RESPONSE" | grep -q "successfully"; then
    echo "✅ Contact form submission successful!"
    echo ""
    echo "📋 Next steps:"
    echo "----------------------------------------"
    echo "1. Check API server logs for email sending status"
    echo "   Look for: 'Email notifications sent for contact: <id>'"
    echo ""
    echo "2. Check your email inbox (admin@jahongir-travel.uz)"
    echo "   Subject: 'New Contact Form Submission from $TEST_NAME'"
    echo ""
    echo "3. Check test email inbox ($TEST_EMAIL)"
    echo "   Subject: 'Thank You for Contacting Jahongir Travel'"
    echo ""
    echo "4. Check Brevo dashboard:"
    echo "   https://app.brevo.com/ → Statistics → Email Activity"
    echo ""
    echo "⚠️  Note: If using development SMTP (MailHog), check:"
    echo "   http://localhost:8025"
else
    echo "❌ Error: Contact form submission failed"
    echo ""
    echo "Check the API server logs for error messages"
fi

echo "================================================"
