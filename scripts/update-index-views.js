const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(filePath, 'utf8');

// 1. Brand logo button
html = html.replace(
  /<a href="index\.html" class="brand" aria-label="Care Center homepage">/,
  '<a href="#v-home" class="brand" data-go="home" aria-label="Care Center homepage">'
);

// 2. Navigation links
const oldNav = `<ul class="nav-list">
          <li><a href="#hero" class="nav-link is-active" aria-current="page">Home</a></li>
          <li><a href="#services" class="nav-link">Services</a></li>
          <li><a href="#avail" class="nav-link">Availability</a></li>
          <li><a href="#providers" class="nav-link">Providers</a></li>
          <li><a href="#insurance" class="nav-link">Insurance &amp; Fees</a></li>
          <li><a href="#contact" class="nav-link">Contact</a></li>
          <li><a href="#faq" class="nav-link">FAQ</a></li>
        </ul>`;

const newNav = `<ul class="nav-list">
          <li><a href="#v-home" class="nav-link is-active" data-go="home" aria-current="page">Home</a></li>
          <li><a href="#services" class="nav-link" data-go="home" data-sec="services">Services</a></li>
          <li><a href="#avail" class="nav-link" data-go="home" data-sec="avail">Availability</a></li>
          <li><a href="#providers" class="nav-link" data-go="home" data-sec="providers">Providers</a></li>
          <li><a href="#insurance" class="nav-link" data-go="home" data-sec="insurance">Insurance &amp; Fees</a></li>
          <li><a href="#contact" class="nav-link" data-go="home" data-sec="contact">Contact</a></li>
          <li><a href="#faq" class="nav-link" data-go="home" data-sec="faq">FAQ</a></li>
        </ul>`;

html = html.replace(oldNav, newNav);

// 3. Header Action buttons
html = html.replace(
  '<a href="session.html" class="btn btn-secondary">Join session</a>',
  '<a href="session.html" class="btn btn-secondary" data-go="join">Join session</a>'
);
html = html.replace(
  '<a href="book.html" class="btn btn-primary">Book an Intake</a>',
  '<a href="book.html" class="btn btn-primary" data-go="book">Book an Intake</a>'
);

// 4. Hero CTA buttons
html = html.replace(
  '<a href="book.html" data-open-modal="v-book" class="btn-hero-primary">',
  '<a href="book.html" data-go="book" data-open-modal="v-book" class="btn-hero-primary">'
);
html = html.replace(
  '<a href="session.html" data-open-modal="v-join" class="btn-hero-secondary">',
  '<a href="session.html" data-go="join" data-open-modal="v-join" class="btn-hero-secondary">'
);

// 5. Availability row links
html = html.replace(
  '<a href="book.html?day=Monday" data-open-modal="v-book" class="avail-day-row"',
  '<a href="book.html?day=Monday" data-go="book" data-open-modal="v-book" class="avail-day-row"'
);
html = html.replace(
  '<a href="book.html?day=Wednesday" data-open-modal="v-book" class="avail-day-row"',
  '<a href="book.html?day=Wednesday" data-go="book" data-open-modal="v-book" class="avail-day-row"'
);
html = html.replace(
  '<a href="book.html?day=Friday" data-open-modal="v-book" class="avail-day-row"',
  '<a href="book.html?day=Friday" data-go="book" data-open-modal="v-book" class="avail-day-row"'
);
html = html.replace(
  '<a href="book.html" data-open-modal="v-book" class="avail-time-link">',
  '<a href="book.html" data-go="book" data-open-modal="v-book" class="avail-time-link">'
);

// 6. Footer links
html = html.replace(
  '<li><a href="book.html">Book an intake appointment</a></li>',
  '<li><a href="book.html" data-go="book">Book an intake appointment</a></li>'
);
html = html.replace(
  '<li><a href="book.html">White-glove intake stepper</a></li>',
  '<li><a href="book.html" data-go="book">White-glove intake stepper</a></li>'
);
html = html.replace(
  '<li><a href="session.html">Virtual waiting room login</a></li>',
  '<li><a href="session.html" data-go="join">Virtual waiting room login</a></li>'
);

// 7. Wrap homepage sections in <section class="view on" id="v-home" aria-label="Home">
// Find where <main id="main"> starts and where </main> ends
const mainStartTag = '<main id="main">';
const mainStartIndex = html.indexOf(mainStartTag);
if (mainStartIndex === -1) {
  console.error('Could not find <main id="main">');
  process.exit(1);
}

