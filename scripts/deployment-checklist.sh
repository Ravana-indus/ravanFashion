#!/bin/bash

# 🚀 Deployment Checklist Script for Ravan Fashion Shopify Theme
# Ensures all deployment requirements are met before going live

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}🚀 Deployment Checklist - Ravan Fashion Shopify Theme${NC}"
echo "=================================================="
echo "Starting deployment checklist..."
echo "Timestamp: $(date)"
echo ""

# Create deployment logs directory
mkdir -p deployment-logs

# Deployment checklist items
DEPLOYMENT_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0

# Function to log deployment check
log_deployment() {
    local check_name="$1"
    local status="$2"
    local details="$3"

    DEPLOYMENT_CHECKS=$((DEPLOYMENT_CHECKS + 1))

    case $status in
        "PASS")
            PASSED_CHECKS=$((PASSED_CHECKS + 1))
            echo -e "${GREEN}✅ $check_name: $details${NC}"
            echo "PASS: $check_name - $details" >> deployment-logs/deployment.log
            ;;
        "FAIL")
            FAILED_CHECKS=$((FAILED_CHECKS + 1))
            echo -e "${RED}❌ $check_name: $details${NC}"
            echo "FAIL: $check_name - $details" >> deployment-logs/deployment.log
            ;;
        "WARN")
            echo -e "${YELLOW}⚠️  $check_name: $details${NC}"
            echo "WARN: $check_name - $details" >> deployment-logs/deployment.log
            ;;
        "SKIP")
            echo -e "${BLUE}⏭️  $check_name: $details${NC}"
            echo "SKIP: $check_name - $details" >> deployment-logs/deployment.log
            ;;
    esac
}

# Function to check environment variable
check_env_var() {
    local var_name="$1"
    local description="$2"
    local is_required="$3"

    if [ -n "${!var_name}" ]; then
        log_deployment "$description" "PASS" "Environment variable $var_name is set"
        return 0
    elif [ "$is_required" = "true" ]; then
        log_deployment "$description" "FAIL" "Required environment variable $var_name is missing"
        return 1
    else
        log_deployment "$description" "WARN" "Optional environment variable $var_name is not set"
        return 0
    fi
}

# Function to validate Shopify theme
validate_shopify_theme() {
    echo "Validating Shopify theme structure..."

    if command_exists shopify; then
        if shopify theme check > deployment-logs/theme-check.log 2>&1; then
            log_deployment "Shopify Theme Validation" "PASS" "Theme structure is valid"
            return 0
        else
            log_deployment "Shopify Theme Validation" "FAIL" "Theme validation failed"
            return 1
        fi
    else
        log_deployment "Shopify Theme Validation" "SKIP" "Shopify CLI not available"
        return 0
    fi
}

# Function to backup current theme
backup_current_theme() {
    echo "Backing up current theme..."

    if command_exists shopify; then
        local backup_dir="backups/backup-$(date +%Y%m%d-%H%M%S)"
        mkdir -p "$backup_dir"

        if shopify theme pull --path "$backup_dir" > deployment-logs/backup.log 2>&1; then
            log_deployment "Theme Backup" "PASS" "Current theme backed up to $backup_dir"
            return 0
        else
            log_deployment "Theme Backup" "FAIL" "Failed to backup current theme"
            return 1
        fi
    else
        log_deployment "Theme Backup" "SKIP" "Shopify CLI not available"
        return 0
    fi
}

# Function to check command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

echo -e "${PURPLE}🔍 Environment Validation${NC}"
echo "================================"

# Check environment variables
check_env_var "NODE_ENV" "Node Environment" true
check_env_var "SHOPIFY_STORE" "Shopify Store URL" true
check_env_var "SHOPIFY_API_KEY" "Shopify API Key" true
check_env_var "SHOPIFY_API_PASSWORD" "Shopify API Password" true
check_env_var "SHOPIFY_THEME_ID" "Shopify Theme ID" true
check_env_var "KLAVIYO_PUBLIC_KEY" "Klaviyo Public Key" false
check_env_var "KLAVIYO_PRIVATE_KEY" "Klaviyo Private Key" false

# Check Node.js environment
if [ "$NODE_ENV" = "production" ]; then
    log_deployment "Environment Mode" "PASS" "Running in production mode"
else
    log_deployment "Environment Mode" "FAIL" "Not running in production mode (current: $NODE_ENV)"
fi

echo -e "\n${PURPLE}📁 Theme Structure Validation${NC}"
echo "================================"

