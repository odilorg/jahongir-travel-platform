#!/bin/bash

# SMTP Configuration Helper Script
# This script helps configure Brevo SMTP settings in the .env file

set -e

echo "================================================"
echo "  Jahongir Travel Platform - SMTP Setup"
echo "  Service: Brevo (Sendinblue)"
echo "================================================"
echo ""

ENV_FILE="apps/api/.env"

# Check if .env file exists
if [ ! -f "$ENV_FILE" ]; then
    echo "❌ Error: .env file not found at $ENV_FILE"
    echo "Creating .env file from .env.example..."

    if [ -f "apps/api/.env.example" ]; then
        cp apps/api/.env.example "$ENV_FILE"
        echo "✅ Created .env file from .env.example"
    else
        echo "❌ Error: .env.example file not found"
        exit 1
    fi
fi

echo "📝 Current SMTP configuration in .env:"
echo "----------------------------------------"
grep -E "^SMTP_|^EMAIL_|^ADMIN_" "$ENV_FILE" 2>/dev/null || echo "No SMTP configuration found"
echo ""

# Brevo SMTP credentials
SMTP_HOST="smtp-relay.brevo.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="6459af002@smtp-brevo.com"
SMTP_PASS="wtsA5LbBE39SyYjg"
EMAIL_FROM="noreply@jahongir-travel.uz"
ADMIN_EMAIL="admin@jahongir-travel.uz"

echo "🔧 New SMTP configuration (Brevo):"
echo "----------------------------------------"
echo "SMTP_HOST=$SMTP_HOST"
echo "SMTP_PORT=$SMTP_PORT"
echo "SMTP_SECURE=$SMTP_SECURE"
echo "SMTP_USER=$SMTP_USER"
echo "SMTP_PASS=********** (hidden for security)"
echo "EMAIL_FROM=$EMAIL_FROM"
echo "ADMIN_EMAIL=$ADMIN_EMAIL"
echo ""

# Ask for confirmation
read -p "⚠️  Do you want to update the .env file with these settings? (y/n): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Configuration cancelled"
    exit 0
fi

echo ""
echo "✅ Updating .env file..."

# Backup current .env
cp "$ENV_FILE" "$ENV_FILE.backup.$(date +%Y%m%d_%H%M%S)"
echo "✅ Backup created: $ENV_FILE.backup.$(date +%Y%m%d_%H%M%S)"

# Function to update or add environment variable
update_env_var() {
    local key=$1
    local value=$2

    if grep -q "^${key}=" "$ENV_FILE"; then
        # Update existing variable
        sed -i "s|^${key}=.*|${key}=${value}|" "$ENV_FILE"
        echo "   Updated: $key"
    else
        # Add new variable
        echo "${key}=${value}" >> "$ENV_FILE"
        echo "   Added: $key"
    fi
}

# Update SMTP configuration
update_env_var "SMTP_HOST" "$SMTP_HOST"
update_env_var "SMTP_PORT" "$SMTP_PORT"
update_env_var "SMTP_SECURE" "$SMTP_SECURE"
update_env_var "SMTP_USER" "$SMTP_USER"
update_env_var "SMTP_PASS" "$SMTP_PASS"
update_env_var "EMAIL_FROM" "$EMAIL_FROM"
update_env_var "ADMIN_EMAIL" "$ADMIN_EMAIL"

echo ""
echo "✅ SMTP configuration updated successfully!"
echo ""
echo "📋 Next steps:"
echo "----------------------------------------"
echo "1. Restart the API server:"
echo "   cd /home/odil/projects/jahongir-travel-platform"
echo "   pnpm dev"
echo ""
echo "2. Test email sending:"
echo "   - Submit a contact form at http://localhost:3001/contact"
echo "   - Or use the curl test command in SMTP_SETUP.md"
echo ""
echo "3. Check Brevo dashboard:"
echo "   - https://app.brevo.com/ → Statistics → Email Activity"
echo ""
echo "📖 Full documentation: SMTP_SETUP.md"
echo "================================================"
