const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const indexPath = path.join(ROOT_DIR, 'index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf8');

// 1. Navigation links in header:
// Update navigation links to include both href (for standalone multi-page fallback) and data-go (for instant SPA switching)
const oldNavPattern = /<nav id="main-nav" class="main-nav"[\s\S]*?<\/nav>/;
const newNav = `<nav id="main-nav" class="main-nav" role="navigation" aria-label="Primary navigation" data-open="false">
        <ul class="nav-list">
          <li><a href="index.html" class="nav-link is-active" data-go="home" aria-current="page">Home</a></li>
          <li><a href="services.html" class="nav-link" data-go="services">Services</a></li>
          <li><a href="availability.html" class="nav-link" data-go="avail">Availability</a></li>
          <li><a href="about.html" class="nav-link" data-go="providers">Providers</a></li>
          <li><a href="insurance.html" class="nav-link" data-go="insurance">Insurance &amp; Fees</a></li>
          <li><a href="contact.html" class="nav-link" data-go="contact">Contact</a></li>
          <li><a href="faq.html" class="nav-link" data-go="faq">FAQ</a></li>
        </ul>
      </nav>`;

indexHtml = indexHtml.replace(oldNavPattern, newNav);

// 2. Sanctuary Directory Section on Home (#v-home)
const sanctuaryDirectoryHtml = `
    <!-- Sanctuary Multi-Page Directory Grid -->
    <section id="directory" class="sanctuary-directory-section" aria-labelledby="directory-title">
      <div class="section-inner">
        <div class="section-header" style="text-align: left; margin-bottom: var(--space-3xl);">
          <span class="section-eyebrow">Explore Our Practice</span>
          <h2 id="directory-title" class="section-title">A Comprehensive Sanctuary for Healing</h2>
          <p class="section-lead">
            Select a pathway below to view clinical details, meet our physician leadership, inspect transparent fee schedules, or check immediate scheduling openings.
          </p>
        </div>

        <div class="sanctuary-directory-grid">
          <!-- 1. Services Portal -->
          <a href="services.html" class="directory-card" data-go="services" aria-label="View Clinical Services">
            <div class="directory-icon-box" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            </div>
            <span class="directory-badge">Specialties &amp; Care</span>
            <h3 class="directory-title">Clinical Offerings</h3>
            <p class="directory-desc">
              Comprehensive psychiatric evaluation, conservative medication management, and evidence-based psychotherapy tailored to your biology.
            </p>
            <span class="directory-action">
              <span>Explore services</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            </span>
          </a>

          <!-- 2. Availability Portal -->
          <a href="availability.html" class="directory-card" data-go="avail" aria-label="View Availability Board">
            <div class="directory-icon-box" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            </div>
            <span class="directory-badge">Live Openings</span>
            <h3 class="directory-title">Availability Board</h3>
            <p class="directory-desc">
              Real-time schedule data updated weekly. Inspect daytime, evening, and Indiana telehealth consultation openings.
            </p>
            <span class="directory-action">
              <span>View live schedule</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            </span>
          </a>

          <!-- 3. Providers Portal -->
          <a href="about.html" class="directory-card" data-go="providers" aria-label="Meet Clinical Leadership">
            <div class="directory-icon-box" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <span class="directory-badge">Medical Leadership</span>
            <h3 class="directory-title">Our Clinicians</h3>
            <p class="directory-desc">
              Physician-led care directed by Dr. Elena Vance, MD (Johns Hopkins trained) and Marcus Reed, LCSW (Certified EMDR clinician).
            </p>
            <span class="directory-action">
              <span>Meet the team</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            </span>
          </a>

          <!-- 4. Insurance & Fees Portal -->
          <a href="insurance.html" class="directory-card" data-go="insurance" aria-label="View Insurance & Fees">
            <div class="directory-icon-box" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
            </div>
            <span class="directory-badge">Financial Clarity</span>
            <h3 class="directory-title">Insurance &amp; Fees</h3>
            <p class="directory-desc">
              Direct in-network participating agreements with Anthem, Aetna, Cigna, Medicare, plus transparent self-pay and Superbill assistance.
            </p>
            <span class="directory-action">
              <span>Review coverage</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            </span>
          </a>

          <!-- 5. Sanctuary Location Portal -->
          <a href="contact.html" class="directory-card" data-go="contact" aria-label="Clinic Directions & Inquiries">
            <div class="directory-icon-box" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <span class="directory-badge">New Albany, IN</span>
            <h3 class="directory-title">Clinic &amp; Directions</h3>
            <p class="directory-desc">
              Situated in downtown New Albany with discrete off-street parking, elevator access, and acoustic soundproofing.
            </p>
            <span class="directory-action">
              <span>View location</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            </span>
          </a>

          <!-- 6. FAQ Portal -->
          <a href="faq.html" class="directory-card" data-go="faq" aria-label="Frequently Asked Questions">
            <div class="directory-icon-box" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
            <span class="directory-badge">Patient Inquiries</span>
            <h3 class="directory-title">Common Questions</h3>
            <p class="directory-desc">
              Answers regarding first-visit expectations, telehealth security, conservative prescribing, and appointment scheduling.
            </p>
            <span class="directory-action">
              <span>Read patient FAQ</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            </span>
          </a>
        </div>
      </div>
    </section>
`;

