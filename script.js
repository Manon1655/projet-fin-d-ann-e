document.addEventListener('DOMContentLoaded', function () {

  // --- Dropdown Catégories ---
  const catLink = document.getElementById('categories-link');
  const catDropdown = document.getElementById('categories-dropdown');
  let dropdownTimeout;

  if (catLink && catDropdown) {
    catLink.addEventListener('mouseenter', () => {
      clearTimeout(dropdownTimeout);
      catDropdown.style.display = 'block';
    });
    catDropdown.addEventListener('mouseenter', () => {
      clearTimeout(dropdownTimeout);
      catDropdown.style.display = 'block';
    });

    catLink.addEventListener('mouseleave', () => {
      dropdownTimeout = setTimeout(() => { catDropdown.style.display = 'none'; }, 200);
    });
    catDropdown.addEventListener('mouseleave', () => {
      dropdownTimeout = setTimeout(() => { catDropdown.style.display = 'none'; }, 200);
    });
  }

  // --- Recherche et Popular Search ---
  const searchForm = document.querySelector('.search-bar');
  if (searchForm) {
    const searchInput = searchForm.querySelector('input');
    const bookCards = document.querySelectorAll('.book-card');

    // Création du bouton réinitialisation
    let resetBtn = document.createElement('button');
    resetBtn.textContent = "↩️ Réinitialiser";
    resetBtn.type = "button";
    resetBtn.style.display = "none";
    resetBtn.style.marginLeft = "10px";
    resetBtn.style.padding = "8px 16px";
    resetBtn.style.border = "none";
    resetBtn.style.borderRadius = "20px";
    resetBtn.style.background = "#A8BFA2";
    resetBtn.style.color = "#fff";
    resetBtn.style.cursor = "pointer";
    searchForm.appendChild(resetBtn);

    function filterBooks(query) {
      query = query.trim().toLowerCase();
      let found = false;
      bookCards.forEach(card => {
        const title = card.querySelector('h4')?.textContent.toLowerCase() || "";
        const author = card.querySelector('.author')?.textContent.toLowerCase() || "";
        const genre = card.querySelector('.genre')?.textContent.toLowerCase() || "";

        if (title.includes(query) || author.includes(query) || genre.includes(query)) {
          card.style.display = "block";
          found = true;
        } else {
          card.style.display = "none";
        }
      });
      if (!found) alert("Aucun résultat trouvé.");
      resetBtn.style.display = "inline-block";
    }

    // Recherche via formulaire
    searchForm.addEventListener('submit', function (e) {
      e.preventDefault();
      filterBooks(searchInput.value);
    });

    // Réinitialisation
    resetBtn.addEventListener('click', function () {
      searchInput.value = "";
      bookCards.forEach(card => card.style.display = "block");
      resetBtn.style.display = "none";
    });

    // Popular Search clickable
    const popularItems = document.querySelectorAll('.popular-search span');
    popularItems.forEach(item => {
      item.addEventListener('click', () => {
        searchInput.value = item.textContent;
        filterBooks(item.textContent);
      });
    });
  }

  // --- Compteur Coup de coeur ---
  document.querySelectorAll('.book-card .badge.heart, .book-card .heart-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      let favCount = document.getElementById('fav-count');
      let count = parseInt(favCount.textContent) || 0;
      favCount.textContent = count + 1;
      favCount.style.display = 'inline-block';
    });
  });

  // --- Compteur Panier ---
  document.querySelectorAll('.book-card button, .add-to-cart').forEach(btn => {
    btn.addEventListener('click', function () {
      let cartCount = document.getElementById('cart-count');
      let count = parseInt(cartCount.textContent) || 0;
      cartCount.textContent = count + 1;
      cartCount.style.display = 'inline-block';
    });
  });

  // --- Carousel Recommandations ---
  function initCarousel(containerId, navId, slidesToShow = 3) {
    const carousel = document.getElementById(containerId);
    if (!carousel) return;
    const track = carousel.querySelector('.carousel-track');
    const nav = document.getElementById(navId);
    let currentIndex = 0;

    function createNavDots() {
      const dotCount = Math.ceil(track.children.length / slidesToShow);
      for (let i = 0; i < dotCount; i++) {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        nav.appendChild(dot);
      }
    }

    function goToSlide(index) {
      const slides = track.children.length;
      const newIndex = Math.max(0, Math.min(index, slides - slidesToShow));
      const offset = -newIndex * (100 / slidesToShow);
      track.style.transform = `translateX(${offset}%)`;
      currentIndex = newIndex;
      updateNavDots();
    }

    function updateNavDots() {
      const dots = nav.querySelectorAll('.carousel-dot');
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    }

    carousel.querySelector('.left').addEventListener('click', () => goToSlide(currentIndex - 1));
    carousel.querySelector('.right').addEventListener('click', () => goToSlide(currentIndex + 1));

    createNavDots();
  }

  // Activer les carrousels
  initCarousel("carousel-reco", "carousel-nav-reco", 3);
  initCarousel("carousel-best", "carousel-nav-best", 3);

});
