(function () {
    function select(selector, parent) {
        return (parent || document).querySelector(selector);
    }

    function selectAll(selector, parent) {
        return Array.prototype.slice.call((parent || document).querySelectorAll(selector));
    }

    function normalize(value) {
        return String(value || '').toLowerCase().trim();
    }

    function setupHeader() {
        var header = select('.site-header');
        var toggle = select('.menu-toggle');
        var panel = select('.mobile-panel');

        function syncHeader() {
            if (!header) return;
            header.classList.toggle('scrolled', window.scrollY > 12);
        }

        syncHeader();
        window.addEventListener('scroll', syncHeader, { passive: true });

        if (toggle && panel) {
            toggle.addEventListener('click', function () {
                var open = panel.hasAttribute('hidden');
                if (open) {
                    panel.removeAttribute('hidden');
                } else {
                    panel.setAttribute('hidden', '');
                }
                toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            });
        }
    }

    function setupHero() {
        var slides = selectAll('.hero-slide');
        var dots = selectAll('.hero-dot');
        if (!slides.length || !dots.length) return;
        var current = 0;
        var timer = null;

        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle('active', i === current);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle('active', i === current);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                show(Number(dot.getAttribute('data-slide') || 0));
                start();
            });
        });

        var hero = select('.hero-section');
        if (hero) {
            hero.addEventListener('mouseenter', stop);
            hero.addEventListener('mouseleave', start);
        }
        start();
    }

    function setupSearchForms() {
        selectAll('.search-form').forEach(function (form) {
            form.addEventListener('submit', function (event) {
                var input = select('input[name="q"]', form);
                if (!input) return;
                var query = input.value.trim();
                if (!query) {
                    event.preventDefault();
                    window.location.href = 'search.html';
                }
            });
        });
    }

    function cardText(card) {
        return normalize([
            card.getAttribute('data-title'),
            card.getAttribute('data-region'),
            card.getAttribute('data-type'),
            card.getAttribute('data-genre'),
            card.getAttribute('data-tags'),
            card.getAttribute('data-year'),
            card.textContent
        ].join(' '));
    }

    function setupFilters() {
        var inputs = selectAll('.filter-input');
        if (!inputs.length) return;
        var cards = selectAll('.movie-card, .ranking-item');
        var chips = selectAll('.filter-chip');
        var activeFilters = {};

        function applyFilters() {
            var query = normalize(inputs[0].value);
            cards.forEach(function (card) {
                var text = cardText(card);
                var ok = !query || text.indexOf(query) !== -1;
                Object.keys(activeFilters).forEach(function (key) {
                    var value = normalize(activeFilters[key]);
                    if (value && normalize(card.getAttribute('data-' + key)).indexOf(value) === -1) {
                        ok = false;
                    }
                });
                card.classList.toggle('is-hidden', !ok);
            });
        }

        inputs.forEach(function (input) {
            input.addEventListener('input', applyFilters);
        });

        chips.forEach(function (chip) {
            chip.addEventListener('click', function () {
                var key = chip.getAttribute('data-filter-key');
                var value = chip.getAttribute('data-filter-value');
                var active = chip.classList.contains('active');
                chips.forEach(function (item) {
                    if (item.getAttribute('data-filter-key') === key) {
                        item.classList.remove('active');
                    }
                });
                if (active) {
                    delete activeFilters[key];
                } else {
                    chip.classList.add('active');
                    activeFilters[key] = value;
                }
                applyFilters();
            });
        });

        var params = new URLSearchParams(window.location.search);
        var query = params.get('q');
        if (query) {
            inputs.forEach(function (input) {
                input.value = query;
            });
            applyFilters();
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        setupHeader();
        setupHero();
        setupSearchForms();
        setupFilters();
    });
})();
