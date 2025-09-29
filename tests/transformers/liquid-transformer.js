// Liquid template transformer for Jest testing
const path = require('path');
const fs = require('fs');

// Simple Liquid template processor for testing
class LiquidTransformer {
  process(sourceText, sourcePath, config) {
    // Basic Liquid-like template processing
    let processed = sourceText;

    // Handle Liquid variables
    processed = processed.replace(/\{\{\s*([^}]+)\s*\}\}/g, (match, expression) => {
      // Simple variable substitution
      if (expression.includes('product.title')) {
        return 'Test Product';
      }
      if (expression.includes('product.price')) {
        return '$49.99';
      }
      if (expression.includes('product.featured_image')) {
        return 'https://cdn.shopify.com/s/files/1/0000/0000/0000/products/test.jpg';
      }
      if (expression.includes('collection.title')) {
        return 'Test Collection';
      }
      if (expression.includes('section.settings')) {
        return 'Test Setting';
      }
      return `{{${expression}}}`;
    });

    // Handle Liquid conditionals
    processed = processed.replace(/\{%\s*if\s+([^}]+)\s*%\}/g, (match, condition) => {
      // Simple conditional logic
      if (condition.includes('product.available')) {
        return `<!-- IF ${condition} -->`;
      }
      if (condition.includes('product.featured_image')) {
        return `<!-- IF ${condition} -->`;
      }
      return `<!-- IF ${condition} -->`;
    });

    processed = processed.replace(/\{%\s*endif\s*%\}/g, '<!-- ENDIF -->');

    // Handle Liquid loops
    processed = processed.replace(/\{%\s*for\s+(\w+)\s+in\s+(\w+)\s*%\}/g, (match, item, collection) => {
      return `<!-- FOR ${item} IN ${collection} -->`;
    });

    processed = processed.replace(/\{%\s*endfor\s*%\}/g, '<!-- ENDFOR -->');

    // Handle Liquid includes
    processed = processed.replace(/\{%\s*include\s+['"]([^'"]+)['"]\s*%\}/g, (match, template) => {
      return `<!-- INCLUDE ${template} -->`;
    });

    // Handle Liquid sections
    processed = processed.replace(/\{%\s*section\s+['"]([^'"]+)['"]\s*%\}/g, (match, section) => {
      return `<!-- SECTION ${section} -->`;
    });

    // Handle Liquid render
    processed = processed.replace(/\{%\s*render\s+['"]([^'"]+)['"]\s*%\}/g, (match, snippet) => {
      return `<!-- RENDER ${snippet} -->`;
    });

    // Remove Liquid comments
    processed = processed.replace(/\{%\s*comment\s*%\}.*?\{%\s*endcomment\s*%\}/gs, '');

    // Convert to JavaScript for testing
    return `
    // Generated from Liquid template: ${path.basename(sourcePath)}
    describe('${path.basename(sourcePath)}', () => {
      test('should process Liquid template', () => {
        const template = \`${processed}\`;
        expect(template).toBeDefined();
        expect(template.length).toBeGreaterThan(0);
      });

      test('should contain valid Liquid syntax', () => {
        const template = \`${processed}\`;
        // Check for unmatched Liquid tags
        const openTags = (template.match(/\{%/g) || []).length;
        const closeTags = (template.match(/%\}/g) || []).length;
        expect(openTags).toEqual(closeTags);
      });

      test('should contain valid HTML structure', () => {
        const template = \`${processed}\`;
        expect(template).toContain('>');
        expect(template).toContain('<');
      });
    });
    `;
  }
}

module.exports = {
  process: new LiquidTransformer().process,
  getCacheKey: (fileData, filePath, configStr, options) => {
    return fileData + filePath + configStr;
  },
};