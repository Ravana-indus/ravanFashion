# US1.3: CI/CD Pipeline Setup

**Story Points:** 5 **Section:** Theme Setup & Environment **Priority:** High **Status:** Ready

## User Story

As a developer, I want CI/CD pipelines so every push runs lint/build/deploy checks.

## Acceptance Criteria

✅ **Primary Acceptance:** GitHub Actions pipeline runs lint, style check, and pushes theme without
errors.

### Detailed Acceptance Criteria:

1. **GitHub Actions Workflow**
   - [ ] Workflow triggers on push to main and pull requests
   - [ ] Multiple jobs for lint, build, and deploy
   - [ ] Proper error handling and failure notifications
   - [ ] Build artifacts stored for debugging

2. **Code Quality Checks**
   - [ ] ESLint configured for JavaScript files
   - [ ] Stylelint configured for CSS/SCSS files
   - [ ] Prettier formatting checks
   - [ ] Liquid template validation

3. **Build Process**
   - [ ] Tailwind CSS compilation verification
   - [ ] Asset optimization and minification
   - [ ] Theme file structure validation
   - [ ] No build errors or warnings

4. **Deployment Automation**
   - [ ] Automatic deployment to dev store on main branch
   - [ ] Staging deployment for pull requests
   - [ ] Rollback capability if deployment fails
   - [ ] Deployment status notifications

## Technical Implementation

### GitHub Actions Workflow Structure

```yaml
# .github/workflows/theme-cicd.yml
name: Shopify Theme CI/CD
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Run ESLint
        run: npm run lint:js
      - name: Run Stylelint
        run: npm run lint:css
      - name: Check Prettier
        run: npm run format:check

  build:
    needs: lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
      - name: Install dependencies
        run: npm ci
      - name: Build theme
        run: npm run build
      - name: Validate theme
        run: shopify theme check

  deploy:
    needs: [lint, build]
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to dev store
        run: shopify theme push --development
```

### Required Package.json Scripts

```json
{
  "scripts": {
    "lint:js": "eslint assets/**/*.js",
    "lint:css": "stylelint assets/**/*.css",
    "lint": "npm run lint:js && npm run lint:css",
    "format:check": "prettier --check .",
    "format": "prettier --write .",
    "build": "npm run build:css && npm run build:js",
    "build:css": "tailwindcss -i src/css/theme.css -o assets/theme.build.css",
    "validate": "shopify theme check"
  }
}
```

### Code Quality Configuration Files

- `.eslintrc.js` - JavaScript linting rules
- `.stylelintrc.json` - CSS linting rules
- `.prettierrc` - Code formatting rules
- `.github/workflows/theme-cicd.yml` - CI/CD pipeline

## Environment Setup Requirements

1. **GitHub Secrets Configuration**
   - `SHOPIFY_CLI_THEME_TOKEN` - For theme deployment
   - `SHOPIFY_STORE` - Development store URL
   - `SHOPIFY_PASSWORD` - Private app password

2. **Branch Protection Rules**
   - Require status checks to pass
   - Require pull request reviews
   - Restrict pushes to main branch

## Definition of Done

- [ ] GitHub Actions workflow created and functional
- [ ] All linting tools configured and passing
- [ ] Build process automated and error-free
- [ ] Deployment to dev store working
- [ ] Pull request checks preventing broken merges
- [ ] Team notification system working
- [ ] Documentation updated with CI/CD process

## Dependencies

- US1.1: Dev store setup (for deployment target)
- US1.2: Tailwind configuration (for build process)
- GitHub repository with appropriate permissions
- Shopify CLI access tokens

## Files Created/Modified

- `.github/workflows/theme-cicd.yml`
- `.eslintrc.js`
- `.stylelintrc.json`
- `.prettierrc`
- `package.json` (scripts section)
- `.gitignore` (build artifacts)
- `README.md` (CI/CD documentation)

## Quality Gates

1. **Pre-commit Hooks** (Optional Enhancement)
   - Husky for git hooks
   - Lint-staged for incremental checks
   - Commit message validation

2. **Performance Monitoring**
   - Lighthouse CI integration
   - Bundle size tracking
   - Theme performance metrics

## Testing Checklist

- [ ] Push to main triggers full pipeline
- [ ] Pull request triggers validation checks
- [ ] Failed lint/build prevents deployment
- [ ] Successful pipeline deploys to dev store
- [ ] Team receives appropriate notifications
- [ ] Pipeline failure notifications working

## Security Considerations

- [ ] Secrets properly configured and encrypted
- [ ] No sensitive data in workflow files
- [ ] Appropriate permissions for deployment
- [ ] Audit logging enabled

## Estimate Breakdown

- GitHub Actions workflow setup: 2 hours
- Linting tools configuration: 1.5 hours
- Build process automation: 1 hour
- Testing and troubleshooting: 30 min
- **Total: 5 story points**

## Success Metrics

- Zero manual deployment steps required
- Less than 5 minutes from push to deployment
- 100% of code quality issues caught before merge
- Zero production deployments with build errors
