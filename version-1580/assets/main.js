(function () {
  function qs(sel, root) {
    return (root || document).querySelector(sel);
  }
  function qsa(sel, root) {
    return Array.from((root || document).querySelectorAll(sel));
  }

  function bindMobileNav() {
    const btn = qs('[data-nav-toggle]');
    const nav = qs('[data-nav]');
    if (!btn || !nav) return;
    btn.addEventListener('click', () => {
      nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', nav.classList.contains('open') ? 'true' : 'false');
    });
  }

  function bindFilter() {
    qsa('[data-filter-root]').forEach((root) => {
      const input = qs('[data-filter-input]', root);
      const cards = qsa('[data-filter-item]', root);
      const counter = qs('[data-filter-count]', root);
      const empty = qs('[data-filter-empty]', root);

      function apply() {
        const query = (input?.value || '').trim().toLowerCase();
        let shown = 0;
        cards.forEach((card) => {
          const hay = (card.getAttribute('data-search') || card.textContent || '').toLowerCase();
          const ok = !query || hay.includes(query);
          card.classList.toggle('hidden', !ok);
          if (ok) shown += 1;
        });
        if (counter) counter.textContent = String(shown);
        if (empty) empty.classList.toggle('hidden', shown !== 0);
      }

      if (input) {
        input.addEventListener('input', apply);
        apply();
      }
    });
  }

  function initCarousel() {
    qsa('[data-carousel]').forEach((carousel) => {
      const track = qs('[data-carousel-track]', carousel);
      const slides = qsa('[data-carousel-slide]', carousel);
      const dotsWrap = qs('[data-carousel-dots]', carousel);
      const prev = qs('[data-carousel-prev]', carousel);
      const next = qs('[data-carousel-next]', carousel);
      if (!track || !slides.length) return;

      let index = 0;
      let timer = null;

      function render() {
        track.style.transform = 'translateX(' + (-index * 100) + '%)';
        if (dotsWrap) {
          qsa('button', dotsWrap).forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
          });
        }
      }

      function go(step) {
        index = (index + step + slides.length) % slides.length;
        render();
      }

      function start() {
        stop();
        timer = setInterval(() => go(1), 5000);
      }

      function stop() {
        if (timer) {
          clearInterval(timer);
          timer = null;
        }
      }

      if (dotsWrap) {
        dotsWrap.innerHTML = slides.map((_, i) => '<button class="dot' + (i === 0 ? ' active' : '') + '" type="button" aria-label="第' + (i + 1) + '张"></button>').join('');
        qsa('button', dotsWrap).forEach((dot, i) => {
          dot.addEventListener('click', () => {
            index = i;
            render();
            start();
          });
        });
      }

      if (prev) prev.addEventListener('click', () => { go(-1); start(); });
      if (next) next.addEventListener('click', () => { go(1); start(); });

      carousel.addEventListener('mouseenter', stop);
      carousel.addEventListener('mouseleave', start);
      render();
      start();
    });
  }

  function initPlayers() {
    qsa('video[data-src]').forEach((video) => {
      const src = video.getAttribute('data-src');
      if (!src) return;
      const poster = video.getAttribute('data-poster');
      if (poster) video.setAttribute('poster', poster);
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src;
        return;
      }
      if (window.Hls && window.Hls.isSupported()) {
        const hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
        hls.loadSource(src);
        hls.attachMedia(video);
      }
    });
  }

  function bindScrollTop() {
    const btn = qs('[data-top]');
    if (!btn) return;
    window.addEventListener('scroll', () => {
      btn.classList.toggle('hidden', window.scrollY < 400);
    });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  document.addEventListener('DOMContentLoaded', function () {
    bindMobileNav();
    bindFilter();
    initCarousel();
    initPlayers();
    bindScrollTop();
  });
})();
