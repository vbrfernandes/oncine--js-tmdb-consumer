const BASE_URL = "https://api.themoviedb.org/3";
const API_URL = `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=pt-BR&page=1`;
const SEARCH_API = `${BASE_URL}/search/movie?api_key=${API_KEY}&language=pt-BR&query=`;
const GENRE_API = `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=pt-BR`;
const IMG_PATH = "https://image.tmdb.org/t/p/w500";
const IMAGE_URL = "https://image.tmdb.org/t/p/w300";

// --- VARIÁVEIS DE CONTROLE ---
let currentGenreId = null;
let currentPage = 1;
let totalPages = 100; // Será atualizado pela API
let lastUrl = ""; // Guarda a URL base atual para a paginação

const main = document.getElementById("main");
const searchInput = document.getElementById("search");
const searchBtn = document.querySelector(".search-btn");
const genreSelect = document.getElementById("genreSelect");

// --- ELEMENTOS DO MODAL ---
const modal = document.getElementById("movieModal");
const closeModalBtn = document.getElementById("closeModal");

// Elementos internos do modal
const modalTitle = document.getElementById("modalTitle");
const modalPoster = document.getElementById("modalPoster");
const modalHeaderImg = document.querySelector(".modal-header-img");
const modalRating = document.getElementById("modalRating");
const modalDate = document.getElementById("modalDate");
const modalLang = document.getElementById("modalLang");
const modalOverview = document.getElementById("modalOverview");
const modalGenre = document.getElementById("modalGenre");

// Elementos de UI/UX
const cineNeon = document.querySelector(".blue-part");
const shuffleBtn = document.getElementById("shuffleBtn");
const actionsContainer = document.getElementById("quickActions");

// Mapa de Gêneros (ID -> Nome)
let genreMap = {};

// --- FUNÇÃO INICIALIZADORA ---
async function init() {
  await fetchGenres();
  getMovies(API_URL);
}

// --- BUSCAR LISTA DE GÊNEROS ---
async function fetchGenres() {
  try {
    const res = await fetch(GENRE_API);
    const data = await res.json();

    // Limpa opções antigas
    genreSelect.innerHTML = '<option value="" disabled selected>Gênero</option>';

    data.genres.forEach((genre) => {
      // Popula o mapa e o dropdown
      genreMap[genre.id] = genre.name;

      const option = document.createElement("option");
      option.value = genre.id;
      option.innerText = genre.name;
      genreSelect.appendChild(option);
    });

    renderQuickButtons(data.genres);
  } catch (error) {
    console.error("Erro ao buscar gêneros:", error);
  }
}

// --- BUSCAR FILMES (PRINCIPAL) ---
async function getMovies(url, embaralhar = false) {
  lastUrl = url;
  document.getElementById("loading").style.display = "flex";
  main.innerHTML = "";

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.results.length !== 0) {
      let listaFilmes = data.results;

      if (embaralhar) {
        listaFilmes = shuffleArray(listaFilmes);
      }

      showMovies(listaFilmes);

      // Atualiza paginação
      currentPage = data.page;
      totalPages = data.total_pages;
      if (totalPages > 500) totalPages = 500; // Limite da API

      renderPagination();
    } else {
      main.innerHTML = `<h1 class="no-results">Nenhum resultado encontrado</h1>`;
      document.getElementById("pagination").innerHTML = "";
    }
  } catch (error) {
    console.error("Erro ao buscar filmes:", error);
  } finally {
    document.getElementById("loading").style.display = "none";
  }
}

