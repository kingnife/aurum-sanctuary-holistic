/**
 * Care Center - Navigation and Announcement Bar Controls
 * Manages calm announcement dismiss and accessible mobile navigation.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Announcement Bar dismiss
  const announcementBar = document.getElementById('ann') || document.getElementById('announcement-bar');
  const dismissBtn = document.getElementById('annx') || document.getElementById('announcement-dismiss');
  const STORAGE_KEY = 'carecenter_announcement_dismissed_v1';

  if (announcementBar && dismissBtn) {
    if (sessionStorage.getItem(STORAGE_KEY) === 'true') {
      announcementBar.setAttribute('hidden', '');
    } else {
      dismissBtn.addEventListener('click', () => {
        announcementBar.setAttribute('hidden', '');
        sessionStorage.setItem(STORAGE_KEY, 'true');
      });
    }
  }

  // Mobile navigation drawer toggle
  const mobileToggle = document.getElementById('mobile-nav-toggle');
  const mainNav = document.getElementById('main-nav');

  if (mobileToggle && mainNav) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mainNav.getAttribute('data-open') === 'true';
      mainNav.setAttribute('data-open', (!isOpen).toString());
      mobileToggle.setAttribute('aria-expanded', (!isOpen).toString());
      mobileToggle.setAttribute('aria-label', isOpen ? 'Open navigation menu' : 'Close navigation menu');
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mainNav.getAttribute('data-open') === 'true') {
        mainNav.setAttribute('data-open', 'false');
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.setAttribute('aria-label', 'Open navigation menu');
        mobileToggle.focus();
      }
    });
  }
});