// Extract sections from indexHtml
// We want to replace everything between </section><!-- /#trust --> and </section><!-- /#v-home -->
const trustEndTag = '</section>\n\n    <!-- Trust Strip & In-Network Insurance Logos -->';
// Let's locate where the trust strip ends:
const trustCloseIdx = indexHtml.indexOf('</section>', indexHtml.indexOf('id="trust"'));
if (trustCloseIdx === -1) {
  console.error('Could not find trust section close');
  process.exit(1);
}
const trustEnd = trustCloseIdx + '</section>'.length;

const vHomeCloseIdx = indexHtml.indexOf('</section><!-- /#v-home -->');
if (vHomeCloseIdx === -1) {
  console.error('Could not find </section><!-- /#v-home -->');
  process.exit(1);
}

// 3. Define the dedicated Multi-Page Section Views:
const vServicesHtml = `
    <!-- DEDICATED SERVICES VIEW (#v-services) -->
    <section class="view page" id="v-services" aria-label="Clinical Services">
      <div class="view-page-container is-wide">
        <div class="view-page-nav">
          <button type="button" class="btn-return-home" data-go="home" aria-label="Return to practice overview">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            <span>Return to Sanctuary</span>
          </button>
          <nav class="view-nav-breadcrumb" aria-label="Breadcrumb">
            <a href="index.html" data-go="home">Care Center</a>
            <span class="sep">/</span>
            <span class="current">Clinical Services</span>
          </nav>
        </div>

        <div class="view-hero-header">
          <span class="section-eyebrow">Clinical Specialties &amp; Offerings</span>
          <h2 class="view-hero-title section-title">Evidence-Based Psychiatric &amp; Therapeutic Care</h2>
          <p class="section-lead">
            We provide comprehensive outpatient psychiatry, conservative medication management, and specialized trauma-informed psychotherapy for adults, adolescents, and families across Southern Indiana and statewide telehealth.
          </p>
        </div>

        <div class="services-grid">
          <article class="service-card box">
            <div class="service-icon-wrap" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            </div>
            <span class="directory-badge">Diagnostic Assessment</span>
            <h3 class="service-title">Comprehensive Psychiatric Evaluation</h3>
            <p class="service-desc">
              In-depth biological, psychological, and lifestyle assessments to build a diagnostic foundation without rush. We examine family history, previous therapies, and laboratory biomarkers to uncover underlying roots.
            </p>
            <div style="font-size:var(--text-xs);color:var(--text-muted);margin-bottom:var(--space-md);line-height:1.6;">
              <strong>Format:</strong> 60-Minute Intake · In-Person or Telehealth<br>
              <strong>Clinician:</strong> Board-Certified Psychiatrist (Dr. Elena Vance, MD)
            </div>
            <a href="book.html" class="btn btn-primary btn-pill-sm" data-go="book" style="width:100%;">Schedule Evaluation</a>
          </article>

          <article class="service-card box">
            <div class="service-icon-wrap" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.5 20.5L3.5 13.5A5 5 0 0 1 10.5 6.5L17.5 13.5A5 5 0 0 1 10.5 20.5Z"/><line x1="8.5" y1="8.5" x2="15.5" y2="15.5"/></svg>
            </div>
            <span class="directory-badge">Pharmacotherapy</span>
            <h3 class="service-title">Conservative Medication Management</h3>
            <p class="service-desc">
              Evidence-based pharmacotherapy tailored to your unique biology, prioritizing the lowest effective dosage and continuous monitoring. We de-prescribe unnecessary compounds and optimize safety.
            </p>
            <div style="font-size:var(--text-xs);color:var(--text-muted);margin-bottom:var(--space-md);line-height:1.6;">
              <strong>Format:</strong> 30-Minute Monitoring Sessions · Monthly / Bi-monthly<br>
              <strong>Focus:</strong> Depressive Disorders, Complex Anxiety, ADHD, Bipolar Spectrum
            </div>
            <a href="book.html" class="btn btn-primary btn-pill-sm" data-go="book" style="width:100%;">Explore Medication Care</a>
          </article>

          <article class="service-card box">
            <div class="service-icon-wrap" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z"/><path d="M12 7v5l3 3"/></svg>
            </div>
            <span class="directory-badge">Psychotherapy</span>
            <h3 class="service-title">Integrative Psychotherapy &amp; EMDR</h3>
            <p class="service-desc">
              Individualized CBT, ACT, and psychodynamic counseling addressing trauma, anxiety, mood disorders, and life transitions. Specialized somatic and EMDR modalities for nervous system integration.
            </p>
            <div style="font-size:var(--text-xs);color:var(--text-muted);margin-bottom:var(--space-md);line-height:1.6;">
              <strong>Format:</strong> 50-Minute Weekly or Bi-weekly Sessions<br>
              <strong>Clinician:</strong> Marcus Reed, LCSW (Certified EMDR Clinician)
            </div>
            <a href="book.html" class="btn btn-primary btn-pill-sm" data-go="book" style="width:100%;">Request Therapy Session</a>
          </article>

          <article class="service-card box">
            <div class="service-icon-wrap" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
            </div>
            <span class="directory-badge">Youth &amp; Families</span>
            <h3 class="service-title">Adolescent &amp; Family Support</h3>
            <p class="service-desc">
              Specialized psychiatric guidance for adolescents and young adults navigating emotional regulation, academic pressure, and family transitions with compassionate developmental pacing.
            </p>
            <div style="font-size:var(--text-xs);color:var(--text-muted);margin-bottom:var(--space-md);line-height:1.6;">
              <strong>Ages:</strong> Adolescents (14–17) &amp; Young Adults (18–24)<br>
              <strong>Modality:</strong> Family Systems &amp; Developmental Counseling
            </div>
            <a href="book.html" class="btn btn-primary btn-pill-sm" data-go="book" style="width:100%;">Inquire for Adolescent Care</a>
          </article>
        </div>

        <!-- Care Pathway -->
        <div style="margin-top: var(--space-4xl);">
          <div class="section-header" style="text-align: left; margin-bottom: var(--space-xl);">
            <span class="section-eyebrow">The Intake Journey</span>
            <h3 class="section-title" style="font-size: var(--text-2xl);">An Unhurried Clinical Pathway</h3>
          </div>
          <div class="pathway-grid">
            <div class="pathway-card">
              <span class="pathway-step-num">Step 01</span>
              <h4 class="pathway-title">Confidential Reach Out</h4>
              <p class="pathway-desc">Submit your inquiry online or via our Care Concierge. We verify insurance benefits within two business hours.</p>
            </div>
            <div class="pathway-card">
              <span class="pathway-step-num">Step 02</span>
              <h4 class="pathway-title">60-Min Comprehensive Intake</h4>
              <p class="pathway-desc">An unhurried consultation in our quiet New Albany clinic or via encrypted high-definition WebRTC video.</p>
            </div>
            <div class="pathway-card">
              <span class="pathway-step-num">Step 03</span>
              <h4 class="pathway-title">Collaborative Care Plan</h4>
              <p class="pathway-desc">Receive a personalized roadmap balancing biological stability, conservative dosing, and therapeutic goals.</p>
            </div>
            <div class="pathway-card">
              <span class="pathway-step-num">Step 04</span>
              <h4 class="pathway-title">Continuous Partnership</h4>
              <p class="pathway-desc">Regular monitoring, progress reviews, and direct digital messaging with your dedicated clinician team.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- DEDICATED AVAILABILITY VIEW (#v-avail) -->
    <section class="view page" id="v-avail" aria-label="Clinical Availability">
      <div class="view-page-container is-wide">
        <div class="view-page-nav">
          <button type="button" class="btn-return-home" data-go="home" aria-label="Return to practice overview">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            <span>Return to Sanctuary</span>
          </button>
          <nav class="view-nav-breadcrumb" aria-label="Breadcrumb">
            <a href="index.html" data-go="home">Care Center</a>
            <span class="sep">/</span>
            <span class="current">Availability Board</span>
          </nav>
        </div>

        <div class="view-hero-header">
          <span class="section-eyebrow">Real-Time Scheduling</span>
          <h2 class="view-hero-title section-title">Clinical Availability Board</h2>
          <p class="section-lead">
            Transparent scheduling data updated every week. Find immediate appointment openings for diagnostic evaluations, conservative pharmacotherapy, and psychotherapy in New Albany and statewide telehealth.
          </p>
        </div>

        <div id="av2" class="avail-hud-panel panel box" style="max-width: 960px; margin: 0 auto; border-radius: var(--radius-xl); padding: var(--space-2xl);">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: var(--space-xl); flex-wrap: wrap; gap: var(--space-md); border-bottom: 1px solid rgba(255, 255, 255, 0.15); padding-bottom: var(--space-lg);">
            <div>
              <span class="section-eyebrow" style="margin-bottom:2px; color: #4CC585;">Live Clinic Status</span>
              <h3 style="font-family: var(--font-heading); font-size: 1.6rem; font-weight: 600; color: var(--text-primary); margin:0;">
                Southern Indiana &amp; Telehealth Openings
              </h3>
              <p style="font-size: var(--text-xs); color: var(--text-secondary); margin-top: 4px;">
                Verified by Intake Coordination Office · 120 E. Market St, Suite 300, New Albany, IN
              </p>
            </div>
            <span class="avail-live-tag chip" style="padding: 6px 14px; font-size: 0.8rem;">
              <span class="pulse-indicator" style="width:7px;height:7px;" aria-hidden="true"></span>
              <span>Accepting New Clients</span>
            </span>
          </div>

          <!-- Day by Day Pills -->
          <div style="margin-bottom: var(--space-2xl);">
            <p style="font-size: var(--text-sm); font-weight: 600; color: var(--text-primary); margin-bottom: var(--space-sm);">
              Current Week Daytime Openings (Mon–Fri)
            </p>
            <div class="avail-days-row" style="display:grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 10px;">
              <div class="day-pill" style="padding: 14px 10px; text-align:center;">
                <span class="day-pill-name" style="font-size: 0.85rem; font-weight:600; display:block;">Monday</span>
                <span style="font-size: var(--text-xs); color: var(--text-primary); font-weight: 600; display:block; margin: 4px 0;">3 Openings</span>
                <span class="day-pill-status day-status-open" style="width:9px; height:9px; margin:0 auto; display:block;" title="3 Openings"></span>
              </div>
              <div class="day-pill" style="padding: 14px 10px; text-align:center;">
                <span class="day-pill-name" style="font-size: 0.85rem; font-weight:600; display:block;">Tuesday</span>
                <span style="font-size: var(--text-xs); color: var(--text-primary); font-weight: 600; display:block; margin: 4px 0;">2 Openings</span>
                <span class="day-pill-status day-status-open" style="width:9px; height:9px; margin:0 auto; display:block;" title="2 Openings"></span>
              </div>
              <div class="day-pill" style="padding: 14px 10px; text-align:center;">
                <span class="day-pill-name" style="font-size: 0.85rem; font-weight:600; display:block;">Wednesday</span>
                <span style="font-size: var(--text-xs); color: #EEDAA2; font-weight: 600; display:block; margin: 4px 0;">Limited</span>
                <span class="day-pill-status day-status-limited" style="width:9px; height:9px; margin:0 auto; display:block;" title="Limited Openings"></span>
              </div>
              <div class="day-pill" style="padding: 14px 10px; text-align:center;">
                <span class="day-pill-name" style="font-size: 0.85rem; font-weight:600; display:block;">Thursday</span>
                <span style="font-size: var(--text-xs); color: var(--text-primary); font-weight: 600; display:block; margin: 4px 0;">3 Openings</span>
                <span class="day-pill-status day-status-open" style="width:9px; height:9px; margin:0 auto; display:block;" title="3 Openings"></span>
              </div>
              <div class="day-pill" style="padding: 14px 10px; text-align:center;">
                <span class="day-pill-name" style="font-size: 0.85rem; font-weight:600; display:block;">Friday</span>
                <span style="font-size: var(--text-xs); color: var(--text-primary); font-weight: 600; display:block; margin: 4px 0;">2 Openings</span>
                <span class="day-pill-status day-status-open" style="width:9px; height:9px; margin:0 auto; display:block;" title="2 Openings"></span>
              </div>
            </div>
          </div>

          <div style="background: rgba(255,255,255,0.04); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: var(--space-xl); margin-bottom: var(--space-xl);">
            <h4 style="font-family: var(--font-heading); font-size: 1.15rem; color: var(--text-primary); margin-bottom: 8px;">Appointment Options</h4>
            <ul style="list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:10px; font-size:var(--text-sm); color:var(--text-secondary);">
              <li style="display:flex; justify-content:space-between; border-bottom:1px solid var(--border-subtle); padding-bottom:6px;">
                <span>In-Person Consultations (Historic New Albany Suite 300)</span>
                <strong style="color:var(--text-primary);">Monday, Tuesday, Thursday, Friday</strong>
              </li>
              <li style="display:flex; justify-content:space-between; border-bottom:1px solid var(--border-subtle); padding-bottom:6px;">
                <span>Statewide Indiana Telehealth Video Consultations</span>
                <strong style="color:var(--text-primary);">Monday through Friday (Daily)</strong>
              </li>
              <li style="display:flex; justify-content:space-between;">
                <span>Evening Telehealth Sessions (By Special Request)</span>
                <strong style="color:var(--text-primary);">Tuesday &amp; Thursday 5:30 PM – 7:30 PM</strong>
              </li>
            </ul>
          </div>

          <div style="text-align: center;">
            <a href="book.html" class="btn btn-primary" data-go="book" style="padding: 14px 36px; font-size: 1rem;">
              Reserve an Open Appointment Slot
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- DEDICATED PROVIDERS VIEW (#v-providers) -->
    <section class="view page" id="v-providers" aria-label="Clinical Leadership & Providers">
      <div class="view-page-container is-wide">
        <div class="view-page-nav">
          <button type="button" class="btn-return-home" data-go="home" aria-label="Return to practice overview">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            <span>Return to Sanctuary</span>
          </button>
          <nav class="view-nav-breadcrumb" aria-label="Breadcrumb">
            <a href="index.html" data-go="home">Care Center</a>
            <span class="sep">/</span>
            <span class="current">Clinical Leadership</span>
          </nav>
        </div>

        <div class="view-hero-header">
          <span class="section-eyebrow">Clinical Leadership &amp; Medical Directors</span>
          <h2 class="view-hero-title section-title">Physician-Led, Empathic Practice</h2>
          <p class="section-lead">
            Our clinicians bring extensive training from leading academic health centers to direct patient care in New Albany and statewide telehealth.
          </p>
        </div>

        <div class="providers-grid">
          <!-- Dr. Elena Vance -->
          <article class="provider-card box">
            <div class="provider-img-wrap">
              <picture>
                <source srcset="assets/img/providers/dr-marcus-vance.webp" type="image/webp">
                <img src="assets/img/providers/dr-marcus-vance.jpg" alt="Portrait of Dr. Elena Vance, MD, Board-Certified Psychiatrist" class="provider-img" width="600" height="600" loading="lazy">
              </picture>
            </div>
            <div class="provider-info">
              <h3 class="provider-name">Dr. Elena Vance, MD</h3>
              <p class="provider-creds">Board-Certified Adult &amp; Adolescent Psychiatrist</p>
              <div class="provider-training">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                <span>The Johns Hopkins Hospital Trained · Indiana Medical License #01089223A</span>
              </div>
              <p class="provider-bio">
                Dr. Vance completed her psychiatric residency and fellowship at The Johns Hopkins Hospital in Baltimore, Maryland. With over 14 years of clinical experience, she focuses on conservative pharmacotherapy—ensuring medications are deployed judiciously, monitored vigilantly, and paired with lifestyle adjustments to avoid unnecessary dependency.
              </p>
              <div class="provider-tags">
                <span class="provider-tag">Psychiatric Evaluation</span>
                <span class="provider-tag">Conservative Dosing</span>
                <span class="provider-tag">Adolescent Medicine</span>
                <span class="provider-tag">Treatment-Resistant Mood</span>
              </div>
              <a href="book.html" class="btn btn-primary" data-go="book" style="margin-top: auto;">Schedule intake with Dr. Vance</a>
            </div>
          </article>

          <!-- Marcus Reed -->
          <article class="provider-card box">
            <div class="provider-img-wrap">
              <picture>
                <source srcset="assets/img/providers/sarah-lin-holloway.webp" type="image/webp">
                <img src="assets/img/providers/sarah-lin-holloway.jpg" alt="Portrait of Marcus Reed, LCSW, Lead Psychotherapist" class="provider-img" width="600" height="600" loading="lazy">
              </picture>
            </div>
            <div class="provider-info">
              <h3 class="provider-name">Marcus Reed, LCSW</h3>
              <p class="provider-creds">Lead Psychotherapist &amp; Clinical Director</p>
              <div class="provider-training">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                <span>Certified EMDR Clinician · Indiana LCSW Licensure #34008119A</span>
              </div>
              <p class="provider-bio">
                With over 16 years of psychotherapy leadership, Marcus directs our counseling department. Certified in EMDR, somatic experiencing, and psychodynamic counseling, he guides individuals through healing acute and developmental trauma, major grief, and emotional burnout in a compassionate, confidential sanctuary.
              </p>
              <div class="provider-tags">
                <span class="provider-tag">EMDR Certified</span>
                <span class="provider-tag">Trauma &amp; Somatics</span>
                <span class="provider-tag">Psychodynamic Therapy</span>
                <span class="provider-tag">Grief Counseling</span>
              </div>
              <a href="book.html" class="btn btn-primary" data-go="book" style="margin-top: auto;">Schedule intake with Marcus</a>
            </div>
          </article>
        </div>

        <!-- Clinic Environment Section -->
        <div class="panel box" style="margin-top: var(--space-4xl); border-radius: var(--radius-xl); padding: var(--space-3xl);">
          <div style="max-width: 720px;">
            <span class="section-eyebrow">Our Sanctuary</span>
            <h3 style="font-family: var(--font-heading); font-size: 1.8rem; font-weight: 600; color: var(--text-primary); margin-bottom: var(--space-md);">
              Designed for Privacy, Calm, and Focus
            </h3>
            <p style="font-size: var(--text-base); color: var(--text-secondary); line-height: 1.7; margin-bottom: var(--space-md);">
              Situated on Market Street in historic downtown New Albany, our clinic has been thoughtfully curated to feel warm, grounded, and free of the sterile, rushed atmosphere typical of traditional medical offices.
            </p>
            <p style="font-size: var(--text-base); color: var(--text-secondary); line-height: 1.7; margin-bottom: var(--space-lg);">
              Each consultation room features acoustic soundproofing, soft natural day-lighting, air-purified botanical environments, and discrete private entryways with reserved off-street parking.
            </p>
            <a href="contact.html" class="btn btn-secondary" data-go="contact">View directions &amp; parking details</a>
          </div>
        </div>
      </div>
    </section>

    <!-- DEDICATED INSURANCE & FEES VIEW (#v-insurance) -->
    <section class="view page" id="v-insurance" aria-label="Insurance & Fees">
      <div class="view-page-container is-wide">
        <div class="view-page-nav">
          <button type="button" class="btn-return-home" data-go="home" aria-label="Return to practice overview">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            <span>Return to Sanctuary</span>
          </button>
          <nav class="view-nav-breadcrumb" aria-label="Breadcrumb">
            <a href="index.html" data-go="home">Care Center</a>
            <span class="sep">/</span>
            <span class="current">Insurance &amp; Fees</span>
          </nav>
        </div>

        <div class="view-hero-header">
          <span class="section-eyebrow">Financial Transparency</span>
          <h2 class="view-hero-title section-title">Insurance Coverage &amp; Clear Fees</h2>
          <p class="section-lead">
            We prioritize absolute clarity regarding medical billing. Whether utilizing in-network insurance or out-of-network reimbursement, you receive transparent financial terms before your first visit.
          </p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: var(--space-lg); margin-bottom: var(--space-3xl);">
          <div class="card box" style="padding: 1.75rem;">
            <strong style="display: block; font-size: 1.15rem; color: var(--text-primary); margin-bottom: 6px;">Anthem Blue Cross / Blue Shield</strong>
            <p style="font-size: var(--text-xs); color: var(--text-secondary); line-height: 1.6;">In-network for commercial employer plans, individual marketplace exchange policies, and Medicare Advantage across Indiana.</p>
          </div>
          <div class="card box" style="padding: 1.75rem;">
            <strong style="display: block; font-size: 1.15rem; color: var(--text-primary); margin-bottom: 6px;">Aetna Behavioral Health</strong>
            <p style="font-size: var(--text-xs); color: var(--text-secondary); line-height: 1.6;">Full coverage for outpatient psychiatric evaluations, conservative medication management, and psychotherapy.</p>
          </div>
          <div class="card box" style="padding: 1.75rem;">
            <strong style="display: block; font-size: 1.15rem; color: var(--text-primary); margin-bottom: 6px;">Cigna Healthcare &amp; Evernorth</strong>
            <p style="font-size: var(--text-xs); color: var(--text-secondary); line-height: 1.6;">Direct participating provider status for outpatient behavioral health services in-person and via telehealth.</p>
          </div>
          <div class="card box" style="padding: 1.75rem;">
            <strong style="display: block; font-size: 1.15rem; color: var(--text-primary); margin-bottom: 6px;">Traditional Medicare Part B</strong>
            <p style="font-size: var(--text-xs); color: var(--text-secondary); line-height: 1.6;">Direct assignment accepted for eligible beneficiaries seeking outpatient psychiatric diagnosis and pharmacotherapy.</p>
          </div>
          <div class="card box" style="padding: 1.75rem;">
            <strong style="display: block; font-size: 1.15rem; color: var(--text-primary); margin-bottom: 6px;">Humana Commercial &amp; Medicare</strong>
            <p style="font-size: var(--text-xs); color: var(--text-secondary); line-height: 1.6;">Covered for specialized physician consultations and licensed psychotherapy with transparent co-pay verification.</p>
          </div>
          <div class="card box" style="padding: 1.75rem;">
            <strong style="display: block; font-size: 1.15rem; color: var(--text-primary); margin-bottom: 6px;">UnitedHealthcare &amp; Optum</strong>
            <p style="font-size: var(--text-xs); color: var(--text-secondary); line-height: 1.6;">Comprehensive behavioral health network participation across Floyd County and statewide telehealth.</p>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: var(--space-2xl); margin-top: var(--space-3xl);">
          <div class="panel box" style="padding: 2.25rem;">
            <h3 style="font-family: var(--font-heading); font-size: 1.35rem; font-weight: 600; color: var(--text-primary); margin-bottom: var(--space-sm);">
              Out-of-Network Superbill Concierge
            </h3>
            <p style="font-size: var(--text-sm); color: var(--text-secondary); line-height: 1.7; margin-bottom: var(--space-md);">
              If your plan is with a PPO insurer outside our network, our billing concierge automatically generates itemized, clinical CMS-1500 compliant receipts (Superbills) with required diagnostic CPT codes.
            </p>
            <p style="font-size: var(--text-sm); color: var(--text-secondary); line-height: 1.7;">
              Most PPO plans reimburse 60% to 80% of eligible out-of-network outpatient psychiatric and therapy fees.
            </p>
          </div>

          <div class="panel box" style="padding: 2.25rem;">
            <h3 style="font-family: var(--font-heading); font-size: 1.35rem; font-weight: 600; color: var(--text-primary); margin-bottom: var(--space-sm);">
              Self-Pay Transparent Fee Schedule
            </h3>
            <ul style="list-style: none; display: flex; flex-direction: column; gap: 12px; font-size: var(--text-sm); color: var(--text-secondary); margin-bottom: var(--space-lg); padding:0;">
              <li style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-subtle); padding-bottom: 8px;">
                <span>Comprehensive Psychiatric Evaluation (60 Min)</span>
                <strong style="color: var(--text-primary);">$325</strong>
              </li>
              <li style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-subtle); padding-bottom: 8px;">
                <span>Conservative Medication Follow-Up (30 Min)</span>
                <strong style="color: var(--text-primary);">$175</strong>
              </li>
              <li style="display: flex; justify-content: space-between; border-bottom: 1px solid var(--border-subtle); padding-bottom: 8px;">
                <span>Integrative Psychotherapy / EMDR (50 Min)</span>
                <strong style="color: var(--text-primary);">$185</strong>
              </li>
            </ul>
            <div style="font-size: var(--text-xs); color: var(--text-muted); line-height: 1.6; margin-bottom: var(--space-md);">
              <strong>Good Faith Estimate Notice:</strong> In compliance with the federal No Surprises Act, all self-pay patients receive a binding Good Faith Estimate prior to treatment.
            </div>
            <a href="book.html" class="btn btn-primary btn-pill-sm" data-go="book" style="width: 100%;">Verify my coverage &amp; schedule</a>
          </div>
        </div>
      </div>
    </section>

    <!-- DEDICATED CONTACT VIEW (#v-contact) -->
    <section class="view page" id="v-contact" aria-label="Contact & Clinic Location">
      <div class="view-page-container is-wide">
        <div class="view-page-nav">
          <button type="button" class="btn-return-home" data-go="home" aria-label="Return to practice overview">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            <span>Return to Sanctuary</span>
          </button>
          <nav class="view-nav-breadcrumb" aria-label="Breadcrumb">
            <a href="index.html" data-go="home">Care Center</a>
            <span class="sep">/</span>
            <span class="current">Contact &amp; Directions</span>
          </nav>
        </div>

        <div class="view-hero-header">
          <span class="section-eyebrow">Connect With Us</span>
          <h2 class="view-hero-title section-title">Sanctuary Location &amp; Clinic Directions</h2>
          <p class="section-lead">
            Our outpatient clinic is located in the historic medical district of New Albany, Indiana. We welcome confidential inquiries by phone, email, or through our secure form below.
          </p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: var(--space-3xl); align-items: start;">
          <div>
            <div style="display: flex; flex-direction: column; gap: var(--space-lg); margin-bottom: var(--space-2xl);">
              <div class="card box" style="padding: 1.75rem;">
                <strong style="display: block; font-size: 1.15rem; color: var(--text-primary); margin-bottom: 6px;">Physical Location</strong>
                <address style="font-style: normal; font-size: var(--text-sm); color: var(--text-secondary); line-height: 1.7;">
                  120 E. Market Street, Suite 300<br>
                  New Albany, IN 47150<br>
                  <em>Convenient to Floyds Knobs, Clarksville, Jeffersonville, and downtown Louisville.</em>
                </address>
              </div>

              <div class="card box" style="padding: 1.75rem;">
                <strong style="display: block; font-size: 1.15rem; color: var(--text-primary); margin-bottom: 6px;">Direct Communication</strong>
                <p style="font-size: var(--text-sm); color: var(--text-secondary); line-height: 1.7;">
                  Phone: <a href="tel:8129442273" style="color:var(--brand-primary); font-weight:600;">(812) 944-CARE (2273)</a><br>
                  Intake Email: <a href="mailto:intake@carecenternewalbany.com" style="color:var(--brand-primary); font-weight:600;">intake@carecenternewalbany.com</a><br>
                  Confidential Fax: (812) 944-2274
                </p>
              </div>

              <div class="card box" style="padding: 1.75rem;">
                <strong style="display: block; font-size: 1.15rem; color: var(--text-primary); margin-bottom: 6px;">Clinic Consultation Hours</strong>
                <p style="font-size: var(--text-sm); color: var(--text-secondary); line-height: 1.7;">
                  Monday – Thursday: 8:30 AM – 6:00 PM<br>
                  Friday: 8:30 AM – 4:00 PM<br>
                  Saturday &amp; Sunday: Closed (Emergency protocols apply)
                </p>
              </div>

              <div class="panel box" style="padding: 1.5rem; font-size: var(--text-xs); color: var(--text-muted); line-height: 1.6;">
                <strong>Reserved Parking:</strong> Patient parking is located directly adjacent to our East Market entrance with discrete elevator access to Suite 300.
              </div>
            </div>
          </div>

          <div>
            <div class="panel form box" style="padding: 2.5rem; border-radius: var(--radius-xl);">
              <h3 style="font-family: var(--font-heading); font-size: 1.4rem; font-weight: 600; color: var(--text-primary); margin-bottom: 6px;">
                Send a Confidential Inquiry
              </h3>
              <p style="font-size: var(--text-xs); color: var(--text-muted); margin-bottom: 1.5rem; line-height: 1.6;">
                This form transmits securely to our intake coordination team. We respond within 2 business hours.
              </p>

              <form id="contact-inquiry-view-form" onsubmit="event.preventDefault(); document.getElementById('contact-form-content-v').style.display='none'; document.getElementById('contact-success-v').style.display='block';">
                <div id="contact-form-content-v">
                  <div class="form-group">
                    <label for="cv-name" class="form-label">Full Name</label>
                    <input type="text" id="cv-name" class="form-input" placeholder="e.g. Katherine Reed" required>
                  </div>
                  <div class="form-group">
                    <label for="cv-email" class="form-label">Email Address</label>
                    <input type="email" id="cv-email" class="form-input" placeholder="katherine@example.com" required>
                  </div>
                  <div class="form-group">
                    <label for="cv-phone" class="form-label">Phone Number</label>
                    <input type="tel" id="cv-phone" class="form-input" placeholder="(812) 555-0192" required>
                  </div>
                  <div class="form-group">
                    <label for="cv-service" class="form-label">Service of Interest</label>
                    <select id="cv-service" class="form-input" style="cursor: pointer;">
                      <option value="psychiatry">Comprehensive Psychiatric Evaluation &amp; Medication</option>
                      <option value="psychotherapy">Integrative Psychotherapy &amp; EMDR</option>
                      <option value="adolescent">Adolescent &amp; Family Care</option>
                      <option value="insurance">Insurance Coverage &amp; Benefits Check</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label for="cv-message" class="form-label">Message / Scheduling Preferences (Optional)</label>
                    <textarea id="cv-message" class="form-input" rows="4" style="height: auto; padding: 12px 16px;" placeholder="Tell us about your scheduling needs or specific concerns..."></textarea>
                  </div>

                  <button type="submit" class="btn btn-primary" style="width: 100%; min-height: 50px;">
                    Send Secure Inquiry
                  </button>
                  <p style="font-size: 0.72rem; color: var(--text-muted); text-align: center; margin-top: 12px;">
                    Protected by HIPAA Privacy Safeguards · Never shared with third parties.
                  </p>
                </div>

                <div id="contact-success-v" style="display: none; text-align: center; padding: 2rem 1rem;">
                  <div style="width: 56px; height: 56px; border-radius: 50%; background: var(--status-open-bg); color: var(--status-open-text); display: flex; align-items: center; justify-content: center; margin: 0 auto var(--space-md);">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <h4 style="font-family: var(--font-heading); font-size: 1.35rem; font-weight: 600; margin-bottom: var(--space-xs);">
                    Inquiry Received
                  </h4>
                  <p style="font-size: var(--text-sm); color: var(--text-secondary); line-height: 1.6;">
                    Thank you for contacting Care Center. Our intake coordinator will review your message and reach out shortly to answer your questions and assist with scheduling.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- DEDICATED FAQ VIEW (#v-faq) -->
    <section class="view page" id="v-faq" aria-label="Frequently Asked Questions">
      <div class="view-page-container is-wide">
        <div class="view-page-nav">
          <button type="button" class="btn-return-home" data-go="home" aria-label="Return to practice overview">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            <span>Return to Sanctuary</span>
          </button>
          <nav class="view-nav-breadcrumb" aria-label="Breadcrumb">
            <a href="index.html" data-go="home">Care Center</a>
            <span class="sep">/</span>
            <span class="current">Frequently Asked Questions</span>
          </nav>
        </div>

        <div class="view-hero-header">
          <span class="section-eyebrow">Patient Inquiries</span>
          <h2 class="view-hero-title section-title">Frequently Asked Questions</h2>
          <p class="section-lead">
            Comprehensive details regarding psychiatric intake appointments, conservative medication management, psychotherapy, telehealth security, and financial arrangements.
          </p>
        </div>

        <div class="faq-container">
          <h3 style="font-family: var(--font-heading); font-size: 1.4rem; font-weight: 600; margin-bottom: var(--space-md); color: var(--text-primary);">
            Intake &amp; Clinical Questions
          </h3>

          <details class="faq-item" open>
            <summary class="faq-summary">
              <span>What should I expect during my initial psychiatric evaluation?</span>
              <svg class="faq-toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
            </summary>
            <div class="faq-answer">
              Your initial evaluation is an unhurried 60-minute consultation. Your physician will review your developmental background, psychological symptoms, previous medical treatments, and current lifestyle factors. Together, we establish an accurate diagnostic foundation and determine whether medication, psychotherapy, or an integrative approach is most appropriate.
            </div>
          </details>

          <details class="faq-item">
            <summary class="faq-summary">
              <span>How does conservative medication management differ from standard prescribing?</span>
              <svg class="faq-toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
            </summary>
            <div class="faq-answer">
              Conservative medication management prioritizes the lowest effective dose of scientifically validated compounds, avoiding polypharmacy and excessive prescription reliance. We continuously monitor tolerability and actively evaluate when medications can be safely tapered as clinical stability is reached.
            </div>
          </details>

          <details class="faq-item">
            <summary class="faq-summary">
              <span>What is EMDR therapy, and is it offered at your practice?</span>
              <svg class="faq-toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
            </summary>
            <div class="faq-answer">
              Eye Movement Desensitization and Reprocessing (EMDR) is an extensively researched, evidence-based modality that facilitates the processing of traumatic memories and psychological distress. Marcus Reed, LCSW is a certified EMDR clinician with over 16 years of clinical experience guiding trauma recovery.
            </div>
          </details>

          <h3 style="font-family: var(--font-heading); font-size: 1.4rem; font-weight: 600; margin-top: var(--space-3xl); margin-bottom: var(--space-md); color: var(--text-primary);">
            Telehealth &amp; Clinic Logistics
          </h3>

          <details class="faq-item">
            <summary class="faq-summary">
              <span>Is your telehealth service secure and available everywhere in Indiana?</span>
              <svg class="faq-toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
            </summary>
            <div class="faq-answer">
              Yes. Our virtual appointments utilize 256-bit encrypted, peer-to-peer WebRTC video adhering strictly to HIPAA and HITECH guidelines. As long as you are physically located within the state of Indiana at the time of your appointment, you may connect from the privacy of your home.
            </div>
          </details>

          <details class="faq-item">
            <summary class="faq-summary">
              <span>Where is your physical clinic located in New Albany?</span>
              <svg class="faq-toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
            </summary>
            <div class="faq-answer">
              We are located in the historic medical district at 120 E. Market Street, Suite 300, New Albany, IN 47150, convenient to both Floyd County and downtown Louisville. Dedicated, private patient parking is provided behind the building with full ADA accessibility.
            </div>
          </details>

          <h3 style="font-family: var(--font-heading); font-size: 1.4rem; font-weight: 600; margin-top: var(--space-3xl); margin-bottom: var(--space-md); color: var(--text-primary);">
            Insurance, Fees &amp; Superbills
          </h3>

          <details class="faq-item">
            <summary class="faq-summary">
              <span>Which insurance plans are in-network?</span>
              <svg class="faq-toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
            </summary>
            <div class="faq-answer">
              We are in-network participating providers with Anthem Blue Cross / Blue Shield, Aetna Behavioral Health, Cigna / Evernorth, Humana, Traditional Medicare Part B, and UnitedHealthcare / Optum.
            </div>
          </details>

          <details class="faq-item">
            <summary class="faq-summary">
              <span>What is a Superbill and how does out-of-network reimbursement work?</span>
              <svg class="faq-toggle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
            </summary>
            <div class="faq-answer">
              A Superbill is an itemized medical claim receipt containing diagnosis codes (ICD-10) and service codes (CPT). If you have an out-of-network PPO, you submit this receipt to your insurer for direct partial reimbursement, typically between 60% and 80% of allowed charges.
            </div>
          </details>
        </div>

        <div style="text-align: center; margin-top: var(--space-4xl);">
          <a href="book.html" class="btn btn-primary" data-go="book">Reserve an intake appointment</a>
        </div>
      </div>
    </section>
`;

// Replace the middle content in indexHtml:
// Keep from 0 up to trustEnd
// Insert sanctuaryDirectoryHtml
// Then close #v-home
// Then append vServicesHtml + vAvailHtml + vProvidersHtml + vInsuranceHtml + vContactHtml + vFaqHtml
// Then keep #v-book and #v-join up to end of indexHtml

const beforeTrustClose = indexHtml.slice(0, trustEnd);
const fromVBook = indexHtml.slice(vHomeCloseIdx + '</section><!-- /#v-home -->'.length);

const updatedIndexHtml = beforeTrustClose +
  '\n' + sanctuaryDirectoryHtml +
  '    </section><!-- /#v-home -->\n' +
  vServicesHtml + '\n' +
  fromVBook;

fs.writeFileSync(indexPath, updatedIndexHtml, 'utf8');
console.log('Successfully updated index.html with Dedicated Multi-Page Section Views!');
