const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const htmlFiles = fs.readdirSync(ROOT_DIR).filter(f => f.endsWith('.html'));

function generateHeader(activeFile) {
  const navItems = [
    { href: 'index.html', label: 'Home' },
    { href: 'services.html', label: 'Services' },
    { href: 'availability.html', label: 'Availability' },
    { href: 'about.html', label: 'Providers' },
    { href: 'insurance.html', label: 'Insurance &amp; Fees' },
    { href: 'contact.html', label: 'Contact' },
    { href: 'faq.html', label: 'FAQ' }
  ];

  const navHtml = navItems.map(item => {
    const isActive = item.href === activeFile;
    const activeAttr = isActive ? ' class="nav-link is-active" aria-current="page"' : ' class="nav-link"';
    return `          <li><a href="${item.href}"${activeAttr}>${item.label}</a></li>`;
  }).join('\n');

  return `  <!-- Top Patient Alert (#ann) -->
  <aside id="ann" class="announcement-bar" aria-label="Practice notification">
    <div class="announcement-inner bar-ann">
      <div class="announcement-content">
        <span class="ann-live-dot" aria-hidden="true">
          <span class="pulse-indicator ann-status-dot"></span>
        </span>
        <span class="announcement-text">
          Accepting new adult &amp; adolescent patients in New Albany · Same-week in-person &amp; Indiana telehealth consultations.
        </span>
        <a href="availability.html" class="announcement-action">
          <span>Check openings &rarr;</span>
        </a>
      </div>
      <button type="button" id="annx" class="announcement-dismiss" aria-label="Dismiss notification">&times;</button>
    </div>
  </aside>

  <!-- Global Frosted Header -->
  <header class="site-header" role="banner">
    <div class="header-inner bar">
      <a href="index.html" class="brand-link brand" aria-label="Care Center home">
        <div class="brand-icon-wrap" aria-hidden="true">
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="22" cy="22" r="20" stroke="#C5A059" stroke-opacity="0.35" stroke-width="1"/>
            <circle cx="22" cy="22" r="17" stroke="#C5A059" stroke-width="1.2" stroke-dasharray="2 1.5"/>
            <circle cx="22" cy="22" r="14" fill="#143327"/>
            <circle cx="22" cy="2" r="1" fill="#C5A059"/>
            <circle cx="22" cy="42" r="1" fill="#C5A059"/>
            <circle cx="2" cy="22" r="1" fill="#C5A059"/>
            <circle cx="42" cy="22" r="1" fill="#C5A059"/>
            <path d="M22 28C22 28 15 23 15 16C15 12 18 8 22 8C26 8 29 12 29 16C29 23 22 28 22 28Z" stroke="#C5A059" stroke-width="1.3" fill="rgba(76, 197, 133, 0.18)"/>
            <path d="M22 28V12" stroke="#E4EDE8" stroke-width="1.2" stroke-linecap="round"/>
            <path d="M22 17C23.8 15.5 26 16 26 16" stroke="#C5A059" stroke-width="1.1" stroke-linecap="round"/>
            <path d="M22 21C20.2 19.5 18 20 18 20" stroke="#C5A059" stroke-width="1.1" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="brand-text-wrap">
          <span class="brand-name">Care Center</span>
          <span class="brand-sublabel">PSYCHIATRY &amp; THERAPY · IN</span>
        </div>
      </a>

      <!-- Center Floating Navigation Pill -->
      <nav id="main-nav" class="main-nav" role="navigation" aria-label="Primary navigation" data-open="false">
        <ul class="nav-list">
${navHtml}
        </ul>
      </nav>

      <!-- Right Action Cluster -->
      <div class="header-actions">
        <!-- Light / Dark Mode Toggle -->
        <button type="button" id="theme" class="theme-toggle-btn" aria-pressed="false" aria-label="Switch theme">
          <svg class="theme-toggle-icon theme-icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
          <svg class="theme-toggle-icon theme-icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        </button>

        <a href="session.html" class="btn btn-secondary">Join session</a>
        <a href="book.html" class="btn btn-primary">Book an Intake</a>

        <button type="button" id="mobile-nav-toggle" class="mobile-nav-toggle" aria-expanded="false" aria-label="Open navigation menu">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
  </header>`;
}

let updatedCount = 0;

htmlFiles.forEach(file => {
  const filePath = path.join(ROOT_DIR, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace from start of <aside id="ann" to </header>
  const headerRegex = /<!-- Top Patient Alert \(#ann\) -->[\s\S]*?<\/header>/i;
  const match = content.match(headerRegex);

  if (match) {
    const replacement = generateHeader(file);
    content = content.replace(headerRegex, replacement);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated header in: ${file}`);
    updatedCount++;
  } else {
    // Try matching <aside id="ann" ... </header>
    const fallbackRegex = /<aside id="ann"[\s\S]*?<\/header>/i;
    if (content.match(fallbackRegex)) {
      const replacement = generateHeader(file);
      content = content.replace(fallbackRegex, replacement);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated header (fallback regex) in: ${file}`);
      updatedCount++;
    } else {
      console.warn(`Could not match header in: ${file}`);
    }
  }
});

console.log(`\nSuccessfully updated ${updatedCount} HTML files.`);
