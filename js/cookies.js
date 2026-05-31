/* ─────────────────────────────────────────
   Oak & Grid — cookies.js
   Minimal consent bar + gated analytics
   ───────────────────────────────────────── */

(function () {
  const STORAGE_KEY = 'oak-grid-cookie-consent';

  function loadAnalytics() {
    if (document.querySelector('script[data-oak-analytics]')) return;

    const script = document.createElement('script');
    script.src = 'https://cdn.vercel-insights.com/v1/script.js';
    script.defer = true;
    script.dataset.oakAnalytics = 'true';
    document.head.appendChild(script);
  }

  function hideBanner(banner) {
    banner.classList.remove('cookie-banner--visible');
    banner.classList.add('cookie-banner--hidden');
    window.setTimeout(() => banner.remove(), 450);
  }

  function setConsent(value) {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch (_) {
      /* storage unavailable — still respect choice for session */
    }

    if (value === 'accepted') loadAnalytics();
  }

  function createBanner() {
    if (document.getElementById('cookie-banner')) return;

    const banner = document.createElement('aside');
    banner.id = 'cookie-banner';
    banner.className = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-live', 'polite');
    banner.setAttribute('aria-label', 'Cookie preferences');

    banner.innerHTML = `
      <div class="cookie-banner__inner">
        <p class="cookie-banner__text">
          We use cookies to understand how you use our site.
          You can accept or decline non-essential cookies.
        </p>
        <div class="cookie-banner__actions">
          <button type="button" class="cookie-banner__btn cookie-banner__btn--decline">Decline</button>
          <button type="button" class="cookie-banner__btn cookie-banner__btn--accept">Accept</button>
        </div>
      </div>
    `;

    document.body.appendChild(banner);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => banner.classList.add('cookie-banner--visible'));
    });

    banner.querySelector('.cookie-banner__btn--accept').addEventListener('click', () => {
      setConsent('accepted');
      hideBanner(banner);
    });

    banner.querySelector('.cookie-banner__btn--decline').addEventListener('click', () => {
      setConsent('declined');
      hideBanner(banner);
    });
  }

  let consent = null;
  try {
    consent = localStorage.getItem(STORAGE_KEY);
  } catch (_) {
    consent = null;
  }

  if (consent === 'accepted') {
    loadAnalytics();
  } else if (consent !== 'declined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', createBanner);
    } else {
      createBanner();
    }
  }
})();
