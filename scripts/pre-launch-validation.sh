#!/bin/bash

# 🚀 Pre-Launch Validation Script for Ravan Fashion Shopify Theme
# Comprehensive validation before production deployment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}🚀 Pre-Launch Validation - Ravan Fashion Shopify Theme${NC}"
echo "=================================================="
echo "Starting comprehensive pre-launch validation..."
echo "Timestamp: $(date)"
echo ""

# Create validation reports directory
mkdir -p validation-reports

# Validation counters
TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0

# Function to log validation results
log_validation() {
    local check_name="$1"
    local status="$2"
    local details="$3"

    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))

    case $status in
        "PASS")
            PASSED_CHECKS=$((PASSED_CHECKS + 1))
            echo -e "${GREEN}✅ $check_name: $details${NC}"
            echo "PASS: $check_name - $details" >> validation-reports/validation.log
            ;;
        "FAIL")
            FAILED_CHECKS=$((FAILED_CHECKS + 1))
            echo -e "${RED}❌ $check_name: $details${NC}"
            echo "FAIL: $check_name - $details" >> validation-reports/validation.log
            ;;
        "WARN")
            echo -e "${YELLOW}⚠️  $check_name: $details${NC}"
            echo "WARN: $check_name - $details" >> validation-reports/validation.log
            ;;
        "SKIP")
            echo -e "${BLUE}⏭️  $check_name: $details${NC}"
            echo "SKIP: $check_name - $details" >> validation-reports/validation.log
            ;;
    esac
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to validate file exists and is readable
validate_file() {
    local file_path="$1"
    local description="$2"

    if [ -f "$file_path" ] && [ -r "$file_path" ]; then
        log_validation "$description" "PASS" "File exists and is readable"
        return 0
    else
        log_validation "$description" "FAIL" "File missing or not readable: $file_path"
        return 1
    fi
}

# Function to validate directory exists
validate_directory() {
    local dir_path="$1"
    local description="$2"

    if [ -d "$dir_path" ]; then
        log_validation "$description" "PASS" "Directory exists"
        return 0
    else
        log_validation "$description" "FAIL" "Directory missing: $dir_path"
        return 1
    fi
}

echo -e "${PURPLE}🔍 Environment Validation${NC}"
echo "================================"

# Check Node.js version
if command_exists node; then
    NODE_VERSION=$(node --version | cut -d'v' -f2)
    REQUIRED_VERSION="20.0.0"

    if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" = "$REQUIRED_VERSION" ]; then
        log_validation "Node.js Version" "PASS" "Node.js $NODE_VERSION installed"
    else
        log_validation "Node.js Version" "FAIL" "Node.js $NODE_VERSION installed, required $REQUIRED_VERSION or higher"
    fi
else
    log_validation "Node.js Version" "FAIL" "Node.js not installed"
fi

# Check npm version
if command_exists npm; then
    NPM_VERSION=$(npm --version)
    log_validation "npm Version" "PASS" "npm $NPM_VERSION installed"
else
    log_validation "npm Version" "FAIL" "npm not installed"
fi

# Check Shopify CLI
if command_exists shopify; then
    SHOPIFY_VERSION=$(shopify --version)
    log_validation "Shopify CLI" "PASS" "Shopify CLI $SHOPIFY_VERSION installed"
else
    log_validation "Shopify CLI" "FAIL" "Shopify CLI not installed"
fi

echo -e "\n${PURPLE}📁 File Structure Validation${NC}"
echo "================================"

# Validate essential theme files
validate_file "config/settings_schema.json" "Theme Settings Schema"
validate_file "config/settings_data.json" "Theme Settings Data"
validate_file "assets/application.js" "Main JavaScript File"
validate_file "assets/application.css" "Main CSS File"
validate_file "layout/theme.liquid" "Theme Layout"
validate_file "templates/index.liquid" "Homepage Template"
validate_file "snippets/product-card.liquid" "Product Card Snippet"
validate_file "sections/header.liquid" "Header Section"
validate_file "sections/footer.liquid" "Footer Section"

# Validate configuration files
validate_file "package.json" "Package Configuration"
validate_file "tailwind.config.js" "Tailwind Configuration"
validate_file "postcss.config.js" "PostCSS Configuration"
validate_file ".eslintrc.json" "ESLint Configuration"
validate_file ".gitignore" "Git Ignore File"

