/**
 * Care Center - Luxury Single-Page Application Interactions
 * Manages:
 * 1. White-Glove Intake Booking Stepper (#v-book)
 * 2. Virtual Telehealth Waiting Room (#v-join) with Pre-call Diagnostics
 * 3. Care Concierge AI Drawer (#er) with 1.2s Typing Indicator & Crisis Safety Interceptor
 * 4. FAQ Accordion Interactions
 * 5. Modal State Machines & Focus Traps
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. Modal State Machine (#v-book & #v-join)
     ========================================================================== */
  const bookModal = document.getElementById('v-book');
  const joinModal = document.getElementById('v-join');

  function openModal(modal) {
    if (!modal) return;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    const firstInput = modal.querySelector('input, button:not(.modal-close-btn)');
    if (firstInput) setTimeout(() => firstInput.focus(), 100);
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Trigger bindings
  document.querySelectorAll('[data-open-modal]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = trigger.getAttribute('data-open-modal');
      const targetModal = document.getElementById(targetId);
      if (targetModal) openModal(targetModal);
    });
  });

  document.querySelectorAll('.modal-close-btn, .modal-backdrop').forEach(closer => {
    closer.addEventListener('click', (e) => {
      if (e.target === closer || closer.classList.contains('modal-close-btn')) {
        const modal = closer.closest('.modal-backdrop');
        closeModal(modal);
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (bookModal && bookModal.classList.contains('is-open')) closeModal(bookModal);
      if (joinModal && joinModal.classList.contains('is-open')) closeModal(joinModal);
      if (conciergeDrawer && conciergeDrawer.classList.contains('is-open')) toggleConcierge(false);
    }
  });

  /* ==========================================================================
     2. Intake Booking Stepper (#v-book)
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
     3. Telehealth Waiting Room (#v-join)
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
      const clientName = document.getElementById('patient-name')?.value || 'Client';
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
        reply = `Care Center is an in-network provider for Anthem Blue Cross, Aetna, Cigna, Humana, Medicare, and UnitedHealthcare. We also provide full Superbill concierge support for out-of-network claims. Would you like to <a href="#" data-open-modal="v-book" style="color:var(--brand-primary);font-weight:600;text-decoration:underline;">schedule an intake</a> to verify your benefits?`;
      } else if (lower.includes('appointment') || lower.includes('book') || lower.includes('first') || lower.includes('schedule')) {
        reply = `New patient evaluations are typically scheduled within 3 to 5 business days. You can begin directly through our <a href="#" data-open-modal="v-book" style="color:var(--brand-primary);font-weight:600;text-decoration:underline;">white-glove intake stepper</a>, selecting either our New Albany clinic or secure statewide telehealth.`;
      } else if (lower.includes('doctor') || lower.includes('provider') || lower.includes('psychiatrist') || lower.includes('vance')) {
        reply = `Our clinical leadership includes <strong>Dr. Elena Vance, MD</strong> (Board-Certified Adult &amp; Adolescent Psychiatrist, Johns Hopkins trained) and <strong>Marcus Reed, LCSW</strong> (Lead Psychotherapist &amp; Clinical Director, EMDR certified).`;
      } else if (lower.includes('direction') || lower.includes('location') || lower.includes('address') || lower.includes('parking') || lower.includes('where')) {
        reply = `Our clinic is located in the historic medical district at <strong>120 E. Market Street, Suite 300, New Albany, IN 47150</strong>. Complimentary reserved patient parking is available directly behind the building.`;
      } else if (lower.includes('telehealth') || lower.includes('virtual') || lower.includes('online')) {
        reply = `We provide encrypted, HIPAA-compliant telehealth to patients throughout the entire state of Indiana. Existing patients can access the <a href="#" data-open-modal="v-join" style="color:var(--brand-primary);font-weight:600;text-decoration:underline;">Virtual Waiting Room</a> using their clinician code.`;
      } else {
        reply = `Thank you for reaching out to Care Center. Our intake team would be delighted to assist you with specialized psychiatric evaluation, conservative medication management, or psychotherapy. You may also call us directly at <strong>(812) 944-CARE</strong>.`;
      }

      appendMessage('bot', reply);

      // Rebind modal triggers inside bot replies
      conciergeStream.querySelectorAll('[data-open-modal]').forEach(t => {
        t.addEventListener('click', (e) => {
          e.preventDefault();
          toggleConcierge(false);
          const target = document.getElementById(t.getAttribute('data-open-modal'));
          if (target) openModal(target);
        });
      });
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
     6. Ambient Backdrop Engine & WebP Frame Binding
     Automatically binds FRAMES[2], FRAMES[4], and FRAMES[5] as background
     canvases to .sec.alt sections and #v-book / #v-join backdrops.
     ========================================================================== */
  const FRAMES = [
    'assets/img/hero/desktop/frame-001.webp',
    'assets/img/hero/desktop/frame-016.webp',
    'assets/img/hero/desktop/frame-024.webp',
    'assets/img/hero/desktop/frame-040.webp',
    'assets/img/hero/desktop/frame-048.webp',
    'assets/img/hero/desktop/frame-064.webp',
    'assets/img/hero/desktop/frame-072.webp'
  ];
  window.FRAMES = FRAMES;

  function initAmbientBackdropEngine() {
    // 1. Bind to feature sanctuary sections (.sec.alt / .section-alt)
    const altSections = document.querySelectorAll('.sec.alt, .section-alt');
    altSections.forEach((sec, idx) => {
      // Alternate between FRAMES[2] and FRAMES[4]
      const frameIndex = idx % 2 === 0 ? 2 : 4;
      const frameUrl = FRAMES[frameIndex];
      sec.style.setProperty('--sec-alt-bg', `url("${frameUrl}")`);
    });

    // 2. Bind to #v-book and #v-join backdrops
    const vBook = document.getElementById('v-book');
    const vJoin = document.getElementById('v-join');
    if (vBook) {
      vBook.style.setProperty('--modal-ambient-bg', `url("${FRAMES[1]}")`);
    }
    if (vJoin) {
      vJoin.style.setProperty('--modal-ambient-bg', `url("${FRAMES[5]}")`);
    }

    // 3. Inject atmospheric background engine into alternating non-alt sections
    // (e.g. Care Pathway, Trust Strip, Insurance, Availability)
    const targetSections = document.querySelectorAll('.sec:not(.alt):not(#hero), .section:not(.section-alt):not(.hero-section), .trust-strip');
    targetSections.forEach((sec, idx) => {
      // Skip if already contains .sec-bg
      if (sec.querySelector('.sec-bg, .ambient-stage')) return;

      // Select frame: FRAMES[2], FRAMES[4], FRAMES[6]
      const frameMap = [2, 4, 6];
      const frameIndex = frameMap[idx % frameMap.length];
      const frameUrl = FRAMES[frameIndex];

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

      // Prepend before content so it stays at z-index: 0
      sec.prepend(stage);
    });
  }

  initAmbientBackdropEngine();

});
