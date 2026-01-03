# SMTP Configuration Guide - Brevo (Sendinblue)

## ✅ Task: Configure Production Email Service

**Status:** Ready to configure
**Service:** Brevo (formerly Sendinblue)
**Purpose:** Send email notifications for contact forms and bookings

---

## 📝 Required Environment Variables

Add these to `/home/odil/projects/jahongir-travel-platform/apps/api/.env`:

```env
# Brevo SMTP Configuration
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=6459af002@smtp-brevo.com
SMTP_PASS=wtsA5LbBE39SyYjg

# Email Addresses
EMAIL_FROM=noreply@jahongir-travel.uz
ADMIN_EMAIL=admin@jahongir-travel.uz
```

---

## 🔧 Manual Configuration Steps

### Option 1: Edit .env file directly

```bash
cd /home/odil/projects/jahongir-travel-platform/apps/api

# Open .env file in your editor
nano .env

# Add the SMTP configuration variables shown above
# Save and exit (Ctrl+X, then Y, then Enter)
```

### Option 2: Use the helper script

```bash
cd /home/odil/projects/jahongir-travel-platform

# Run the configuration script
./configure-smtp.sh
```

---

## ✅ Verification Steps

### 1. Check environment variables are loaded

```bash
cd /home/odil/projects/jahongir-travel-platform/apps/api

# Check if variables are set
grep SMTP .env
```

### 2. Restart the API server

```bash
# Stop the current dev server (Ctrl+C in the terminal running pnpm dev)

# Then restart
cd /home/odil/projects/jahongir-travel-platform
pnpm dev
```

### 3. Test email sending

You can test the email service by:

**A. Using the contact form on the website:**
1. Go to http://localhost:3001/contact
2. Fill out the form and submit
3. Check your email (both admin email and customer email)

**B. Using curl to test the API directly:**

```bash
curl -X POST http://localhost:4000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+998901234567",
    "message": "This is a test message to verify SMTP configuration"
  }'
```

Check the API logs for email sending status:
```bash
# In the terminal running the API
# You should see logs like:
# "Email notifications sent for contact: <contact-id>"
```

### 4. Check Brevo Dashboard

1. Log in to https://app.brevo.com/
2. Go to "Statistics" → "Email Activity"
3. You should see the sent emails

---

## 🐛 Troubleshooting

### Error: "Failed to send email notifications"

**Check API logs:**
```bash
# Look for error messages in the API console
# Common issues:
# - Invalid SMTP credentials
# - Port blocked by firewall
# - DNS issues resolving smtp-relay.brevo.com
```

**Verify SMTP connection:**
```bash
# Test connection to Brevo SMTP server
telnet smtp-relay.brevo.com 587

# If connection fails, check:
# - Internet connection
# - Firewall settings
# - DNS resolution
```

### Email not received

1. **Check spam folder** - Emails from new domains often go to spam
2. **Check Brevo sending limits** - Free tier has daily limits
3. **Verify sender domain** - jahongir-travel.uz should be configured in Brevo
4. **Check API logs** - Look for "Email notifications sent" message

### SMTP Authentication Failed

- Double-check SMTP_USER and SMTP_PASS are correct
- Ensure no extra spaces or quotes in .env file
- Verify the API key is still active in Brevo dashboard

---

## 📧 Email Templates Available

The system has 4 email templates ready to use:

1. **contact-notification.hbs** - Admin notification when contact form submitted
2. **contact-confirmation.hbs** - Customer confirmation after contact form submission
3. **booking-confirmation.hbs** - Customer booking confirmation (when booking system is implemented)
4. **booking-notification.hbs** - Admin notification for new bookings

All templates are located in:
`/home/odil/projects/jahongir-travel-platform/apps/api/src/email/templates/`

---

## 🔄 Switching Between Development and Production

**Development (MailHog - Local Testing):**
```env
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_SECURE=false
# No SMTP_USER or SMTP_PASS needed
EMAIL_FROM=noreply@localhost
ADMIN_EMAIL=admin@localhost
```

View emails at: http://localhost:8025

**Production (Brevo - Real Email Sending):**
```env
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=6459af002@smtp-brevo.com
SMTP_PASS=wtsA5LbBE39SyYjg
EMAIL_FROM=noreply@jahongir-travel.uz
ADMIN_EMAIL=admin@jahongir-travel.uz
```

---

## ✅ Configuration Complete Checklist

- [ ] Added SMTP variables to .env file
- [ ] Restarted API server
- [ ] Tested contact form submission
- [ ] Received admin notification email
- [ ] Received customer confirmation email
- [ ] Checked Brevo dashboard for email activity
- [ ] Verified emails are not going to spam

---

**Last Updated:** 2025-12-18
**Credentials Source:** User provided (Message: 2025-12-18)
