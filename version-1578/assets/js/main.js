(function () {
    var menuButton = document.querySelector('[data-menu-button]');
    var mobileMenu = document.querySelector('[data-mobile-menu]');

    if (menuButton && mobileMenu) {
        menuButton.addEventListener('click', function () {
            mobileMenu.classList.toggle('open');
        });
    }

    var hero = document.querySelector('[data-hero]');

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var prev = hero.querySelector('[data-hero-prev]');
        var next = hero.querySelector('[data-hero-next]');
        var current = 0;
        var timer = null;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }

            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('active', dotIndex === current);
            });
        }

        function startTimer() {
            timer = window.setInterval(function () {
                showSlide(current + 1);
            }, 5000);
        }

        function resetTimer() {
            if (timer) {
                window.clearInterval(timer);
            }
            startTimer();
        }

        if (prev) {
            prev.addEventListener('click', function () {
                showSlide(current - 1);
                resetTimer();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                showSlide(current + 1);
                resetTimer();
            });
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                showSlide(index);
                resetTimer();
            });
        });

        showSlide(0);
        startTimer();
    }

    var redirectForm = document.querySelector('[data-search-redirect]');

    if (redirectForm) {
        redirectForm.addEventListener('submit', function (event) {
            event.preventDefault();
            var input = redirectForm.querySelector('input[name="q"]');
            var value = input ? input.value.trim() : '';
            var target = './search.html';

            if (value) {
                target += '?q=' + encodeURIComponent(value);
            }

            window.location.href = target;
        });
    }

    var filterBox = document.querySelector('[data-filter-box]');
    var filterList = document.querySelector('[data-filter-list]');

    if (filterBox && filterList) {
        var queryInput = filterBox.querySelector('[data-filter-input]');
        var yearSelect = filterBox.querySelector('[data-filter-year]');
        var categorySelect = filterBox.querySelector('[data-filter-category]');
        var cards = Array.prototype.slice.call(filterList.querySelectorAll('[data-movie-card]'));
        var empty = document.querySelector('[data-filter-empty]');
        var params = new URLSearchParams(window.location.search);
        var q = params.get('q');

        if (q && queryInput) {
            queryInput.value = q;
        }

        function normalize(value) {
            return String(value || '').toLowerCase();
        }

        function applyFilter() {
            var keyword = normalize(queryInput ? queryInput.value.trim() : '');
            var year = yearSelect ? yearSelect.value : '';
            var category = categorySelect ? categorySelect.value : '';
            var visible = 0;

            cards.forEach(function (card) {
                var haystack = normalize([
                    card.dataset.title,
                    card.dataset.region,
                    card.dataset.type,
                    card.dataset.year,
                    card.dataset.genre,
                    card.dataset.tags
                ].join(' '));
                var matchKeyword = !keyword || haystack.indexOf(keyword) !== -1;
                var matchYear = !year || card.dataset.year === year;
                var matchCategory = !category || card.dataset.category === category;
                var matched = matchKeyword && matchYear && matchCategory;

                card.hidden = !matched;

                if (matched) {
                    visible += 1;
                }
            });

            if (empty) {
                empty.hidden = visible !== 0;
            }
        }

        if (queryInput) {
            queryInput.addEventListener('input', applyFilter);
        }

        if (yearSelect) {
            yearSelect.addEventListener('change', applyFilter);
        }

        if (categorySelect) {
            categorySelect.addEventListener('change', applyFilter);
        }

        applyFilter();
    }

    var player = document.querySelector('[data-player]');

    if (player && typeof playerConfig !== 'undefined') {
        var video = player.querySelector('video');
        var overlay = player.querySelector('.player-overlay');
        var playButton = player.querySelector('.player-play');
        var loading = player.querySelector('.player-loading');
        var hlsInstance = null;
        var loaded = false;

        function setLoading(active) {
            if (loading) {
                loading.hidden = !active;
            }
        }

        function attachSource() {
            if (!video || loaded) {
                return;
            }

            loaded = true;
            setLoading(true);

            if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hlsInstance.loadSource(playerConfig.source);
                hlsInstance.attachMedia(video);
                hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
                    setLoading(false);
                    video.play().catch(function () {});
                });
                hlsInstance.on(window.Hls.Events.ERROR, function () {
                    setLoading(false);
                });
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = playerConfig.source;
                video.addEventListener('loadedmetadata', function () {
                    setLoading(false);
                    video.play().catch(function () {});
                }, { once: true });
                video.addEventListener('error', function () {
                    setLoading(false);
                }, { once: true });
            } else {
                video.src = playerConfig.source;
                setLoading(false);
            }
        }

        function startPlayback(event) {
            if (event) {
                event.preventDefault();
                event.stopPropagation();
            }

            if (overlay) {
                overlay.classList.add('is-hidden');
            }

            attachSource();

            if (video && loaded) {
                video.play().catch(function () {});
            }
        }

        if (playButton) {
            playButton.addEventListener('click', startPlayback);
        }

        if (overlay) {
            overlay.addEventListener('click', startPlayback);
        }

        window.addEventListener('pagehide', function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    }
})();