# Validate essential theme files
THEME_FILES=(
    "config/settings_schema.json"
    "config/settings_data.json"
    "layout/theme.liquid"
    "templates/index.liquid"
    "templates/product.liquid"
    "templates/collection.liquid"
    "templates/cart.liquid"
    "assets/application.js"
    "assets/application.css"
    "snippets/product-card.liquid"
    "snippets/product-form.liquid"
    "sections/header.liquid"
    "sections/footer.liquid"
    "sections/product-template.liquid"
)

for file in "${THEME_FILES[@]}"; do
    if [ -f "$file" ]; then
        log_deployment "Theme File: $file" "PASS" "File exists"
    else
        log_deployment "Theme File: $file" "FAIL" "File missing"
    fi
done

echo -e "\n${PURPLE}📦 Dependencies Validation${NC}"
echo "================================"

# Check if dependencies are installed
if [ -d "node_modules" ]; then
    log_deployment "Dependencies" "PASS" "Dependencies are installed"

    # Check for production dependencies
    PROD_DEPS=(
        "tailwindcss"
        "postcss"
        "autoprefixer"
        "@shopify/cli"
        "@shopify/theme"
    )

    for dep in "${PROD_DEPS[@]}"; do
        if [ -d "node_modules/$dep" ]; then
            log_deployment "Production Dependency: $dep" "PASS" "Installed"
        else
            log_deployment "Production Dependency: $dep" "FAIL" "Missing"
        fi
    done
else
    log_deployment "Dependencies" "FAIL" "Dependencies not installed"
fi

echo -e "\n${PURPLE}🔒 Security Validation${NC}"
echo "================================"

# Check for security issues
if grep -r "console.log\|debugger\|alert" assets/ --include="*.js" | head -5 > deployment-logs/security-check.log; then
    log_deployment "Debug Code" "WARN" "Debug code found in JavaScript files"
else
    log_deployment "Debug Code" "PASS" "No debug code found"
fi

# Check for hardcoded credentials
if grep -r "api.*key\|secret\|password\|token" assets/ config/ --include="*.js" --include="*.json" | grep -v "example" | head -5 > deployment-logs/credentials-check.log; then
    log_deployment "Hardcoded Credentials" "WARN" "Potential hardcoded credentials found"
else
    log_deployment "Hardcoded Credentials" "PASS" "No hardcoded credentials found"
fi

echo -e "\n${PURPLE}🌐 Localization Validation${NC}"
echo "================================"

# Validate localization files
if [ -f "locales/en.default.json" ] && [ -f "locales/ta.json" ]; then
    log_deployment "Localization Files" "PASS" "English and Tamil locale files exist"

    # Check if Tamil content is properly formatted
    if python3 -c "import json; json.load(open('locales/ta.json'))" 2>/dev/null; then
        log_deployment "Tamil JSON Format" "PASS" "Tamil locale file is valid JSON"
    else
        log_deployment "Tamil JSON Format" "FAIL" "Tamil locale file is not valid JSON"
    fi
else
    log_deployment "Localization Files" "FAIL" "Missing localization files"
fi

echo -e "\n${PURPLE}🎨 Asset Optimization${NC}"
echo "================================"

# Check for optimized assets
if [ -f "assets/application.css" ]; then
    CSS_SIZE=$(wc -c < assets/application.css)
    if [ "$CSS_SIZE" -lt 500000 ]; then  # Less than 500KB
        log_deployment "CSS Size" "PASS" "CSS file size is optimized ($CSS_SIZE bytes)"
    else
        log_deployment "CSS Size" "WARN" "CSS file is large ($CSS_SIZE bytes)"
    fi
fi

if [ -f "assets/application.js" ]; then
    JS_SIZE=$(wc -c < assets/application.js)
    if [ "$JS_SIZE" -lt 1000000 ]; then  # Less than 1MB
        log_deployment "JavaScript Size" "PASS" "JavaScript file size is optimized ($JS_SIZE bytes)"
    else
        log_deployment "JavaScript Size" "WARN" "JavaScript file is large ($JS_SIZE bytes)"
    fi
fi

echo -e "\n${PURPLE}🔗 Third-Party Integration${NC}"
echo "================================"

# Check third-party integration files
INTEGRATION_FILES=(
    "assets/klaviyo-service.js"
    "snippets/loox-product-reviews.liquid"
    "snippets/judgeme-product-reviews.liquid"
    "config/pod-config.js"
)

for file in "${INTEGRATION_FILES[@]}"; do
    if [ -f "$file" ]; then
        log_deployment "Integration: $file" "PASS" "Integration file exists"
    else
        log_deployment "Integration: $file" "WARN" "Integration file missing (may be optional)"
    fi
