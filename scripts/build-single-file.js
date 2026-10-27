const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
let html = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');

// Read CSS files
const tokensCss = fs.readFileSync(path.join(ROOT_DIR, 'assets/css/tokens.css'), 'utf8');
const mainCss = fs.readFileSync(path.join(ROOT_DIR, 'assets/css/main.css'), 'utf8');

// Replace stylesheet links with inlined <style>
const cssReplacement = '  <style>\n' + tokensCss + '\n' + mainCss + '\n  </style>';
html = html.replace(
  /<link rel="stylesheet" href="assets\/css\/tokens\.css"[^>]*>\s*<link rel="stylesheet" href="assets\/css\/main\.css"[^>]*>/,
  cssReplacement
);

// Read JS files
const themeJs = fs.readFileSync(path.join(ROOT_DIR, 'assets/js/theme.js'), 'utf8');
const annJs = fs.readFileSync(path.join(ROOT_DIR, 'assets/js/announcement.js'), 'utf8');
let heroJs = fs.readFileSync(path.join(ROOT_DIR, 'assets/js/hero-sequence.js'), 'utf8');
const appJs = fs.readFileSync(path.join(ROOT_DIR, 'assets/js/app.js'), 'utf8');

// Convert key WebP frames into base64 data URIs for self-contained single-file build
const frameFiles = [
  'frame-001.webp',
  'frame-008.webp',
  'frame-016.webp',
  'frame-024.webp',
  'frame-032.webp',
  'frame-040.webp',
  'frame-048.webp',
  'frame-056.webp',
  'frame-064.webp'
];

const base64Frames = frameFiles.map(file => {
  const p = path.join(ROOT_DIR, 'assets', 'img', 'hero', 'desktop', file);
  if (fs.existsSync(p)) {
    const data = fs.readFileSync(p);
    return `'data:image/webp;base64,${data.toString('base64')}'`;
  }
  return `'assets/img/hero/desktop/${file}'`;
});

const framesDeclaration = `var FRAMES = [\n  ${base64Frames.join(',\n  ')}\n];\nwindow.FRAMES = FRAMES;`;

heroJs = heroJs.replace(
  /var FRAMES = window\.FRAMES \|\| \[[^\]]*\];\s*window\.FRAMES = FRAMES;/,
  framesDeclaration
);

const jsReplacement = '  <script>\n' + themeJs + '\n' + annJs + '\n' + heroJs + '\n' + appJs + '\n  </script>';
html = html.replace(
  /<script src="assets\/js\/theme\.js"[^>]*><\/script>\s*<script src="assets\/js\/announcement\.js"[^>]*><\/script>\s*<script src="assets\/js\/hero-sequence\.js"[^>]*><\/script>\s*<script src="assets\/js\/app\.js"[^>]*><\/script>/,
  jsReplacement
);

fs.writeFileSync(path.join(ROOT_DIR, 'care-center.html'), html, 'utf8');
console.log('Successfully created care-center.html! Size: ' + html.length + ' bytes.');