# Validate documentation
validate_file "README.md" "README Documentation"
validate_file "DEVELOPMENT.md" "Development Guide"
validate_file "docs/pre-launch-checklist.md" "Pre-Launch Checklist"

echo -e "\n${PURPLE}📦 Dependencies Validation${NC}"
echo "================================"

# Check if node_modules exists
if [ -d "node_modules" ]; then
    log_validation "Dependencies" "PASS" "node_modules directory exists"

    # Check for critical dependencies
    DEPENDENCIES=(
        "tailwindcss"
        "postcss"
        "autoprefixer"
        "eslint"
        "prettier"
        "jest"
        "playwright"
        "@shopify/cli"
    )

    for dep in "${DEPENDENCIES[@]}"; do
        if [ -d "node_modules/$dep" ]; then
            log_validation "Dependency: $dep" "PASS" "Installed"
        else
            log_validation "Dependency: $dep" "FAIL" "Missing"
        fi
    done
else
    log_validation "Dependencies" "FAIL" "node_modules directory missing"
fi

echo -e "\n${PURPLE}🧪 Testing Framework Validation${NC}"
echo "================================"

# Validate test configuration
validate_file "jest.config.js" "Jest Configuration"
validate_file "playwright.config.js" "Playwright Configuration"
validate_directory "tests" "Tests Directory"
validate_directory "tests/unit" "Unit Tests Directory"
validate_directory "tests/integration" "Integration Tests Directory"
validate_directory "tests/e2e" "E2E Tests Directory"
validate_directory "tests/fixtures" "Test Fixtures Directory"

# Check test files exist
if [ -d "tests" ]; then
    TEST_COUNT=$(find tests -name "*.test.js" | wc -l)
    if [ "$TEST_COUNT" -gt 0 ]; then
        log_validation "Test Files" "PASS" "$TEST_COUNT test files found"
    else
        log_validation "Test Files" "FAIL" "No test files found"
    fi
fi

echo -e "\n${PURPLE}🌐 Localization Validation${NC}"
echo "================================"

# Validate localization files
validate_directory "locales" "Locales Directory"
validate_file "locales/en.default.json" "English Locale"
validate_file "locales/ta.json" "Tamil Locale"

# Check Tamil content validation
validate_file "tests/utils/tamil-validator.js" "Tamil Validator"
if [ -f "tests/utils/tamil-validator.js" ]; then
    log_validation "Tamil Validation" "PASS" "Tamil text validation utility available"
fi

echo -e "\n${PURPLE}🎨 Asset Validation${NC}"
echo "================================"

# Validate asset directories
validate_directory "assets" "Assets Directory"
validate_directory "images" "Images Directory"
validate_directory "fonts" "Fonts Directory"

# Check for required assets
if [ -d "assets" ]; then
    JS_COUNT=$(find assets -name "*.js" | wc -l)
    CSS_COUNT=$(find assets -name "*.css" | wc -l)

    log_validation "JavaScript Assets" "PASS" "$JS_COUNT JavaScript files found"
    log_validation "CSS Assets" "PASS" "$CSS_COUNT CSS files found"
fi

echo -e "\n${PURPLE}🔒 Security Validation${NC}"
echo "================================"

# Check for environment files
if [ -f ".env" ] || [ -f ".env.production" ]; then
    log_validation "Environment Files" "PASS" "Environment configuration found"
else
    log_validation "Environment Files" "WARN" "No environment files found"
fi

# Check for sensitive data in version control
if grep -r "api_key\|secret\|password\|token" . --exclude-dir=node_modules --exclude-dir=.git | head -5 > /dev/null; then
    log_validation "Secrets in Code" "WARN" "Potential secrets found in codebase"
else
    log_validation "Secrets in Code" "PASS" "No obvious secrets found in codebase"
fi

echo -e "\n${PURPLE}📱 Performance Optimization${NC}"
echo "================================"

# Check for optimization files
validate_file "postcss.config.js" "PostCSS Configuration"
validate_file "tailwind.config.js" "Tailwind Configuration"

# Check for minification configuration
if grep -q "minify\|optimize\|compress" tailwind.config.js postcss.config.js 2>/dev/null; then
    log_validation "Optimization" "PASS" "Optimization configuration found"
else
    log_validation "Optimization" "WARN" "No optimization configuration found"
fi

echo -e "\n${PURPLE}🔗 Integration Validation${NC}"
echo "================================"

