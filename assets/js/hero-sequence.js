/**
 * Care Center - Hero Crossfade & Ken Burns Motion Engine
 * 60fps smooth cosine easing crossfade and subtle breathing zoom.
 */

var FRAMES = window.FRAMES || [
  'assets/img/hero/desktop/frame-001.webp',
  'assets/img/hero/desktop/frame-008.webp',
  'assets/img/hero/desktop/frame-016.webp',
  'assets/img/hero/desktop/frame-024.webp',
  'assets/img/hero/desktop/frame-032.webp',
  'assets/img/hero/desktop/frame-040.webp',
  'assets/img/hero/desktop/frame-048.webp',
  'assets/img/hero/desktop/frame-056.webp',
  'assets/img/hero/desktop/frame-064.webp'
];
window.FRAMES = FRAMES;

(function initHeroMotion() {
  function startMotion() {
    var still = document.getElementById('still');
    var cv = document.getElementById('cv');
    if (!FRAMES || !FRAMES.length || !still || !cv) return;

    // Set initial fallback frame immediately
    still.src = FRAMES[0];

    // Preload all base64 / WebP frames into Image objects
    var imgs = FRAMES.map(function(src) {
      var img = new Image();
      img.src = src;
      return img;
    });

    var ctx = cv.getContext('2d');
    var w = (cv.width = 1152);
    var h = (cv.height = 648);
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    var idx = 0;
    var nextIdx = 1 % imgs.length;
    var lastSwitch = performance.now();
    var holdDuration = 3200; // ms per frame
    var fadeDuration = 1400; // ms smooth crossfade

    function render(now) {
      var elapsed = now - lastSwitch;
      var curImg = imgs[idx];
      var nxtImg = imgs[nextIdx];

      if (curImg && curImg.complete && curImg.naturalWidth > 0) {
        ctx.clearRect(0, 0, w, h);
        // Subtle slow breathing zoom
        var zoom = 1 + (elapsed / (holdDuration + fadeDuration)) * 0.035;
        var dw = w * zoom;
        var dh = h * zoom;
        var dx = (w - dw) / 2;
        var dy = (h - dh) / 2;

        ctx.globalAlpha = 1;
        ctx.drawImage(curImg, dx, dy, dw, dh);

        if (elapsed > holdDuration && nxtImg && nxtImg.complete && nxtImg.naturalWidth > 0) {
          var alpha = Math.min(1, (elapsed - holdDuration) / fadeDuration);
          // Smooth cosine easing for crossfade
          var easedAlpha = 0.5 - 0.5 * Math.cos(alpha * Math.PI);
          ctx.globalAlpha = easedAlpha;
          ctx.drawImage(nxtImg, 0, 0, w, h);

          if (alpha >= 1) {
            idx = nextIdx;
            nextIdx = (idx + 1) % imgs.length;
            lastSwitch = now;
          }
        }
      }
      requestAnimationFrame(render);
    }

    imgs[0].onload = function() {
      requestAnimationFrame(render);
    };
    if (imgs[0].complete) {
      requestAnimationFrame(render);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startMotion);
  } else {
    startMotion();
  }
})();
