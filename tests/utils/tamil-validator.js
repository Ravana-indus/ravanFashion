const fs = require('fs');
const path = require('path');

class TamilValidator {
  constructor() {
    this.tamilUnicodeRange = /[\u0B80-\u0BFF]/;
    this.commonErrors = [
      { pattern: /க்ஷ/g, correct: 'க்‌ஷ', error: 'Missing ZWNJ in க்ஷ' },
      { pattern: /ஶ்ரீ/g, correct: 'ஸ்ரீ', error: 'Use ஸ instead of ஶ' },
      { pattern: /ஜ்‍ஜ/g, correct: 'ஜ்ஜ', error: 'Incorrect ZWJ usage in ஜ்ஜ' },
    ];

    this.culturalTerms = [
      'சேலை', 'புடவை', 'வேட்டி', 'சிறுக்கடை', 'தலைப்பாகை',
      'பள்ளி', 'நீலம்', 'பச்சை', 'மஞ்சள்', 'சிவப்பு',
      'பொங்கல்', 'தீபாவளி', 'தைப்பூசம்', 'விநாயகசதுரதி', 'கிறிஸ்துமஸ்'
    ];
  }

  validateTamilText(text) {
    const errors = [];
    const warnings = [];

    // Check for common Tamil typing errors
    this.commonErrors.forEach(({ pattern, correct, error }) => {
      if (pattern.test(text)) {
        errors.push({ error, suggestion: correct, type: 'syntax' });
      }
    });

    // Validate Unicode normalization
    if (text !== text.normalize('NFC')) {
      errors.push({
        error: 'Text not in NFC normalized form',
        suggestion: 'Use Unicode NFC normalization',
        type: 'unicode'
      });
    }

    // Check for mixed script issues
    const hasTamil = this.tamilUnicodeRange.test(text);
    const hasEnglish = /[a-zA-Z]/.test(text);

    if (hasTamil && hasEnglish) {
      warnings.push({
        warning: 'Mixed Tamil and English text detected',
        suggestion: 'Consider language separation or proper transliteration',
        type: 'mixed_script'
      });
    }

    // Validate cultural terminology usage
    this.culturalTerms.forEach(term => {
      if (text.includes(term)) {
        const context = this.getTermContext(text, term);
        if (!this.isValidCulturalContext(context, term)) {
          warnings.push({
            warning: `Cultural term "${term}" used in potentially inappropriate context`,
            suggestion: 'Review cultural term usage for accuracy',
            type: 'cultural_context',
            term: term
          });
        }
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      tamilCharCount: (text.match(this.tamilUnicodeRange) || []).length,
      totalCharCount: text.length,
      hasMixedScript: hasTamil && hasEnglish
    };
  }

  getTermContext(text, term, contextLength = 50) {
    const index = text.indexOf(term);
    const start = Math.max(0, index - contextLength);
    const end = Math.min(text.length, index + term.length + contextLength);
    return text.substring(start, end);
  }

  isValidCulturalContext(context, term) {
    // Basic validation for cultural term usage
    const inappropriatePatterns = [
      /cheap|low quality|fake/gi,
      /(wear|use|buy).*(inappropriate|wrong)/gi
    ];

    return !inappropriatePatterns.some(pattern => pattern.test(context));
  }

  validateFiles() {
    const results = [];
    const liquidFiles = this.findLiquidFiles();

    liquidFiles.forEach(file => {
      const content = fs.readFileSync(file, 'utf8');
      const validation = this.validateTamilText(content);

      if (!validation.isValid || validation.warnings.length > 0) {
        results.push({
          file,
          validation,
          relativePath: path.relative(process.cwd(), file)
        });
      }
    });

    return results;
  }

  validateLocaleFiles() {
    const results = [];
    const localeFiles = [
      'locales/ta.json',
      'locales/en.default.json'
    ];

    localeFiles.forEach(file => {
      if (fs.existsSync(file)) {
        const content = fs.readFileSync(file, 'utf8');
        let jsonData;

        try {
          jsonData = JSON.parse(content);
          const validation = this.validateJSONContent(jsonData, file);

          if (!validation.isValid || validation.warnings.length > 0) {
            results.push({
              file,
              validation,
              relativePath: path.relative(process.cwd(), file)
            });
          }
        } catch (error) {
          results.push({
            file,
            error: `Invalid JSON: ${error.message}`,
            relativePath: path.relative(process.cwd(), file)
          });
        }
      }
    });

    return results;
  }

  validateJSONContent(jsonData, file) {
    const text = JSON.stringify(jsonData);
    return this.validateTamilText(text);
  }

  findLiquidFiles() {
    const files = [];
    const scanDir = dir => {
      if (!fs.existsSync(dir)) return;

      const items = fs.readdirSync(dir);
      items.forEach(item => {
        const fullPath = path.join(dir, item);
        if (fs.statSync(fullPath).isDirectory()) {
          scanDir(fullPath);
        } else if (item.endsWith('.liquid')) {
          files.push(fullPath);
        }
      });
    };

    ['templates', 'snippets', 'sections', 'layout'].forEach(dir => {
      scanDir(dir);
    });

    return files;
  }

  generateReport(results) {
    const report = {
      summary: {
        totalFiles: results.length,
        filesWithErrors: results.filter(r => r.validation.errors.length > 0).length,
        filesWithWarnings: results.filter(r => r.validation.warnings.length > 0).length,
        totalErrors: results.reduce((sum, r) => sum + r.validation.errors.length, 0),
        totalWarnings: results.reduce((sum, r) => sum + r.validation.warnings.length, 0)
      },
      details: results,
      recommendations: this.generateRecommendations(results)
    };

    return report;
  }

  generateRecommendations(results) {
    const recommendations = [];

    const errorTypes = {};
    results.forEach(result => {
      result.validation.errors.forEach(error => {
        errorTypes[error.type] = (errorTypes[error.type] || 0) + 1;
      });
    });

    if (errorTypes.unicode) {
      recommendations.push({
        priority: 'high',
        issue: 'Unicode normalization issues',
        solution: 'Normalize all Tamil text to NFC form using text.normalize("NFC")'
      });
    }

    if (errorTypes.syntax) {
      recommendations.push({
        priority: 'medium',
        issue: 'Common Tamil syntax errors',
        solution: 'Review and correct common typing patterns, use ZWNJ where appropriate'
      });
    }

    const mixedScriptFiles = results.filter(r => r.validation.hasMixedScript).length;
    if (mixedScriptFiles > 0) {
      recommendations.push({
        priority: 'medium',
        issue: 'Mixed script usage detected',
        solution: 'Consider separating Tamil and English content or using proper transliteration'
      });
    }

    return recommendations;
  }

  saveReport(report, filename = 'tamil-validation-report.json') {
    fs.writeFileSync(filename, JSON.stringify(report, null, 2));
    console.log(`Validation report saved to ${filename}`);
  }
}

module.exports = TamilValidator;

// CLI usage
if (require.main === module) {
  const validator = new TamilValidator();

  console.log('🔍 Validating Tamil text content...\n');

  const liquidResults = validator.validateFiles();
  const localeResults = validator.validateLocaleFiles();
  const allResults = [...liquidResults, ...localeResults];

  const report = validator.generateReport(allResults);

  if (report.summary.totalErrors === 0 && report.summary.totalWarnings === 0) {
    console.log('✅ All Tamil text validation passed!');
    process.exit(0);
  } else {
    console.log('❌ Tamil text validation issues found:\n');

    console.log('📊 Summary:');
    console.log(`   Files checked: ${report.summary.totalFiles}`);
    console.log(`   Files with errors: ${report.summary.filesWithErrors}`);
    console.log(`   Files with warnings: ${report.summary.filesWithWarnings}`);
    console.log(`   Total errors: ${report.summary.totalErrors}`);
    console.log(`   Total warnings: ${report.summary.totalWarnings}\n`);

    if (report.summary.totalErrors > 0) {
      console.log('🚨 Errors:');
      report.details.filter(d => d.validation.errors.length > 0).forEach(({ file, validation }) => {
        console.log(`\n📁 ${file}:`);
        validation.errors.forEach(({ error, suggestion }) => {
          console.log(`  • ${error}`);
          if (suggestion) console.log(`    💡 ${suggestion}`);
        });
      });
    }

    if (report.summary.totalWarnings > 0) {
      console.log('⚠️  Warnings:');
      report.details.filter(d => d.validation.warnings.length > 0).forEach(({ file, validation }) => {
        console.log(`\n📁 ${file}:`);
        validation.warnings.forEach(({ warning, suggestion }) => {
          console.log(`  • ${warning}`);
          if (suggestion) console.log(`    💡 ${suggestion}`);
        });
      });
    }

    console.log('\n🔧 Recommendations:');
    report.recommendations.forEach(({ priority, issue, solution }) => {
      const icon = priority === 'high' ? '🚨' : priority === 'medium' ? '⚠️' : '💡';
      console.log(`  ${icon} ${issue}: ${solution}`);
    });

    validator.saveReport(report);
    process.exit(1);
  }
}