# Check for integration files
validate_file "assets/klaviyo-service.js" "Klaviyo Integration"
validate_file "docs/stories/US6.2-reviews-integration.md" "Reviews Integration Documentation"
validate_file "docs/stories/US6.3-pod-integration.md" "POD Integration Documentation"

echo -e "\n${PURPLE}🚀 Build Validation${NC}"
echo "================================"

# Try to run build process
if command_exists npm; then
    echo "Running build process..."
    if npm run build > validation-reports/build.log 2>&1; then
        log_validation "Build Process" "PASS" "Build completed successfully"
    else
        log_validation "Build Process" "FAIL" "Build failed - check validation-reports/build.log"
    fi
fi

echo -e "\n${PURPLE}🧪 Test Execution${NC}"
echo "================================"

# Run critical tests
if command_exists npm; then
    echo "Running critical tests..."

    # Run linting
    if npm run lint > validation-reports/lint.log 2>&1; then
        log_validation "Code Quality" "PASS" "Linting passed"
    else
        log_validation "Code Quality" "FAIL" "Linting failed"
    fi

    # Run unit tests
    if npm run test:unit > validation-reports/unit-tests.log 2>&1; then
        log_validation "Unit Tests" "PASS" "Unit tests passed"
    else
        log_validation "Unit Tests" "FAIL" "Unit tests failed"
    fi

    # Run Tamil validation
    if npm run test:tamil > validation-reports/tamil-tests.log 2>&1; then
        log_validation "Tamil Validation" "PASS" "Tamil validation passed"
    else
        log_validation "Tamil Validation" "FAIL" "Tamil validation failed"
    fi
fi

echo -e "\n${PURPLE}📊 Validation Summary${NC}"
echo "================================"

# Calculate success rate
if [ $TOTAL_CHECKS -gt 0 ]; then
    SUCCESS_RATE=$((PASSED_CHECKS * 100 / TOTAL_CHECKS))
else
    SUCCESS_RATE=0
fi

echo "Total Checks: $TOTAL_CHECKS"
echo "Passed: $PASSED_CHECKS"
echo "Failed: $FAILED_CHECKS"
echo "Success Rate: $SUCCESS_RATE%"

# Generate detailed report
cat > validation-reports/summary.md << EOF
# Pre-Launch Validation Summary

**Date:** $(date)
**Theme:** Ravan Fashion Shopify Theme
**Total Checks:** $TOTAL_CHECKS
**Passed:** $PASSED_CHECKS
**Failed:** $FAILED_CHECKS
**Success Rate:** $SUCCESS_RATE%

## Validation Results

### Environment
$(grep "Environment" validation-reports/validation.log)

### File Structure
$(grep "File Structure" validation-reports/validation.log)

### Dependencies
$(grep "Dependencies" validation-reports/validation.log)

### Testing
$(grep "Testing" validation-reports/validation.log)

### Localization
$(grep "Localization" validation-reports/validation.log)

### Security
$(grep "Security" validation-reports/validation.log)

### Performance
$(grep "Performance" validation-reports/validation.log)

## Recommendations

EOF

# Add recommendations based on results
if [ $SUCCESS_RATE -ge 90 ]; then
    echo "✅ **Excellent**: Your theme is ready for launch!" >> validation-reports/summary.md
elif [ $SUCCESS_RATE -ge 80 ]; then
    echo "⚠️  **Good**: Theme is nearly ready, address the failed checks before launch." >> validation-reports/summary.md
elif [ $SUCCESS_RATE -ge 70 ]; then
    echo "🔧 **Needs Work**: Several issues need to be resolved before launch." >> validation-reports/summary.md
else
    echo "❌ **Not Ready**: Significant issues must be addressed before launch." >> validation-reports/summary.md
fi

# Final decision
echo ""
echo -e "${CYAN}🎯 Launch Readiness Decision${NC}"
echo "================================"

if [ $FAILED_CHECKS -eq 0 ]; then
    echo -e "${GREEN}🎉 READY FOR LAUNCH!${NC}"
    echo "All validation checks passed. Your theme is ready for production deployment."
    exit 0
elif [ $FAILED_CHECKS -le 3 ]; then
    echo -e "${YELLOW}⚠️  NEARLY READY FOR LAUNCH${NC}"
    echo "A few issues need to be resolved before launch. Check the validation report."
    exit 1
else
    echo -e "${RED}❌ NOT READY FOR LAUNCH${NC}"
    echo "Multiple issues must be resolved before launch. Please address all failed checks."
    exit 1
fi