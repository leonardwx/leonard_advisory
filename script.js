/* Progressive enhancements: links and horizontal testimonials work without JavaScript. */
(() => {
  'use strict';

  function start() {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const navbar = document.querySelector('.navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const mobile = window.matchMedia('(max-width: 900px)');

    function measureNavbar() {
      if (navbar) {
        document.documentElement.style.setProperty('--nav-height', `${navbar.getBoundingClientRect().height}px`);
      }
    }

    function setMenu(open, returnFocus = false) {
      if (!hamburger || !navMenu) return;
      navMenu.classList.toggle('active', open);
      hamburger.setAttribute('aria-expanded', String(open));
      hamburger.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      if (returnFocus) hamburger.focus();
      measureNavbar();
    }

    if (hamburger && navMenu) {
      hamburger.type = 'button';
      hamburger.setAttribute('aria-controls', navMenu.id);
      setMenu(false);
      hamburger.addEventListener('click', () => setMenu(hamburger.getAttribute('aria-expanded') !== 'true'));
      document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && hamburger.getAttribute('aria-expanded') === 'true') {
          setMenu(false, true);
        }
      });
      document.addEventListener('click', event => {
        if (navbar && !navbar.contains(event.target)) setMenu(false);
      });
      navMenu.addEventListener('focusout', event => {
        if (event.relatedTarget && navbar && !navbar.contains(event.relatedTarget)) setMenu(false);
      });
      mobile.addEventListener('change', () => setMenu(false));
      // CSS only hides the mobile links once their menu controller is ready.
      document.documentElement.classList.add('js');
    }

    // Let the browser handle URLs, history, downloads and modified clicks normally.
    // Only valid same-document anchors receive the focus enhancement.
    if (navbar) {
      navbar.addEventListener('click', event => {
        const link = event.target.closest('a[href]');
        if (!link || !navbar.contains(link) || event.button !== 0 || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
        const url = new URL(link.href, document.baseURI);
        const sameDocument = url.origin === location.origin && url.pathname === location.pathname && url.search === location.search;
        if (!sameDocument || !url.hash) return;
        let target;
        try {
          target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
        } catch (_) {
          return;
        }
        if (!target) return;
        setMenu(false);
        requestAnimationFrame(() => {
          const temporaryTabindex = !target.hasAttribute('tabindex');
          if (temporaryTabindex) target.setAttribute('tabindex', '-1');
          target.focus({ preventScroll: true });
          if (temporaryTabindex) target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
        });
      });
      measureNavbar();
      if ('ResizeObserver' in window) new ResizeObserver(measureNavbar).observe(navbar);
      else window.addEventListener('resize', measureNavbar, { passive: true });
    }

    document.querySelectorAll('.flip-card').forEach(card => {
      const nativeButton = card.tagName === 'BUTTON';
      if (nativeButton) card.type = 'button';
      else {
        card.setAttribute('role', 'button');
        card.tabIndex = 0;
      }
      if (!card.hasAttribute('aria-label')) card.setAttribute('aria-label', 'Show the other photo');
      function update() {
        const flipped = card.classList.contains('flipped');
        card.setAttribute('aria-pressed', String(flipped));
        card.querySelector('.flip-front')?.setAttribute('aria-hidden', String(flipped));
        card.querySelector('.flip-back')?.setAttribute('aria-hidden', String(!flipped));
      }
      card.addEventListener('click', () => {
        card.classList.toggle('flipped');
        update();
      });
      if (!nativeButton) card.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          card.click();
        }
      });
      update();
    });

    // Keep the supplied image paths; use honest text fallbacks when assets are absent.
    document.querySelectorAll('img').forEach(img => {
      function showFallback() {
        if (img.alt === '') { img.hidden = true; return; }
        const wrapper = img.closest('.photo-frame, .portrait-frame, .photo-face, .flip-front, .flip-back, .avatar, .client-avatar, .credential-media, .certificate-preview, .certificate-link') || img.parentElement;
        if (!wrapper) return;
        wrapper.classList.add('image-missing');
        img.hidden = true;
        let fallback = wrapper.querySelector('.image-fallback, .avatar-initials, .credential-mark');
        if (!fallback) {
          fallback = document.createElement('span');
          fallback.className = 'image-fallback';
          const testimonial = img.closest('.testimonial-card');
          const name = testimonial?.querySelector('strong')?.textContent.replace(/^[\s–—-]+/, '').split(',')[0];
          const label = name || img.alt || 'Photo';
          fallback.textContent = wrapper.dataset.initials || (name ? name.split(/\s+/).slice(0, 2).map(word => word[0]).join('') : label);
          fallback.setAttribute('role', 'img');
          fallback.setAttribute('aria-label', name ? `${name}, photo unavailable` : `${label}, image unavailable`);
          wrapper.appendChild(fallback);
        }
        fallback.hidden = false;
      }
      img.addEventListener('error', showFallback, { once: true });
      if (img.complete && !img.naturalWidth) showFallback();
    });

    const track = document.getElementById('carouselTrack');
    const scroller = track?.closest('.carousel-container');
    if (!track || !scroller) return;
    const cards = Array.from(track.querySelectorAll('.testimonial-card'));
    if (!cards.length) return;
    const region = scroller.closest('.testimonials') || scroller.closest('.carousel-wrapper') || scroller.parentElement;
    const prev = region.querySelector('#prevBtn');
    const next = region.querySelector('#nextBtn');
    const dotsContainer = document.getElementById('carouselDots');
    let positions = [];
    let dots = [];
    let active = 0;
    let scrollFrame = 0;
    let resizeFrame = 0;
    const status = document.createElement('span');
    status.className = 'sr-only';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    status.setAttribute('aria-atomic', 'true');
    region.appendChild(status);
    scroller.tabIndex = 0;
    if (!scroller.hasAttribute('aria-label')) scroller.setAttribute('aria-label', 'Client testimonials. Scroll or use the arrow keys to browse.');
    scroller.setAttribute('role', 'region');
    scroller.setAttribute('aria-roledescription', 'carousel');
    if (prev) { prev.type = 'button'; prev.setAttribute('aria-label', 'Previous testimonials'); }
    if (next) { next.type = 'button'; next.setAttribute('aria-label', 'Next testimonials'); }

    function updateControls() {
      const left = scroller.scrollLeft;
      const max = Math.max(0, scroller.scrollWidth - scroller.clientWidth);
      active = positions.reduce((nearest, position, index) => Math.abs(position - left) < Math.abs(positions[nearest] - left) ? index : nearest, 0);
      if (prev) prev.disabled = left <= 2;
      if (next) next.disabled = left >= max - 2;
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === active);
        if (index === active) dot.setAttribute('aria-current', 'true');
        else dot.removeAttribute('aria-current');
      });
    }

    function announceVisible() {
      const viewport = scroller.getBoundingClientRect();
      const visible = cards.map((card, index) => ({ rect: card.getBoundingClientRect(), index })).filter(({ rect }) => rect.right > viewport.left + 8 && rect.left < viewport.right - 8);
      if (visible.length) status.textContent = `Testimonials ${visible[0].index + 1} to ${visible[visible.length - 1].index + 1} of ${cards.length}`;
    }

    function goTo(index) {
      if (!positions.length) return;
      const position = positions[Math.max(0, Math.min(index, positions.length - 1))];
      scroller.scrollTo({ left: position, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
    }

    function measure() {
      const max = Math.max(0, scroller.scrollWidth - scroller.clientWidth);
      const firstLeft = cards[0].getBoundingClientRect().left;
      const measured = cards.map(card => Math.min(max, Math.max(0, card.getBoundingClientRect().left - firstLeft)));
      positions = measured.filter((position, index) => index === 0 || Math.abs(position - measured[index - 1]) > 1);
      if (Math.abs(positions[positions.length - 1] - max) > 1) positions.push(max);
      // Rebuild only if the number of navigable positions changed; keep keyboard focus stable.
      if (dotsContainer && dots.length !== positions.length) {
        dotsContainer.replaceChildren();
        dots = positions.map((_, index) => {
          const dot = document.createElement('button');
          dot.type = 'button';
          dot.setAttribute('aria-label', `Show testimonial position ${index + 1} of ${positions.length}`);
          dot.addEventListener('click', () => goTo(index));
          dotsContainer.appendChild(dot);
          return dot;
        });
      }
      updateControls();
      announceVisible();
    }

    prev?.addEventListener('click', () => goTo(active - 1));
    next?.addEventListener('click', () => goTo(active + 1));
    scroller.addEventListener('keydown', event => {
      if (event.target !== scroller) return;
      const destination = { ArrowLeft: active - 1, ArrowRight: active + 1, Home: 0, End: positions.length - 1 }[event.key];
      if (destination !== undefined) { event.preventDefault(); goTo(destination); }
    });
    scroller.addEventListener('scroll', () => {
      if (!scrollFrame) scrollFrame = requestAnimationFrame(() => { scrollFrame = 0; updateControls(); });
    }, { passive: true });
    scroller.addEventListener('scrollend', announceVisible);
    function scheduleMeasure() {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(measure);
    }
    if ('ResizeObserver' in window) {
      const observer = new ResizeObserver(scheduleMeasure);
      observer.observe(scroller);
      cards.forEach(card => observer.observe(card));
    } else window.addEventListener('resize', scheduleMeasure, { passive: true });
    measure();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
