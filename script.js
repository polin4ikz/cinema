const TMDB_API_KEY =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMTZiYTQ0NDRjYWQ4ODdjZGY0ZDE1Yjk3MGZlNjlhYSIsIm5iZiI6MTc4NjY1NjM4NS43MDcsInN1YiI6IjZhN2UzNjgxMDYxNjdmYTY2ZmM3YWI2MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.WLWycZ1zW98G_x0bs90UHsFljmrwpPKoPvZBrP9ho2o";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_URL = "https://image.tmdb.org/t/p/w780";
const TMDB_BACKDROP_URL = "https://image.tmdb.org/t/p/w1280";
const ARCHIVE_STORAGE_KEY = "afterDarkArchive";
const USER_STORAGE_KEY = "afterDarkUser";
const body = document.body;
const cursor = document.querySelector(".cursor");
const indexPanel = document.querySelector(".index-panel");
const indexTrigger = document.querySelector(".index-trigger");
const indexClose = document.querySelector(".index-close");
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
const movieNightRevealStage = document.getElementById("movieNightRevealStage");
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
const archiveDragState = {
  active: false,
  moved: false,
  startX: 0,
  startScrollLeft: 0,
  pointerId: null,
};
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
   ARCHIVE STORAGE
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
  return ["wash", "bordeaux", "flash", "darkroom", "paper"][index % 5];
}
function getArchiveTypeLabel(type) {
  return (
    {
      film: "ФИЛЬМ",
      series: "СЕРИАЛ",
      animation: "АНИМАЦИЯ",
    }[type] || "КИНО"
  );
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
  return currentArchiveType === "all"
    ? films
    : films.filter((film) => film.type === currentArchiveType);
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
      .map((genre) => (typeof genre === "object" ? Number(genre.id) : null))
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
  return film.country || "—";
}
function filmIsInArchive(tmdbId) {
  return films.some((film) => Number(film.tmdbId) === Number(tmdbId));
}
/* =========================================================
   CUSTOM CURSOR
========================================================= */
function initCustomCursor() {
  if (!cursor) {
    return;
  }
  cursor.style.pointerEvents = "none";
  cursor.setAttribute("aria-hidden", "true");
  let mouseX = innerWidth / 2;
  let mouseY = innerHeight / 2;
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
  function checkHover() {
    const element = document.elementFromPoint(mouseX, mouseY);
    const interactive = element?.closest(interactiveSelector);
    cursor.classList.toggle("is-hover", Boolean(interactive));
  }
  document.addEventListener(
    "pointermove",
    (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      cursor.classList.remove("is-hidden");
    },
    { passive: true },
  );
  document.addEventListener("pointerleave", () => {
    cursor.classList.add("is-hidden", "is-hover");
  });
  document.addEventListener("pointerenter", (event) => {
    cursor.classList.remove("is-hidden");
    mouseX = cursorX = event.clientX;
    mouseY = cursorY = event.clientY;
  });
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
   ARCHIVE
========================================================= */
function createArchiveControls() {
  if (
    !archiveTrackWrap ||
    archiveTrackWrap.querySelector(".archive-carousel-ui")
  ) {
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
      <span class="archive-position-current">01</span>
      /
      <span class="archive-position-total">01</span>
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
function updateArchiveCounter() {
  const visible = getVisibleArchiveFilms().length;
  const total = films.length;
  visibleCount && (visibleCount.textContent = padNumber(visible));
  totalCount && (totalCount.textContent = padNumber(total));
  archiveCount && (archiveCount.textContent = total);
}
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
          NOTHING<br><em>HERE.</em>
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
archiveTrack?.addEventListener("click", (event) => {
  if (archiveDragState.moved) {
    return;
  }
  const actionElement = event.target.closest("[data-action]");
  const card = event.target.closest(".archive-card");
  if (!card) {
    return;
  }
  const film = films.find(
    (item) => String(item.id) === String(card.dataset.id),
  );
  if (!film) {
    return;
  }
  const action = actionElement?.dataset.action;
  if (action === "remove") {
    event.preventDefault();
    event.stopPropagation();
    removeFilm(film.id);
    return;
  }
  if (action === "rate") {
    event.preventDefault();
    event.stopPropagation();
    document.getElementById("ratings")?.scrollIntoView({
      behavior: "smooth",
    });
    return;
  }
  if (action === "watch") {
    event.preventDefault();
    event.stopPropagation();
    film.watchStarted = true;
    saveArchive();
    renderArchive();
    openFilmModal(film);
    return;
  }
  openFilmModal(film);
});
function removeFilm(id) {
  films = films.filter((film) => String(film.id) !== String(id));
  saveArchive();
  renderArchive();
}
function getArchiveCards() {
  return archiveTrack
    ? [...archiveTrack.querySelectorAll(".archive-card")]
    : [];
}
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
    const distance = rect.left + rect.width / 2 - trackCenter;
    const absoluteDistance = Math.abs(distance);
    if (absoluteDistance < closestDistance) {
      closestDistance = absoluteDistance;
      closestIndex = index;
    }
    const influence = Math.min(absoluteDistance / Math.max(rect.width, 1), 2);
    card.style.setProperty("--card-scale", 1 - influence * 0.045);
    card.style.setProperty(
      "--card-opacity",
      Math.max(0.55, 1 - influence * 0.18),
    );
    card.style.setProperty("--card-y", `${influence * 8}px`);
    card.style.setProperty(
      "--card-rotate",
      `${Math.max(-1.5, Math.min(1.5, distance * 0.002))}deg`,
    );
    card.classList.toggle("is-active", index === closestIndex);
  });
  archiveCurrentIndex = closestIndex;
  updateArchiveNavigation();
}
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
    current && (current.textContent = "00");
    total && (total.textContent = "00");
    progress && (progress.style.width = "0%");
    if (prev) {
      prev.disabled = true;
    }
    if (next) {
      next.disabled = true;
    }
    return;
  }
  const index = Math.max(0, Math.min(archiveCurrentIndex, cards.length - 1));
  current && (current.textContent = padNumber(index + 1));
  total && (total.textContent = padNumber(cards.length));
  if (progress) {
    progress.style.width = `${
      cards.length <= 1 ? 100 : (index / (cards.length - 1)) * 100
    }%`;
  }
  if (prev) {
    prev.disabled = index <= 0;
  }
  if (next) {
    next.disabled = index >= cards.length - 1;
  }
}
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
  { passive: true },
);
function snapArchiveToClosest() {
  if (!archiveTrack || archiveDragState.active) {
    return;
  }
  const cards = getArchiveCards();
  if (!cards.length) {
    return;
  }
  const center =
    archiveTrack.getBoundingClientRect().left +
    archiveTrack.getBoundingClientRect().width / 2;
  let closestCard = null;
  let closestDistance = Infinity;
  cards.forEach((card) => {
    const rect = card.getBoundingClientRect();
    const distance = Math.abs(rect.left + rect.width / 2 - center);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestCard = card;
    }
  });
  closestCard?.scrollIntoView({
    behavior: "smooth",
    block: "nearest",
    inline: "center",
  });
}
archiveTrack?.addEventListener("pointerdown", (event) => {
  if (event.button !== 0 || !archiveTrack) {
    return;
  }
  if (event.target.closest("button, a, input, select, textarea")) {
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
  } catch {}
});
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
function endArchiveDrag() {
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
  } catch {}
  const wasMoved = archiveDragState.moved;
  archiveDragState.pointerId = null;
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
   SEARCH
