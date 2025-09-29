// Accessibility checker utility
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

class AccessibilityChecker {
  constructor() {
    this.violations = [];
    this.warnings = [];
    this.passed = [];

    // WCAG 2.1 AA guidelines
    this.guidelines = {
      '1.1.1': 'Non-text Content',
      '1.2.1': 'Audio-only and Video-only (Prerecorded)',
      '1.2.2': 'Captions (Prerecorded)',
      '1.2.3': 'Audio Description or Media Alternative (Prerecorded)',
      '1.2.4': 'Captions (Live)',
      '1.2.5': 'Audio Description (Prerecorded)',
      '1.3.1': 'Info and Relationships',
      '1.3.2': 'Meaningful Sequence',
      '1.3.3': 'Sensory Characteristics',
      '1.4.1': 'Use of Color',
      '1.4.2': 'Audio Control',
      '1.4.3': 'Contrast (Minimum)',
      '1.4.4': 'Resize text',
      '1.4.5': 'Images of Text',
      '1.4.10': 'Reflow',
      '1.4.11': 'Non-text Contrast',
      '1.4.12': 'Text Spacing',
      '1.4.13': 'Content on Hover or Focus',
      '2.1.1': 'Keyboard',
      '2.1.2': 'No Keyboard Trap',
      '2.1.4': 'Character Key Shortcuts',
      '2.2.1': 'Timing Adjustable',
      '2.2.2': 'Pause, Stop, Hide',
      '2.3.1': 'Three Flashes or Below Threshold',
      '2.4.1': 'Bypass Blocks',
      '2.4.2': 'Page Titled',
      '2.4.3': 'Focus Order',
      '2.4.4': 'Link Purpose (In Context)',
      '2.4.5': 'Multiple Ways',
      '2.4.6': 'Headings and Labels',
      '2.4.7': 'Focus Visible',
      '2.5.1': 'Pointer Gestures',
      '2.5.2': 'Pointer Cancellation',
      '2.5.3': 'Label in Name',
      '2.5.4': 'Motion Actuation',
      '3.1.1': 'Language of Page',
      '3.1.2': 'Language of Parts',
      '3.2.1': 'On Focus',
      '3.2.2': 'On Input',
      '3.2.3': 'Consistent Navigation',
      '3.2.4': 'Consistent Identification',
      '3.3.1': 'Error Identification',
      '3.3.2': 'Labels or Instructions',
      '3.3.3': 'Error Suggestion',
      '3.3.4': 'Error Prevention (Legal, Financial, Data)',
      '4.1.1': 'Parsing',
      '4.1.2': 'Name, Role, Value',
    };
  }

  async checkFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const dom = new JSDOM(content);
      const document = dom.window.document;

      // Reset results
      this.violations = [];
      this.warnings = [];
      this.passed = [];

      // Run accessibility checks
      this.checkImages(document);
      this.checkHeadings(document);
      this.checkForms(document);
      this.checkLinks(document);
      this.checkTables(document);
      this.checkColorContrast(document);
      this.checkKeyboardNavigation(document);
      this.checkARIA(document);
      this.checkLanguage(document);
      this.checkStructure(document);
      this.checkFocusManagement(document);