// --- FUNÇÃO SHOW MOVIES (RENDERIZA OS CARDS) ---
function showMovies(movies) {
  main.innerHTML = "";

  movies.forEach((movie) => {
    const { title, poster_path, vote_average, release_date, genre_ids, original_language } = movie;

    const year = release_date ? release_date.split("-")[0] : "N/A";
    const genreName = genre_ids.length > 0 && genreMap[genre_ids[0]] ? genreMap[genre_ids[0]] : "Filme";
    const lang = original_language ? original_language.toUpperCase() : "?";

    const movieEl = document.createElement("div");
    movieEl.classList.add("movie-card");

    movieEl.innerHTML = `
            <div class="poster-container">
                <img src="${poster_path ? IMG_PATH + poster_path : "https://placehold.co/500x750/1e293b/FFF?text=Sem+Imagem"}" alt="${title}">
                <div class="rating-badge ${getClassByRate(vote_average)}">
                    <span class="material-icons-round star-icon">star</span> ${vote_average.toFixed(1)}
                </div>
            </div>
            <div class="movie-info">
                <h3>${title}</h3>
                <div class="meta">
                    <span>${year} • ${genreName}</span>
                    <span class="badge-lang">${lang}</span>
                </div>
            </div>
        `;

    movieEl.addEventListener("click", () => {
      openModal(movie);
    });

    main.appendChild(movieEl);
  });
}

// --- FUNÇÃO PARA ABRIR E PREENCHER O MODAL ---
function openModal(movie) {
  modalTitle.innerText = movie.title;
  modalOverview.innerText = movie.overview || "Sinopse não disponível.";
  modalRating.innerText = `⭐ ${movie.vote_average.toFixed(1)}`;
  modalDate.innerText = movie.release_date ? movie.release_date.split("-")[0] : "N/A";
  modalLang.innerText = movie.original_language.toUpperCase();

  const genreNames = movie.genre_ids.map((id) => genreMap[id]).filter(Boolean).join(", ");
  modalGenre.innerText = genreNames || "Filme";

  const posterSrc = movie.poster_path ? IMG_PATH + movie.poster_path : "https://placehold.co/500x750";
  modalPoster.src = posterSrc;

  const backdropPath = movie.backdrop_path ? IMG_PATH + movie.backdrop_path : posterSrc;
  modalHeaderImg.style.backgroundImage = `url('${backdropPath}')`;

  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

// Lógica de Cores da Nota
function getClassByRate(vote) {
  if (vote >= 8) return "green-badge";
  else if (vote >= 5) return "";
  else return "red-badge";
}

// Função que causa o efeito "Curto-Circuito" no Logo
function triggerFlicker() {
  const flickerCount = Math.floor(Math.random() * 4) + 1;
  let count = 0;

  const flickerInterval = setInterval(() => {
    cineNeon.classList.toggle("neon-off");
    count++;

    if (count >= flickerCount * 2) {
      clearInterval(flickerInterval);
      cineNeon.classList.remove("neon-off");
      
      // Agenda o próximo pisco
      const nextGlitchTime = Math.random() * 5000 + 200;
      setTimeout(triggerFlicker, nextGlitchTime);
    }
  }, 50);
}

// Função Auxiliar para Embaralhar Arrays
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// --- CARROSSEL INFINITO ---
async function loadInfiniteCarousel() {
  const track = document.getElementById("carouselTrack");

  try {
    const [res1, res2] = await Promise.all([
      fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=pt-BR&page=1`),
      fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=pt-BR&page=2`),
    ]);

    const data1 = await res1.json();
    const data2 = await res2.json();

    let movies = [...data1.results, ...data2.results];
    movies = shuffleArray(movies);

    track.innerHTML = "";

    const createAndAppendCard = (movie) => {
      const card = document.createElement("div");
      card.classList.add("carousel-card");
      card.title = movie.title;

      card.innerHTML = `<img src="${IMAGE_URL}${movie.poster_path}" alt="${movie.title}" loading="lazy">`;

      card.addEventListener("click", () => {
        openModal(movie);
      });

      track.appendChild(card);
    };

    // Renderiza duas vezes para o loop infinito
    movies.forEach((movie) => createAndAppendCard(movie));
    movies.forEach((movie) => createAndAppendCard(movie));
  } catch (error) {
    console.error("Erro ao carregar carrossel:", error);
  }
}

