const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const pages = [
  { file: 'services.html', active: 'services' },
  { file: 'availability.html', active: 'avail' },
  { file: 'about.html', active: 'providers' },
  { file: 'insurance.html', active: 'insurance' },
  { file: 'contact.html', active: 'contact' },
  { file: 'faq.html', active: 'faq' },
  { file: 'book.html', active: 'book' },
  { file: 'session.html', active: 'join' },
  { file: 'privacy.html', active: '' },
  { file: 'terms.html', active: '' },
  { file: 'rights.html', active: '' },
  { file: 'consent.html', active: '' }
];

pages.forEach(({ file, active }) => {
  const filePath = path.join(ROOT_DIR, file);
  if (!fs.existsSync(filePath)) return;

  let html = fs.readFileSync(filePath, 'utf8');

  // Brand link
  html = html.replace(
    /<a href="index\.html" class="brand"([^>]*)>/,
    '<a href="index.html" class="brand"$1 data-go="home">'
  );

  // Generate nav list
  const navItems = [
    { href: 'index.html', go: 'home', label: 'Home' },
    { href: 'services.html', go: 'services', label: 'Services' },
    { href: 'availability.html', go: 'avail', label: 'Availability' },
    { href: 'about.html', go: 'providers', label: 'Providers' },
    { href: 'insurance.html', go: 'insurance', label: 'Insurance &amp; Fees' },
    { href: 'contact.html', go: 'contact', label: 'Contact' },
    { href: 'faq.html', go: 'faq', label: 'FAQ' }
  ];

  const navListHtml = '<ul class="nav-list">\n' + navItems.map(item => {
    const isActive = item.go === active;
    const activeClass = isActive ? ' is-active' : '';
    const currentAttr = isActive ? ' aria-current="page"' : '';
    return `          <li><a href="${item.href}" class="nav-link${activeClass}" data-go="${item.go}"${currentAttr}>${item.label}</a></li>`;
  }).join('\n') + '\n        </ul>';

  const navRegex = /<ul class="nav-list">[\s\S]*?<\/ul>/;
  if (navRegex.test(html)) {
    html = html.replace(navRegex, navListHtml);
  }

  // Buttons in header
  html = html.replace(
    /<a href="session\.html" class="btn btn-secondary"([^>]*)>/,
    '<a href="session.html" class="btn btn-secondary"$1 data-go="join">'
  );
  if (!html.includes('data-go="join"')) {
    html = html.replace(
      '<a href="session.html" class="btn btn-secondary">',
      '<a href="session.html" class="btn btn-secondary" data-go="join">'
    );
  }

  html = html.replace(
    /<a href="book\.html" class="btn btn-primary"([^>]*)>/,
    '<a href="book.html" class="btn btn-primary"$1 data-go="book">'
  );
  if (!html.includes('data-go="book"') && html.includes('<a href="book.html" class="btn btn-primary">')) {
    html = html.replace(
      '<a href="book.html" class="btn btn-primary">',
      '<a href="book.html" class="btn btn-primary" data-go="book">'
    );
  }

  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`Synced nav in ${file}`);
});
