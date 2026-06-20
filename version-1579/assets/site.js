document.addEventListener("DOMContentLoaded", function () {
  var menuButton = document.querySelector(".mobile-menu-button");
  var mobileNav = document.querySelector(".mobile-nav");

  if (menuButton && mobileNav) {
    menuButton.addEventListener("click", function () {
      mobileNav.classList.toggle("open");
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
  var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
  var prev = document.querySelector(".hero-prev");
  var next = document.querySelector(".hero-next");
  var current = 0;
  var timer = null;

  function showSlide(index) {
    if (!slides.length) return;
    current = (index + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      slide.classList.toggle("active", i === current);
    });
    dots.forEach(function (dot, i) {
      dot.classList.toggle("active", i === current);
    });
  }

  function startHero() {
    if (timer || slides.length < 2) return;
    timer = window.setInterval(function () {
      showSlide(current + 1);
    }, 5000);
  }

  if (prev) {
    prev.addEventListener("click", function () {
      showSlide(current - 1);
      startHero();
    });
  }

  if (next) {
    next.addEventListener("click", function () {
      showSlide(current + 1);
      startHero();
    });
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener("click", function () {
      showSlide(index);
      startHero();
    });
  });

  startHero();

  var input = document.getElementById("movie-search");
  var buttons = Array.prototype.slice.call(document.querySelectorAll(".filter-button"));
  var cards = Array.prototype.slice.call(document.querySelectorAll(".search-item"));
  var filters = { type: "", region: "" };

  function runFilter() {
    var query = input ? input.value.trim().toLowerCase() : "";
    cards.forEach(function (card) {
      var search = (card.getAttribute("data-search") || "").toLowerCase();
      var type = card.getAttribute("data-type-group") || "";
      var region = card.getAttribute("data-region-group") || "";
      var matchedQuery = !query || search.indexOf(query) !== -1;
      var matchedType = !filters.type || filters.type === type;
      var matchedRegion = !filters.region || filters.region === region;
      card.classList.toggle("hidden-item", !(matchedQuery && matchedType && matchedRegion));
    });
  }

  if (input && cards.length) {
    input.addEventListener("input", runFilter);
  }

  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      var group = button.getAttribute("data-filter-group");
      var value = button.getAttribute("data-filter-value") || "";
      if (group !== "type" && group !== "region") return;
      filters[group] = value;
      buttons.forEach(function (item) {
        if (item.getAttribute("data-filter-group") === group) {
          item.classList.toggle("active", item === button);
        }
      });
      runFilter();
    });
  });
});