// --- BOTÕES RÁPIDOS DE GÊNERO ---
function renderQuickButtons(genres) {
  const wrapper = document.createElement("div");
  wrapper.classList.add("genre-carousel-wrapper");

  const track = document.createElement("div");
  track.classList.add("genre-track");

  genres.forEach((genre) => {
    const btn = document.createElement("button");
    btn.classList.add("genre-quick-btn");
    btn.innerText = genre.name;

    btn.addEventListener("click", () => {
      if (currentGenreId === genre.id) {
        // Se clicar no mesmo, busca aleatório
        const paginaAleatoria = Math.floor(Math.random() * 50) + 1;
        getMovies(`${BASE_URL}/discover/movie?api_key=${API_KEY}&language=pt-BR&with_genres=${genre.id}&page=${paginaAleatoria}`, true);
      } else {
        currentGenreId = genre.id;
        currentPage = 1;
        genreSelect.value = genre.id;
        getMovies(`${BASE_URL}/discover/movie?api_key=${API_KEY}&language=pt-BR&with_genres=${genre.id}&page=${currentPage}`);
      }
    });

    track.appendChild(btn);
  });

  wrapper.appendChild(track);
  actionsContainer.innerHTML = "";
  actionsContainer.appendChild(shuffleBtn);
  actionsContainer.appendChild(wrapper);

  // --- LÓGICA DE SCROLL COM O MOUSE ---
  let scrollAmount = 0;
  let scrollSpeed = 0;
  let isHovering = false;
  let animationFrameId;
  const sensitivity = 0.15;
  const maxSpeed = 8;

  wrapper.addEventListener("mousemove", (e) => {
    const rect = wrapper.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const width = rect.width;

    if (mouseX < width * sensitivity) {
      const intensity = 1 - mouseX / (width * sensitivity);
      scrollSpeed = maxSpeed * intensity;
    } else if (mouseX > width * (1 - sensitivity)) {
      const distFromRight = width - mouseX;
      const intensity = 1 - distFromRight / (width * sensitivity);
      scrollSpeed = -maxSpeed * intensity;
    } else {
      scrollSpeed = 0;
    }

    if (!isHovering) {
      isHovering = true;
      animateScroll();
    }
  });

  wrapper.addEventListener("mouseleave", () => {
    isHovering = false;
    scrollSpeed = 0;
    cancelAnimationFrame(animationFrameId);
  });

  function animateScroll() {
    if (!isHovering) return;
    const maxScrollLeft = 0;
    const maxScrollRight = -(track.offsetWidth - wrapper.offsetWidth);

    scrollAmount += scrollSpeed;
    if (scrollAmount > maxScrollLeft) scrollAmount = maxScrollLeft;
    if (scrollAmount < maxScrollRight) scrollAmount = maxScrollRight;

    track.style.transform = `translateX(${scrollAmount}px)`;
    animationFrameId = requestAnimationFrame(animateScroll);
  }
}

// --- PAGINAÇÃO ---
function renderPagination() {
  const paginationEl = document.getElementById("pagination");
  paginationEl.innerHTML = "";

  if (totalPages <= 1) return;

  // Botão Anterior
  const prevBtn = document.createElement("button");
  prevBtn.classList.add("page-btn", "nav-special");
  prevBtn.innerHTML = '<span class="material-icons-round">chevron_left</span>';
  if (currentPage === 1) prevBtn.classList.add("disabled");

  prevBtn.addEventListener("click", () => {
    if (currentPage > 1) pageCall(currentPage - 1);
  });
  paginationEl.appendChild(prevBtn);

  // Lógica dos Números (Range)
  const range = 2;

  if (currentPage > range + 1) {
    let btn = createPageButton(1);
    paginationEl.appendChild(btn);

    if (currentPage > range + 2) {
      const dots = document.createElement("span");
      dots.style.color = "var(--text-gray)";
      dots.innerText = "...";
      paginationEl.appendChild(dots);
    }
  }

  for (let i = Math.max(1, currentPage - range); i <= Math.min(totalPages, currentPage + range); i++) {
    if (i === 1 && currentPage > range + 1) continue;
    if (i === totalPages && currentPage < totalPages - range) continue;

    let btn = createPageButton(i);
    paginationEl.appendChild(btn);
  }

  if (currentPage < totalPages - range) {
    if (currentPage < totalPages - range - 1) {
      const dots = document.createElement("span");
      dots.style.color = "var(--text-gray)";
      dots.innerText = "...";
      paginationEl.appendChild(dots);
    }
    let btn = createPageButton(totalPages);
    paginationEl.appendChild(btn);
  }

  // Botão Próximo
  const nextBtn = document.createElement("button");
  nextBtn.classList.add("page-btn", "nav-special");
  nextBtn.innerHTML = '<span class="material-icons-round">chevron_right</span>';
  if (currentPage === totalPages) nextBtn.classList.add("disabled");

  nextBtn.addEventListener("click", () => {
    if (currentPage < totalPages) pageCall(currentPage + 1);
  });
  paginationEl.appendChild(nextBtn);
}

