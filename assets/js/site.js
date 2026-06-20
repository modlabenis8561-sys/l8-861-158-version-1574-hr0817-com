(function () {
    function selectAll(selector, scope) {
        return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
    }

    function initMenu() {
        var button = document.querySelector('[data-menu-toggle]');
        var nav = document.querySelector('[data-mobile-nav]');
        if (!button || !nav) {
            return;
        }
        button.addEventListener('click', function () {
            nav.classList.toggle('is-open');
        });
    }

    function initHero() {
        var root = document.querySelector('[data-hero]');
        if (!root) {
            return;
        }
        var slides = selectAll('[data-hero-slide]', root);
        var dots = selectAll('[data-hero-dot]', root);
        var prev = root.querySelector('[data-hero-prev]');
        var next = root.querySelector('[data-hero-next]');
        var index = 0;
        var timer = null;

        function show(nextIndex) {
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === index);
            });
        }

        function restart() {
            if (timer) {
                window.clearInterval(timer);
            }
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5200);
        }

        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener('click', function () {
                show(dotIndex);
                restart();
            });
        });

        if (prev) {
            prev.addEventListener('click', function () {
                show(index - 1);
                restart();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                show(index + 1);
                restart();
            });
        }

        if (slides.length > 1) {
            restart();
        }
    }

    function initSearch() {
        var input = document.querySelector('[data-search-input]');
        var cards = selectAll('[data-movie-card]');
        var chips = selectAll('[data-filter-value]');
        var empty = document.querySelector('[data-empty-state]');
        if (!input && chips.length === 0) {
            return;
        }
        var filter = '全部';
        if (chips.length > 0) {
            chips[0].classList.add('is-active');
        }

        function matches(card, query) {
            var haystack = (card.getAttribute('data-search') || card.textContent || '').toLowerCase();
            var hasQuery = !query || haystack.indexOf(query) !== -1;
            var hasFilter = filter === '全部' || haystack.indexOf(filter.toLowerCase()) !== -1;
            return hasQuery && hasFilter;
        }

        function apply() {
            var query = input ? input.value.trim().toLowerCase() : '';
            var visible = 0;
            cards.forEach(function (card) {
                var ok = matches(card, query);
                card.style.display = ok ? '' : 'none';
                if (ok) {
                    visible += 1;
                }
            });
            if (empty) {
                empty.classList.toggle('is-visible', visible === 0);
            }
        }

        if (input) {
            input.addEventListener('input', apply);
        }

        chips.forEach(function (chip) {
            chip.addEventListener('click', function () {
                filter = chip.getAttribute('data-filter-value') || '全部';
                chips.forEach(function (item) {
                    item.classList.toggle('is-active', item === chip);
                });
                apply();
            });
        });
    }

    function initPlayer() {
        var shell = document.querySelector('.player-shell');
        if (!shell) {
            return;
        }
        var video = shell.querySelector('video');
        var trigger = shell.querySelector('[data-player-trigger]');
        var playButton = shell.querySelector('[data-play]');
        if (!video) {
            return;
        }
        var source = video.getAttribute('data-src');
        var mounted = false;
        var hls = null;

        function mount() {
            if (!source || mounted) {
                return;
            }
            mounted = true;
            shell.classList.add('is-playing');
            video.controls = true;
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = source;
            } else if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(source);
                hls.attachMedia(video);
            } else {
                video.src = source;
            }
            var playback = video.play();
            if (playback && typeof playback.catch === 'function') {
                playback.catch(function () {});
            }
        }

        if (trigger) {
            trigger.addEventListener('click', mount);
        }
        if (playButton) {
            playButton.addEventListener('click', function (event) {
                event.preventDefault();
                mount();
            });
        }
        video.addEventListener('click', function () {
            if (!mounted) {
                mount();
            }
        });
        window.addEventListener('pagehide', function () {
            if (hls && typeof hls.destroy === 'function') {
                hls.destroy();
            }
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        initMenu();
        initHero();
        initSearch();
        initPlayer();
    });
})();
