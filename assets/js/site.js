/* Tidemark: gentle motion. Content is always readable without this file;
   it only adds a soft reveal on scroll, a count-up on the big numbers and a slow
   drift on the photos. Everything stops for visitors who ask for reduced motion. */
(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) { root.classList.remove('js'); return; }

  var SELECTOR = [
    '.page-head .wrap > *',
    '.section .wrap > .eyebrow', '.section .wrap > .h2', '.section .wrap > .lead',
    '.card', '.stat', '.result', '.offer', '.channels li', '.moment', '.idcard', '.portrait',
    '.bio > *', '.contact > *', '.band .wrap > *', '.photoband .inner > *'
  ].join(',');

  var els = Array.prototype.slice.call(document.querySelectorAll(SELECTOR))
    .filter(function (el) { return !el.closest('.hero'); });

  // stagger siblings: first item immediately, the next a beat later, capped
  var counters = new Map();
  els.forEach(function (el) {
    var n = counters.get(el.parentNode) || 0;
    counters.set(el.parentNode, n + 1);
    el.style.setProperty('--i', Math.min(n, 5));
    el.setAttribute('data-reveal', '');
  });

  function countUp(fig) {
    var m = /^(\d+)(.*)$/.exec(fig.textContent.trim());
    if (!m) return;
    var end = parseInt(m[1], 10), tail = m[2], start = null, dur = 1100;
    fig.setAttribute('aria-label', fig.textContent.trim());
    function step(t) {
      if (start === null) start = t;
      var p = Math.min((t - start) / dur, 1), e = 1 - Math.pow(1 - p, 3);
      fig.textContent = Math.round(end * e) + tail;
      if (p < 1) requestAnimationFrame(step);
    }
    fig.textContent = '0' + tail;
    requestAnimationFrame(step);
  }

  function reveal(el, animate) {
    io.unobserve(el);
    el.classList.add('in');
    var fig = el.querySelector && el.querySelector('.figure');
    if (animate && fig && !fig.classList.contains('word')) countUp(fig);
    // hand the element back to its normal styles once it has settled
    var delay = (parseInt(el.style.getPropertyValue('--i'), 10) || 0) * 70 + 900;
    setTimeout(function () { el.removeAttribute('data-reveal'); el.classList.remove('in'); }, delay);
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) { reveal(entry.target, true); }
      // scrolled past before it could play (a fast scroll or a jump): just show it
      else if (entry.boundingClientRect.top < 0) { reveal(entry.target, false); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  els.forEach(function (el) { io.observe(el); });

  // slow drift on the photos
  var shots = Array.prototype.slice.call(document.querySelectorAll('.photo .shot'));
  if (shots.length) {
    var ticking = false;
    function drift() {
      var vh = window.innerHeight;
      shots.forEach(function (shot) {
        var box = shot.parentNode.getBoundingClientRect();
        if (box.bottom < 0 || box.top > vh) return;
        var offset = (box.top + box.height / 2 - vh / 2) * -0.1;
        var max = box.height * 0.07;
        offset = Math.max(-max, Math.min(max, offset));
        shot.style.transform = 'translate3d(0,' + offset.toFixed(1) + 'px,0)';
      });
      ticking = false;
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(drift); } }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    drift();
  }
})();
