/**
 * Care Center - Theme Switcher
 * Manages light / dark theme with system preference detection and localStorage persistence.
 * Accessible: Updates aria-pressed and announcements.
 */

(function initTheme() {
  const STORAGE_KEY = 'carecenter_theme';
  const getThemeBtn = () => document.getElementById('theme') || document.getElementById('theme-toggle-btn');
  const root = document.documentElement;

  // Read persisted preference or default to system
  function getPreferredTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    const themeToggleBtn = getThemeBtn();
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
      if (themeToggleBtn) {
        themeToggleBtn.setAttribute('aria-pressed', 'true');
        themeToggleBtn.setAttribute('aria-label', 'Switch to light theme');
      }
    } else {
      root.setAttribute('data-theme', 'light');
      if (themeToggleBtn) {
        themeToggleBtn.setAttribute('aria-pressed', 'false');
        themeToggleBtn.setAttribute('aria-label', 'Switch to dark theme');
      }
    }
  }

  // Apply initially as soon as possible
  const initialTheme = getPreferredTheme();
  applyTheme(initialTheme);

  // Bind toggle button after DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    const btn = getThemeBtn();
    if (!btn) return;

    btn.setAttribute('aria-pressed', root.getAttribute('data-theme') === 'dark' ? 'true' : 'false');
    btn.setAttribute('aria-label', root.getAttribute('data-theme') === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');

    btn.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      const nextTheme = current === 'dark' ? 'light' : 'dark';
      localStorage.setItem(STORAGE_KEY, nextTheme);
      applyTheme(nextTheme);
    });

    // Listen to OS theme changes if user has not set explicit override
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem(STORAGE_KEY)) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  });
})();
