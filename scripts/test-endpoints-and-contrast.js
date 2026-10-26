const http = require('http');
const sharp = require('sharp');
const path = require('path');

const urls = [
  'http://127.0.0.1:3000/',
  'http://127.0.0.1:3000/services.html',
  'http://127.0.0.1:3000/availability.html',
  'http://127.0.0.1:3000/book.html',
  'http://127.0.0.1:3000/session.html',
  'http://127.0.0.1:3000/about.html',
  'http://127.0.0.1:3000/insurance.html',
  'http://127.0.0.1:3000/contact.html',
  'http://127.0.0.1:3000/faq.html',
  'http://127.0.0.1:3000/privacy.html',
  'http://127.0.0.1:3000/terms.html',
  'http://127.0.0.1:3000/rights.html',
  'http://127.0.0.1:3000/consent.html',
  'http://127.0.0.1:3000/assets/css/tokens.css',
  'http://127.0.0.1:3000/assets/css/main.css',
  'http://127.0.0.1:3000/assets/js/theme.js',
  'http://127.0.0.1:3000/assets/js/announcement.js',
  'http://127.0.0.1:3000/assets/js/hero-sequence.js',
  'http://127.0.0.1:3000/assets/js/app.js',
  'http://127.0.0.1:3000/assets/img/hero/hero-poster-desktop.webp',
  'http://127.0.0.1:3000/assets/img/hero/hero-poster-mobile.webp',
  'http://127.0.0.1:3000/assets/img/providers/dr-marcus-vance.webp',
  'http://127.0.0.1:3000/assets/img/providers/sarah-lin-holloway.webp',
  'http://127.0.0.1:3000/assets/img/concierge-avatar.webp'
];

function fetchStatus(url) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      resolve({ url, status: res.statusCode, contentType: res.headers['content-type'], length: res.headers['content-length'] });
    }).on('error', (err) => resolve({ url, status: 0, error: err.message }));
  });
}

function relativeLuminance(r, g, b) {
  const [sR, sG, sB] = [r, g, b].map(v => {
    const val = v / 255;
    return val <= 0.04045 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * sR + 0.7152 * sG + 0.0722 * sB;
}

function contrastRatio(lum1, lum2) {
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

async function run() {
  console.log('Testing HTTP Endpoints on Local Server:');
  let failures = 0;
  for (const url of urls) {
    const res = await fetchStatus(url);
    const pass = res.status === 200;
    if (!pass) failures++;
    console.log(`  [${res.status}] ${res.url} (${res.contentType}, ${res.length} bytes)`);
  }

  console.log('\nTesting Hero Contrast against brightest succulent pixels with botanical spruce veil overlay:');
  const frame1Path = path.join(__dirname, '..', 'assets', 'img', 'hero', 'desktop', 'frame-001.webp');
  const { data, info } = await sharp(frame1Path).raw().toBuffer({ resolveWithObject: true });
  
  let maxLuminance = 0;
  let brightestR = 0, brightestG = 0, brightestB = 0;
  for (let i = 0; i < data.length; i += info.channels) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const lum = relativeLuminance(r, g, b);
    if (lum > maxLuminance) {
      maxLuminance = lum;
      brightestR = r;
      brightestG = g;
      brightestB = b;
    }
  }

  // Editorial typography scrim on left column: rgba(10, 25, 20, 0.88)
  const alpha = 0.88;
  const blendedR = Math.round(brightestR * (1 - alpha) + 10 * alpha);
  const blendedG = Math.round(brightestG * (1 - alpha) + 25 * alpha);
  const blendedB = Math.round(brightestB * (1 - alpha) + 20 * alpha);
  const blendedLum = relativeLuminance(blendedR, blendedG, blendedB);

  // Text color on hero: #FAF8F5
  const textLum = relativeLuminance(250, 248, 245);
  const ratio = contrastRatio(textLum, blendedLum);

  console.log(`  Brightest pixel under veil overlay: rgb(${blendedR}, ${blendedG}, ${blendedB}), luminance: ${blendedLum.toFixed(4)}`);
  console.log(`  Hero text color: #FAF8F5, text luminance: ${textLum.toFixed(4)}`);
  console.log(`  Measured WCAG contrast ratio: ${ratio.toFixed(2)}:1 (Minimum requirement: 4.5:1)`);

  if (ratio >= 4.5 && failures === 0) {
    console.log(`  ✔ Contrast and all endpoints PASS with flying colors!`);
    process.exit(0);
  } else {
    console.log(`  ✖ Failed verification.`);
    process.exit(1);
  }
}

run();