// Extract existing modals #v-book and #v-join
const vBookStartTag = '<!-- INTAKE BOOKING STEPPER MODAL (#v-book) -->';
const vBookStartIndex = html.indexOf(vBookStartTag);
const erStartTag = '<!-- CARE CONCIERGE AI DRAWER (#er) -->';
const erStartIndex = html.indexOf(erStartTag);

if (vBookStartIndex === -1 || erStartIndex === -1) {
  console.error('Could not find v-book or er');
  process.exit(1);
}

// Slice out the modals block from below footer
const modalsBlock = html.substring(vBookStartIndex, erStartIndex);

// Remove modalsBlock from its old position below footer
html = html.substring(0, vBookStartIndex) + html.substring(erStartIndex);

// Build new #v-book section
// Extract inner wizard content from modalsBlock
// Replace wrapper with:
// <section class="view page" id="v-book" aria-label="Book an appointment">
//   <div class="view-page-container">
//     <div class="view-page-nav">
//       <button type="button" class="btn-return-home" data-go="home" aria-label="Return to practice overview">
//         <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
//         <span>Return to Sanctuary</span>
//       </button>
//     </div>
//     <div class="form" id="form">
//     ...
//     </div>
//   </div>
// </section>

// Let's parse #v-book inner and #v-join inner
const vBookMatch = modalsBlock.match(/<div id="v-book"[\s\S]*?<\/form>\s*<!-- Success Screen -->[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/);
const vJoinMatch = modalsBlock.match(/<div id="v-join"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/);

// Instead of fragile regex parsing on entire modalsBlock, let's construct pristine #v-book and #v-join
// using the exact inner forms:
const wizardBodyMatch = modalsBlock.match(/<div class="wizard-body">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>\s*<!-- VIRTUAL TELEHEALTH/);
const joinBodyMatch = modalsBlock.match(/<!-- VIRTUAL TELEHEALTH WAITING ROOM MODAL \(#v-join\) -->[\s\S]*?<div class="wizard-body">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/);

const wizardBody = wizardBodyMatch ? wizardBodyMatch[1].trim() : '';
const joinBody = joinBodyMatch ? joinBodyMatch[1].trim() : '';

const newVBookSection = `    <!-- INTAKE BOOKING STEPPER VIEW (#v-book) -->
    <section class="view page" id="v-book" aria-label="Book an appointment">
      <div class="view-page-container">
        <div class="view-page-nav">
          <button type="button" class="btn-return-home" data-go="home" aria-label="Return to practice overview">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            <span>Return to Sanctuary</span>
          </button>
        </div>

        <div class="form" id="form">
          <div class="modal-header">
            <div class="modal-title-wrap">
              <h2 id="wizard-modal-title" class="modal-title">Intake Reservation</h2>
              <span class="modal-subtitle">Confidential 3-Step Scheduling · HIPAA Protected · New Albany, IN</span>
            </div>
            <button type="button" class="modal-close-btn" data-go="home" aria-label="Close intake view">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <div class="wizard-body">
${wizardBody}
          </div>
        </div>
      </div>
    </section>`;

const newVJoinSection = `    <!-- VIRTUAL TELEHEALTH WAITING ROOM VIEW (#v-join) -->
    <section class="view page" id="v-join" aria-label="Join your session">
      <div class="view-page-container">
        <div class="view-page-nav">
          <button type="button" class="btn-return-home" data-go="home" aria-label="Return to practice overview">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            <span>Return to Sanctuary</span>
          </button>
        </div>

        <div class="form" id="jn">
          <div class="modal-header">
            <div class="modal-title-wrap">
              <h2 id="join-modal-title" class="modal-title">Virtual Waiting Room</h2>
              <span class="modal-subtitle">Indiana Encrypted Telehealth · WebRTC Compliant</span>
            </div>
            <button type="button" class="modal-close-btn" data-go="home" aria-label="Close waiting room view">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <div class="wizard-body">
${joinBody}
          </div>
        </div>
      </div>
    </section>`;

// Replace <main id="main"> content:
// Insert <section class="view on" id="v-home" aria-label="Home"> right after <main id="main">\n
html = html.replace(
  '<main id="main">',
  '<main id="main">\n    <section class="view on" id="v-home" aria-label="Home">'
);

// Close </section><!-- /#v-home --> before </main>, and append newVBookSection and newVJoinSection
html = html.replace(
  '  </main>',
  '    </section><!-- /#v-home -->\n\n' + newVBookSection + '\n\n' + newVJoinSection + '\n  </main>'
);

fs.writeFileSync(filePath, html, 'utf8');
console.log('Successfully updated index.html with views!');
