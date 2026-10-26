# Care Center — Boutique Outpatient Psychiatry & Integrative Mental Health

> **A calm, unhurried place to begin again.**
> Historic Downtown New Albany, Indiana & Statewide Secure Telehealth

---

## Overview

**Care Center** is a premier outpatient psychiatric and psychotherapeutic practice in New Albany, Indiana (120 E. Market Street, Suite 300). The practice combines biologically rigorous psychiatric evaluations and conservative pharmacotherapy with evidence-based psychotherapy (CBT, ACT, EMDR) in an unhurried, luxury clinical sanctuary.

## Architectural Highlights

- **Pure Vanilla Stack:** Zero build steps, zero external frameworks, and no dependencies other than curated typography (`Literata` & `Manrope`).
- **Scroll-Driven Hero Sequence:** 200 high-performance WebP/AVIF frames loaded with adaptive DPR scaling, keyframe-first streaming (every 8th frame), idle decoding via `createImageBitmap`, and `prefers-reduced-motion` / Save-Data detection.
- **Cinematic Atmospheric Depth:** 3-layer directional lighting scrim (105° editorial typography scrim, warm golden sunburst glow, floor vignette) achieving a **12.09:1 WCAG contrast ratio** (exceeding the 4.5:1 AA threshold).
- **Multi-Page Architecture:** Standalone semantic pages with unique URLs, canonical tags, open graph metadata, and structured headings:
  - `index.html` — Homepage with scroll-scrubbed hero sequence & availability HUD
  - `services.html` — Clinical specialties & comparative modalities matrix
  - `availability.html` — Real-time Mon–Fri schedule board with live status pulses
  - `book.html` — White-glove 3-step intake booking wizard
  - `session.html` — Virtual telehealth waiting room with A/V & 16ms latency diagnostics
  - `about.html` — Clinical leadership: Dr. Marcus Vance, MD & Sarah Lin-Holloway, LCSW
  - `insurance.html` — In-network carriers, Superbill Concierge & No Surprises Act disclosure
  - `contact.html` — Suite details, parking, clinic hours & secure inquiry form
  - `faq.html` — Categorized accordion questions & answers
  - `privacy.html` — HIPAA Notice of Privacy Practices
  - `terms.html` — Patient Portal & Website Terms of Use
  - `rights.html` — Patient Rights & Responsibilities Charter
  - `consent.html` — Informed Consent to Telehealth (Indiana Code IC 25-1-9.5)
- **Care Concierge AI Drawer (`#er`):** Slide-out intake assistant with realistic 1.2s typing indicators, pre-configured inquiry chips, and automatic crisis keyword detection that intercepts emergencies to surface the 988 Suicide & Crisis Lifeline and 911 dispatch.
- **Accessibility & Safety Compliance:**
  - WCAG 2.2 AA compliant skip links, keyboard navigation traps, focus states, and aria attributes.
  - Mandatory persistent crisis safety bar with exact 988, 911, and outpatient disclosures on every single page.

## Local Development

Start the static test server:

```bash
node scripts/serve.js
```

Open [http://127.0.0.1:3000](http://127.0.0.1:3000) in your browser.

## Quality & Compliance Audits

Run the automated quality and compliance test suite:

```bash
node scripts/checker.js
```

Run endpoint HTTP status and hero contrast verification:

```bash
node scripts/test-endpoints-and-contrast.js
```

---

&copy; 2026 Care Center LLC. All rights reserved.
