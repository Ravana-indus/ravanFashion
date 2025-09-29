#!/usr/bin/env node

/**
 * Test Summary Generator
 * Generates comprehensive test summary reports from various test results
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class TestSummaryGenerator {
  constructor() {
    this.reportsDir = path.join(__dirname, '../reports');
    this.summaryPath = path.join(this.reportsDir, 'summary', 'test-summary.json');
    this.ensureReportsDirectory();
  }

  ensureReportsDirectory() {
    const dirs = [
      path.join(this.reportsDir, 'summary'),
      path.join(this.reportsDir, 'jest'),
      path.join(this.reportsDir, 'integration'),
      path.join(this.reportsDir, 'performance'),
      path.join(this.reportsDir, 'accessibility'),
      path.join(this.reportsDir, 'cultural'),
      path.join(this.reportsDir, 'tamil')
    ];

    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  async generateSummary() {
    console.log('📊 Generating test summary...');

    const summary = {
      generatedAt: new Date().toISOString(),
      overallStatus: 'pending',
      totalTests: 0,
      passedTests: 0,
      failedTests: 0,
      skippedTests: 0,
      coverage: null,
      performance: null,
      accessibility: null,
      cultural: null,
      tamil: null,
      testSuites: {
        unit: null,
        integration: null,
        e2e: null,
        performance: null,
        accessibility: null
      },
      recommendations: [],
      issues: []
    };

    // Process unit test results
    const unitResults = await this.processUnitTestResults();
    summary.testSuites.unit = unitResults;
    this.mergeTestCounts(summary, unitResults);

    // Process integration test results
    const integrationResults = await this.processIntegrationTestResults();
    summary.testSuites.integration = integrationResults;
    this.mergeTestCounts(summary, integrationResults);

    // Process E2E test results
    const e2eResults = await this.processE2ETestResults();
    summary.testSuites.e2e = e2eResults;
    this.mergeTestCounts(summary, e2eResults);

    // Process performance test results
    const performanceResults = await this.processPerformanceTestResults();
    summary.testSuites.performance = performanceResults;
    summary.performance = performanceResults.score;

    // Process accessibility test results
    const accessibilityResults = await this.processAccessibilityTestResults();
    summary.testSuites.accessibility = accessibilityResults;
    summary.accessibility = accessibilityResults.score;

    // Process cultural validation results
    const culturalResults = await this.processCulturalValidationResults();
    summary.cultural = culturalResults;

    // Process Tamil validation results
    const tamilResults = await this.processTamilValidationResults();
    summary.tamil = tamilResults;

    // Determine overall status
    summary.overallStatus = this.determineOverallStatus(summary);

    // Generate recommendations
    summary.recommendations = this.generateRecommendations(summary);

    // Save summary
    fs.writeFileSync(this.summaryPath, JSON.stringify(summary, null, 2));

    console.log(`✅ Test summary generated: ${this.summaryPath}`);
    console.log(`📊 Overall Status: ${summary.overallStatus}`);
    console.log(`🧪 Tests: ${summary.passedTests} passed, ${summary.failedTests} failed, ${summary.skippedTests} skipped`);

    return summary;
  }

  async processUnitTestResults() {
    const coveragePath = path.join(this.reportsDir, 'jest', 'coverage-summary.json');
    const resultsPath = path.join(this.reportsDir, 'jest', 'test-results.json');

    let results = {
      passed: 0,
      failed: 0,
      skipped: 0,
      total: 0,
      coverage: 0,
      details: {}
    };

    // Process coverage if available
    if (fs.existsSync(coveragePath)) {
      try {
        const coverage = JSON.parse(fs.readFileSync(coveragePath, 'utf8'));
        results.coverage = Math.round(coverage.total.statements.pct);
      } catch (error) {
        console.warn('⚠️ Error processing coverage:', error.message);
      }
    }

    // Process test results if available
    if (fs.existsSync(resultsPath)) {
      try {
        const testResults = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
        results.total = testResults.numTotalTests;
        results.passed = testResults.numPassedTests;
        results.failed = testResults.numFailedTests;
        results.skipped = testResults.numPendingTests;
      } catch (error) {
        console.warn('⚠️ Error processing unit test results:', error.message);
      }
    }

    return results;
  }

  async processIntegrationTestResults() {
    const resultsPath = path.join(this.reportsDir, 'integration', 'integration-results.json');

    let results = {
      passed: 0,
      failed: 0,
      skipped: 0,
      total: 0,
      services: {
        klaviyo: { passed: 0, failed: 0, skipped: 0 },
        pod: { passed: 0, failed: 0, skipped: 0 },
        cultural: { passed: 0, failed: 0, skipped: 0 }
      }
    };

    if (fs.existsSync(resultsPath)) {
      try {
        const testResults = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
        results.total = testResults.total;
        results.passed = testResults.passed;
        results.failed = testResults.failed;
        results.skipped = testResults.skipped;

        if (testResults.services) {
          results.services = { ...results.services, ...testResults.services };
        }
      } catch (error) {
        console.warn('⚠️ Error processing integration test results:', error.message);
      }
    }

    return results;
  }

  async processE2ETestResults() {
    const resultsPath = path.join(process.cwd(), 'test-results', 'e2e-results.json');

    let results = {
      passed: 0,
      failed: 0,
      skipped: 0,
      total: 0,
      browsers: {
        chromium: { passed: 0, failed: 0, skipped: 0 },
        firefox: { passed: 0, failed: 0, skipped: 0 },
        webkit: { passed: 0, failed: 0, skipped: 0 }
      }
    };

    if (fs.existsSync(resultsPath)) {
      try {
        const testResults = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
        results.total = testResults.total;
        results.passed = testResults.passed;
        results.failed = testResults.failed;
        results.skipped = testResults.skipped;

        if (testResults.browsers) {
          results.browsers = { ...results.browsers, ...testResults.browsers };
        }
      } catch (error) {
        console.warn('⚠️ Error processing E2E test results:', error.message);
      }
    }

    return results;
  }

  async processPerformanceTestResults() {
    const resultsPath = path.join(this.reportsDir, 'performance', 'performance-results.json');

    let results = {
      score: 0,
      lcp: 0,
      cls: 0,
      fcp: 0,
      tti: 0,
      details: {}
    };

    if (fs.existsSync(resultsPath)) {
      try {
        const perfResults = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
        results.score = Math.round(perfResults.score * 100);
        results.lcp = perfResults.lcp || 0;
        results.cls = perfResults.cls || 0;
        results.fcp = perfResults.fcp || 0;
        results.tti = perfResults.tti || 0;
        results.details = perfResults.details || {};
      } catch (error) {
        console.warn('⚠️ Error processing performance test results:', error.message);
      }
    }

    return results;
  }

  async processAccessibilityTestResults() {
    const resultsPath = path.join(this.reportsDir, 'accessibility', 'accessibility-results.json');

    let results = {
      score: 0,
      violations: 0,
      warnings: 0,
      passed: 0,
      details: {}
    };

    if (fs.existsSync(resultsPath)) {
      try {
        const a11yResults = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
        results.score = Math.round(a11yResults.score * 100);
        results.violations = a11yResults.violations || 0;
        results.warnings = a11yResults.warnings || 0;
        results.passed = a11yResults.passed || 0;
        results.details = a11yResults.details || {};
      } catch (error) {
        console.warn('⚠️ Error processing accessibility test results:', error.message);
      }
    }

    return results;
  }

  async processCulturalValidationResults() {
    const resultsPath = path.join(this.reportsDir, 'cultural', 'cultural-validation.json');

    let results = {
      valid: 0,
      invalid: 0,
      warnings: 0,
      total: 0,
      details: {
        products: { valid: 0, invalid: 0 },
        content: { valid: 0, invalid: 0 },
        festivalData: { valid: 0, invalid: 0 }
      }
    };

    if (fs.existsSync(resultsPath)) {
      try {
        const culturalResults = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
        results.valid = culturalResults.valid || 0;
        results.invalid = culturalResults.invalid || 0;
        results.warnings = culturalResults.warnings || 0;
        results.total = culturalResults.total || 0;

        if (culturalResults.details) {
          results.details = { ...results.details, ...culturalResults.details };
        }
      } catch (error) {
        console.warn('⚠️ Error processing cultural validation results:', error.message);
      }
    }

    return results;
  }

  async processTamilValidationResults() {
    const resultsPath = path.join(this.reportsDir, 'tamil', 'tamil-validation.json');

    let results = {
      valid: 0,
      invalid: 0,
      warnings: 0,
      total: 0,
      unicodeNormalized: 0,
      syntaxErrors: 0,
      details: {}
    };

    if (fs.existsSync(resultsPath)) {
      try {
        const tamilResults = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
        results.valid = tamilResults.valid || 0;
        results.invalid = tamilResults.invalid || 0;
        results.warnings = tamilResults.warnings || 0;
        results.total = tamilResults.total || 0;
        results.unicodeNormalized = tamilResults.unicodeNormalized || 0;
        results.syntaxErrors = tamilResults.syntaxErrors || 0;
        results.details = tamilResults.details || {};
      } catch (error) {
        console.warn('⚠️ Error processing Tamil validation results:', error.message);
      }
    }

    return results;
  }

  mergeTestCounts(summary, results) {
    summary.totalTests += results.total || 0;
    summary.passedTests += results.passed || 0;
    summary.failedTests += results.failed || 0;
    summary.skippedTests += results.skipped || 0;
  }

  determineOverallStatus(summary) {
    if (summary.failedTests > 0) {
      return 'failed';
    }

    if (summary.passedTests === 0 && summary.totalTests > 0) {
      return 'failed';
    }

    if (summary.performance && summary.performance < 80) {
      return 'warning';
    }

    if (summary.accessibility && summary.accessibility < 90) {
      return 'warning';
    }

    if (summary.testSuites.unit && summary.testSuites.unit.coverage < 80) {
      return 'warning';
    }

    return 'passed';
  }

  generateRecommendations(summary) {
    const recommendations = [];

    // Performance recommendations
    if (summary.performance && summary.performance < 80) {
      recommendations.push({
        priority: 'high',
        category: 'performance',
        issue: 'Performance score below threshold',
        suggestion: 'Optimize images, reduce JavaScript bundle size, improve Core Web Vitals'
      });
    }

    // Accessibility recommendations
    if (summary.accessibility && summary.accessibility < 90) {
      recommendations.push({
        priority: 'high',
        category: 'accessibility',
        issue: 'Accessibility score below threshold',
        suggestion: 'Fix WCAG violations, improve ARIA labels, ensure keyboard navigation'
      });
    }

    // Test coverage recommendations
    if (summary.testSuites.unit && summary.testSuites.unit.coverage < 80) {
      recommendations.push({
        priority: 'medium',
        category: 'coverage',
        issue: 'Test coverage below threshold',
        suggestion: 'Add more unit tests, increase code coverage to 80% or higher'
      });
    }

    // Tamil validation recommendations
    if (summary.tamil && summary.tamil.invalid > 0) {
      recommendations.push({
        priority: 'medium',
        category: 'tamil',
        issue: 'Tamil text validation issues found',
        suggestion: 'Fix Unicode normalization issues, correct Tamil syntax errors'
      });
    }

    // Cultural content recommendations
    if (summary.cultural && summary.cultural.invalid > 0) {
      recommendations.push({
        priority: 'medium',
        category: 'cultural',
        issue: 'Cultural content validation issues',
        suggestion: 'Review and fix cultural content, ensure Tamil products are properly categorized'
      });
    }

    return recommendations;
  }

  generateHtmlReport(summary) {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>🧪 Test Summary - Ravan Fashion</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 20px; background: #f8f9fa; }
    .summary { max-width: 1200px; margin: 0 auto; }
    .header { text-align: center; margin-bottom: 30px; }
    .status-${summary.overallStatus} { color: ${summary.overallStatus === 'passed' ? '#28a745' : summary.overallStatus === 'failed' ? '#dc3545' : '#ffc107'}; }
    .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
    .metric-card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align: center; }
    .metric-value { font-size: 2em; font-weight: bold; margin: 10px 0; }
    .metric-label { color: #666; font-size: 0.9em; }
    .recommendations { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .recommendation { padding: 10px; border-left: 4px solid #007bff; margin-bottom: 10px; background: #f8f9fa; }
    .priority-high { border-left-color: #dc3545; }
    .priority-medium { border-left-color: #ffc107; }
    .priority-low { border-left-color: #28a745; }
  </style>
</head>
<body>
  <div class="summary">
    <div class="header">
      <h1>🧪 Test Summary Report</h1>
      <p class="status-${summary.overallStatus}">Overall Status: ${summary.overallStatus.toUpperCase()}</p>
      <p>Generated: ${new Date(summary.generatedAt).toLocaleString()}</p>
    </div>

    <div class="metrics">
      <div class="metric-card">
        <div class="metric-value">${summary.passedTests}</div>
        <div class="metric-label">Tests Passed</div>
      </div>
      <div class="metric-card">
        <div class="metric-value">${summary.failedTests}</div>
        <div class="metric-label">Tests Failed</div>
      </div>
      <div class="metric-card">
        <div class="metric-value">${summary.skippedTests}</div>
        <div class="metric-label">Tests Skipped</div>
      </div>
      <div class="metric-card">
        <div class="metric-value">${summary.coverage || 0}%</div>
        <div class="metric-label">Code Coverage</div>
      </div>
      <div class="metric-card">
        <div class="metric-value">${summary.performance || 0}</div>
        <div class="metric-label">Performance Score</div>
      </div>
      <div class="metric-card">
        <div class="metric-value">${summary.accessibility || 0}</div>
        <div class="metric-label">Accessibility Score</div>
      </div>
    </div>

    ${summary.recommendations.length > 0 ? `
    <div class="recommendations">
      <h3>💡 Recommendations</h3>
      ${summary.recommendations.map(rec => `
        <div class="recommendation priority-${rec.priority}">
          <strong>${rec.category.toUpperCase()}:</strong> ${rec.issue}
          <br><em>${rec.suggestion}</em>
        </div>
      `).join('')}
    </div>
    ` : ''}
  </div>
</body>
</html>`;

    const htmlPath = path.join(this.reportsDir, 'summary', 'test-summary.html');
    fs.writeFileSync(htmlPath, html);
    console.log(`📄 HTML report generated: ${htmlPath}`);
  }
}

// Main execution
if (require.main === module) {
  const generator = new TestSummaryGenerator();
  generator.generateSummary()
    .then(summary => {
      generator.generateHtmlReport(summary);
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Error generating test summary:', error);
      process.exit(1);
    });
}

module.exports = TestSummaryGenerator;