========================================================= */
function setSearchCountMode(hasResults) {
  const label = document.querySelector(".search-info span:first-child");
  const strong = label?.querySelector("strong");
  if (!strong) {
    return;
  }
  const text = label.childNodes[label.childNodes.length - 1];
  if (text?.nodeType === Node.TEXT_NODE) {
    text.textContent = hasResults ? " RESULTS" : " TITLES";
  }
}
async function searchTMDB(query) {
  if (!query.trim()) {
    if (searchResults) {
      searchResults.innerHTML = "";
      searchResults.classList.remove("has-results");
    }
    setSearchCountMode(false);
    return;
  }
  searchController?.abort();
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
    renderSearchResults(
      (data.results || [])
        .filter(
          (item) => item.media_type === "movie" || item.media_type === "tv",
        )
        .slice(0, 15),
    );
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
                    ? `<span>${escapeHTML(originalTitle)}</span>`
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
  if (event.key !== "Enter") {
    return;
  }
  event.preventDefault();
  searchTMDB(searchInput.value);
});
searchResults?.addEventListener("click", async (event) => {
  const addButton = event.target.closest("[data-add-tmdb]");
  if (addButton) {
    event.preventDefault();
    event.stopPropagation();
    if (addButton.disabled) {
      return;
    }
    const added = await addTMDBToArchive(
      Number(addButton.dataset.addTmdb),
      addButton.dataset.mediaType || "movie",
    );
    if (added) {
      addButton.textContent = "ADDED";
      addButton.classList.add("added");
      addButton.disabled = true;
      searchInput?.focus();
    }
    return;
  }
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
   TMDB
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
    return normalizeTMDBFilm(await response.json());
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error("TMDB detail error:", error);
    }
    return null;
  }
}
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
  const countries = data.origin_country?.length
    ? data.origin_country
    : Array.isArray(data.production_countries)
      ? data.production_countries.map((country) => country.iso_3166_1)
      : [];
  const countryName = countries.length
    ? countries
        .map((country) => MOVIE_NIGHT_COUNTRIES[country] || country)
        .join(" / ")
    : "—";
  const title = data.title || data.name || "UNTITLED";
  const type = detectType({
    ...data,
    media_type: mediaType,
  });
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
    year: getYear(data.release_date || data.first_air_date),
    director: director.toUpperCase(),
    type,
    genreIds,
    genres: genreIds.map((id) => TMDB_GENRES[id]).filter(Boolean),
    originCountries: countries,
    countryName,
    runtime: data.runtime || data.episode_run_time?.[0] || null,
    voteAverage: Number(data.vote_average || 0),
    voteCount: Number(data.vote_count || 0),
    popularity: Number(data.popularity || 0),
    image: data.poster_path ? `${TMDB_IMAGE_URL}${data.poster_path}` : "",
    backdrop: data.backdrop_path
      ? `${TMDB_BACKDROP_URL}${data.backdrop_path}`
      : "",
    description: data.overview || "Описание отсутствует.",
    watchStarted: false,
    adult: Boolean(data.adult),
  };
}
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
  modalLoader && (modalLoader.style.display = "flex");
  modalResult?.classList.remove("active");
  let counter = 0;
  const loaderNumber = modalLoader?.querySelector(".loader-number");
  const interval = setInterval(() => {
    counter = Math.min(counter + 7, 99);
    if (loaderNumber) {
      loaderNumber.textContent = padNumber(counter);
    }
  }, 45);
  setTimeout(() => {
    clearInterval(interval);
    if (modalLoader) {
      modalLoader.style.display = "none";
    }
    modalTitle && (modalTitle.textContent = film.title || "UNTITLED");
    modalYear && (modalYear.textContent = film.year || "—");
    modalDirector &&
      (modalDirector.textContent = film.director || "DIRECTOR UNKNOWN");
    modalDescription &&
      (modalDescription.textContent =
        film.description || "Описание отсутствует.");
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
[
  ["[data-filter-type]", "filterType", "selectedMovieType", "all"],
  ["[data-genre]", "genre", "selectedMovieGenre", "any"],
  ["[data-year]", "year", "selectedMovieYear", "any"],
  ["[data-rating]", "rating", "selectedMovieRating", 0],
].forEach(([selector, data, state, fallback]) => {
  document.querySelectorAll(selector).forEach((button) => {
    button.addEventListener("click", () => {
      resetMovieNightSelection(selector, button);
      const value = button.dataset[data];
      if (state === "selectedMovieRating") {
        selectedMovieRating = Number(value || fallback);
      } else {
        window[state] = value || fallback;
      }
    });
  });
});
movieNightCountrySelect?.addEventListener("change", () => {
  selectedMovieCountry = movieNightCountrySelect.value || "any";
});
excludeArchiveControl?.addEventListener("change", () => {
  excludeArchive = Boolean(excludeArchiveControl.checked);
});
/* =========================================================
   MOVIE NIGHT MODAL
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
  movieNightTitle && (movieNightTitle.textContent = "MOVIE TITLE");
  movieNightYear && (movieNightYear.textContent = "2026");
  movieNightRating && (movieNightRating.textContent = "★ 8.0");
  movieNightType && (movieNightType.textContent = "FILM");
  movieNightSubmeta && (movieNightSubmeta.textContent = "USA / DRAMA");
  movieNightOverview && (movieNightOverview.textContent = "Description.");
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
  if (movieNightRevealStage) {
    movieNightRevealStage.innerHTML = "";
    movieNightRevealStage.classList.remove("is-complete", "is-failed");
  }
  if (movieNightRevealTrack) {
    movieNightRevealTrack.classList.remove("movie-night-animation-active");
  }
  setMovieNightRevealStatus("");
}
function openMovieNightModal() {
  if (!movieNightModal) {
    return;
  }
  resetMovieNightModal();
  movieNightModal.classList.add("active", "is-selecting");
  movieNightModal.setAttribute("aria-hidden", "false");
  movieNightReveal?.style.setProperty("pointer-events", "auto", "important");
  body.classList.add("movie-night-modal-open");
}
function closeMovieNightModal() {
  if (!movieNightModal) {
    return;
  }
  const controller = movieNightController;
  if (controller) {
    controller.abort();
  }
  movieNightController = null;
  movieNightBusy = false;
  if (decideButton) {
    decideButton.disabled = false;
    decideButton.classList.remove("is-loading");
    const span = decideButton.querySelector("span");
    if (span) {
      span.textContent = "DECIDE";
    }
  }
  movieNightReveal?.style.setProperty("pointer-events", "none", "important");
  movieNightModal.classList.remove(
    "active",
    "is-selecting",
    "is-result",
    "is-error",
  );
  movieNightModal.setAttribute("aria-hidden", "true");
  if (
    movieNightModal.contains(document.activeElement) &&
    typeof document.activeElement.blur === "function"
  ) {
    document.activeElement.blur();
  }
  body.classList.remove("movie-night-modal-open");
}
movieNightModalClose?.addEventListener("click", closeMovieNightModal);
movieNightModalBackdrop?.addEventListener("click", closeMovieNightModal);
/* =========================================================
   MOVIE NIGHT — CINEMATIC SEARCH ANIMATION
========================================================= */
function createMovieNightSearchAnimation() {
  const startedAt = performance.now();
  const timers = new Set();

  let finished = false;
  let selectedTitle = "";
  let finishTimer = null;
  let resolveAnimation;

  const promise = new Promise((resolve) => {
    resolveAnimation = resolve;
  });

  const stage = movieNightRevealStage || movieNightRevealTrack;

  if (!stage) {
    return {
      promise,
      setPool() {},
      setSelected() {},
      finish() {
        resolveAnimation();
      },
      fail() {
        resolveAnimation();
      },
      stop() {
        resolveAnimation();
      },
    };
  }

  stage.innerHTML = "";
  stage.classList.remove("is-complete", "is-failed");

  const scene = document.createElement("div");
  scene.className = "movie-night-search-animation";

  const core = document.createElement("div");
  core.className = "movie-night-search-core";

  const ring = document.createElement("div");
  ring.className = "movie-night-search-ring";

  const particles = document.createElement("div");
  particles.className = "movie-night-search-particles";

  const grain = document.createElement("div");
  grain.className = "movie-night-search-grain";

  scene.appendChild(core);
  scene.appendChild(ring);
  scene.appendChild(particles);
  scene.appendChild(grain);

  stage.appendChild(scene);

  function clearTimers() {
    timers.forEach((timer) => clearTimeout(timer));
    timers.clear();

    if (finishTimer) {
      clearTimeout(finishTimer);
      finishTimer = null;
    }
  }

  function schedule(callback, delay) {
    const timer = setTimeout(() => {
      timers.delete(timer);

      if (!finished) {
        callback();
      }
    }, delay);

    timers.add(timer);
    return timer;
  }

  function createParticles() {
    particles.innerHTML = "";

    for (let i = 0; i < 20; i += 1) {
      const particle = document.createElement("span");

      particle.className = "movie-night-search-particle";

      particle.style.setProperty(
        "--angle",
        `${Math.random() * 360}deg`,
      );

      particle.style.setProperty(
        "--distance",
        `${70 + Math.random() * 170}px`,
      );

      particle.style.setProperty(
        "--size",
        `${1 + Math.random() * 2.5}px`,
      );

      particle.style.setProperty(
        "--opacity",
        `${0.25 + Math.random() * 0.6}`,
      );

      particle.style.setProperty(
        "--duration",
        `${1.1 + Math.random() * 1.1}s`,
      );

      particle.style.setProperty(
        "--delay",
        `${Math.random() * 0.8}s`,
      );

      particles.appendChild(particle);
    }
  }

  createParticles();

  function setPool() {
    if (finished) {
      return;
    }

    createParticles();
  }

  function setSelected(title) {
    if (!title || finished) {
      return;
    }

    selectedTitle = String(title).toUpperCase();
  }

  function finish(resultStatus = "MATCH FOUND") {
    if (finished) {
      return;
    }

    const elapsed = performance.now() - startedAt;
    const minimumDuration = 2200;
    const remaining = Math.max(0, minimumDuration - elapsed);

    clearTimers();

    if (resultStatus !== "MATCH FOUND") {
      finished = true;
      stage.classList.add("is-failed");
      resolveAnimation();
      return;
    }

    schedule(() => {
      if (finished) {
        return;
      }

      particles.classList.add("is-hidden");
      core.classList.add("is-hidden");
      ring.classList.add("is-hidden");

      const finalTitle = document.createElement("span");

      finalTitle.className = "movie-night-search-title";
      finalTitle.textContent = selectedTitle || "UNTITLED";

      scene.appendChild(finalTitle);

      finishTimer = setTimeout(() => {
        finishTimer = null;

        if (finished) {
          return;
        }

        finished = true;
        resolveAnimation();
      }, 700);
    }, remaining);
  }

  function stop() {
    if (finished) {
      return;
    }

    finished = true;
    clearTimers();
    stage.innerHTML = "";
    resolveAnimation();
  }

  return {
    promise,
    setPool,
    setSelected,
    finish,
    fail() {
      finish("NO MATCH FOUND");
    },
    stop,
  };
}
/* =========================================================
   MOVIE NIGHT FILTER / POOL
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
function matchesMovieNightGenre(item) {
  if (selectedMovieGenre === "any") {
    return true;
  }
  if (selectedMovieGenre === "animation") {
    return Array.isArray(item.genre_ids) && item.genre_ids.includes(16);
  }
  const ids = getMovieNightGenreIds();
  if (!ids) {
    return true;
  }
  return (
    Array.isArray(item.genre_ids) &&
    ids.some((id) => item.genre_ids.includes(id))
  );
}
function matchesMovieNightType(item) {
  if (selectedMovieType === "all") {
    return true;
  }
  if (selectedMovieType === "series") {
    return item.media_type === "tv";
  }
  if (selectedMovieType === "film") {
    return item.media_type === "movie";
  }
  if (selectedMovieType === "animation") {
    return (
      item.media_type === "movie" &&
      Array.isArray(item.genre_ids) &&
      item.genre_ids.includes(16)
    );
  }
  return true;
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
  const date =
    item.media_type === "tv"
      ? item.first_air_date
      : item.primary_release_date || item.release_date;
  const year = Number(getYear(date));
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
  const rating = Number(selectedMovieRating);
  if (!rating) {
    return true;
  }
  return Number(item.vote_average || 0) >= rating;
}
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
function showMovieNightResult(film) {
  if (!film || !movieNightModal) {
    return;
  }
  populateMovieNightResult(film);
  movieNightModal.classList.remove("is-selecting");
  movieNightModal.classList.add("is-result");
  movieNightReveal?.classList.add("hidden");
  requestAnimationFrame(() => {
    movieNightFinal?.classList.add("visible");
  });
}
function showMovieNightError(message) {
  if (!movieNightModal) {
    return;
  }
  movieNightModal.classList.remove("is-selecting");
  movieNightModal.classList.add("is-result", "is-error");
  movieNightReveal?.classList.add("hidden");
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
   MOVIE NIGHT SEARCH
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

  const controller = new AbortController();
  movieNightController = controller;

  openMovieNightModal();

  const animation = createMovieNightSearchAnimation();

  try {
    const pool = await getMovieNightPool(controller.signal);

    if (controller.signal.aborted) {
      animation.stop();
      return;
    }

    animation.setPool(pool);

    if (!pool.length) {
      animation.fail();
      await animation.promise;

      if (
        !controller.signal.aborted &&
        movieNightController === controller
      ) {
        showMovieNightError(
          "COULDN'T FIND A TITLE WITH THESE PARAMETERS.",
        );
      }

      return;
    }

    const selected = chooseRandomFromPool(pool);

    if (!selected) {
      animation.fail();
      await animation.promise;

      if (
        !controller.signal.aborted &&
        movieNightController === controller
      ) {
        showMovieNightError("COULDN'T FIND A TITLE.");
      }

      return;
    }

    animation.setSelected(
      selected.title || selected.name || "UNTITLED",
    );

    const mediaType =
      selected.media_type ||
      (selected.first_air_date ? "tv" : "movie");

    const film = await fetchTMDBFilm(
      selected.id,
      mediaType,
      controller.signal,
    );

    if (controller.signal.aborted) {
      animation.stop();
      return;
    }

    if (!film) {
      animation.fail();
      await animation.promise;

      if (
        !controller.signal.aborted &&
        movieNightController === controller
      ) {
        showMovieNightError(
          "TMDB COULDN'T LOAD THIS TITLE.",
        );
      }

      return;
    }

    animation.finish();

    await animation.promise;

    if (
      !controller.signal.aborted &&
      movieNightController === controller
    ) {
      showMovieNightResult(film);
    }
  } catch (error) {
    if (
      error.name === "AbortError" ||
      controller.signal.aborted
    ) {
      animation.stop();
      return;
    }

    console.error("Movie Night error:", error);

    animation.fail();
    await animation.promise;

    if (
      !controller.signal.aborted &&
      movieNightController === controller
    ) {
      showMovieNightError(
        "TMDB COULDN'T LOAD THE SELECTION. TRY AGAIN.",
      );
    }
  } finally {
    if (movieNightController !== controller) {
      return;
    }

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
decideButton?.addEventListener("click", () => {
  chooseMovieNightFilm();
});
/* =========================================================
   MOVIE NIGHT ACTIONS
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
function getRatingValue(rating) {
  const polina = Number(rating.polina || 0);
  const nastya = Number(rating.nastya || 0);
  return (polina + nastya) / 2;
}
function renderRatings() {
  if (!ratingsList) {
    return;
  }
  let list = [...ratings];
  if (ratingFilter !== "all") {
    list = list.filter((item) => item.type === ratingFilter);
  }
  list.sort((a, b) => {
    const ratingA = getRatingValue(a);
    const ratingB = getRatingValue(b);
    return ratingSort === "high" ? ratingB - ratingA : ratingA - ratingB;
  });
  if (!list.length) {
    ratingsList.innerHTML = "";
    return;
  }
  ratingsList.innerHTML = list
    .map((item, index) => {
      return `
          <article class="rating-card">
            <span class="rating-card-index">
              ${padNumber(index + 1)}
            </span>
            <div class="rating-card-main">
              <h3 class="rating-card-title">
                ${escapeHTML(item.title)}
              </h3>
              <span class="rating-card-meta">
                ${escapeHTML(getArchiveTypeLabel(item.type))}
                /
                ${item.year || "—"}
              </span>
            </div>
            <div class="rating-card-scores">
              <span>
                ${Number(item.polina).toFixed(1)}
              </span>
              <span>
                ${Number(item.nastya).toFixed(1)}
              </span>
            </div>
            <strong class="rating-card-average">
              ${getRatingValue(item).toFixed(1)}
            </strong>
          </article>
        `;
    })
    .join("");
}
document.querySelectorAll("[data-rating-filter]").forEach((button) => {
  button.addEventListener("click", () => {
    document
      .querySelectorAll("[data-rating-filter]")
      .forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    ratingFilter = button.dataset.ratingFilter || "all";
    renderRatings();
  });
});
document.querySelectorAll("[data-rating-sort]").forEach((button) => {
  button.addEventListener("click", () => {
    document
      .querySelectorAll("[data-rating-sort]")
      .forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    ratingSort = button.dataset.ratingSort || "high";
    renderRatings();
  });
});
/* =========================================================
   AUTH
========================================================= */
function getStoredUser() {
  try {
    const saved = localStorage.getItem(USER_STORAGE_KEY);
    if (!saved) {
      return null;
    }
    return JSON.parse(saved);
  } catch {
    return null;
  }
}
function saveUser(user) {
  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  } catch (error) {
    console.error("User saving error:", error);
  }
}
function openAuthModal() {
  authModal?.classList.add("active");
}
function closeAuthModal() {
  authModal?.classList.remove("active");
}
authButton?.addEventListener("click", openAuthModal);
authClose?.addEventListener("click", closeAuthModal);
authModal?.addEventListener("click", (event) => {
  if (event.target === authModal) {
    closeAuthModal();
  }
});
authForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = authName?.value.trim();
  if (!name) {
    return;
  }
  saveUser({
    name,
    loggedAt: new Date().toISOString(),
  });
  closeAuthModal();
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
   INITIALIZATION
========================================================= */
function init() {
  initCustomCursor();
  createArchiveControls();
  renderArchive();
  renderRatings();
  updateArchiveCounter();
  updateArchiveNavigation();
}
init();