done

echo -e "\n${PURPLE}🧪 Pre-Deployment Testing${NC}"
echo "================================"

# Run pre-deployment tests
if command_exists npm; then
    echo "Running pre-deployment tests..."

    # Run linting
    if npm run lint > deployment-logs/lint.log 2>&1; then
        log_deployment "Code Quality" "PASS" "Linting passed"
    else
        log_deployment "Code Quality" "FAIL" "Linting failed"
    fi

    # Run build process
    if npm run build > deployment-logs/build.log 2>&1; then
        log_deployment "Build Process" "PASS" "Build completed successfully"
    else
        log_deployment "Build Process" "FAIL" "Build failed"
    fi

    # Run unit tests
    if npm run test:unit > deployment-logs/unit-tests.log 2>&1; then
        log_deployment "Unit Tests" "PASS" "Unit tests passed"
    else
        log_deployment "Unit Tests" "FAIL" "Unit tests failed"
    fi
else
    log_deployment "Pre-Deployment Tests" "SKIP" "npm not available"
fi

echo -e "\n${PURPLE}🚀 Shopify Theme Validation${NC}"
echo "================================"

# Validate Shopify theme structure
validate_shopify_theme

echo -e "\n${PURPLE}💾 Backup Current Theme${NC}"
echo "================================"

# Backup current theme
backup_current_theme

echo -e "\n${PURPLE}📊 Deployment Summary${NC}"
echo "================================"

# Calculate deployment readiness
echo "Total Checks: $DEPLOYMENT_CHECKS"
echo "Passed: $PASSED_CHECKS"
echo "Failed: $FAILED_CHECKS"

if [ $DEPLOYMENT_CHECKS -gt 0 ]; then
    SUCCESS_RATE=$((PASSED_CHECKS * 100 / DEPLOYMENT_CHECKS))
    echo "Success Rate: $SUCCESS_RATE%"
else
    SUCCESS_RATE=0
    echo "Success Rate: 0%"
fi

# Generate deployment report
cat > deployment-logs/summary.md << EOF
# Deployment Checklist Summary

**Date:** $(date)
**Theme:** Ravan Fashion Shopify Theme
**Total Checks:** $DEPLOYMENT_CHECKS
**Passed:** $PASSED_CHECKS
**Failed:** $FAILED_CHECKS
**Success Rate:** $SUCCESS_RATE%

## Deployment Readiness

EOF

# Add deployment recommendation
if [ $FAILED_CHECKS -eq 0 ]; then
    echo "✅ **READY FOR DEPLOYMENT**" >> deployment-logs/summary.md
    echo "All deployment checks passed. Your theme is ready for production deployment." >> deployment-logs/summary.md
    RECOMMENDATION="READY"
elif [ $FAILED_CHECKS -le 2 ]; then
    echo "⚠️  **NEARLY READY FOR DEPLOYMENT**" >> deployment-logs/summary.md
    echo "A few issues need to be resolved before deployment." >> deployment-logs/summary.md
    RECOMMENDATION="NEARLY_READY"
else
    echo "❌ **NOT READY FOR DEPLOYMENT**" >> deployment-logs/summary.md
    echo "Multiple issues must be resolved before deployment." >> deployment-logs/summary.md
    RECOMMENDATION="NOT_READY"
fi

# Final deployment decision
echo ""
echo -e "${CYAN}🎯 Deployment Decision${NC}"
echo "================================"

case $RECOMMENDATION in
    "READY")
        echo -e "${GREEN}🎉 READY FOR DEPLOYMENT!${NC}"
        echo "All deployment checks passed. Your theme is ready for production deployment."
        echo ""
        echo "Next steps:"
        echo "1. Review the deployment logs in deployment-logs/"
        echo "2. Run: shopify theme push --theme $SHOPIFY_THEME_ID --live"
        echo "3. Monitor the deployment process"
        echo "4. Validate the live theme"
        exit 0
        ;;
    "NEARLY_READY")
        echo -e "${YELLOW}⚠️  NEARLY READY FOR DEPLOYMENT${NC}"
        echo "A few issues need to be resolved before deployment."
        echo "Check the deployment logs in deployment-logs/ for details."
        exit 1
        ;;
    "NOT_READY")
        echo -e "${RED}❌ NOT READY FOR DEPLOYMENT${NC}"
        echo "Multiple issues must be resolved before deployment."
        echo "Please address all failed checks and try again."
        exit 1
        ;;
esac