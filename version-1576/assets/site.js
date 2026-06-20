(function () {
    function getCards(scope) {
        return Array.prototype.slice.call(scope.querySelectorAll('[data-movie-card]'));
    }

    function normalize(value) {
        return String(value || '').toLowerCase().trim();
    }

    function applyFilters(scope) {
        var input = scope.querySelector('[data-page-search]');
        var active = scope.querySelector('[data-filter-group] button.active');
        var keyword = normalize(input ? input.value : '');
        var filterValue = active ? normalize(active.getAttribute('data-filter-value')) : 'all';
        var visible = 0;
        getCards(scope).forEach(function (card) {
            var text = normalize(card.getAttribute('data-search'));
            var matchKeyword = !keyword || text.indexOf(keyword) !== -1;
            var matchFilter = filterValue === 'all' || text.indexOf(filterValue) !== -1;
            var show = matchKeyword && matchFilter;
            card.style.display = show ? '' : 'none';
            if (show) {
                visible += 1;
            }
        });
        var empty = scope.querySelector('[data-empty-state]');
        if (empty) {
            empty.classList.toggle('is-visible', visible === 0);
        }
    }

    function initNavigation() {
        var toggle = document.querySelector('[data-nav-toggle]');
        var links = document.querySelector('[data-nav-links]');
        if (!toggle || !links) {
            return;
        }
        toggle.addEventListener('click', function () {
            links.classList.toggle('is-open');
        });
    }

    function initHero() {
        var hero = document.querySelector('[data-hero]');
        if (!hero) {
            return;
        }
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        if (slides.length <= 1) {
            return;
        }
        var current = 0;
        function show(index) {
            current = index;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('active', dotIndex === current);
            });
        }
        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                show(Number(dot.getAttribute('data-hero-dot')) || 0);
            });
        });
        window.setInterval(function () {
            show((current + 1) % slides.length);
        }, 5200);
    }

    function initFiltering() {
        var scopes = Array.prototype.slice.call(document.querySelectorAll('main'));
        scopes.forEach(function (scope) {
            var input = scope.querySelector('[data-page-search]');
            var buttons = Array.prototype.slice.call(scope.querySelectorAll('[data-filter-group] button'));
            if (!input && !buttons.length) {
                return;
            }
            if (input) {
                input.addEventListener('input', function () {
                    applyFilters(scope);
                });
            }
            buttons.forEach(function (button) {
                button.addEventListener('click', function () {
                    buttons.forEach(function (item) {
                        item.classList.remove('active');
                    });
                    button.classList.add('active');
                    applyFilters(scope);
                });
            });
            applyFilters(scope);
        });
    }

    function initQuerySearch() {
        var params = new URLSearchParams(window.location.search);
        var query = params.get('q');
        if (!query) {
            return;
        }
        var input = document.querySelector('[data-query-input]');
        if (input) {
            input.value = query;
            var main = document.querySelector('main');
            if (main) {
                applyFilters(main);
            }
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        initNavigation();
        initHero();
        initFiltering();
        initQuerySearch();
    });
})();
