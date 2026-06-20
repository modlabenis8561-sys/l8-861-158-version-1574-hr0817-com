
(function(){
  const ready = (fn) => {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  };

  function initNav() {
    const toggle = document.querySelector('[data-nav-toggle]');
    const panel = document.querySelector('[data-nav-panel]');
    if (toggle && panel) {
      toggle.addEventListener('click', () => panel.classList.toggle('open'));
    }
  }

  function initHeroSlider() {
    const slides = Array.from(document.querySelectorAll('[data-hero-slide]'));
    if (!slides.length) return;
    const prev = document.querySelector('[data-hero-prev]');
    const next = document.querySelector('[data-hero-next]');
    let index = slides.findIndex(s => s.classList.contains('active'));
    if (index < 0) index = 0;
    const show = (i) => {
      slides.forEach((s, idx) => s.classList.toggle('active', idx === i));
      index = i;
    };
    const step = (delta) => show((index + delta + slides.length) % slides.length);
    if (prev) prev.addEventListener('click', () => step(-1));
    if (next) next.addEventListener('click', () => step(1));
    setInterval(() => step(1), 5500);
  }

  function initFilterInput() {
    document.querySelectorAll('[data-filter-input]').forEach(input => {
      const targetSelector = input.getAttribute('data-filter-target');
      const cards = targetSelector ? Array.from(document.querySelectorAll(targetSelector)) : [];
      if (!cards.length) return;
      const empty = document.querySelector(input.getAttribute('data-filter-empty'));
      const doFilter = () => {
        const q = input.value.trim().toLowerCase();
        let visible = 0;
        cards.forEach(card => {
          const text = card.getAttribute('data-search-text') || card.textContent || '';
          const ok = !q || text.toLowerCase().includes(q);
          card.style.display = ok ? '' : 'none';
          if (ok) visible += 1;
        });
        if (empty) empty.style.display = visible ? 'none' : '';
      };
      input.addEventListener('input', doFilter);
      doFilter();
    });
  }

  function createCard(item) {
    const a = document.createElement('a');
    a.className = 'card';
    a.href = item.detail_path;
    a.setAttribute('data-card', '1');
    a.setAttribute('data-search-text', [item.title, item.region, item.type, item.genre, item.tags, item.one_line, item.summary, item.review].join(' '));
    a.innerHTML = `
      <div class="poster">
        <img src="${item.poster}" alt="${escapeHtml(item.title)}">
        <span class="badge">${escapeHtml(item.year + ' · ' + item.type)}</span>
        <span class="play" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="18" height="18"><polygon points="5,3 19,12 5,21"></polygon></svg>
        </span>
      </div>
      <div class="card-body">
        <h3>${escapeHtml(item.title)}</h3>
        <div class="meta-row">
          <span>${escapeHtml(item.region)}</span>
          <span>${escapeHtml(item.primary_genre || item.genre)}</span>
        </div>
      </div>`;
    return a;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function initSearchPage() {
    const page = document.querySelector('[data-search-page]');
    if (!page) return;
    const input = document.querySelector('[data-search-input]');
    const results = document.querySelector('[data-search-results]');
    const empty = document.querySelector('[data-search-empty]');
    const quick = document.querySelector('[data-search-quick]');
    const all = window.MOVIE_INDEX || [];
    const render = (items) => {
      results.innerHTML = '';
      items.forEach(item => results.appendChild(createCard(item)));
      empty.style.display = items.length ? 'none' : '';
    };
    const run = () => {
      const q = input.value.trim().toLowerCase();
      let items = all;
      if (q) {
        items = all.filter(item => {
          const blob = [item.title, item.region, item.type, item.genre, item.tags, item.one_line, item.summary, item.review].join(' ').toLowerCase();
          return blob.includes(q);
        });
      }
      render(items.slice(0, 200));
    };
    if (quick) {
      quick.addEventListener('click', (e) => {
        const t = e.target.closest('[data-quick-tag]');
        if (!t) return;
        input.value = t.getAttribute('data-quick-tag');
        run();
      });
    }
    input.addEventListener('input', run);
    run();
  }

  function initDetailPlayer() {
    const video = document.querySelector('[data-player]');
    if (!video) return;
    const overlay = document.querySelector('[data-play-overlay]');
    const source = video.getAttribute('data-hls');
    const mp4 = video.getAttribute('data-mp4');
    const playNow = () => video.play().catch(() => {});

    if (source && window.Hls && Hls.isSupported() && location.protocol !== 'file:') {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      });
      hls.loadSource(source);
      hls.attachMedia(video);
    } else if (source && video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
    } else if (mp4) {
      video.src = mp4;
    }

    if (overlay) {
      overlay.addEventListener('click', () => {
        overlay.classList.add('hidden');
        playNow();
      });
      video.addEventListener('play', () => overlay.classList.add('hidden'));
      video.addEventListener('pause', () => overlay.classList.remove('hidden'));
    }
    const btn = document.querySelector('[data-play-toggle]');
    if (btn) btn.addEventListener('click', () => {
      overlay && overlay.classList.add('hidden');
      playNow();
    });
  }

  ready(() => {
    initNav();
    initHeroSlider();
    initFilterInput();
    initSearchPage();
    initDetailPlayer();
  });
})();


(function(){
  const mini = document.getElementById('site-mini-search');
  if (!mini) return;
  mini.addEventListener('keydown', function(e){
    if (e.key === 'Enter') {
      const q = encodeURIComponent(this.value.trim());
      if (q) location.href = 'search.html?q=' + q;
    }
  });
})();

(function(){
  const params = new URLSearchParams(location.search);
  const q = params.get('q');
  if (q) {
    const input = document.querySelector('[data-search-input]');
    if (input) {
      input.value = q;
      input.dispatchEvent(new Event('input'));
    }
  }
})();
