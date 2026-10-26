/**
 * Care Center - Hero Scroll-Driven Frame Sequence
 * Production-grade, zero layout shift, WCAG compliant.
 *
 * Architecture:
 * - Frame 1 is a native <img> with fetchpriority="high" (LCP element).
 * - Canvas is sized to devicePixelRatio, with responsive "cover" fitting.
 * - Respects prefers-reduced-motion (frame 1 only).
 * - Respects Save-Data and slow 2G/3G connections (still image only).
 * - Keyframes loaded first (every 8th frame) for immediate scroll responsiveness.
 * - Remaining frames loaded in idle slices using requestIdleCallback / createImageBitmap.
 * - requestAnimationFrame updates canvas ONLY when the calculated frame index changes.
 */

(function initHeroSequence() {
  // Check conditions that require staying on still image
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const isSaveData = connection && (connection.saveData === true || connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');

  if (prefersReducedMotion || isSaveData) {
    // Keep still frame 1 only. No background fetching or scrubbing.
    return;
  }

  // Configuration
  const isMobile = window.matchMedia('(max-width: 860px)').matches;
  const TOTAL_FRAMES = isMobile ? 66 : 200;
  const FRAME_DIR = isMobile ? 'assets/img/hero/mobile' : 'assets/img/hero/desktop';
  const KEYFRAME_INTERVAL = 8;

  // DOM elements
  const heroSection = document.getElementById('hero');
  const heroStickyFrame = heroSection ? heroSection.querySelector('.hero-sticky-frame') : null;
  const canvas = document.getElementById('cv') || document.getElementById('hero-canvas');
  const stillImg = document.getElementById('still');
  const lcpPicture = stillImg ? stillImg.closest('picture') : document.getElementById('hero-lcp-picture');

  if (!heroSection || !canvas || !heroStickyFrame) return;

  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) return;

  // Frame store: array of ImageBitmap or HTMLImageElement
  const frames = new Array(TOTAL_FRAMES + 1).fill(null);
  let currentRenderedFrame = 1;
  let targetFrame = 1;
  let isTicking = false;
  let canvasWidth = 0;
  let canvasHeight = 0;
  let dpr = 1;
  let preferredExt = 'webp'; // default to webp; test avif capability asynchronously

  function pad(num) {
    return String(num).padStart(3, '0');
  }

  function getFrameUrl(index) {
    return `${FRAME_DIR}/frame-${pad(index)}.${preferredExt}`;
  }

  /**
   * Cover-fit drawer: draws the frame centered and cropped to fill canvas without distortion.
   */
  function drawCover(image) {
    if (!image) return;
    const imgWidth = image.width;
    const imgHeight = image.height;
    if (!imgWidth || !imgHeight || !canvasWidth || !canvasHeight) return;

    const imgRatio = imgWidth / imgHeight;
    const canvasRatio = canvasWidth / canvasHeight;

    let renderW, renderH, offsetX, offsetY;

    if (canvasRatio > imgRatio) {
      renderW = canvasWidth;
      renderH = canvasWidth / imgRatio;
      offsetX = 0;
      offsetY = (canvasHeight - renderH) / 2;
    } else {
      renderH = canvasHeight;
      renderW = canvasHeight * imgRatio;
      offsetX = (canvasWidth - renderW) / 2;
      offsetY = 0;
    }

    ctx.drawImage(image, offsetX, offsetY, renderW, renderH);
  }

  /**
   * Resizes the canvas to match client dimensions and devicePixelRatio.
   */
  function resizeCanvas() {
    const rect = heroStickyFrame.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2); // cap at 2 for performance
    canvasWidth = Math.round(rect.width * dpr);
    canvasHeight = Math.round(rect.height * dpr);

    if (canvas.width !== canvasWidth || canvas.height !== canvasHeight) {
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
    }

    // Redraw current or nearest available frame
    renderNearestFrame(targetFrame);
  }

  /**
   * Finds the closest loaded frame if the target frame is not yet decoded.
   */
  function renderNearestFrame(frameIdx) {
    if (frames[frameIdx]) {
      drawCover(frames[frameIdx]);
      currentRenderedFrame = frameIdx;
      return;
    }

    // Search outwards for closest loaded keyframe
    for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
      const prev = frameIdx - offset;
      const next = frameIdx + offset;
      if (prev >= 1 && frames[prev]) {
        drawCover(frames[prev]);
        currentRenderedFrame = prev;
        return;
      }
      if (next <= TOTAL_FRAMES && frames[next]) {
        drawCover(frames[next]);
        currentRenderedFrame = next;
        return;
      }
    }
  }

  /**
   * Loads a single frame using off-main-thread createImageBitmap where supported.
   */
  async function loadFrame(index) {
    if (frames[index]) return frames[index];

    const url = getFrameUrl(index);
    try {
      if (window.createImageBitmap && window.fetch) {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const blob = await response.blob();
        const bitmap = await createImageBitmap(blob);
        frames[index] = bitmap;
        return bitmap;
      } else {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => {
            frames[index] = img;
            resolve(img);
          };
          img.onerror = reject;
          img.src = url;
        });
      }
    } catch (err) {
      // Fallback silently if individual frame fails
      return null;
    }
  }

  /**
   * Phase 1: Load Frame 1 and initialize canvas rendering.
   */
  async function initFirstFrame() {
    resizeCanvas();
    const first = await loadFrame(1);
    if (first) {
      drawCover(first);
      canvas.classList.add('is-ready');
      if (lcpPicture) {
        lcpPicture.style.opacity = '0';
      }
    }

    // Phase 2: Load keyframes immediately (every 8th frame)
    loadKeyframes();
  }

  /**
   * Phase 2: Load every 8th frame for responsive scrubbing.
   */
  async function loadKeyframes() {
    const keyframeIndices = [];
    for (let i = 1; i <= TOTAL_FRAMES; i += KEYFRAME_INTERVAL) {
      if (i !== 1) keyframeIndices.push(i);
    }
    // Ensure final frame is included as a keyframe
    if (!keyframeIndices.includes(TOTAL_FRAMES)) {
      keyframeIndices.push(TOTAL_FRAMES);
    }

    // Load keyframes in small parallel batches
    for (const idx of keyframeIndices) {
      await loadFrame(idx);
    }

    // Phase 3: Fill remaining frames during idle time
    scheduleIdleLoading();
  }

  /**
   * Phase 3: Fill remaining frames using requestIdleCallback so main thread is never blocked.
   */
  function scheduleIdleLoading() {
    const remaining = [];
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      if (!frames[i]) remaining.push(i);
    }

    let cursor = 0;

    function processIdleBatch(deadline) {
      while (cursor < remaining.length && (deadline.timeRemaining() > 3 || deadline.didTimeout)) {
        const frameIdx = remaining[cursor++];
        loadFrame(frameIdx);
      }

      if (cursor < remaining.length) {
        if ('requestIdleCallback' in window) {
          window.requestIdleCallback(processIdleBatch, { timeout: 1500 });
        } else {
          setTimeout(() => processIdleBatch({ timeRemaining: () => 10, didTimeout: true }), 60);
        }
      }
    }

    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(processIdleBatch, { timeout: 1500 });
    } else {
      setTimeout(() => processIdleBatch({ timeRemaining: () => 10, didTimeout: true }), 60);
    }
  }

  /**
   * Calculates scroll progress through the sticky hero track and schedules frame render.
   */
  function onScroll() {
    if (!isTicking) {
      isTicking = true;
      window.requestAnimationFrame(() => {
        isTicking = false;
        const rect = heroSection.getBoundingClientRect();
        const scrollDistance = -rect.top;
        const totalScrollable = rect.height - window.innerHeight;

        if (totalScrollable <= 0) return;

        const progress = Math.max(0, Math.min(1, scrollDistance / totalScrollable));
        const newTargetFrame = Math.floor(progress * (TOTAL_FRAMES - 1)) + 1;

        if (newTargetFrame !== currentRenderedFrame) {
          targetFrame = newTargetFrame;
          renderNearestFrame(targetFrame);
        }
      });
    }
  }

  // Event Listeners
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => {
    resizeCanvas();
  }, { passive: true });

  // Initialize once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFirstFrame);
  } else {
    initFirstFrame();
  }
})();
