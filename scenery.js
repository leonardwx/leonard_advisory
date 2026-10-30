/* Decorative local scenery only; the original interaction scripts are unchanged. */
(() => {
  'use strict';
  const videos = [...document.querySelectorAll('.singapore-scene video[data-src]')];
  const button = document.querySelector('.motion-toggle');
  if (!videos.length || !button) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const status = document.getElementById('motion-status');
  const label = button.querySelector('.motion-label');
  const symbol = button.querySelector('.motion-symbol');
  let pausedByVisitor = false;
  // A local preference contains no personal information and is optional.
  try { pausedByVisitor = localStorage.getItem('wei-xi-background-motion') === 'paused'; } catch (_) {}
  const states = new Map(videos.map(video => [video, { visible: false, loaded: false, pending: false, failed: false }]));
  const restricted = () => reducedMotion.matches || Boolean(connection?.saveData);
  const enabled = () => !restricted() && !pausedByVisitor;
  const allowed = state => enabled() && !document.hidden && state.visible && !state.failed;
  function updateControl() {
    const allFailed = [...states.values()].every(state => state.failed);
    const on = enabled() && !allFailed;
    // The stable accessible name is Background motion; pressed means enabled.
    button.setAttribute('aria-pressed', String(on));
    button.disabled = restricted() || allFailed;
    let text = on ? 'Pause background motion' : 'Play background motion';
    if (reducedMotion.matches) text = 'Motion off: reduced motion';
    else if (connection?.saveData) text = 'Motion off: data saver';
    else if (allFailed) text = 'Motion unavailable';
    label.textContent = text;
    symbol.textContent = on ? 'Ⅱ' : '▶';
    if (status) status.textContent = on ? 'Background motion enabled. Scenery plays only while visible.' : text;
  }
  function showPoster(video, state) {
    state.failed = true;
    video.pause();
    video.classList.remove('is-ready');
    updateControl();
  }
  function syncVideo(video, state) {
    if (!allowed(state)) { video.pause(); return; }
    if (!state.loaded) {
      state.loaded = true;
      video.muted = true;
      video.src = video.dataset.src;
      video.load();
    }
    if (!video.paused || state.pending) return;
    state.pending = true;
    const attempt = video.play();
    if (attempt && typeof attempt.then === 'function') {
      attempt.then(() => {
        state.pending = false;
        if (!allowed(state)) video.pause();
      }).catch(error => {
        state.pending = false;
        // A pause during loading is expected when scrolling away or hiding the tab.
        if (error.name !== 'AbortError') showPoster(video, state);
      });
    } else state.pending = false;
  }
  function syncAll() {
    states.forEach((state, video) => syncVideo(video, state));
    updateControl();
  }
  videos.forEach(video => {
    const state = states.get(video);
    video.muted = true;
    video.addEventListener('play', () => { if (!allowed(state)) video.pause(); });
    video.addEventListener('playing', () => {
      if (allowed(state)) video.classList.add('is-ready');
      else video.pause();
    });
    video.addEventListener('error', () => showPoster(video, state));
  });
  button.addEventListener('click', () => {
    if (restricted()) return;
    pausedByVisitor = !pausedByVisitor;
    try { localStorage.setItem('wei-xi-background-motion', pausedByVisitor ? 'paused' : 'enabled'); } catch (_) {}
    syncAll();
  });
  document.addEventListener('visibilitychange', syncAll);
  if (reducedMotion.addEventListener) reducedMotion.addEventListener('change', syncAll);
  else reducedMotion.addListener(syncAll);
  connection?.addEventListener?.('change', syncAll);
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const video = entry.target.querySelector('video[data-src]');
        const state = states.get(video);
        if (!state) return;
        state.visible = entry.isIntersecting && entry.intersectionRatio > 0;
        syncVideo(video, state);
      });
    }, { threshold: [0, 0.01] });
    videos.forEach(video => observer.observe(video.parentElement));
  } else {
    let queued = false;
    const check = () => {
      queued = false;
      states.forEach((state, video) => {
        const rect = video.parentElement.getBoundingClientRect();
        state.visible = rect.bottom > 0 && rect.top < innerHeight && rect.right > 0 && rect.left < innerWidth;
        syncVideo(video, state);
      });
    };
    const requestCheck = () => { if (!queued) { queued = true; requestAnimationFrame(check); } };
    addEventListener('scroll', requestCheck, { passive: true });
    addEventListener('resize', requestCheck, { passive: true });
    check();
  }
  button.hidden = false;
  syncAll();
})();
