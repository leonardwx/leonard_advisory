/* Navigation only; the member's original script.js is preserved. */
(() => {
  'use strict';
  const start = () => {
    const navbar = document.querySelector('.navbar');
    const header = navbar?.querySelector('.nav-header');
    const quickNav = document.querySelector('.mobile-quick-nav');
    const links = Array.from(document.querySelectorAll('#nav-menu a[href^="#"], .mobile-quick-nav a[href^="#"]'));
    const ids = ['hero', 'about', 'services', 'why', 'testimonials', 'credentials', 'claims', 'contact'];
    const sections = ids.map(id => document.getElementById(id)).filter(Boolean);
    if (!sections.length) return;

    function measureHeader() {
      if (!header || !navbar) return;
      const inner = navbar.querySelector('.nav-inner');
      const style = inner ? getComputedStyle(inner) : null;
      const height = header.getBoundingClientRect().height + (style ? parseFloat(style.paddingTop) + parseFloat(style.paddingBottom) : 28);
      document.documentElement.style.setProperty('--mobile-header-height', `${Math.ceil(height)}px`);
    }
    function currentSection() {
      const top = (navbar?.getBoundingClientRect().bottom || 0) + Math.min(innerHeight * .22, 170);
      let current = sections[0];
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= top) current = section;
        else break;
      }
      links.forEach(link => {
        if (link.getAttribute('href') === `#${current.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }
    let scheduled = false;
    function scheduleUpdate() {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => { scheduled = false; currentSection(); });
    }
    // Scroll handles long sections; observation also covers initial loading and resizing.
    addEventListener('scroll', scheduleUpdate, { passive: true });
    addEventListener('resize', () => { measureHeader(); scheduleUpdate(); }, { passive: true });
    addEventListener('hashchange', scheduleUpdate);
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(scheduleUpdate, { rootMargin: '-10% 0px -55% 0px', threshold: [0, .1, .5] });
      sections.forEach(section => observer.observe(section));
    }
    if ('ResizeObserver' in window && header) new ResizeObserver(measureHeader).observe(header);
    quickNav?.addEventListener('click', event => {
      const link = event.target.closest('a[href^="#"]');
      if (!link || event.button !== 0 || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
      const target = document.getElementById(link.getAttribute('href').slice(1));
      // Closing an open full menu keeps the destination clear of its expanded panel.
      const menuButton = document.getElementById('hamburger');
      if (menuButton?.getAttribute('aria-expanded') === 'true') menuButton.click();
      if (target) requestAnimationFrame(() => {
        const temporary = !target.hasAttribute('tabindex');
        if (temporary) target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
        if (temporary) target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
      });
    });
    measureHeader();
    currentSection();
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