// Função Auxiliar para criar o botão numérico
function createPageButton(page) {
  const btn = document.createElement("button");
  btn.classList.add("page-btn");
  if (page === currentPage) btn.classList.add("active");
  btn.innerText = page;

  btn.addEventListener("click", () => {
    pageCall(page);
  });
  return btn;
}

// Função que processa a nova chamada de página
function pageCall(page) {
  let urlSplit = lastUrl.split("?");
  let queryParams = urlSplit[1].split("&");
  let newParams = queryParams.filter((param) => !param.startsWith("page="));
  newParams.push("page=" + page);
  let newUrl = urlSplit[0] + "?" + newParams.join("&");

  getMovies(newUrl);

  // Rolagem suave com ajuste de altura
  const targetSection = document.getElementById("main");
  const headerOffset = 150;
  const elementPosition = targetSection.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

  window.scrollTo({
    top: offsetPosition,
    behavior: "smooth",
  });
}

// --- ESCUTADORES DE EVENTOS (DOM READY) ---
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(triggerFlicker, 2000);
  loadInfiniteCarousel();
  init();

  // Fechar Modal
  closeModalBtn.addEventListener("click", () => {
    modal.classList.remove("active");
    document.body.style.overflow = "auto";
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("active");
      document.body.style.overflow = "auto";
    }
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      modal.classList.remove("active");
      document.body.style.overflow = "auto";
    }
  });

  // --- LÓGICA DE BUSCA EM TEMPO REAL (DEBOUNCE) ---
  let debounceTimeout = null;

  searchInput.addEventListener("input", (e) => {
    const searchTerm = e.target.value.trim();
    const carousel = document.querySelector(".infinite-carousel-wrapper");

    currentGenreId = null;
    currentPage = 1;

    if (searchTerm.length > 0) {
      carousel.style.display = "none";
    } else {
      carousel.style.display = "block";
      getMovies(API_URL);
      return;
    }

    clearTimeout(debounceTimeout);

    debounceTimeout = setTimeout(() => {
      getMovies(SEARCH_API + searchTerm);
    }, 500);
  });

  // Filtro por Select
  genreSelect.addEventListener("change", () => {
    const genreId = genreSelect.value;
    if (genreId) {
      getMovies(`${BASE_URL}/discover/movie?api_key=${API_KEY}&language=pt-BR&with_genres=${genreId}`);
    } else {
      getMovies(API_URL);
    }
  });

  // Botão Aleatório
  shuffleBtn.addEventListener("click", () => {
    const randomPage = Math.floor(Math.random() * 500) + 1;
    const icon = shuffleBtn.querySelector(".material-icons-round");
    icon.style.transform = "rotate(360deg)";

    const separator = API_URL.includes("?") ? "&" : "?";
    const randomUrl = `${API_URL}${separator}page=${randomPage}`;

    currentGenreId = null;
    currentPage = 1;
    getMovies(randomUrl);

    setTimeout(() => {
      icon.style.transform = "rotate(0deg)";
    }, 500);
  });
});