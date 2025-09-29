# US1.1: Shopify Dev Store Setup

**Story Points:** 2 **Section:** Theme Setup & Environment **Priority:** High **Status:** Ready

## User Story

As a developer, I want a Shopify dev store linked so I can preview theme changes in real-time.

## Acceptance Criteria

✅ **Primary Acceptance:** CLI login works, theme preview available at dev store URL.

### Detailed Acceptance Criteria:

1. **Shopify CLI Connection**
   - [ ] Shopify CLI installed and authenticated
   - [ ] Dev store created and accessible
   - [ ] Theme development environment connected

2. **Preview Functionality**
   - [ ] Theme preview URL generates successfully
   - [ ] Real-time preview updates when files are modified
   - [ ] Preview URL accessible from development team

3. **Development Workflow**
   - [ ] `shopify theme dev` command works without errors
   - [ ] File watchers detect changes in theme files
   - [ ] Hot reload functionality working for CSS/JS changes

## Technical Notes

- Use Shopify Partner dashboard to create development store
- Configure store with sample products for testing
- Ensure development store has necessary permissions for theme development

## Definition of Done

- [x] Dev store directory structure created
- [x] Shopify CLI successfully installed and configured
- [x] Theme configuration files created
- [x] Development team documentation updated
- [ ] Theme preview URL accessible and functional (requires actual dev store creation in Shopify
      Partner Dashboard)
- [ ] Real-time preview updates tested (requires dev store authentication)
- [ ] File watchers and hot reload verified (requires dev store connection)

## Dependencies

- Shopify Partner account
- Development environment setup
- Team access to Shopify Partner dashboard

## Estimate Breakdown

- Store setup: 30 min
- CLI configuration: 45 min
- Testing and validation: 45 min
- **Total: 2 story points**
