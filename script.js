// --- Ombrelune : Script JS modernisé et optimisé ---

document.addEventListener('DOMContentLoaded', async () => {
  // --- Dropdown Catégories ---
  const catLink = document.getElementById('categories-link');
  const catDropdown = document.getElementById('categories-dropdown');
  let dropdownTimeout;

  if (catLink && catDropdown) {
    const showDropdown = () => {
      clearTimeout(dropdownTimeout);
      catDropdown.style.display = 'block';
    };
    const hideDropdown = () => {
      dropdownTimeout = setTimeout(() => {
        catDropdown.style.display = 'none';
      }, 200);
    };

    catLink.addEventListener('mouseenter', showDropdown);
    catDropdown.addEventListener('mouseenter', showDropdown);
    catLink.addEventListener('mouseleave', hideDropdown);
    catDropdown.addEventListener('mouseleave', hideDropdown);
  }

  // --- Chargement des livres depuis l’API Google Books ---
  async function loadBooks(query = 'roman') {
    try {
      const res = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=12`
      );
      const data = await res.json();

      const bookGrid = document.querySelector('.collection .book-grid');
      if (!bookGrid) return;

      bookGrid.innerHTML = '';

      (data.items || []).forEach(book => {
        const info = book.volumeInfo;
        const price = book.saleInfo?.listPrice?.amount
          ? `${book.saleInfo.listPrice.amount} €`
          : 'Non disponible';

        const card = document.createElement('div');
        card.className = 'book-card';
        card.innerHTML = `
          <img src="${info.imageLinks?.thumbnail || 'assets/images/no-cover.png'}" alt="${info.title}">
          <div class="info">
            <span class="genre">${info.categories?.[0] || 'Inconnu'}</span>
            <h4>${info.title}</h4>
            <span class="author">${info.authors?.join(', ') || 'Auteur inconnu'}</span>
            <div class="rating">⭐⭐⭐⭐☆</div>
            <div class="price">${price}</div>
            <button class="add-to-cart">Acheter</button>
            <button class="heart-btn">♡</button>
          </div>
        `;
        bookGrid.appendChild(card);
      });
    } catch (err) {
      console.error('Erreur de chargement des livres :', err);
    }
  }

  await loadBooks();

  // --- Recherche avec réinitialisation ---
  const searchForm = document.querySelector('.search-bar');
  if (searchForm) {
    const searchInput = searchForm.querySelector('input');
    const resetBtn = document.createElement('button');
    resetBtn.textContent = '↩️ Réinitialiser';
    Object.assign(resetBtn.style, {
      display: 'none',
      marginLeft: '10px',
      padding: '8px 16px',
      border: 'none',
      borderRadius: '20px',
      background: '#A8BFA2',
      color: '#fff',
      cursor: 'pointer',
    });
    searchForm.appendChild(resetBtn);

    searchForm.addEventListener('submit', e => {
      e.preventDefault();
      const query = searchInput.value.trim();
      if (query) {
        loadBooks(query);
        resetBtn.style.display = 'inline-block';
      }
    });

    resetBtn.addEventListener('click', () => {
      searchInput.value = '';
      resetBtn.style.display = 'none';
      loadBooks('roman');
    });

    document.querySelectorAll('.popular-search span').forEach(span => {
      span.addEventListener('click', () => {
        searchInput.value = span.textContent;
        loadBooks(span.textContent);
        resetBtn.style.display = 'inline-block';
      });
    });
  }

  // --- Compteurs favoris et panier ---
  function incrementCounter(id) {
    const el = document.getElementById(id);
    if (!el) return;
    const count = parseInt(el.textContent) || 0;
    el.textContent = count + 1;
    el.style.display = 'inline-block';
  }

  document.body.addEventListener('click', e => {
    if (e.target.matches('.heart-btn, .badge.heart')) incrementCounter('fav-count');
    if (e.target.matches('.add-to-cart, .book-card button')) incrementCounter('cart-count');
  });

  // --- Profil utilisateur ---
  const userProfile = document.getElementById('user-profile');
  const profileMenu = document.getElementById('profile-menu');
  if (userProfile && profileMenu) {
    userProfile.addEventListener('click', e => {
      e.stopPropagation();
      profileMenu.style.display =
        profileMenu.style.display === 'block' ? 'none' : 'block';
    });
    document.addEventListener('click', () => (profileMenu.style.display = 'none'));
  }

  // --- Carousel Recommandations ---
  function initCarousel(carouselId, navId, slidesToShow = 3) {
    const carousel = document.getElementById(carouselId);
    if (!carousel) return;

    const track = carousel.querySelector('.carousel-track');
    const nav = document.getElementById(navId);
    let currentIndex = 0;

    function goToSlide(index) {
      const slides = track.children.length;
      const newIndex = Math.max(0, Math.min(index, slides - slidesToShow));
      const offset = -newIndex * (100 / slidesToShow);
      track.style.transform = `translateX(${offset}%)`;
      currentIndex = newIndex;
      updateDots();
    }

    function updateDots() {
      const dots = nav.querySelectorAll('.carousel-dot');
      dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
    }

    function createDots() {
      const total = Math.ceil(track.children.length / slidesToShow);
      for (let i = 0; i < total; i++) {
        const dot = document.createElement('button');
        dot.classList.add('carousel-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        nav.appendChild(dot);
      }
    }

    carousel.querySelector('.left')?.addEventListener('click', () => goToSlide(currentIndex - 1));
    carousel.querySelector('.right')?.addEventListener('click', () => goToSlide(currentIndex + 1));

    createDots();
  }

  initCarousel('carousel-reco', 'carousel-nav-reco', 3);
  initCarousel('carousel-best', 'carousel-nav-best', 3);
});
