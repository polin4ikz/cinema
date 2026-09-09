/* =========================================================
   AFTER DARK — CINEMA ARCHIVE
   COMPLETE JAVASCRIPT
========================================================= */
/* =========================================================
   TMDB
========================================================= */
const TMDB_API_KEY =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMTZiYTQ0NDRjYWQ4ODdjZGY0ZDE1Yjk3MGZlNjlhYSIsIm5iZiI6MTc4NjY1NjM4NS43MDcsInN1YiI6IjZhN2UzNjgxMDYxNjdmYTY2ZmM3YWI2MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.WLWycZ1zW98G_x0bs90UHsFljmrwpPKoPvZBrP9ho2o";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_URL = "https://image.tmdb.org/t/p/w780";
const TMDB_BACKDROP_URL = "https://image.tmdb.org/t/p/w1280";
/* =========================================================
   STORAGE
========================================================= */
const ARCHIVE_STORAGE_KEY = "afterDarkArchive";
const USER_STORAGE_KEY = "afterDarkUser";
/* =========================================================
   DOM
========================================================= */
const body = document.body;
const indexPanel = document.querySelector(".index-panel");
const indexTrigger = document.querySelector(".index-trigger");
const indexClose = document.querySelector(".index-close");
const cursor = document.querySelector(".cursor");
const archiveTrack = document.getElementById("archiveTrack");
const archiveTrackWrap = document.querySelector(".archive-track-wrap");
const visibleCount = document.getElementById("visibleCount");
const totalCount = document.getElementById("totalCount");
const archiveCount = document.getElementById("archiveCount");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const searchResults = document.getElementById("searchResults");
const ratingsList = document.getElementById("ratingsList");
const filmModal = document.getElementById("filmModal");
const modalLoader = document.getElementById("modalLoader");
const modalResult = document.getElementById("modalResult");
const modalTitle = document.getElementById("modalTitle");
const modalYear = document.getElementById("modalYear");
const modalDirector = document.getElementById("modalDirector");
const modalDescription = document.getElementById("modalDescription");
const modalClose = document.getElementById("modalClose");
const decideButton = document.getElementById("decideButton");
const movieNightModal = document.getElementById("movieNightModal");
const movieNightModalBackdrop = document.getElementById(
  "movieNightModalBackdrop",
);
const movieNightModalClose = document.getElementById("movieNightModalClose");
const movieNightReveal = document.getElementById("movieNightReveal");
const movieNightRevealTrack = document.getElementById("movieNightRevealTrack");
const movieNightFinal = document.getElementById("movieNightFinal");
const movieNightPoster = document.getElementById("movieNightPoster");
const movieNightPosterIndex = document.getElementById("movieNightPosterIndex");
const movieNightType = document.getElementById("movieNightType");
const movieNightYear = document.getElementById("movieNightYear");
const movieNightRating = document.getElementById("movieNightRating");
const movieNightTitle = document.getElementById("movieNightTitle");
const movieNightSubmeta = document.getElementById("movieNightSubmeta");
const movieNightOverview = document.getElementById("movieNightOverview");
const movieNightArchiveStatus = document.getElementById(
  "movieNightArchiveStatus",
);
const movieNightOpen = document.getElementById("movieNightOpen");
const movieNightAdd = document.getElementById("movieNightAdd");
const movieNightCountrySelect = document.getElementById("movieNightCountry");
const excludeArchiveControl = document.getElementById("excludeArchive");
const authModal = document.getElementById("authModal");
const authButton = document.getElementById("authButton");
const authClose = document.getElementById("authClose");
const authForm = document.getElementById("authForm");
const authName = document.getElementById("authName");
/* =========================================================
   STATE
========================================================= */
let films = loadArchive();
let currentArchiveType = "all";
let selectedMovieType = "all";
let selectedMovieGenre = "any";
let selectedMovieYear = "any";
let selectedMovieCountry = "any";
let selectedMovieRating = 0;
let excludeArchive = false;
let currentMovieNightFilm = null;
let ratingFilter = "all";
let ratingSort = "high";
let searchTimer = null;
let searchController = null;
let movieNightController = null;
let movieNightBusy = false;
let archiveCurrentIndex = 0;
let archiveScrollFrame = null;
let archiveSnapTimer = null;
let resizeTimer = null;
/*
   IMPORTANT:
   Drag state is completely separated from click state.
   This prevents archive buttons from becoming unclickable.
*/
const archiveDragState = {
  active: false,
  moved: false,
  startX: 0,
  startScrollLeft: 0,
  pointerId: null,
};
/* =========================================================
   SAMPLE RATINGS
========================================================= */
let ratings = [
  {
    id: 1,
    title: "THE GODFATHER",
    type: "film",
    year: 1972,
    polina: 9.5,
    nastya: 9.2,
    date: "2026-08-12",
  },
  {
    id: 2,
    title: "BLACK SWAN",
    type: "film",
    year: 2010,
    polina: 9.1,
    nastya: 9.4,
    date: "2026-08-09",
  },
  {
    id: 3,
    title: "DARK",
    type: "series",
    year: 2017,
    polina: 9.4,
    nastya: 8.9,
    date: "2026-08-04",
  },
  {
    id: 4,
    title: "PERFECT BLUE",
    type: "animation",
    year: 1997,
    polina: 9.6,
    nastya: 9.3,
    date: "2026-07-28",
  },
  {
    id: 5,
    title: "HER",
    type: "film",
    year: 2013,
    polina: 8.9,
    nastya: 9.0,
    date: "2026-07-21",
  },
];
/* =========================================================
   TMDB GENRES
========================================================= */
const TMDB_GENRES = {
  28: "ACTION",
  12: "ADVENTURE",
  16: "ANIMATION",
  35: "COMEDY",
  80: "CRIME",
  99: "DOCUMENTARY",
  18: "DRAMA",
  10751: "FAMILY",
  14: "FANTASY",
  36: "HISTORY",
  27: "HORROR",
  10402: "MUSIC",
  9648: "MYSTERY",
  10749: "ROMANCE",
  878: "SCI-FI",
  10770: "TV MOVIE",
  53: "THRILLER",
  10752: "WAR",
  37: "WESTERN",
  10759: "ACTION & ADVENTURE",
  10762: "KIDS",
  10763: "NEWS",
  10764: "REALITY",
  10765: "SCI-FI & FANTASY",
  10766: "SOAP",
  10767: "TALK",
  10768: "WAR & POLITICS",
};
/* =========================================================
   COUNTRIES
========================================================= */
const MOVIE_NIGHT_COUNTRIES = {
  US: "USA",
  GB: "UK",
  FR: "FRANCE",
  DE: "GERMANY",
  IT: "ITALY",
  ES: "SPAIN",
  JP: "JAPAN",
  KR: "SOUTH KOREA",
  CN: "CHINA",
  HK: "HONG KONG",
  TW: "TAIWAN",
  IN: "INDIA",
  CA: "CANADA",
  AU: "AUSTRALIA",
  NZ: "NEW ZEALAND",
  RU: "RUSSIA",
  SE: "SWEDEN",
  NO: "NORWAY",
  DK: "DENMARK",
  FI: "FINLAND",
  NL: "NETHERLANDS",
  BE: "BELGIUM",
  AT: "AUSTRIA",
  CH: "SWITZERLAND",
  PL: "POLAND",
  CZ: "CZECH REPUBLIC",
  BR: "BRAZIL",
  MX: "MEXICO",
  AR: "ARGENTINA",
  IE: "IRELAND",
  TR: "TURKEY",
  TH: "THAILAND",
  ID: "INDONESIA",
  IR: "IRAN",
  IL: "ISRAEL",
};
/* =========================================================
   STORAGE
========================================================= */
function loadArchive() {
  try {
    const saved = localStorage.getItem(ARCHIVE_STORAGE_KEY);
    if (!saved) {
      return [];
    }
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Archive loading error:", error);
    return [];
  }
}
function saveArchive() {
  try {
    localStorage.setItem(ARCHIVE_STORAGE_KEY, JSON.stringify(films));
  } catch (error) {
    console.error("Archive saving error:", error);
  }
}
/* =========================================================
   HELPERS
========================================================= */
function escapeHTML(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
function padNumber(number) {
  return String(number).padStart(2, "0");
}
function getYear(dateString) {
  return dateString ? String(dateString).slice(0, 4) : "—";
}
function getArchiveStyle(index) {
  const styles = ["wash", "bordeaux", "flash", "darkroom", "paper"];
  return styles[index % styles.length];
}
function getArchiveTypeLabel(type) {
  const labels = {
    film: "ФИЛЬМ",
    series: "СЕРИАЛ",
    animation: "АНИМАЦИЯ",
  };
  return labels[type] || "КИНО";
}
function detectType(data) {
  const genreIds = Array.isArray(data.genre_ids)
    ? data.genre_ids.map(Number)
    : (data.genres || []).map((genre) => Number(genre.id)).filter(Boolean);
  if (genreIds.includes(16)) {
    return "animation";
  }
  if (data.media_type === "tv" || data.first_air_date) {
    return "series";
  }
  return "film";
}
function getVisibleArchiveFilms() {
  if (currentArchiveType === "all") {
    return films;
  }
  return films.filter((film) => film.type === currentArchiveType);
}
function getFilmGenreIds(film) {
  if (Array.isArray(film.genreIds)) {
    return film.genreIds.map(Number);
  }
  if (Array.isArray(film.genre_ids)) {
    return film.genre_ids.map(Number);
  }
  if (Array.isArray(film.genres)) {
    return film.genres
      .map((genre) => {
        if (typeof genre === "object") {
          return Number(genre.id);
        }
        return null;
      })
      .filter(Boolean);
  }
  return [];
}
function getFilmGenreLabel(film) {
  const ids = getFilmGenreIds(film);
  if (!ids.length) {
    return "—";
  }
  return (
    ids
      .map((id) => TMDB_GENRES[id])
      .filter(Boolean)
      .slice(0, 3)
      .join(" / ") || "—"
  );
}
function getFilmCountry(film) {
  if (film.countryName) {
    return film.countryName;
  }
  if (Array.isArray(film.originCountries)) {
    return film.originCountries
      .map((country) => MOVIE_NIGHT_COUNTRIES[country] || country)
      .join(" / ");
  }
  if (film.country) {
    return film.country;
  }
  return "—";
}
function filmIsInArchive(tmdbId) {
  return films.some((film) => Number(film.tmdbId) === Number(tmdbId));
}
// =========================
// CUSTOM CURSOR
// =========================
function initCustomCursor() {
  const cursor = document.querySelector(".cursor");
  if (!cursor) return;
  cursor.style.pointerEvents = "none";
  cursor.setAttribute("aria-hidden", "true");
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;
  const interactiveSelector = [
    "button",
    "a",
    "input",
    "select",
    "textarea",
    "[role='button']",
    "[data-action]",
    ".archive-card",
    ".search-result",
    ".filter",
    ".movie-night-card",
    ".rating-card",
  ].join(",");
  function moveCursor(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
    cursor.classList.remove("is-hidden");
  }
  function checkHover() {
    const element = document.elementFromPoint(mouseX, mouseY);
    if (!element) {
      cursor.classList.remove("is-hover");
      return;
    }
    const interactive = element.closest(interactiveSelector);
    if (interactive) {
      cursor.classList.add("is-hover");
    } else {
      cursor.classList.remove("is-hover");
    }
  }
  function handlePointerLeave() {
    cursor.classList.add("is-hidden");
    cursor.classList.remove("is-hover");
  }
  function handlePointerEnter(event) {
    cursor.classList.remove("is-hidden");
    mouseX = event.clientX;
    mouseY = event.clientY;
    cursorX = mouseX;
    cursorY = mouseY;
  }
  document.addEventListener("pointermove", moveCursor, {
    passive: true,
  });
  document.addEventListener("pointerleave", handlePointerLeave);
  document.addEventListener("pointerenter", handlePointerEnter);
  function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.18;
    cursorY += (mouseY - cursorY) * 0.18;
    cursor.style.setProperty("--cursor-x", `${cursorX}px`);
    cursor.style.setProperty("--cursor-y", `${cursorY}px`);
    checkHover();
    requestAnimationFrame(animateCursor);
  }
  animateCursor();
}
/* =========================================================
   INDEX
========================================================= */
function openIndex() {
  if (!indexPanel) {
    return;
  }
  indexPanel.classList.add("active");
  body.classList.add("index-open");
}
function closeIndex() {
  if (!indexPanel) {
    return;
  }
  indexPanel.classList.remove("active");
  body.classList.remove("index-open");
}
indexTrigger?.addEventListener("click", openIndex);
indexClose?.addEventListener("click", closeIndex);
document.querySelectorAll(".index-nav a").forEach((link) => {
  link.addEventListener("click", closeIndex);
});
/* =========================================================
   ARCHIVE CAROUSEL UI
========================================================= */
function createArchiveControls() {
  if (!archiveTrackWrap) {
    return;
  }
  if (archiveTrackWrap.querySelector(".archive-carousel-ui")) {
    return;
  }
  const ui = document.createElement("div");
  ui.className = "archive-carousel-ui";
  ui.innerHTML = `
    <div class="archive-carousel-buttons">
      <button
        class="archive-carousel-button"
        type="button"
        data-carousel="prev"
        aria-label="Previous films"
      >
        ←
      </button>
      <button
        class="archive-carousel-button"
        type="button"
        data-carousel="next"
        aria-label="Next films"
      >
        →
      </button>
    </div>
    <div class="archive-carousel-progress">
      <span class="archive-carousel-progress-bar"></span>
    </div>
    <div class="archive-carousel-position">
      <span class="archive-position-current">
        01
      </span>
      /
      <span class="archive-position-total">
        01
      </span>
    </div>
  `;
  archiveTrackWrap.appendChild(ui);
  ui.addEventListener("click", (event) => {
    const button = event.target.closest(".archive-carousel-button");
    if (!button) {
      return;
    }
    scrollArchive(button.dataset.carousel === "next" ? 1 : -1);
  });
}
/* =========================================================
   ARCHIVE COUNTERS
========================================================= */
function updateArchiveCounter() {
  const visibleFilms = getVisibleArchiveFilms();
  const visible = visibleFilms.length;
  const total = films.length;
  if (visibleCount) {
    visibleCount.textContent = padNumber(visible);
  }
  if (totalCount) {
    totalCount.textContent = padNumber(total);
  }
  if (archiveCount) {
    archiveCount.textContent = total;
  }
}
/* =========================================================
   RENDER ARCHIVE
========================================================= */
function renderArchive() {
  if (!archiveTrack) {
    return;
  }
  const visibleFilms = getVisibleArchiveFilms();
  archiveTrack.innerHTML = "";
  archiveCurrentIndex = 0;
  if (!visibleFilms.length) {
    archiveTrack.innerHTML = `
      <div class="archive-empty">
        <span class="archive-empty-number">
          00 / EMPTY
        </span>
        <h3 class="archive-empty-title">
          NOTHING<br>
          <em>HERE.</em>
        </h3>
        <span class="archive-empty-meta">
          SEARCH SOMETHING TO ADD TO THE COLLECTION.
        </span>
      </div>
    `;
    updateArchiveCounter();
    updateArchiveNavigation();
    return;
  }
  visibleFilms.forEach((film, index) => {
    const card = document.createElement("article");
    card.className = "archive-card";
    card.dataset.id = film.id;
    const image =
      film.image ||
      "https://via.placeholder.com/600x900/080706/e8ddc8?text=NO+IMAGE";
    const title = film.title || "UNTITLED";
    const director = film.director || "DIRECTOR UNKNOWN";
    const year = film.year || "—";
    const watchLabel = film.watchStarted
      ? "CONTINUE WATCHING"
      : "START WATCHING";
    card.innerHTML = `
        <div
          class="archive-poster"
          data-style="${getArchiveStyle(index)}"
        >
          <img
            src="${escapeHTML(image)}"
            alt="${escapeHTML(title)}"
            loading="lazy"
            draggable="false"
          >
          <span class="archive-index">
            ${padNumber(index + 1)}
          </span>
          <span class="archive-type">
            ${escapeHTML(getArchiveTypeLabel(film.type))}
          </span>
        </div>
        <div class="archive-card-info">
          <h3 class="archive-card-title">
            ${escapeHTML(title)}
          </h3>
          <span class="archive-card-year">
            ${escapeHTML(year)}
          </span>
        </div>
        <div class="archive-card-director">
          ${escapeHTML(director)}
        </div>
        <div class="archive-actions">
          <button
            class="archive-action archive-action-start"
            type="button"
            data-action="watch"
          >
            ${watchLabel}
          </button>
          <button
            class="archive-action"
            type="button"
            data-action="rate"
          >
            RATE
          </button>
          <button
            class="archive-action archive-action-remove"
            type="button"
            data-action="remove"
            aria-label="Remove film"
          >
            ×
          </button>
        </div>
      `;
    archiveTrack.appendChild(card);
  });
  archiveTrack.scrollLeft = 0;
  updateArchiveCounter();
  requestAnimationFrame(() => {
    updateArchiveFocus();
    updateArchiveNavigation();
  });
}
/* =========================================================
   ARCHIVE FILTERS
========================================================= */
document.querySelectorAll(".archive-section .filter").forEach((button) => {
  button.addEventListener("click", () => {
    document
      .querySelectorAll(".archive-section .filter")
      .forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    currentArchiveType = button.dataset.type || "all";
    renderArchive();
  });
});
/* =========================================================
   ARCHIVE CARD ACTIONS
========================================================= */
archiveTrack?.addEventListener("click", (event) => {
  /*
       If the pointer actually dragged the carousel,
       do not treat the release as a click.
    */
  if (archiveDragState.moved) {
    return;
  }
  const actionElement = event.target.closest("[data-action]");
  const card = event.target.closest(".archive-card");
  if (!card) {
    return;
  }
  const filmId = card.dataset.id;
  const film = films.find((item) => String(item.id) === String(filmId));
  if (!film) {
    return;
  }
  const action = actionElement?.dataset.action;
  /* REMOVE */
  if (action === "remove") {
    event.preventDefault();
    event.stopPropagation();
    removeFilm(film.id);
    return;
  }
  /* RATE */
  if (action === "rate") {
    event.preventDefault();
    event.stopPropagation();
    document.getElementById("ratings")?.scrollIntoView({
      behavior: "smooth",
    });
    return;
  }
  /* WATCH */
  if (action === "watch") {
    event.preventDefault();
    event.stopPropagation();
    film.watchStarted = true;
    saveArchive();
    renderArchive();
    openFilmModal(film);
    return;
  }
  /*
       Clicking anywhere else on the card
       opens the film modal.
    */
  openFilmModal(film);
});
/* =========================================================
   REMOVE FILM
========================================================= */
function removeFilm(id) {
  films = films.filter((film) => String(film.id) !== String(id));
  saveArchive();
  renderArchive();
}
/* =========================================================
   ARCHIVE CARDS
========================================================= */
function getArchiveCards() {
  if (!archiveTrack) {
    return [];
  }
  return [...archiveTrack.querySelectorAll(".archive-card")];
}
/* =========================================================
   CAROUSEL FOCUS
========================================================= */
function updateArchiveFocus() {
  if (!archiveTrack) {
    return;
  }
  const cards = getArchiveCards();
  if (!cards.length) {
    archiveCurrentIndex = 0;
    updateArchiveNavigation();
    return;
  }
  const trackRect = archiveTrack.getBoundingClientRect();
  const trackCenter = trackRect.left + trackRect.width / 2;
  let closestIndex = 0;
  let closestDistance = Infinity;
  cards.forEach((card, index) => {
    const rect = card.getBoundingClientRect();
    const cardCenter = rect.left + rect.width / 2;
    const distance = cardCenter - trackCenter;
    const absoluteDistance = Math.abs(distance);
    if (absoluteDistance < closestDistance) {
      closestDistance = absoluteDistance;
      closestIndex = index;
    }
    const normalized = absoluteDistance / Math.max(rect.width, 1);
    const influence = Math.min(normalized, 2);
    const scale = 1 - influence * 0.045;
    const opacity = 1 - influence * 0.18;
    const y = influence * 8;
    const rotate = Math.max(-1.5, Math.min(1.5, distance * 0.002));
    card.style.setProperty("--card-scale", scale);
    card.style.setProperty("--card-opacity", Math.max(0.55, opacity));
    card.style.setProperty("--card-y", `${y}px`);
    card.style.setProperty("--card-rotate", `${rotate}deg`);
    card.classList.toggle("is-active", index === closestIndex);
  });
  archiveCurrentIndex = closestIndex;
  updateArchiveNavigation();
}
/* =========================================================
   CAROUSEL NAVIGATION
========================================================= */
function scrollArchive(direction) {
  if (!archiveTrack) {
    return;
  }
  const cards = getArchiveCards();
  if (!cards.length) {
    return;
  }
  const current = Math.max(0, Math.min(archiveCurrentIndex, cards.length - 1));
  const next = Math.max(0, Math.min(cards.length - 1, current + direction));
  if (next === current) {
    return;
  }
  cards[next].scrollIntoView({
    behavior: "smooth",
    block: "nearest",
    inline: "center",
  });
  archiveCurrentIndex = next;
  updateArchiveNavigation();
}
/* =========================================================
   CAROUSEL UI
========================================================= */
function updateArchiveNavigation() {
  if (!archiveTrackWrap) {
    return;
  }
  const cards = getArchiveCards();
  const current = archiveTrackWrap.querySelector(".archive-position-current");
  const total = archiveTrackWrap.querySelector(".archive-position-total");
  const progress = archiveTrackWrap.querySelector(
    ".archive-carousel-progress-bar",
  );
  const prev = archiveTrackWrap.querySelector('[data-carousel="prev"]');
  const next = archiveTrackWrap.querySelector('[data-carousel="next"]');
  if (!cards.length) {
    if (current) {
      current.textContent = "00";
    }
    if (total) {
      total.textContent = "00";
    }
    if (progress) {
      progress.style.width = "0%";
    }
    if (prev) {
      prev.disabled = true;
    }
    if (next) {
      next.disabled = true;
    }
    return;
  }
  const index = Math.max(0, Math.min(archiveCurrentIndex, cards.length - 1));
  if (current) {
    current.textContent = padNumber(index + 1);
  }
  if (total) {
    total.textContent = padNumber(cards.length);
  }
  if (progress) {
    const percent =
      cards.length <= 1 ? 100 : (index / (cards.length - 1)) * 100;
    progress.style.width = `${percent}%`;
  }
  if (prev) {
    prev.disabled = index <= 0;
  }
  if (next) {
    next.disabled = index >= cards.length - 1;
  }
}
/* =========================================================
   CAROUSEL SCROLL
========================================================= */
archiveTrack?.addEventListener(
  "scroll",
  () => {
    if (archiveScrollFrame) {
      return;
    }
    archiveScrollFrame = requestAnimationFrame(() => {
      updateArchiveFocus();
      archiveScrollFrame = null;
    });
    clearTimeout(archiveSnapTimer);
    archiveSnapTimer = setTimeout(() => {
      if (!archiveDragState.active) {
        snapArchiveToClosest();
      }
    }, 180);
  },
  {
    passive: true,
  },
);
/* =========================================================
   SNAP
========================================================= */
function snapArchiveToClosest() {
  if (!archiveTrack) {
    return;
  }
  if (archiveDragState.active) {
    return;
  }
  const cards = getArchiveCards();
  if (!cards.length) {
    return;
  }
  const trackRect = archiveTrack.getBoundingClientRect();
  const center = trackRect.left + trackRect.width / 2;
  let closestCard = null;
  let closestDistance = Infinity;
  cards.forEach((card) => {
    const rect = card.getBoundingClientRect();
    const cardCenter = rect.left + rect.width / 2;
    const distance = Math.abs(cardCenter - center);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestCard = card;
    }
  });
  if (!closestCard) {
    return;
  }
  closestCard.scrollIntoView({
    behavior: "smooth",
    block: "nearest",
    inline: "center",
  });
}
/* =========================================================
   DRAG TO SCROLL
========================================================= */
/*
   THIS IS THE IMPORTANT FIX.
   The old version started drag whenever pointerdown happened
   inside the archive.
   That meant clicking:
   - START WATCHING
   - RATE
   - REMOVE
   could be interpreted as carousel dragging.
   Now drag starts ONLY when the user presses the actual
   carousel background/card area — NOT interactive controls.
*/
archiveTrack?.addEventListener("pointerdown", (event) => {
  if (event.button !== 0 || !archiveTrack) {
    return;
  }
  const interactive = event.target.closest(
    "button, a, input, select, textarea",
  );
  /*
       Never start carousel drag from buttons.
    */
  if (interactive) {
    return;
  }
  archiveDragState.active = true;
  archiveDragState.moved = false;
  archiveDragState.startX = event.clientX;
  archiveDragState.startScrollLeft = archiveTrack.scrollLeft;
  archiveDragState.pointerId = event.pointerId;
  archiveTrack.classList.add("dragging");
  try {
    archiveTrack.setPointerCapture(event.pointerId);
  } catch (error) {
    /* Pointer capture is optional */
  }
});
/* =========================================================
   DRAG MOVE
========================================================= */
archiveTrack?.addEventListener("pointermove", (event) => {
  if (!archiveDragState.active) {
    return;
  }
  const delta = event.clientX - archiveDragState.startX;
  if (Math.abs(delta) > 6) {
    archiveDragState.moved = true;
  }
  archiveTrack.scrollLeft = archiveDragState.startScrollLeft - delta * 1.15;
});
/* =========================================================
   END DRAG
========================================================= */
function endArchiveDrag(event) {
  if (!archiveDragState.active) {
    return;
  }
  archiveDragState.active = false;
  archiveTrack?.classList.remove("dragging");
  try {
    if (
      archiveDragState.pointerId !== null &&
      archiveTrack?.hasPointerCapture(archiveDragState.pointerId)
    ) {
      archiveTrack.releasePointerCapture(archiveDragState.pointerId);
    }
  } catch (error) {
    /* Ignore pointer capture errors */
  }
  const wasMoved = archiveDragState.moved;
  archiveDragState.pointerId = null;
  /*
     Keep moved=true briefly so the click event generated
     immediately after pointerup cannot open a film.
  */
  if (wasMoved) {
    setTimeout(() => {
      archiveDragState.moved = false;
    }, 80);
  } else {
    archiveDragState.moved = false;
  }
  setTimeout(snapArchiveToClosest, 120);
}
archiveTrack?.addEventListener("pointerup", endArchiveDrag);
archiveTrack?.addEventListener("pointercancel", endArchiveDrag);
/*
   DO NOT end drag simply because pointerleave happens.
   With pointer capture enabled, pointerleave can occur while
   the user is still dragging.
*/
/* =========================================================
   KEYBOARD CAROUSEL
========================================================= */
archiveTrack?.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") {
    event.preventDefault();
    scrollArchive(1);
  }
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    scrollArchive(-1);
  }
});
/* =========================================================
   SEARCH COUNT
========================================================= */
function setSearchCountMode(hasResults) {
  const label = document.querySelector(".search-info span:first-child");
  if (!label) {
    return;
  }
  const strong = label.querySelector("strong");
  if (!strong) {
    return;
  }
  const text = label.childNodes[label.childNodes.length - 1];
  if (text && text.nodeType === Node.TEXT_NODE) {
    text.textContent = hasResults ? " RESULTS" : " TITLES";
  }
}
/* =========================================================
   SEARCH TMDB
========================================================= */
async function searchTMDB(query) {
  if (!query.trim()) {
    if (searchResults) {
      searchResults.innerHTML = "";
      searchResults.classList.remove("has-results");
    }
    setSearchCountMode(false);
    return;
  }
  if (searchController) {
    searchController.abort();
  }
  searchController = new AbortController();
  if (searchResults) {
    searchResults.innerHTML = `
      <div class="search-result search-loading">
        <span class="search-result-title">
          SEARCHING...
        </span>
      </div>
    `;
    searchResults.classList.add("has-results");
  }
  setSearchCountMode(true);
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/search/multi?query=${encodeURIComponent(
        query,
      )}&language=ru-RU&include_adult=false&page=1`,
      {
        headers: {
          Authorization: `Bearer ${TMDB_API_KEY}`,
          "Content-Type": "application/json",
        },
        signal: searchController.signal,
      },
    );
    if (!response.ok) {
      throw new Error(`TMDB ERROR ${response.status}`);
    }
    const data = await response.json();
    const results = (data.results || [])
      .filter((item) => item.media_type === "movie" || item.media_type === "tv")
      .slice(0, 15);
    renderSearchResults(results);
  } catch (error) {
    if (error.name === "AbortError") {
      return;
    }
    console.error("TMDB search error:", error);
    if (searchResults) {
      searchResults.innerHTML = `
        <div class="search-result search-empty">
          <span class="search-result-title">
            SEARCH ERROR
          </span>
        </div>
      `;
    }
  }
}
/* =========================================================
   SEARCH RESULTS RENDER
========================================================= */
function renderSearchResults(results) {
  if (!searchResults) {
    return;
  }
  if (!results.length) {
    searchResults.innerHTML = `
      <div class="search-result search-empty">
        <span class="search-result-title">
          NOTHING FOUND
        </span>
      </div>
    `;
    return;
  }
  searchResults.innerHTML = results
    .map((item, index) => {
      const isMovie = item.media_type === "movie";
      const title = item.title || item.name || "UNTITLED";
      const originalTitle = item.original_title || item.original_name || "";
      const date = item.release_date || item.first_air_date || "";
      const poster = item.poster_path
        ? `${TMDB_IMAGE_URL}${item.poster_path}`
        : "";
      const exists = filmIsInArchive(item.id);
      return `
            <div
              class="search-result"
              data-tmdb-id="${item.id}"
              data-media-type="${item.media_type}"
            >
              <span class="search-result-number">
                ${padNumber(index + 1)}
              </span>
              ${
                poster
                  ? `
                    <div class="search-result-poster">
                      <img
                        src="${escapeHTML(poster)}"
                        alt="${escapeHTML(title)}"
                      >
                    </div>
                  `
                  : ""
              }
              <div class="search-result-main">
                <div class="search-result-title">
                  ${escapeHTML(title)}
                </div>
                <div class="search-result-meta">
                  <span>
                    ${isMovie ? "ФИЛЬМ" : "СЕРИАЛ"}
                  </span>
                  <span>
                    ${date ? escapeHTML(getYear(date)) : "—"}
                  </span>
                  ${
                    originalTitle
                      ? `
                        <span>
                          ${escapeHTML(originalTitle)}
                        </span>
                      `
                      : ""
                  }
                </div>
              </div>
              <button
                class="search-add-button ${exists ? "added" : ""}"
                type="button"
                data-add-tmdb="${item.id}"
                data-media-type="${item.media_type}"
                ${exists ? "disabled" : ""}
              >
                ${exists ? "ADDED" : "ADD TO LIBRARY"}
              </button>
            </div>
          `;
    })
    .join("");
}
/* =========================================================
   SEARCH INPUT
========================================================= */
searchInput?.addEventListener("input", () => {
  clearTimeout(searchTimer);
  const value = searchInput.value.trim();
  searchTimer = setTimeout(() => {
    searchTMDB(value);
  }, 400);
});
searchButton?.addEventListener("click", () => {
  searchTMDB(searchInput?.value || "");
});
searchInput?.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    searchTMDB(searchInput.value);
  }
});
/* =========================================================
   SEARCH RESULT ACTIONS
========================================================= */
searchResults?.addEventListener("click", async (event) => {
  const addButton = event.target.closest("[data-add-tmdb]");
  /*
       ADD BUTTON
    */
  if (addButton) {
    event.preventDefault();
    event.stopPropagation();
    if (addButton.disabled) {
      return;
    }
    const tmdbId = Number(addButton.dataset.addTmdb);
    const mediaType = addButton.dataset.mediaType || "movie";
    const added = await addTMDBToArchive(tmdbId, mediaType);
    if (added) {
      addButton.textContent = "ADDED";
      addButton.classList.add("added");
      addButton.disabled = true;
    }
    return;
  }
  /*
       OPEN SEARCH RESULT
    */
  const result = event.target.closest(".search-result");
  if (!result) {
    return;
  }
  const tmdbId = Number(result.dataset.tmdbId);
  if (!tmdbId) {
    return;
  }
  const film = await fetchTMDBFilm(tmdbId, result.dataset.mediaType);
  if (film) {
    openFilmModal(film);
  }
});
/* =========================================================
   CLOSE SEARCH OUTSIDE
========================================================= */
document.addEventListener("click", (event) => {
  if (!searchResults?.classList.contains("has-results")) {
    return;
  }
  const clickedInsideSearch =
    event.target.closest("#searchInput") ||
    event.target.closest("#searchButton") ||
    event.target.closest("#searchResults");
  if (clickedInsideSearch) {
    return;
  }
  searchResults.innerHTML = "";
  searchResults.classList.remove("has-results");
  setSearchCountMode(false);
});
/* =========================================================
   FETCH TMDB DETAIL
========================================================= */
async function fetchTMDBFilm(tmdbId, mediaType = "movie", signal = undefined) {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/${mediaType}/${tmdbId}?language=ru-RU&append_to_response=credits`,
      {
        headers: {
          Authorization: `Bearer ${TMDB_API_KEY}`,
          "Content-Type": "application/json",
        },
        signal,
      },
    );
    if (!response.ok) {
      throw new Error(`TMDB DETAIL ERROR ${response.status}`);
    }
    const data = await response.json();
    return normalizeTMDBFilm(data);
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error("TMDB detail error:", error);
    }
    return null;
  }
}
/* =========================================================
   NORMALIZE TMDB FILM
========================================================= */
function normalizeTMDBFilm(data) {
  const mediaType = data.media_type || (data.first_air_date ? "tv" : "movie");
  const crew = data.credits?.crew || [];
  const director =
    crew.find((person) => person.job === "Director")?.name ||
    data.created_by?.[0]?.name ||
    "РЕЖИССЁР НЕ УКАЗАН";
  const genreIds = Array.isArray(data.genre_ids)
    ? data.genre_ids.map(Number)
    : (data.genres || []).map((genre) => Number(genre.id)).filter(Boolean);
  const type = detectType({
    ...data,
    media_type: mediaType,
  });
  const title = data.title || data.name || "UNTITLED";
  const year = getYear(data.release_date || data.first_air_date);
  const image = data.poster_path ? `${TMDB_IMAGE_URL}${data.poster_path}` : "";
  const backdrop = data.backdrop_path
    ? `${TMDB_BACKDROP_URL}${data.backdrop_path}`
    : "";
  const originCountries = Array.isArray(data.origin_country)
    ? data.origin_country
    : [];
  const productionCountries = Array.isArray(data.production_countries)
    ? data.production_countries.map((country) => country.iso_3166_1)
    : [];
  const countries = originCountries.length
    ? originCountries
    : productionCountries;
  const countryName = countries.length
    ? countries
        .map((country) => MOVIE_NIGHT_COUNTRIES[country] || country)
        .join(" / ")
    : "—";
  const runtime = data.runtime || data.episode_run_time?.[0] || null;
  return {
    id: `tmdb-${data.id}`,
    tmdbId: data.id,
    mediaType,
    title: title.toUpperCase(),
    originalTitle: (
      data.original_title ||
      data.original_name ||
      ""
    ).toUpperCase(),
    year,
    director: director.toUpperCase(),
    type,
    genreIds,
    genres: genreIds.map((id) => TMDB_GENRES[id]).filter(Boolean),
    originCountries: countries,
    countryName,
    runtime,
    voteAverage: Number(data.vote_average || 0),
    voteCount: Number(data.vote_count || 0),
    popularity: Number(data.popularity || 0),
    image,
    backdrop,
    description: data.overview || "Описание отсутствует.",
    watchStarted: false,
    adult: Boolean(data.adult),
  };
}
/* =========================================================
   ADD TMDB TO ARCHIVE
========================================================= */
async function addTMDBToArchive(tmdbId, mediaType = "movie") {
  const existing = films.find((film) => Number(film.tmdbId) === Number(tmdbId));
  if (existing) {
    return existing;
  }
  const film = await fetchTMDBFilm(tmdbId, mediaType);
  if (!film) {
    return null;
  }
  films.push(film);
  saveArchive();
  renderArchive();
  return film;
}
/* =========================================================
   FILM MODAL
========================================================= */
function openFilmModal(film) {
  if (!filmModal) {
    return;
  }
  filmModal.classList.add("active");
  if (modalLoader) {
    modalLoader.style.display = "flex";
  }
  modalResult?.classList.remove("active");
  let counter = 0;
  const loaderNumber = modalLoader?.querySelector(".loader-number");
  const interval = setInterval(() => {
    counter += 7;
    if (counter > 99) {
      counter = 99;
    }
    if (loaderNumber) {
      loaderNumber.textContent = padNumber(counter);
    }
  }, 45);
  setTimeout(() => {
    clearInterval(interval);
    if (modalLoader) {
      modalLoader.style.display = "none";
    }
    if (modalTitle) {
      modalTitle.textContent = film.title || "UNTITLED";
    }
    if (modalYear) {
      modalYear.textContent = film.year || "—";
    }
    if (modalDirector) {
      modalDirector.textContent = film.director || "DIRECTOR UNKNOWN";
    }
    if (modalDescription) {
      modalDescription.textContent =
        film.description || "Описание отсутствует.";
    }
    modalResult?.classList.add("active");
    currentMovieNightFilm = film;
  }, 650);
}
function closeFilmModal() {
  filmModal?.classList.remove("active");
}
modalClose?.addEventListener("click", closeFilmModal);
filmModal?.addEventListener("click", (event) => {
  if (event.target === filmModal) {
    closeFilmModal();
  }
});
/* =========================================================
   MOVIE NIGHT FILTERS
========================================================= */
function resetMovieNightSelection(selector, activeButton) {
  document
    .querySelectorAll(selector)
    .forEach((button) => button.classList.remove("active"));
  activeButton?.classList.add("active");
}
/* =========================================================
   MOVIE NIGHT TYPE
========================================================= */
document.querySelectorAll("[data-filter-type]").forEach((button) => {
  button.addEventListener("click", () => {
    resetMovieNightSelection("[data-filter-type]", button);
    selectedMovieType = button.dataset.filterType || "all";
  });
});
/* =========================================================
   MOVIE NIGHT GENRE
========================================================= */
document.querySelectorAll("[data-genre]").forEach((button) => {
  button.addEventListener("click", () => {
    resetMovieNightSelection("[data-genre]", button);
    selectedMovieGenre = button.dataset.genre || "any";
  });
});
/* =========================================================
   MOVIE NIGHT YEAR
========================================================= */
document.querySelectorAll("[data-year]").forEach((button) => {
  button.addEventListener("click", () => {
    resetMovieNightSelection("[data-year]", button);
    selectedMovieYear = button.dataset.year || "any";
  });
});
/* =========================================================
   MOVIE NIGHT COUNTRY
========================================================= */
movieNightCountrySelect?.addEventListener("change", () => {
  selectedMovieCountry = movieNightCountrySelect.value || "any";
});
/* =========================================================
   MOVIE NIGHT RATING
========================================================= */
document.querySelectorAll("[data-rating]").forEach((button) => {
  button.addEventListener("click", () => {
    resetMovieNightSelection("[data-rating]", button);
    selectedMovieRating = Number(button.dataset.rating || 0);
  });
});
/* =========================================================
   EXCLUDE ARCHIVE
========================================================= */
excludeArchiveControl?.addEventListener("change", () => {
  excludeArchive = Boolean(excludeArchiveControl.checked);
});
/* =========================================================
   MOVIE NIGHT REVEAL STATUS
========================================================= */
function setMovieNightRevealStatus(status) {
  if (!movieNightRevealTrack) {
    return;
  }
  let span = movieNightRevealTrack.querySelector("span");
  if (!span) {
    movieNightRevealTrack.innerHTML = "<span></span>";
    span = movieNightRevealTrack.querySelector("span");
  }
  span.textContent = status;
}
/* =========================================================
   MOVIE NIGHT MODAL RESET
========================================================= */
function resetMovieNightModal() {
  if (!movieNightModal) {
    return;
  }
  movieNightModal.classList.remove("is-result", "is-error", "is-selecting");
  movieNightFinal?.classList.remove("visible");
  movieNightReveal?.classList.remove("hidden");
  if (movieNightPoster) {
    movieNightPoster.src = "";
    movieNightPoster.alt = "";
  }
  if (movieNightTitle) {
    movieNightTitle.textContent = "MOVIE TITLE";
  }
  if (movieNightYear) {
    movieNightYear.textContent = "2026";
  }
  if (movieNightRating) {
    movieNightRating.textContent = "★ 8.0";
  }
  if (movieNightType) {
    movieNightType.textContent = "FILM";
  }
  if (movieNightSubmeta) {
    movieNightSubmeta.textContent = "USA / DRAMA";
  }
  if (movieNightOverview) {
    movieNightOverview.textContent = "Description.";
  }
  if (movieNightArchiveStatus) {
    movieNightArchiveStatus.textContent = "FROM TMDB";
    movieNightArchiveStatus.classList.remove("in-archive");
  }
  if (movieNightOpen) {
    movieNightOpen.style.display = "";
  }
  if (movieNightAdd) {
    movieNightAdd.style.display = "";
    movieNightAdd.disabled = false;
    movieNightAdd.textContent = "ADD TO ARCHIVE";
    movieNightAdd.classList.remove("added");
  }
  setMovieNightRevealStatus("---");
}
/* =========================================================
   OPEN MOVIE NIGHT MODAL
========================================================= */
function openMovieNightModal() {
  if (!movieNightModal) return;
  resetMovieNightModal();
  movieNightModal.classList.add("active", "is-selecting");
  movieNightModal.setAttribute("aria-hidden", "false");
  // Reveal включается только после открытия Movie Night
  if (movieNightReveal) {
    movieNightReveal.style.setProperty("pointer-events", "auto", "important");
  }
  body.classList.add("movie-night-modal-open");
}
/* =========================================================
   CLOSE MOVIE NIGHT MODAL
========================================================= */
function closeMovieNightModal() {
  if (!movieNightModal) return;
  if (movieNightController) {
    movieNightController.abort();
    movieNightController = null;
  }
  // Полностью убираем reveal со страницы после закрытия
  if (movieNightReveal) {
    movieNightReveal.style.setProperty("pointer-events", "none", "important");
  }
  movieNightModal.classList.remove("active", "is-selecting", "is-result");
  movieNightModal.setAttribute("aria-hidden", "true");
  // Убираем фокус с элемента внутри закрытой модалки
  if (
    movieNightModal.contains(document.activeElement) &&
    typeof document.activeElement.blur === "function"
  ) {
    document.activeElement.blur();
  }
  body.classList.remove("movie-night-modal-open");
  movieNightBusy = false;
  if (decideButton) {
    decideButton.disabled = false;
    decideButton.classList.remove("is-loading");
    const span = decideButton.querySelector("span");
    if (span) span.textContent = "DECIDE";
  }
}
movieNightModalClose?.addEventListener("click", closeMovieNightModal);
movieNightModalBackdrop?.addEventListener("click", closeMovieNightModal);
/* =========================================================
   MOVIE NIGHT SEARCH ANIMATION
========================================================= */
function createMovieNightSearchAnimation() {
  const startTime = performance.now();
  let finished = false;
  let resolveAnimation;
  const timers = [];
  const promise = new Promise((resolve) => {
    resolveAnimation = resolve;
  });
  setMovieNightRevealStatus("SEARCHING ARCHIVE");
  timers.push(
    setTimeout(() => {
      if (!finished) {
        setMovieNightRevealStatus("MATCHING PARAMETERS");
      }
    }, 600),
  );
  timers.push(
    setTimeout(() => {
      if (!finished) {
        setMovieNightRevealStatus("SCANNING TITLES");
      }
    }, 1200),
  );
  function finish() {
    if (finished) {
      return;
    }
    finished = true;
    timers.forEach(clearTimeout);
    setMovieNightRevealStatus("MATCH FOUND");
    const elapsed = performance.now() - startTime;
    const remaining = Math.max(0, 2250 - elapsed);
    setTimeout(resolveAnimation, remaining);
  }
  function fail() {
    if (finished) {
      return;
    }
    finished = true;
    timers.forEach(clearTimeout);
    setMovieNightRevealStatus("NO MATCH FOUND");
    const elapsed = performance.now() - startTime;
    const remaining = Math.max(0, 2250 - elapsed);
    setTimeout(resolveAnimation, remaining);
  }
  function stop() {
    if (finished) {
      return;
    }
    finished = true;
    timers.forEach(clearTimeout);
    resolveAnimation();
  }
  return {
    promise,
    finish,
    fail,
    stop,
  };
}
/* =========================================================
   MOVIE NIGHT YEAR FILTER
========================================================= */
function applyMovieNightYearFilter(params, endpointType) {
  const prefix =
    endpointType === "tv" ? "first_air_date" : "primary_release_date";
  switch (selectedMovieYear) {
    case "before-1990":
      params.set(`${prefix}.lte`, "1989-12-31");
      break;
    case "1990-2000":
      params.set(`${prefix}.gte`, "1990-01-01");
      params.set(`${prefix}.lte`, "1999-12-31");
      break;
    case "2000-2010":
      params.set(`${prefix}.gte`, "2000-01-01");
      params.set(`${prefix}.lte`, "2009-12-31");
      break;
    case "2010-2020":
      params.set(`${prefix}.gte`, "2010-01-01");
      params.set(`${prefix}.lte`, "2019-12-31");
      break;
    case "2020":
      params.set(`${prefix}.gte`, "2020-01-01");
      break;
  }
}
/* =========================================================
   MOVIE NIGHT GENRES
========================================================= */
function getMovieNightGenreIds() {
  if (selectedMovieGenre === "any") {
    return null;
  }
  const map = {
    action: [28],
    adventure: [12],
    animation: [16],
    comedy: [35],
    crime: [80],
    documentary: [99],
    drama: [18],
    family: [10751],
    fantasy: [14],
    history: [36],
    horror: [27],
    music: [10402],
    mystery: [9648],
    romance: [10749],
    "science fiction": [878],
    "sci-fi": [878],
    thriller: [53],
    war: [10752],
    western: [37],
  };
  return map[String(selectedMovieGenre).toLowerCase()] || null;
}
/* =========================================================
   MOVIE NIGHT PARAMETERS
========================================================= */
function buildMovieNightParams(page, endpointType) {
  const params = new URLSearchParams();
  params.set("language", "ru-RU");
  params.set("include_adult", "false");
  params.set("include_video", "false");
  params.set("page", String(page));
  params.set("vote_count.gte", "50");
  params.set(
    "sort_by",
    Number(selectedMovieRating) >= 7 ? "vote_average.desc" : "popularity.desc",
  );
  if (selectedMovieType === "animation") {
    params.set("with_genres", "16");
  }
  const genreIds = getMovieNightGenreIds();
  if (genreIds && selectedMovieType !== "animation") {
    params.set("with_genres", genreIds.join("|"));
  }
  applyMovieNightYearFilter(params, endpointType);
  if (selectedMovieCountry !== "any" && selectedMovieCountry) {
    params.set("with_origin_country", selectedMovieCountry);
  }
  if (Number(selectedMovieRating) > 0) {
    params.set("vote_average.gte", String(selectedMovieRating));
  }
  return params;
}
/* =========================================================
   MOVIE NIGHT ENDPOINTS
========================================================= */
function getMovieNightEndpoints() {
  switch (selectedMovieType) {
    case "series":
      return ["tv"];
    case "film":
      return ["movie"];
    case "animation":
      return ["movie"];
    default:
      return ["movie", "tv"];
  }
}
/* =========================================================
   MOVIE NIGHT DISCOVER
========================================================= */
async function fetchMovieNightDiscover(page, endpointType, signal) {
  const params = buildMovieNightParams(page, endpointType);
  const response = await fetch(
    `${TMDB_BASE_URL}/discover/${endpointType}?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${TMDB_API_KEY}`,
        "Content-Type": "application/json",
      },
      signal,
    },
  );
  if (!response.ok) {
    throw new Error(`TMDB DISCOVER ERROR ${response.status}`);
  }
  const data = await response.json();
  return {
    ...data,
    endpointType,
  };
}
/* =========================================================
   MOVIE NIGHT LOCAL FILTERS
========================================================= */
function matchesMovieNightGenre(item) {
  if (selectedMovieGenre === "any") {
    return true;
  }
  const genreIds = Array.isArray(item.genre_ids)
    ? item.genre_ids.map(Number)
    : [];
  const selectedIds = getMovieNightGenreIds();
  if (!selectedIds) {
    return true;
  }
  return selectedIds.some((id) => genreIds.includes(id));
}
function matchesMovieNightType(item) {
  const mediaType = item.media_type || (item.first_air_date ? "tv" : "movie");
  if (selectedMovieType === "film") {
    return mediaType === "movie";
  }
  if (selectedMovieType === "series") {
    return mediaType === "tv";
  }
  if (selectedMovieType === "animation") {
    return (
      mediaType === "movie" &&
      Array.isArray(item.genre_ids) &&
      item.genre_ids.includes(16)
    );
  }
  return mediaType === "movie" || mediaType === "tv";
}
function matchesMovieNightArchiveRule(item) {
  if (!excludeArchive) {
    return true;
  }
  return !filmIsInArchive(item.id);
}
function matchesMovieNightYear(item) {
  if (selectedMovieYear === "any") {
    return true;
  }
  const date = item.release_date || item.first_air_date || "";
  if (!date) {
    return false;
  }
  const year = Number(date.slice(0, 4));
  if (!year) {
    return false;
  }
  switch (selectedMovieYear) {
    case "before-1990":
      return year < 1990;
    case "1990-2000":
      return year >= 1990 && year <= 1999;
    case "2000-2010":
      return year >= 2000 && year <= 2009;
    case "2010-2020":
      return year >= 2010 && year <= 2019;
    case "2020":
      return year >= 2020;
    default:
      return true;
  }
}
function matchesMovieNightRating(item) {
  if (Number(selectedMovieRating) <= 0) {
    return true;
  }
  return Number(item.vote_average || 0) >= Number(selectedMovieRating);
}
/* =========================================================
   MOVIE NIGHT POOL
========================================================= */
async function getMovieNightPool(signal) {
  const endpoints = getMovieNightEndpoints();
  const allResults = [];
  for (const endpointType of endpoints) {
    for (let page = 1; page <= 3; page++) {
      const data = await fetchMovieNightDiscover(page, endpointType, signal);
      const results = Array.isArray(data.results) ? data.results : [];
      results.forEach((item) => {
        item.media_type = endpointType;
        allResults.push(item);
      });
      if (allResults.length >= 80) {
        break;
      }
    }
  }
  const unique = new Map();
  allResults.forEach((item) => {
    if (!item?.id) {
      return;
    }
    const key = `${item.media_type}-${item.id}`;
    if (!unique.has(key)) {
      unique.set(key, item);
    }
  });
  let pool = [...unique.values()];
  pool = pool.filter(matchesMovieNightType);
  pool = pool.filter(matchesMovieNightGenre);
  pool = pool.filter(matchesMovieNightYear);
  pool = pool.filter(matchesMovieNightRating);
  pool = pool.filter(matchesMovieNightArchiveRule);
  pool = pool.filter((item) => Boolean(item.title || item.name));
  return pool;
}
/* =========================================================
   RANDOM
========================================================= */
function chooseRandomFromPool(pool) {
  if (!pool.length) {
    return null;
  }
  return pool[Math.floor(Math.random() * pool.length)];
}
/* =========================================================
   MOVIE NIGHT RESULT
========================================================= */
function populateMovieNightResult(film) {
  if (!film) {
    return;
  }
  currentMovieNightFilm = film;
  const alreadyInArchive = filmIsInArchive(film.tmdbId);
  if (movieNightPoster) {
    movieNightPoster.src = film.image || "";
    movieNightPoster.alt = film.title || "";
  }
  if (movieNightPosterIndex) {
    const index = Math.floor(Math.random() * 99) + 1;
    movieNightPosterIndex.textContent = padNumber(index);
  }
  if (movieNightType) {
    movieNightType.textContent = getArchiveTypeLabel(film.type);
  }
  if (movieNightYear) {
    movieNightYear.textContent = film.year || "—";
  }
  if (movieNightRating) {
    movieNightRating.textContent = film.voteAverage
      ? `★ ${film.voteAverage.toFixed(1)}`
      : "★ —";
  }
  if (movieNightTitle) {
    movieNightTitle.textContent = film.title || "UNTITLED";
  }
  if (movieNightSubmeta) {
    const country = getFilmCountry(film);
    const genre = getFilmGenreLabel(film);
    movieNightSubmeta.textContent = `${country} / ${genre}`;
  }
  if (movieNightOverview) {
    movieNightOverview.textContent =
      film.description || "Описание отсутствует.";
  }
  if (movieNightArchiveStatus) {
    movieNightArchiveStatus.classList.toggle("in-archive", alreadyInArchive);
    movieNightArchiveStatus.textContent = alreadyInArchive
      ? "ALREADY IN ARCHIVE"
      : "FROM TMDB";
  }
  if (movieNightAdd) {
    movieNightAdd.disabled = alreadyInArchive;
    movieNightAdd.textContent = alreadyInArchive
      ? "IN ARCHIVE"
      : "ADD TO ARCHIVE";
    movieNightAdd.classList.toggle("added", alreadyInArchive);
  }
  if (movieNightOpen) {
    movieNightOpen.style.display = "";
  }
}
/* =========================================================
   SHOW MOVIE NIGHT RESULT
========================================================= */
function showMovieNightResult(film) {
  if (!film || !movieNightModal) {
    return;
  }
  populateMovieNightResult(film);
  movieNightModal.classList.remove("is-selecting");
  movieNightModal.classList.add("is-result");
  movieNightReveal?.classList.add("hidden");
  if (movieNightReveal) {
    movieNightReveal.style.setProperty("pointer-events", "none", "important");
  }
  requestAnimationFrame(() => {
    movieNightFinal?.classList.add("visible");
  });
}
/* =========================================================
   MOVIE NIGHT ERROR
========================================================= */
function showMovieNightError(message) {
  if (!movieNightModal) {
    return;
  }
  movieNightModal.classList.remove("is-selecting");
  movieNightModal.classList.add("is-result", "is-error");
  movieNightReveal?.classList.add("hidden");
  if (movieNightReveal) {
    movieNightReveal.style.setProperty("pointer-events", "none", "important");
  }
  if (movieNightPoster) {
    movieNightPoster.removeAttribute("src");
    movieNightPoster.alt = "";
  }
  if (movieNightTitle) {
    movieNightTitle.textContent = "NO MATCH";
  }
  if (movieNightYear) {
    movieNightYear.textContent = "—";
  }
  if (movieNightRating) {
    movieNightRating.textContent = "—";
  }
  if (movieNightType) {
    movieNightType.textContent = "ARCHIVE";
  }
  if (movieNightSubmeta) {
    movieNightSubmeta.textContent = "TMDB SEARCH";
  }
  if (movieNightOverview) {
    movieNightOverview.textContent =
      message || "COULDN'T FIND A TITLE WITH THESE PARAMETERS.";
  }
  if (movieNightArchiveStatus) {
    movieNightArchiveStatus.textContent = "NO MATCH";
  }
  if (movieNightOpen) {
    movieNightOpen.style.display = "none";
  }
  if (movieNightAdd) {
    movieNightAdd.style.display = "none";
  }
  requestAnimationFrame(() => {
    movieNightFinal?.classList.add("visible");
  });
}
/* =========================================================
   MOVIE NIGHT — MAIN
========================================================= */
async function chooseMovieNightFilm() {
  if (movieNightBusy || !decideButton) {
    return;
  }
  movieNightBusy = true;
  const originalText =
    decideButton.querySelector("span")?.textContent || "DECIDE";
  decideButton.disabled = true;
  decideButton.classList.add("is-loading");
  const buttonSpan = decideButton.querySelector("span");
  if (buttonSpan) {
    buttonSpan.textContent = "SEARCHING";
  }
  openMovieNightModal();
  movieNightController = new AbortController();
  const signal = movieNightController.signal;
  const animation = createMovieNightSearchAnimation();
  try {
    const poolPromise = getMovieNightPool(signal);
    const pool = await poolPromise;
    if (signal.aborted) {
      animation.stop();
      return;
    }
    if (!pool.length) {
      animation.fail();
      await animation.promise;
      if (signal.aborted) {
        return;
      }
      showMovieNightError("COULDN'T FIND A TITLE WITH THESE PARAMETERS.");
      return;
    }
    const selected = chooseRandomFromPool(pool);
    if (!selected) {
      animation.fail();
      await animation.promise;
      showMovieNightError("COULDN'T FIND A TITLE.");
      return;
    }
    const mediaType =
      selected.media_type || (selected.first_air_date ? "tv" : "movie");
    const film = await fetchTMDBFilm(selected.id, mediaType, signal);
    if (signal.aborted) {
      animation.stop();
      return;
    }
    if (!film) {
      animation.fail();
      await animation.promise;
      showMovieNightError("TMDB COULDN'T LOAD THIS TITLE.");
      return;
    }
    animation.finish();
    await animation.promise;
    if (signal.aborted) {
      return;
    }
    currentMovieNightFilm = film;
    showMovieNightResult(film);
  } catch (error) {
    if (error.name === "AbortError") {
      animation.stop();
      return;
    }
    console.error("Movie Night error:", error);
    animation.fail();
    await animation.promise;
    if (!signal.aborted) {
      showMovieNightError("TMDB COULDN'T LOAD THE SELECTION. TRY AGAIN.");
    }
  } finally {
    movieNightController = null;
    movieNightBusy = false;
    if (decideButton) {
      decideButton.disabled = false;
      decideButton.classList.remove("is-loading");
      const span = decideButton.querySelector("span");
      if (span) {
        span.textContent = originalText;
      }
    }
  }
}
decideButton?.addEventListener("click", chooseMovieNightFilm);
/* =========================================================
   MOVIE NIGHT — OPEN RESULT
========================================================= */
movieNightOpen?.addEventListener("click", () => {
  if (!currentMovieNightFilm) {
    return;
  }
  const film = currentMovieNightFilm;
  closeMovieNightModal();
  setTimeout(() => {
    openFilmModal(film);
  }, 180);
});
/* =========================================================
   MOVIE NIGHT — ADD TO ARCHIVE
========================================================= */
movieNightAdd?.addEventListener("click", async () => {
  if (!currentMovieNightFilm || movieNightAdd.disabled) {
    return;
  }
  const film = currentMovieNightFilm;
  const added = await addTMDBToArchive(film.tmdbId, film.mediaType);
  if (!added) {
    return;
  }
  movieNightAdd.disabled = true;
  movieNightAdd.textContent = "ADDED TO ARCHIVE";
  movieNightAdd.classList.add("added");
  if (movieNightArchiveStatus) {
    movieNightArchiveStatus.textContent = "IN YOUR ARCHIVE";
    movieNightArchiveStatus.classList.add("in-archive");
  }
});
/* =========================================================
   RATINGS
========================================================= */
function getRatingAverage(rating) {
  return (Number(rating.polina) + Number(rating.nastya)) / 2;
}
function renderRatings() {
  if (!ratingsList) {
    return;
  }
  let result = [...ratings];
  if (ratingFilter !== "all") {
    result = result.filter((rating) => rating.type === ratingFilter);
  }
  result.sort((a, b) => {
    if (ratingSort === "high") {
      return getRatingAverage(b) - getRatingAverage(a);
    }
    if (ratingSort === "low") {
      return getRatingAverage(a) - getRatingAverage(b);
    }
    if (ratingSort === "recent") {
      return new Date(b.date) - new Date(a.date);
    }
    return new Date(a.date) - new Date(b.date);
  });
  if (!result.length) {
    ratingsList.innerHTML = `
      <div class="rating-row">
        <div class="rating-film-title">
          NO RATINGS
        </div>
      </div>
    `;
    return;
  }
  ratingsList.innerHTML = result
    .map((rating, index) => {
      const average = getRatingAverage(rating).toFixed(1);
      return `
            <div
              class="rating-row"
              data-rating-id="${rating.id}"
            >
              <span class="rating-index">
                ${padNumber(index + 1)}
              </span>
              <div>
                <div class="rating-film-title">
                  ${escapeHTML(rating.title)}
                </div>
                <div class="rating-film-meta">
                  ${rating.year}
                  /
                  ${getArchiveTypeLabel(rating.type)}
                </div>
              </div>
              <span class="rating-person">
                POLINA
              </span>
              <span class="rating-score">
                ${rating.polina}
              </span>
              <span class="rating-person">
                NASTYA
              </span>
              <span class="rating-score rating-average">
                ${average}
              </span>
            </div>
          `;
    })
    .join("");
}
/* =========================================================
   RATING FILTERS
========================================================= */
document.querySelectorAll(".rating-filter").forEach((button) => {
  button.addEventListener("click", () => {
    document
      .querySelectorAll(".rating-filter")
      .forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    ratingFilter = button.dataset.ratingFilter || "all";
    renderRatings();
  });
});
/* =========================================================
   RATING SORT
========================================================= */
document.querySelectorAll(".sort-button").forEach((button) => {
  button.addEventListener("click", () => {
    document
      .querySelectorAll(".sort-button")
      .forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    ratingSort = button.dataset.sort || "high";
    renderRatings();
  });
});
/* =========================================================
   AUTH
========================================================= */
function updateAuthButton() {
  if (!authButton) {
    return;
  }
  try {
    const saved = localStorage.getItem(USER_STORAGE_KEY);
    if (saved) {
      const user = JSON.parse(saved);
      if (user?.name) {
        authButton.textContent = `${user.name.toUpperCase()} / ACCOUNT`;
        return;
      }
    }
  } catch (error) {
    console.error("User loading error:", error);
  }
  authButton.textContent = "LOG IN / REGISTER";
}
/* =========================================================
   AUTH OPEN
========================================================= */
authButton?.addEventListener("click", () => {
  authModal?.classList.add("active");
});
/* =========================================================
   AUTH CLOSE
========================================================= */
authClose?.addEventListener("click", () => {
  authModal?.classList.remove("active");
});
authModal?.addEventListener("click", (event) => {
  if (event.target === authModal) {
    authModal.classList.remove("active");
  }
});
/* =========================================================
   AUTH TABS
========================================================= */
document.querySelectorAll(".auth-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document
      .querySelectorAll(".auth-tab")
      .forEach((item) => item.classList.remove("active"));
    tab.classList.add("active");
  });
});
/* =========================================================
   AUTH FORM
========================================================= */
authForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = authName?.value.trim();
  if (!name) {
    return;
  }
  localStorage.setItem(
    USER_STORAGE_KEY,
    JSON.stringify({
      name,
    }),
  );
  updateAuthButton();
  authModal?.classList.remove("active");
  authForm.reset();
});
/* =========================================================
   ESCAPE
========================================================= */
document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") {
    return;
  }
  closeIndex();
  closeFilmModal();
  closeMovieNightModal();
  authModal?.classList.remove("active");
});
/* =========================================================
   RESIZE
========================================================= */
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    updateArchiveFocus();
    updateArchiveNavigation();
  }, 120);
});
/* =========================================================
   INIT
========================================================= */
initCustomCursor();
createArchiveControls();
renderArchive();
renderRatings();
updateAuthButton();
updateArchiveCounter();
requestAnimationFrame(() => {
  updateArchiveFocus();
  updateArchiveNavigation();
});
