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
async function loadBooks(query = "bestsellers") {
    try {
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=12`);
        const data = await response.json();

        const bookGrid = document.querySelector(".collection .book-grid");
        bookGrid.innerHTML = ""; // vide les anciens livres

        data.items.forEach(book => {
            const info = book.volumeInfo;
            const price = book.saleInfo?.listPrice?.amount 
                          ? `${book.saleInfo.listPrice.amount} €` 
                          : "Non disponible";

            const card = document.createElement("div");
            card.className = "book-card";
            card.innerHTML = `
                <img src="${info.imageLinks?.thumbnail || 'assets/images/no-cover.png'}" alt="${info.title}">
                <div class="info">
                    <span class="genre">${info.categories ? info.categories[0] : "Inconnu"}</span>
                    <h4>${info.title}</h4>
                    <span class="author">${info.authors ? info.authors.join(", ") : "Auteur inconnu"}</span>
                    <div class="rating">⭐⭐⭐⭐☆</div>
                    <div class="price">${price}</div>
                    <button>Acheter</button>
                </div>
            `;
            bookGrid.appendChild(card);
        });
    } catch (err) {
        console.error("Erreur de chargement des livres :", err);
    }
}

// Charger des livres par défaut au démarrage
document.addEventListener("DOMContentLoaded", () => loadBooks("roman"));

// Utiliser la barre de recherche
document.querySelector(".search-bar").addEventListener("submit", e => {
    e.preventDefault();
    const query = e.target.querySelector("input").value;
    if (query.trim()) loadBooks(query);
});

 // Coup de coeur : incrémente le compteur quand on clique sur un coeur de card
        document.querySelectorAll('.book-card .badge.heart, .book-card .heart-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                let favCount = document.getElementById('fav-count');
                let count = parseInt(favCount.textContent) || 0;
                favCount.textContent = count + 1;
                favCount.style.display = 'inline-block';
            });
        });

        // Panier : incrémente le compteur quand on clique sur un bouton "Acheter"
        document.querySelectorAll('.book-card button, .add-to-cart').forEach(btn => {
            btn.addEventListener('click', function () {
                let cartCount = document.getElementById('cart-count');
                let count = parseInt(cartCount.textContent) || 0;
                cartCount.textContent = count + 1;
                cartCount.style.display = 'inline-block';
            });
        });

        // Affichage menu profil utilisateur
        const userProfile = document.getElementById('user-profile');
        const profileMenu = document.getElementById('profile-menu');
        userProfile.addEventListener('click', function (e) {
            e.stopPropagation();
            profileMenu.style.display = profileMenu.style.display === 'block' ? 'none' : 'block';
        });
        document.addEventListener('click', function () {
            profileMenu.style.display = 'none';
        });

        // Dropdown Catégories
        const catLink = document.getElementById('categories-link');
        const catDropdown = document.getElementById('categories-dropdown');
        catLink.addEventListener('mouseover', () => catDropdown.style.display = 'block');
        catLink.addEventListener('focus', () => catDropdown.style.display = 'block');
        catLink.addEventListener('mouseout', () => setTimeout(() => catDropdown.style.display = 'none', 200));
        catDropdown.addEventListener('mouseover', () => catDropdown.style.display = 'block');
        catDropdown.addEventListener('mouseout', () => catDropdown.style.display = 'none');

        // Pour la section Nouveautés et Best-sellers sur index.html
        document.addEventListener('DOMContentLoaded', function () {
            // Sélectionne tous les livres avec le badge nouveauté ou best-seller
            const nouveautes = Array.from(document.querySelectorAll('.book-card .badge.nouveau')).map(card => card.closest('.book-card'));
            const bestsellers = Array.from(document.querySelectorAll('.book-card .badge.best-seller')).map(card => card.closest('.book-card'));

            // Ajoute la section Nouveautés si besoin
            if (nouveautes.length > 0) {
                let nouveauteSection = document.createElement('section');
                nouveauteSection.className = 'nouveautes';
                nouveauteSection.innerHTML = `<h3>Nouveautés</h3><div class="book-list"></div>`;
                nouveautes.forEach(card => nouveauteSection.querySelector('.book-list').appendChild(card.cloneNode(true)));
                document.body.insertBefore(nouveauteSection, document.querySelector('.collection'));
            }

            // Ajoute la section Best-sellers si besoin
            if (bestsellers.length > 0) {
                let bestsellerSection = document.createElement('section');
                bestsellerSection.className = 'bestsellers';
                bestsellerSection.innerHTML = `<h3>Best-sellers</h3><div class="book-list"></div>`;
                bestsellers.forEach(card => bestsellerSection.querySelector('.book-list').appendChild(card.cloneNode(true)));
                document.body.insertBefore(bestsellerSection, document.querySelector('.collection'));
            }
        });

        // Carousel Recommandations
        const carouselReco = document.getElementById('carousel-reco');
        const carouselTrackReco = carouselReco.querySelector('.carousel-track');
        const carouselNavReco = document.getElementById('carousel-nav-reco');
        const slidesToShow = 3;
        let currentIndex = 0;

        // Crée les points de navigation pour le carousel
        function createNavDots() {
            const dotCount = Math.ceil(carouselTrackReco.children.length / slidesToShow);
            for (let i = 0; i < dotCount; i++) {
                const dot = document.createElement('button');
                dot.classList.add('carousel-dot');
                if (i === currentIndex) dot.classList.add('active');
                dot.addEventListener('click', () => goToSlide(i));
                carouselNavReco.appendChild(dot);
            }
        }

        // Va à la diapositive spécifiée
        function goToSlide(index) {
            const slides = carouselTrackReco.children;
            const totalSlides = slides.length;
            const newIndex = (index + totalSlides) % totalSlides;
            const offset = -newIndex * (100 / slidesToShow);
            carouselTrackReco.style.transform = `translateX(${offset}%)`;
            currentIndex = newIndex;
            updateNavDots();
        }

        // Met à jour les points de navigation actifs
        function updateNavDots() {
            const dots = carouselNavReco.querySelectorAll('.carousel-dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }

        // Gestion des flèches du carousel
        let isDragging = false;
        let startX = 0;
        let currentTranslate = 0;
        let prevTranslate = 0;

        const handleDragStart = (index) => (event) => {
            isDragging = true;
            startX = event.clientX;
        };

        const handleDragMove = (event) => {
            if (!isDragging) return;
            const diffX = event.clientX - startX;
            currentTranslate = prevTranslate + diffX / (carouselReco.offsetWidth / slidesToShow);
            carouselTrackReco.style.transform = `translateX(${currentTranslate}%)`;
        };

        const handleDragEnd = () => {
            isDragging = false;
            const movedBy = Math.round(currentTranslate - prevTranslate);
            if (movedBy < -1) {
                goToSlide(currentIndex + 1);
            } else if (movedBy > 1) {
                goToSlide(currentIndex - 1);
            } else {
                goToSlide(currentIndex);
            }
            prevTranslate = currentTranslate;
        };

        carouselTrackReco.addEventListener('mousedown', handleDragStart(currentIndex));
        carouselTrackReco.addEventListener('mousemove', handleDragMove);
        carouselTrackReco.addEventListener('mouseup', handleDragEnd);
        carouselTrackReco.addEventListener('mouseleave', handleDragEnd);

        createNavDots();


        // Configuration
const items = ['🍁', '🍂', '📖']; // Feuilles et livres
const totalItems = 30; // Nombre d'éléments qui tombent

for (let i = 0; i < totalItems; i++) {
    const el = document.createElement('div');
    el.className = 'falling-item';
    el.textContent = items[Math.floor(Math.random() * items.length)];
    
    // Position initiale et taille
    el.style.left = Math.random() * window.innerWidth + 'px';
    el.style.fontSize = (16 + Math.random() * 24) + 'px';
    
    // Durée et délai aléatoire
    const duration = 5 + Math.random() * 10; // 5 à 15s
    const delay = Math.random() * 5; // 0 à 5s
    el.style.animationDuration = duration + 's';
    el.style.animationDelay = delay + 's';
    
    document.body.appendChild(el);
    
    // Refaire tomber l'élément à la fin de l'animation
    el.addEventListener('animationend', () => {
        el.style.left = Math.random() * window.innerWidth + 'px';
        el.style.animationDuration = (5 + Math.random() * 10) + 's';
        el.style.animationDelay = '0s';
        el.style.top = '-50px';
        el.style.opacity = 1;
        el.style.transform = 'rotate(0deg)';
        el.style.animationName = 'none';
        requestAnimationFrame(() => {
            el.style.animationName = 'fall';
        });
    });
}