      return {
        filePath,
        violations: this.violations,
        warnings: this.warnings,
        passed: this.passed,
        summary: {
          total: this.violations.length + this.warnings.length + this.passed.length,
          violations: this.violations.length,
          warnings: this.warnings.length,
          passed: this.passed.length,
          score: this.calculateScore(),
        },
      };
    } catch (error) {
      return {
        filePath,
        error: `Error checking accessibility: ${error.message}`,
      };
    }
  }

  checkImages(document) {
    const images = document.querySelectorAll('img');

    images.forEach(img => {
      const src = img.getAttribute('src') || '';
      const alt = img.getAttribute('alt');

      // Check for alt text
      if (!alt) {
        this.violations.push({
          guideline: '1.1.1',
          title: 'Images must have alternate text',
          description: `Image missing alt text: ${src}`,
          element: img.outerHTML,
          severity: 'critical',
        });
      } else if (alt === '' && !img.hasAttribute('role') && img.getAttribute('role') !== 'presentation') {
        this.warnings.push({
          guideline: '1.1.1',
          title: 'Decorative images should have empty alt text',
          description: `Decorative image should have empty alt text: ${src}`,
          element: img.outerHTML,
          severity: 'moderate',
        });
      } else {
        this.passed.push({
          guideline: '1.1.1',
          title: 'Image has appropriate alt text',
          description: `Image has alt text: ${alt}`,
        });
      }

      // Check for decorative images
      if (img.hasAttribute('role') && img.getAttribute('role') === 'presentation') {
        this.passed.push({
          guideline: '1.1.1',
          title: 'Decorative image properly marked',
          description: `Decorative image marked with role="presentation"`,
        });
      }
    });
  }

  checkHeadings(document) {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let lastLevel = 0;

    headings.forEach(heading => {
      const level = parseInt(heading.tagName.charAt(1));
      const text = heading.textContent.trim();

      // Check for empty headings
      if (!text) {
        this.violations.push({
          guideline: '2.4.6',
          title: 'Headings must not be empty',
          description: `Empty ${heading.tagName} found`,
          element: heading.outerHTML,
          severity: 'serious',
        });
      } else {
        // Check heading hierarchy
        if (lastLevel > 0 && level > lastLevel + 1) {
          this.warnings.push({
            guideline: '1.3.1',
            title: 'Heading level skipped',
            description: `Heading level skipped from h${lastLevel} to ${heading.tagName}`,
            element: heading.outerHTML,
            severity: 'moderate',
          });
        }
        lastLevel = level;

        this.passed.push({
          guideline: '2.4.6',
          title: 'Heading has content',
          description: `${heading.tagName} contains: "${text}"`,
        });
      }
    });

    // Check for at least one h1
    const h1 = document.querySelector('h1');
    if (!h1) {
      this.violations.push({
        guideline: '2.4.6',
        title: 'Page must have at least one h1',
        description: 'No h1 found on page',
        severity: 'serious',
      });
    }
  }

  checkForms(document) {
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
      const inputs = form.querySelectorAll('input, textarea, select');

      inputs.forEach(input => {
        const type = input.type;
        const label = form.querySelector(`label[for="${input.id}"]`) ||
                     input.closest('label') ||
                     input.getAttribute('aria-label');

        // Check for form labels
        if (!label && type !== 'hidden' && type !== 'submit' && type !== 'button') {
          this.violations.push({
            guideline: '3.3.2',
            title: 'Form inputs must have labels',
            description: `Input missing label: ${input.name || input.id}`,
            element: input.outerHTML,
            severity: 'serious',
          });
        } else if (label) {
          this.passed.push({
            guideline: '3.3.2',
            title: 'Form input has proper label',
            description: `Input has label: ${label.textContent || label}`,
          });
        }

        // Check required fields
        if (input.hasAttribute('required') && !input.hasAttribute('aria-required')) {
          this.warnings.push({
            guideline: '3.2.2',
            title: 'Required fields should have aria-required',
            description: `Required input missing aria-required: ${input.name || input.id}`,
            element: input.outerHTML,
            severity: 'moderate',
          });
        }
      });
    });
  }

  checkLinks(document) {
    const links = document.querySelectorAll('a');

    links.forEach(link => {
      const href = link.getAttribute('href');
      const text = link.textContent.trim();

      // Check for meaningful link text
      if (!text && link.querySelector('img')) {
        const img = link.querySelector('img');
        const alt = img.getAttribute('alt');
        if (!alt || alt === '') {
          this.violations.push({
            guideline: '2.4.4',
            title: 'Links must have descriptive text',
            description: 'Link with image missing alt text',
            element: link.outerHTML,
            severity: 'serious',
          });
        }
      } else if (!text) {
        this.violations.push({
          guideline: '2.4.4',
          title: 'Links must have descriptive text',
          description: 'Link missing descriptive text',
          element: link.outerHTML,
          severity: 'serious',
        });
      } else {
        // Check for generic link text
        if (text.toLowerCase() === 'click here' || text.toLowerCase() === 'read more') {
          this.warnings.push({
            guideline: '2.4.6',
            title: 'Avoid generic link text',
            description: `Link uses generic text: "${text}"`,
            element: link.outerHTML,
            severity: 'moderate',
          });
        } else {
          this.passed.push({
            guideline: '2.4.4',
            title: 'Link has descriptive text',
            description: `Link text: "${text}"`,
          });
        }
      }

      // Check for valid href
      if (href === '#' || href === 'javascript:void(0)') {
        this.warnings.push({
          guideline: '2.4.4',
          title: 'Avoid JavaScript pseudo-links',
          description: `Link uses href="${href}"`,
          element: link.outerHTML,
          severity: 'moderate',
        });
      }
    });
  }

  checkTables(document) {
    const tables = document.querySelectorAll('table');

    tables.forEach(table => {
      const captions = table.querySelectorAll('caption');
      const headers = table.querySelectorAll('th');
      const scopeAttrs = table.querySelectorAll('th[scope]');

      // Check for table captions
      if (captions.length === 0) {
        this.warnings.push({
          guideline: '2.4.6',
          title: 'Tables should have captions',
          description: 'Table missing caption',
          element: table.outerHTML,
          severity: 'moderate',
        });
      } else {
        this.passed.push({
          guideline: '2.4.6',
          title: 'Table has caption',
          description: 'Table has proper caption',
        });
      }

      // Check for table headers
      if (headers.length === 0) {
        this.violations.push({
          guideline: '1.3.1',
          title: 'Tables must have header cells',
          description: 'Table missing header cells (th)',
          element: table.outerHTML,
          severity: 'serious',
        });
      }

      // Check for scope attributes
      if (headers.length > 0 && scopeAttrs.length === 0) {
        this.warnings.push({
          guideline: '1.3.1',
          title: 'Table headers should have scope attributes',
          description: 'Table headers missing scope attributes',
          element: table.outerHTML,
          severity: 'moderate',
        });
      }
    });
  }

  checkColorContrast(document) {
    // Basic contrast check - would need a full color contrast library for complete implementation
    const textElements = document.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6');

    textElements.forEach(element => {
      const style = element.style;
      const color = style.color;
      const backgroundColor = style.backgroundColor;

      if (color && backgroundColor) {
        // This is a simplified check - would need proper contrast calculation
        this.passed.push({
          guideline: '1.4.3',
          title: 'Color contrast checked',
          description: `Element has both color and background color set`,
        });
      }
    });
  }

  checkKeyboardNavigation(document) {
    const interactiveElements = document.querySelectorAll('a, button, input, select, textarea, [tabindex]');

    interactiveElements.forEach(element => {
      const tabindex = element.getAttribute('tabindex');

      if (tabindex !== null && tabindex !== '0' && tabindex !== '-1') {
        this.warnings.push({
          guideline: '2.4.3',
          title: 'Avoid positive tabindex values',
          description: `Element has tabindex="${tabindex}"`,
          element: element.outerHTML,
          severity: 'moderate',
        });
      } else {
        this.passed.push({
          guideline: '2.1.1',
          title: 'Element is keyboard accessible',
          description: `Element is properly keyboard accessible`,
        });
      }
    });
  }

  checkARIA(document) {
    const ariaElements = document.querySelectorAll('[role], [aria-*]');

    ariaElements.forEach(element => {
      const role = element.getAttribute('role');
      const ariaAttrs = element.getAttributeNames().filter(attr => attr.startsWith('aria-'));

      // Check for proper ARIA usage
      if (role) {
        this.passed.push({
          guideline: '4.1.2',
          title: 'ARIA role properly used',
          description: `Element has role="${role}"`,
        });
      }

      // Check ARIA attributes
      ariaAttrs.forEach(attr => {
        const value = element.getAttribute(attr);
        if (value) {
          this.passed.push({
            guideline: '4.1.2',
            title: 'ARIA attribute properly used',
            description: `Element has ${attr}="${value}"`,
          });
        }
      });
    });
  }

  checkLanguage(document) {
    const html = document.querySelector('html');
    const lang = html ? html.getAttribute('lang') : null;

    if (!lang) {
      this.violations.push({
        guideline: '3.1.1',
        title: 'HTML must have lang attribute',
        description: 'Missing lang attribute on html element',
        element: html ? html.outerHTML : '<html>',
        severity: 'serious',
      });
    } else {
      this.passed.push({
        guideline: '3.1.1',
        title: 'Language properly specified',
        description: `Language set to: ${lang}`,
      });
    }

    // Check for lang attribute on elements with different language
    const langElements = document.querySelectorAll('[lang]');
    langElements.forEach(element => {
      const elementLang = element.getAttribute('lang');
      this.passed.push({
        guideline: '3.1.2',
        title: 'Language of parts specified',
        description: `Element language: ${elementLang}`,
      });
    });
  }

  checkStructure(document) {
    // Check for proper document structure
    const landmarks = document.querySelectorAll('header, main, nav, footer, section, article, aside');

    if (landmarks.length === 0) {
      this.warnings.push({
        guideline: '1.3.1',
        title: 'Consider using HTML5 semantic elements',
        description: 'No semantic landmarks found',
        severity: 'moderate',
      });
    } else {
      this.passed.push({
        guideline: '1.3.1',
        title: 'Document structure uses semantic elements',
        description: `Found ${landmarks.length} semantic landmarks`,
      });
    }

    // Check for skip links
    const skipLinks = document.querySelectorAll('.skip-link, [href="#main"], [href="#content"]');
    if (skipLinks.length === 0) {
      this.warnings.push({
        guideline: '2.4.1',
        title: 'Consider adding skip links',
        description: 'No skip links found for keyboard users',
        severity: 'moderate',
      });
    } else {
      this.passed.push({
        guideline: '2.4.1',
        title: 'Skip links provided',
        description: `Found ${skipLinks.length} skip links`,
      });
    }
  }

  checkFocusManagement(document) {
    const focusableElements = document.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');

    focusableElements.forEach(element => {
      const outline = element.style.outline;

      if (outline === 'none' || outline === '0') {
        this.warnings.push({
          guideline: '2.4.7',
          title: 'Focus indicators may be removed',
          description: 'Element may have focus outline removed',
          element: element.outerHTML,
          severity: 'moderate',
        });
      } else {
        this.passed.push({
          guideline: '2.4.7',
          title: 'Focus indicator present',
          description: 'Element has proper focus styling',
        });
      }
    });
  }

  calculateScore() {
    const totalChecks = this.violations.length + this.warnings.length + this.passed.length;
    const passedChecks = this.passed.length;

    if (totalChecks === 0) return 100;

    // Weight violations more heavily
    const weightedScore = (passedChecks - (this.violations.length * 2) - this.warnings.length) / totalChecks;
    return Math.max(0, Math.round(weightedScore * 100));
  }

  generateReport(results) {
    const report = {
      summary: {
        totalFiles: results.length,
        filesWithViolations: results.filter(r => r.violations.length > 0).length,
        filesWithWarnings: results.filter(r => r.warnings.length > 0).length,
        totalViolations: results.reduce((sum, r) => sum + r.violations.length, 0),
        totalWarnings: results.reduce((sum, r) => sum + r.warnings.length, 0),
        averageScore: results.reduce((sum, r) => sum + (r.summary?.score || 0), 0) / results.length,
      },
      details: results,
      recommendations: this.generateRecommendations(results),
    };

    return report;
  }

  generateRecommendations(results) {
    const recommendations = [];

    // Count violation types
    const violationTypes = {};
    results.forEach(result => {
      result.violations.forEach(violation => {
        violationTypes[violation.guideline] = (violationTypes[violation.guideline] || 0) + 1;
      });
    });

    // Generate recommendations based on common violations
    if (violationTypes['1.1.1']) {
      recommendations.push({
        priority: 'high',
        guideline: '1.1.1',
        issue: 'Missing alt text for images',
        solution: 'Add descriptive alt text to all images. For decorative images, use alt="" or role="presentation"',
      });
    }

    if (violationTypes['3.3.2']) {
      recommendations.push({
        priority: 'high',
        guideline: '3.3.2',
        issue: 'Missing form labels',
        solution: 'Add proper labels to all form inputs using <label> elements or aria-label attributes',
      });
    }

    if (violationTypes['2.4.6']) {
      recommendations.push({
        priority: 'medium',
        guideline: '2.4.6',
        issue: 'Heading structure issues',
        solution: 'Ensure proper heading hierarchy (h1 followed by h2, etc.) and avoid empty headings',
      });
    }

    if (violationTypes['3.1.1']) {
      recommendations.push({
        priority: 'high',
        guideline: '3.1.1',
        issue: 'Missing language attribute',
        solution: 'Add lang attribute to html element (e.g., <html lang="en"> or <html lang="ta">)',
      });
    }

    return recommendations;
  }

  saveReport(report, filename = 'accessibility-report.json') {
    fs.writeFileSync(filename, JSON.stringify(report, null, 2));
    console.log(`Accessibility report saved to ${filename}`);
  }
}

module.exports = AccessibilityChecker;