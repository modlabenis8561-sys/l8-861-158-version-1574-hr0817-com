(function () {
  var header = document.querySelector('[data-header]');
  var toggle = document.querySelector('[data-menu-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  if (header) {
    window.addEventListener('scroll', function () {
      header.classList.toggle('is-scrolled', window.scrollY > 12);
    }, { passive: true });
  }

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var index = 0;
    var timer = null;

    function showHero(nextIndex) {
      if (!slides.length) {
        return;
      }
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
      });
    }

    function startHero() {
      if (timer) {
        clearInterval(timer);
      }
      timer = setInterval(function () {
        showHero(index + 1);
      }, 5200);
    }

    if (prev) {
      prev.addEventListener('click', function () {
        showHero(index - 1);
        startHero();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        showHero(index + 1);
        startHero();
      });
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        showHero(i);
        startHero();
      });
    });

    startHero();
  }

  var panels = Array.prototype.slice.call(document.querySelectorAll('[data-filter-panel]'));
  panels.forEach(function (panel) {
    var input = panel.querySelector('[data-search-input]');
    var clear = panel.querySelector('[data-clear-search]');
    var scope = panel.parentElement || document;
    var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-search-card]'));
    var state = {};

    function applyFilters() {
      var query = input ? input.value.trim().toLowerCase() : '';
      cards.forEach(function (card) {
        var text = (card.getAttribute('data-search-text') || '').toLowerCase();
        var visible = !query || text.indexOf(query) !== -1;
        Object.keys(state).forEach(function (field) {
          var value = state[field];
          if (value) {
            var cardValue = (card.getAttribute('data-' + field) || '').toLowerCase();
            visible = visible && cardValue.indexOf(value.toLowerCase()) !== -1;
          }
        });
        card.classList.toggle('is-hidden', !visible);
      });
    }

    panel.querySelectorAll('[data-filter-field]').forEach(function (button) {
      button.addEventListener('click', function () {
        var field = button.getAttribute('data-filter-field');
        var value = button.getAttribute('data-filter-value') || '';
        state[field] = value;
        panel.querySelectorAll('[data-filter-field="' + field + '"]').forEach(function (item) {
          item.classList.toggle('is-active', item === button);
        });
        applyFilters();
      });
    });

    if (input) {
      var params = new URLSearchParams(window.location.search);
      var incoming = params.get('q');
      if (incoming) {
        input.value = incoming;
      }
      input.addEventListener('input', applyFilters);
    }

    if (clear && input) {
      clear.addEventListener('click', function () {
        input.value = '';
        applyFilters();
      });
    }

    applyFilters();
  });

  function initVideo(video, shell) {
    if (!video || video.dataset.ready === '1') {
      return Promise.resolve();
    }
    var url = video.getAttribute('data-hls') || '';
    if (!url) {
      return Promise.resolve();
    }
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = url;
      video.dataset.ready = '1';
      return Promise.resolve();
    }
    if (window.Hls && window.Hls.isSupported()) {
      var hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
      hls.loadSource(url);
      hls.attachMedia(video);
      video.dataset.ready = '1';
      video._hlsInstance = hls;
      return Promise.resolve();
    }
    return Promise.resolve();
  }

  document.querySelectorAll('[data-player-shell]').forEach(function (shell) {
    var video = shell.querySelector('video');
    var button = shell.querySelector('[data-play-button]');

    function playVideo() {
      initVideo(video, shell).then(function () {
        var playPromise = video.play();
        if (playPromise && typeof playPromise.then === 'function') {
          playPromise.then(function () {
            shell.classList.add('is-playing');
          }).catch(function () {
            shell.classList.remove('is-playing');
          });
        } else {
          shell.classList.add('is-playing');
        }
      });
    }

    if (button) {
      button.addEventListener('click', playVideo);
    }

    if (video) {
      video.addEventListener('play', function () {
        shell.classList.add('is-playing');
      });
      video.addEventListener('pause', function () {
        if (video.currentTime === 0) {
          shell.classList.remove('is-playing');
        }
      });
    }
  });
})();
