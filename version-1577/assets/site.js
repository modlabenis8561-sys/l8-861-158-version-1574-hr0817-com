(function () {
    var mobileButtons = document.querySelectorAll('[data-mobile-toggle]');
    mobileButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            var menu = document.querySelector('.mobile-menu');
            if (menu) {
                menu.classList.toggle('is-open');
            }
        });
    });

    var hero = document.querySelector('[data-hero]');
    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
        var current = 0;
        var timer = null;
        var showSlide = function (index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === current);
            });
        };
        var startTimer = function () {
            if (timer) {
                clearInterval(timer);
            }
            timer = setInterval(function () {
                showSlide(current + 1);
            }, 5000);
        };
        var prev = hero.querySelector('[data-hero-prev]');
        var next = hero.querySelector('[data-hero-next]');
        if (prev) {
            prev.addEventListener('click', function () {
                showSlide(current - 1);
                startTimer();
            });
        }
        if (next) {
            next.addEventListener('click', function () {
                showSlide(current + 1);
                startTimer();
            });
        }
        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener('click', function () {
                showSlide(dotIndex);
                startTimer();
            });
        });
        showSlide(0);
        startTimer();
    }

    var filterRoots = document.querySelectorAll('[data-filter-root]');
    filterRoots.forEach(function (root) {
        var input = root.querySelector('[data-filter-input]');
        var typeSelect = root.querySelector('[data-filter-type]');
        var regionSelect = root.querySelector('[data-filter-region]');
        var yearSelect = root.querySelector('[data-filter-year]');
        var cards = Array.prototype.slice.call(root.querySelectorAll('[data-movie-card]'));
        var empty = root.querySelector('[data-no-results]');
        var params = new URLSearchParams(window.location.search);
        var q = params.get('q');
        if (q && input) {
            input.value = q;
        }
        var normalize = function (value) {
            return String(value || '').trim().toLowerCase();
        };
        var apply = function () {
            var keyword = normalize(input && input.value);
            var type = normalize(typeSelect && typeSelect.value);
            var region = normalize(regionSelect && regionSelect.value);
            var year = normalize(yearSelect && yearSelect.value);
            var visible = 0;
            cards.forEach(function (card) {
                var text = normalize([
                    card.getAttribute('data-title'),
                    card.getAttribute('data-region'),
                    card.getAttribute('data-type'),
                    card.getAttribute('data-genre'),
                    card.getAttribute('data-tags'),
                    card.getAttribute('data-year')
                ].join(' '));
                var matched = true;
                if (keyword && text.indexOf(keyword) === -1) {
                    matched = false;
                }
                if (type && normalize(card.getAttribute('data-type')).indexOf(type) === -1) {
                    matched = false;
                }
                if (region && normalize(card.getAttribute('data-region')).indexOf(region) === -1) {
                    matched = false;
                }
                if (year && normalize(card.getAttribute('data-year')) !== year) {
                    matched = false;
                }
                card.classList.toggle('hidden-by-filter', !matched);
                if (matched) {
                    visible += 1;
                }
            });
            if (empty) {
                empty.style.display = visible ? 'none' : 'block';
            }
        };
        [input, typeSelect, regionSelect, yearSelect].forEach(function (control) {
            if (control) {
                control.addEventListener('input', apply);
                control.addEventListener('change', apply);
            }
        });
        apply();
    });

    var players = document.querySelectorAll('[data-player]');
    players.forEach(function (wrap) {
        var video = wrap.querySelector('video');
        var button = wrap.querySelector('[data-play-button]');
        if (!video) {
            return;
        }
        var streamUrl = video.getAttribute('data-stream') || '';
        var ready = false;
        var setup = function () {
            if (ready || !streamUrl) {
                return;
            }
            ready = true;
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = streamUrl;
            } else if (window.Hls && window.Hls.isSupported()) {
                var hls = new window.Hls({ enableWorker: true });
                hls.loadSource(streamUrl);
                hls.attachMedia(video);
            } else {
                video.src = streamUrl;
            }
        };
        var play = function () {
            setup();
            wrap.classList.add('is-playing');
            video.setAttribute('controls', 'controls');
            var attempt = video.play();
            if (attempt && typeof attempt.catch === 'function') {
                attempt.catch(function () {
                    wrap.classList.remove('is-playing');
                });
            }
        };
        if (button) {
            button.addEventListener('click', play);
        }
        video.addEventListener('click', function () {
            if (video.paused) {
                play();
            }
        });
    });
})();
