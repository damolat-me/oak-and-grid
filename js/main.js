/* ─────────────────────────────────────────
   Oak & Grid — main.js
   Scroll-reveal via IntersectionObserver
   ───────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // animate once
      }
    });
  }, {
    threshold: 0.12,       // trigger when 12% of element is in view
    rootMargin: '0px 0px -40px 0px'  // slight bottom offset so it feels natural
  });

  // Observe every element with the .reveal class
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

});
