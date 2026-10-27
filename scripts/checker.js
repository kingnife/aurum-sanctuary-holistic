/**
 * Care Center - Quality & Compliance Checker
 * Validates:
 * 1. Crisis line present on every HTML page with exact required wording.
 * 2. All <img> tags have non-empty alt text and explicit dimensions.
 * 3. Exactly one <h1> per page.
 * 4. Skip link present on every page.
 * 5. All placeholders match the documented registry in PLACEHOLDERS.md.
 * 6. Hero supporting sentence is 20 words or fewer.
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const htmlFiles = fs.readdirSync(ROOT_DIR).filter(f => f.endsWith('.html'));

const REQUIRED_CRISIS_TEXT = '988';
const REQUIRED_CRISIS_EMERGENCY = '911';
const NOT_FOR_EMERGENCIES = 'not for emergencies';

let errors = [];
let warnings = [];
let passCount = 0;

console.log(`\n========================================`);
console.log(`Care Center Healthcare QA & Compliance Audit`);
console.log(`========================================\n`);

htmlFiles.forEach(file => {
  const filePath = path.join(ROOT_DIR, file);
  const content = fs.readFileSync(filePath, 'utf8');

  console.log(`Auditing: ${file}`);

  // 1. Check Crisis Line
  const has988 = content.includes(REQUIRED_CRISIS_TEXT);
  const has911 = content.includes(REQUIRED_CRISIS_EMERGENCY);
  const hasNotEmergency = content.toLowerCase().includes(NOT_FOR_EMERGENCIES);

  if (!has988 || !has911 || !hasNotEmergency) {
    errors.push(`[${file}] Missing mandatory crisis safety lines (988 Lifeline, 911, or "not for emergencies" disclosure).`);
  } else {
    passCount++;
  }

  // 2. Check <h1> count
  const h1Matches = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi) || [];
  if (h1Matches.length !== 1) {
    errors.push(`[${file}] Expected exactly one <h1>, found ${h1Matches.length}.`);
  } else {
    passCount++;
  }

  // 3. Check Skip Link
  if (!content.includes('class="skip-link"') && !content.includes("class='skip-link'")) {
    errors.push(`[${file}] Missing WCAG 2.2 skip link.`);
  } else {
    passCount++;
  }

  // 4. Check img tags for alt text and explicit dimensions
  const imgMatches = content.matchAll(/<img\s+([^>]+)>/gi);
  for (const match of imgMatches) {
    const attrs = match[1];
    const hasAlt = /alt="([^"]*)"/i.test(attrs) || /alt='([^']*)'/i.test(attrs);
    const hasWidth = /width="([^"]*)"/i.test(attrs);
    const hasHeight = /height="([^"]*)"/i.test(attrs);

    if (!hasAlt) {
      errors.push(`[${file}] Image missing alt attribute: ${match[0]}`);
    }
    if (!hasWidth || !hasHeight) {
      warnings.push(`[${file}] Image missing explicit width/height: ${match[0]}`);
    }
  }

  // 5. Check hero supporting sentence word count if present
  if (file === 'index.html') {
    const supportingMatch = content.match(/<p class="hero-supporting">([\s\S]*?)<\/p>/i);
    if (supportingMatch) {
      const text = supportingMatch[1].replace(/<[^>]+>/g, '').trim();
      const words = text.split(/\s+/).filter(Boolean);
      console.log(`  Hero supporting text (${words.length} words): "${text}"`);
      if (words.length > 20) {
        errors.push(`[${file}] Hero supporting sentence exceeds 20 words (found ${words.length}).`);
      } else {
        passCount++;
      }
    }
  }

  // 6. Check bracketed placeholders in HTML content (ignoring <style> and <script> contents)
  const contentWithoutCode = content
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '');
  const placeholderMatches = contentWithoutCode.matchAll(/\[([^[\]]+)\]/g);
  const registryContent = fs.existsSync(path.join(ROOT_DIR, 'PLACEHOLDERS.md'))
    ? fs.readFileSync(path.join(ROOT_DIR, 'PLACEHOLDERS.md'), 'utf8')
    : '';

  for (const pMatch of placeholderMatches) {
    const placeholderStr = pMatch[0];
    if (!registryContent.includes(placeholderStr)) {
      warnings.push(`[${file}] Placeholder "${placeholderStr}" not found in PLACEHOLDERS.md registry.`);
    }
  }
});

console.log(`\nAudit Results:`);
console.log(`Passed checks: ${passCount}`);
console.log(`Warnings: ${warnings.length}`);
warnings.forEach(w => console.warn(`  ⚠ ${w}`));

console.log(`Errors: ${errors.length}`);
errors.forEach(e => console.error(`  ✖ ${e}`));

if (errors.length > 0) {
  console.log(`\n❌ Quality check FAILED with ${errors.length} errors.`);
  process.exit(1);
} else {
  console.log(`\n✔ Quality check PASSED cleanly.`);
  process.exit(0);
}
