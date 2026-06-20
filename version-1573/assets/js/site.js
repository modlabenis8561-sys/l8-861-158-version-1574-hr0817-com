(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
    });
  }

  var carousel = document.querySelector('[data-hero-carousel]');

  if (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-dot]'));
    var nextButton = carousel.querySelector('[data-hero-next]');
    var prevButton = carousel.querySelector('[data-hero-prev]');
    var current = 0;

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

    if (nextButton) {
      nextButton.addEventListener('click', function () {
        showSlide(current + 1);
      });
    }

    if (prevButton) {
      prevButton.addEventListener('click', function () {
        showSlide(current - 1);
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        showSlide(index);
      });
    });

    window.setInterval(function () {
      showSlide(current + 1);
    }, 5200);
  }

  var forms = Array.prototype.slice.call(document.querySelectorAll('[data-filter-form]'));

  forms.forEach(function (form) {
    var input = form.querySelector('input[type="search"]');
    var typeSelect = form.querySelector('[data-filter-type]');
    var yearSelect = form.querySelector('[data-filter-year]');
    var section = form.closest('.content-section') || document;
    var items = Array.prototype.slice.call(section.querySelectorAll('.listing-item'));
    var empty = section.querySelector('[data-empty-state]');
    var params = new URLSearchParams(window.location.search);
    var query = params.get('q');

    if (query && input) {
      input.value = query;
    }

    function matchText(item) {
      return [
        item.getAttribute('data-title'),
        item.getAttribute('data-genre'),
        item.getAttribute('data-region'),
        item.getAttribute('data-year'),
        item.getAttribute('data-type')
      ].join(' ').toLowerCase();
    }

    function applyFilter() {
      var keyword = input ? input.value.trim().toLowerCase() : '';
      var typeValue = typeSelect ? typeSelect.value : '';
      var yearValue = yearSelect ? yearSelect.value : '';
      var visible = 0;

      items.forEach(function (item) {
        var text = matchText(item);
        var typeText = (item.getAttribute('data-type') || '') + ' ' + (item.getAttribute('data-genre') || '');
        var yearText = item.getAttribute('data-year') || '';
        var matched = true;

        if (keyword && text.indexOf(keyword) === -1) {
          matched = false;
        }

        if (typeValue && typeText.indexOf(typeValue) === -1) {
          matched = false;
        }

        if (yearValue && yearText !== yearValue) {
          matched = false;
        }

        item.style.display = matched ? '' : 'none';

        if (matched) {
          visible += 1;
        }
      });

      if (empty) {
        empty.classList.toggle('show', visible === 0);
      }
    }

    ['input', 'change'].forEach(function (eventName) {
      form.addEventListener(eventName, applyFilter);
    });

    applyFilter();
  });
})();
