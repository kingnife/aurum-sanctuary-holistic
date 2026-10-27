/**
 * Care Center - Luxury Single-Page Application Interactions
 * Manages:
 * 1. Multi-Page View Switching (#v-home, #v-book, #v-join) & Section Scrolling
 * 2. White-Glove Intake Booking Stepper (#v-book / #form)
 * 3. Virtual Telehealth Waiting Room (#v-join / #jn) with Pre-call Diagnostics
 * 4. Care Concierge AI Drawer (#er) with 1.2s Typing Indicator & Crisis Safety Interceptor
 * 5. Mobile Navigation Menu
 * 6. Ambient Sanctuary Backdrop Engine
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. Multi-Page View Switching & Smooth Section Scrolling Engine
     Manages #v-home, #v-book, #v-join, and section scrolling
     ========================================================================== */
  function showView(target, secId) {
    if (!target) target = 'home';
    const viewId = target.startsWith('v-') ? target : `v-${target}`;
    const allViews = document.querySelectorAll('section.view');
    let activeView = document.getElementById(viewId);
    if (!activeView) {
      activeView = document.getElementById('v-home');
    }

    // Toggle .on class on all views so only the active view displays
    allViews.forEach(v => {
      if (v === activeView) {
        v.classList.add('on');
        v.setAttribute('aria-hidden', 'false');
      } else {
        v.classList.remove('on');
        v.setAttribute('aria-hidden', 'true');
      }
    });

    // Update active nav indicators in header
    document.querySelectorAll('.nav-link').forEach(link => {
      const linkSec = link.getAttribute('data-sec');
      const linkGo = link.getAttribute('data-go');
      if (secId && linkSec === secId) {
        link.classList.add('is-active');
        link.setAttribute('aria-current', 'page');
      } else if (!secId && viewId === 'v-home' && linkGo === 'home' && !linkSec) {
        link.classList.add('is-active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('is-active');
        link.removeAttribute('aria-current');
      }
    });

    // Close mobile nav drawer if open
    const nav = document.getElementById('main-nav');
    const toggle = document.getElementById('mobile-nav-toggle');
    if (nav && nav.getAttribute('data-open') === 'true') {
      nav.setAttribute('data-open', 'false');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    }

    // Section scroll or view top scroll
    if (secId) {
      setTimeout(() => {
        const secElem = document.getElementById(secId);
        if (secElem) {
          secElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 60);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // Global Click Delegation for [data-go]
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-go]');
    if (!trigger) return;

    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;

    const go = trigger.getAttribute('data-go');
    const sec = trigger.getAttribute('data-sec');
    const viewId = go.startsWith('v-') ? go : `v-${go}`;

    // If the target view exists in the current DOM, intercept as instant SPA page-like transition
    if (document.getElementById(viewId)) {
      e.preventDefault();
      showView(go, sec);

      // Update URL hash cleanly
      if (go === 'home') {
        if (sec) {
          history.pushState(null, '', `#${sec}`);
        } else {
          history.pushState(null, '', window.location.pathname);
        }
      } else {
        history.pushState(null, '', `#${viewId}`);
      }
    }
    // Otherwise, allow native browser navigation to the href attribute!
  });

  // Deep-link routing on initial page load
  const initialHash = window.location.hash.replace(/^#v-|^#/, '');
  if (initialHash && document.getElementById(`v-${initialHash}`)) {
    showView(initialHash);
  } else if (initialHash && document.getElementById(initialHash)) {
    setTimeout(() => {
      const el = document.getElementById(initialHash);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 120);
  }

  // Browser back/forward button navigation
  window.addEventListener('popstate', () => {
    const hash = window.location.hash.replace(/^#v-|^#/, '') || 'home';
    if (document.getElementById(`v-${hash}`)) {
      showView(hash);
    }
  });

  // Backward compatibility with any lingering [data-open-modal]
  document.querySelectorAll('[data-open-modal]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      const targetModal = trigger.getAttribute('data-open-modal');
      if (targetModal === 'v-book' || targetModal === 'book') {
        e.preventDefault();
        showView('book');
        history.pushState(null, '', '#v-book');
      } else if (targetModal === 'v-join' || targetModal === 'join') {
        e.preventDefault();
        showView('join');
        history.pushState(null, '', '#v-join');
      }
    });
  });

  // Modal / View close buttons
  document.querySelectorAll('.modal-close-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      showView('home');
      history.pushState(null, '', window.location.pathname);
    });
  });

  // Mobile nav toggle
  const mobileNavToggle = document.getElementById('mobile-nav-toggle');
  const mainNav = document.getElementById('main-nav');
  if (mobileNavToggle && mainNav) {
    mobileNavToggle.addEventListener('click', () => {
      const isOpen = mainNav.getAttribute('data-open') === 'true';
      mainNav.setAttribute('data-open', String(!isOpen));
      mobileNavToggle.setAttribute('aria-expanded', String(!isOpen));
    });
  }

  // Escape key handler
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const activePageView = document.querySelector('section.view.page.on');
      if (activePageView) {
        showView('home');
        history.pushState(null, '', window.location.pathname);
      }
      if (conciergeDrawer && conciergeDrawer.classList.contains('is-open')) toggleConcierge(false);
    }
  });

  // Hash Routing
  function handleHashRoute() {
    const rawHash = window.location.hash.replace('#', '');
    if (!rawHash) {
      showView('home');
      return;
    }
    if (rawHash === 'v-book' || rawHash === 'book') {
      showView('book');
    } else if (rawHash === 'v-join' || rawHash === 'join') {
      showView('join');
    } else if (rawHash === 'v-home' || rawHash === 'home') {
      showView('home');
    } else {
      const targetSec = document.getElementById(rawHash);
      if (targetSec) {
        showView('home', rawHash);
      } else {
        showView('home');
      }
    }
  }

  window.addEventListener('hashchange', handleHashRoute);
  handleHashRoute();

  /* ==========================================================================
     2. Intake Booking Stepper (#v-book / #form)
     ========================================================================== */
  let currentStep = 1;
  const totalSteps = 3;

  const stepNodes = document.querySelectorAll('.step-node');
  const stepPanels = document.querySelectorAll('.wizard-step-panel');
  const btnPrev = document.getElementById('wizard-prev-btn');
  const btnNext = document.getElementById('wizard-next-btn');
  const wizardForm = document.getElementById('wizard-form');
  const wizardSuccess = document.getElementById('wizard-success');

  // Interactive option cards
  document.querySelectorAll('.opt-card').forEach(card => {
    card.addEventListener('click', () => {
      const group = card.getAttribute('data-group');
      document.querySelectorAll(`.opt-card[data-group="${group}"]`).forEach(c => {
        c.classList.remove('is-selected');
        c.setAttribute('aria-checked', 'false');
      });
      card.classList.add('is-selected');
      card.setAttribute('aria-checked', 'true');
    });
  });

  function updateStepperUI() {
    stepNodes.forEach((node, idx) => {
      const stepNum = idx + 1;
      node.classList.remove('is-active', 'is-complete');
      if (stepNum === currentStep) {
        node.classList.add('is-active');
      } else if (stepNum < currentStep) {
        node.classList.add('is-complete');
      }
    });

    stepPanels.forEach((panel, idx) => {
      panel.style.display = (idx + 1 === currentStep) ? 'block' : 'none';
    });

    if (btnPrev) {
      btnPrev.style.visibility = (currentStep === 1) ? 'hidden' : 'visible';
    }

    if (btnNext) {
      btnNext.textContent = (currentStep === totalSteps) ? 'Confirm & Submit Intake' : 'Continue to Next Step';
    }
  }

  if (btnNext) {
    btnNext.addEventListener('click', () => {
      if (currentStep < totalSteps) {
        currentStep++;
        updateStepperUI();
      } else {
        // Complete Intake
        if (wizardForm && wizardSuccess) {
          wizardForm.style.display = 'none';
          wizardSuccess.style.display = 'block';
        }
      }
    });
  }

  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      if (currentStep > 1) {
        currentStep--;
        updateStepperUI();
      }
    });
  }

  const resetWizardBtn = document.getElementById('reset-wizard-btn');
  if (resetWizardBtn) {
    resetWizardBtn.addEventListener('click', () => {
      currentStep = 1;
      if (wizardForm && wizardSuccess) {
        wizardForm.style.display = 'block';
        wizardSuccess.style.display = 'none';
        updateStepperUI();
      }
    });
  }

  /* ==========================================================================
     3. Telehealth Waiting Room (#v-join / #jn)
     ========================================================================== */
  const sessionCodeInput = document.getElementById('session-code');
  if (sessionCodeInput) {
    // Format mask: CC-XXXX
    sessionCodeInput.addEventListener('input', (e) => {
      let val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
      if (val.startsWith('CC')) {
        val = val.substring(2);
      }
      if (val.length > 4) val = val.substring(0, 4);
      e.target.value = val.length > 0 ? `CC-${val}` : '';
    });
  }

  // Pre-call test buttons
  const testAvBtn = document.getElementById('test-av-btn');
  const testNetBtn = document.getElementById('test-net-btn');

  if (testAvBtn) {
    testAvBtn.addEventListener('click', () => {
      testAvBtn.innerHTML = `<span>Checking audio/video...</span>`;
      setTimeout(() => {
        testAvBtn.classList.add('is-success');
        testAvBtn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          <span>Camera &amp; Mic Verified</span>
        `;
      }, 900);
    });
  }

  if (testNetBtn) {
    testNetBtn.addEventListener('click', () => {
      testNetBtn.innerHTML = `<span>Pinging secure node...</span>`;
      setTimeout(() => {
        testNetBtn.classList.add('is-success');
        testNetBtn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          <span>16ms · High-Definition Ready</span>
        `;
      }, 800);
    });
  }

  const joinSessionForm = document.getElementById('join-session-form');
  const waitingRoomState = document.getElementById('waiting-room-connected');

  if (joinSessionForm && waitingRoomState) {
    joinSessionForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const clientName = document.getElementById('join-name')?.value || document.getElementById('patient-name')?.value || 'Client';
      joinSessionForm.style.display = 'none';
      waitingRoomState.style.display = 'block';
      const greeting = document.getElementById('waiting-patient-greeting');
      if (greeting) greeting.textContent = `Welcome, ${clientName}.`;
    });
  }

  /* ==========================================================================
     4. Care Concierge Drawer (#er)
     ========================================================================== */
  const conciergeDrawer = document.getElementById('er');
  const conciergeLaunchBtn = document.getElementById('concierge-launcher');
  const conciergeCloseBtn = document.getElementById('concierge-close');
  const conciergeStream = document.getElementById('concierge-stream');
  const conciergeForm = document.getElementById('concierge-form');
  const conciergeInput = document.getElementById('concierge-input');

  function toggleConcierge(open) {
    if (!conciergeDrawer) return;
    const shouldOpen = open !== undefined ? open : !conciergeDrawer.classList.contains('is-open');
    if (shouldOpen) {
      conciergeDrawer.classList.add('is-open');
      conciergeDrawer.setAttribute('aria-hidden', 'false');
      if (conciergeInput) setTimeout(() => conciergeInput.focus(), 150);
    } else {
      conciergeDrawer.classList.remove('is-open');
      conciergeDrawer.setAttribute('aria-hidden', 'true');
      if (conciergeLaunchBtn) conciergeLaunchBtn.focus();
    }
  }

  if (conciergeLaunchBtn) {
    conciergeLaunchBtn.addEventListener('click', () => toggleConcierge(true));
  }
  if (conciergeCloseBtn) {
    conciergeCloseBtn.addEventListener('click', () => toggleConcierge(false));
  }
  document.querySelectorAll('[data-open-concierge]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleConcierge(true);
    });
  });

  // Crisis safety word dictionary
  const CRISIS_WORDS = ['suicide', 'kill myself', 'hurt myself', 'overdose', 'abuse', 'unsafe', 'die', 'harm', 'emergency', 'poison'];

  function appendMessage(sender, text) {
    if (!conciergeStream) return;
    const bubble = document.createElement('div');
    bubble.className = sender === 'client' ? 'chat-bubble chat-bubble-client' : 'chat-bubble chat-bubble-bot';
    bubble.innerHTML = text;
    conciergeStream.appendChild(bubble);
    conciergeStream.scrollTop = conciergeStream.scrollHeight;
  }

  function showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator';
    indicator.id = 'concierge-typing';
    indicator.innerHTML = `
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    `;
    conciergeStream.appendChild(indicator);
    conciergeStream.scrollTop = conciergeStream.scrollHeight;
    return indicator;
  }

  function handleConciergeQuery(query) {
    const lower = query.toLowerCase();

    // 1. Mandatory Crisis Interceptor
    const isCrisis = CRISIS_WORDS.some(word => lower.includes(word));
    if (isCrisis) {
      appendMessage('client', query);
      const indicator = showTypingIndicator();
      setTimeout(() => {
        indicator.remove();
        appendMessage(
          'bot',
          `<strong>Crisis Support Protocol:</strong><br><br>
          If you or a loved one are experiencing an acute mental health crisis, please call or text <strong>988</strong> immediately to connect with the Suicide &amp; Crisis Lifeline, or call <strong>911</strong> for an emergency.<br><br>
          <em>Please note: Care Center's Care Concierge is not for medical emergencies.</em>`
        );
      }, 600);
      return;
    }

    // Normal query processing
    appendMessage('client', query);
    const indicator = showTypingIndicator();

    setTimeout(() => {
      indicator.remove();
      let reply = '';

      if (lower.includes('insurance') || lower.includes('coverage') || lower.includes('cost') || lower.includes('fee')) {
        reply = `Care Center is an in-network provider for Anthem Blue Cross, Aetna, Cigna, Humana, Medicare, and UnitedHealthcare. We also provide full Superbill concierge support for out-of-network claims. Would you like to <a href="#v-book" data-go="book" style="color:var(--brand-primary);font-weight:600;text-decoration:underline;">schedule an intake</a> to verify your benefits?`;
      } else if (lower.includes('appointment') || lower.includes('book') || lower.includes('first') || lower.includes('schedule')) {
        reply = `New patient evaluations are typically scheduled within 3 to 5 business days. You can begin directly through our <a href="#v-book" data-go="book" style="color:var(--brand-primary);font-weight:600;text-decoration:underline;">white-glove intake stepper</a>, selecting either our New Albany clinic or secure statewide telehealth.`;
      } else if (lower.includes('doctor') || lower.includes('provider') || lower.includes('psychiatrist') || lower.includes('vance')) {
        reply = `Our clinical leadership includes <strong>Dr. Elena Vance, MD</strong> (Board-Certified Adult &amp; Adolescent Psychiatrist, Johns Hopkins trained) and <strong>Marcus Reed, LCSW</strong> (Lead Psychotherapist &amp; Clinical Director, EMDR certified).`;
      } else if (lower.includes('direction') || lower.includes('location') || lower.includes('address') || lower.includes('parking') || lower.includes('where')) {
        reply = `Our clinic is located in the historic medical district at <strong>120 E. Market Street, Suite 300, New Albany, IN 47150</strong>. Complimentary reserved patient parking is available directly behind the building.`;
      } else if (lower.includes('telehealth') || lower.includes('virtual') || lower.includes('online')) {
        reply = `We provide encrypted, HIPAA-compliant telehealth to patients throughout the entire state of Indiana. Existing patients can access the <a href="#v-join" data-go="join" style="color:var(--brand-primary);font-weight:600;text-decoration:underline;">Virtual Waiting Room</a> using their clinician code.`;
      } else {
        reply = `Thank you for reaching out to Care Center. Our intake team would be delighted to assist you with specialized psychiatric evaluation, conservative medication management, or psychotherapy. You may also call us directly at <strong>(812) 944-CARE</strong>.`;
      }

      appendMessage('bot', reply);
    }, 1200); // Realistic 1.2s typing pause
  }

  if (conciergeForm && conciergeInput) {
    conciergeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const q = conciergeInput.value.trim();
      if (!q) return;
      conciergeInput.value = '';
      handleConciergeQuery(q);
    });
  }

  document.querySelectorAll('.quick-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const text = chip.getAttribute('data-query') || chip.textContent.trim();
      handleConciergeQuery(text);
    });
  });

  /* ==========================================================================
     5. Ambient Backdrop Engine & WebP Frame Binding
     Automatically binds FRAMES[2], FRAMES[4], and FRAMES[5] as background
     canvases to .sec.alt sections and #v-book / #v-join backdrops.
     ========================================================================== */
  const AMBIENT_FRAMES = window.FRAMES || [
    'assets/img/hero/desktop/frame-001.webp',
    'assets/img/hero/desktop/frame-016.webp',
    'assets/img/hero/desktop/frame-024.webp',
    'assets/img/hero/desktop/frame-040.webp',
    'assets/img/hero/desktop/frame-048.webp',
    'assets/img/hero/desktop/frame-064.webp',
    'assets/img/hero/desktop/frame-072.webp'
  ];

  function initAmbientBackdropEngine() {
    // 1. Bind to feature sanctuary sections (.sec.alt / .section-alt)
    const altSections = document.querySelectorAll('.sec.alt, .section-alt');
    altSections.forEach((sec, idx) => {
      const frameIndex = idx % 2 === 0 ? 2 : 4;
      const frameUrl = AMBIENT_FRAMES[frameIndex % AMBIENT_FRAMES.length];
      sec.style.setProperty('--sec-alt-bg', `url("${frameUrl}")`);
    });

    // 2. Bind to #v-book and #v-join backdrops
    const vBook = document.getElementById('v-book');
    const vJoin = document.getElementById('v-join');
    if (vBook) {
      vBook.style.setProperty('--modal-ambient-bg', `url("${AMBIENT_FRAMES[4 % AMBIENT_FRAMES.length]}")`);
    }
    if (vJoin) {
      vJoin.style.setProperty('--modal-ambient-bg', `url("${AMBIENT_FRAMES[6 % AMBIENT_FRAMES.length]}")`);
    }

    // 3. Inject atmospheric background engine into alternating non-alt sections
    const targetSections = document.querySelectorAll('.sec:not(.alt):not(#hero), .section:not(.section-alt):not(.hero-section), .trust-strip');
    targetSections.forEach((sec, idx) => {
      if (sec.querySelector('.sec-bg, .ambient-stage')) return;

      const frameMap = [2, 4, 6];
      const frameIndex = frameMap[idx % frameMap.length];
      const frameUrl = AMBIENT_FRAMES[frameIndex % AMBIENT_FRAMES.length];

      const stage = document.createElement('div');
      stage.className = 'sec-bg';
      stage.setAttribute('aria-hidden', 'true');

      const imgLayer = document.createElement('div');
      imgLayer.className = 'sec-bg-image';
      imgLayer.style.backgroundImage = `url("${frameUrl}")`;

      const orbsLayer = document.createElement('div');
      orbsLayer.className = 'sec-bg-orbs';

      stage.appendChild(imgLayer);
      stage.appendChild(orbsLayer);

      sec.prepend(stage);
    });
  }

  initAmbientBackdropEngine();

});
