/* AFTER DARK — clean application layer */
const TMDB_API_KEY = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmMTZiYTQ0NDRjYWQ4ODdjZGY0ZDE1Yjk3MGZlNjlhYSIsIm5iZiI6MTc4NjY1NjM4NS43MDcsInN1YiI6IjZhN2UzNjgxMDYxNjdmYTY2ZmM3YWI2MCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.WLWycZ1zW98G_x0bs90UHsFljmrwpPKoPvZBrP9ho2o";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_URL = "https://image.tmdb.org/t/p/w780";
const TMDB_BACKDROP_URL = "https://image.tmdb.org/t/p/w1280";
const ARCHIVE_STORAGE_KEY = "afterDarkArchive";
const USER_STORAGE_KEY = "afterDarkUser";

/* Load the replacement stylesheet and stop the old stylesheet from fighting it. */
(() => {
  const oldSheet = [...document.querySelectorAll('link[rel="stylesheet"]')].find((link) => link.getAttribute("href") === "style.css");
  if (oldSheet) oldSheet.disabled = true;
  if (!document.querySelector('link[data-after-dark-rewrite]')) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "rewrite.css";
    link.dataset.afterDarkRewrite = "true";
    document.head.appendChild(link);
  }
})();

const body = document.body;
const cursor = document.querySelector(".cursor");
const indexPanel = document.querySelector(".index-panel");
const indexTrigger = document.querySelector(".index-trigger");
const indexClose = document.querySelector(".index-close");
const archiveTrack = document.getElementById("archiveTrack");
const archiveTrackWrap = document.querySelector(".archive-track-wrap");
const visibleCount = document.getElementById("visibleCount");
const totalCount = document.getElementById("totalCount");
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
const movieNightModalBackdrop = document.getElementById("movieNightModalBackdrop");
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
const movieNightArchiveStatus = document.getElementById("movieNightArchiveStatus");
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
const archiveDragState = { active:false, moved:false, startX:0, startScrollLeft:0, pointerId:null };

const ratings = [
  { id:1,title:"THE GODFATHER",type:"film",year:1972,polina:9.5,nastya:9.2,date:"2026-08-12" },
  { id:2,title:"BLACK SWAN",type:"film",year:2010,polina:9.1,nastya:9.4,date:"2026-08-09" },
  { id:3,title:"DARK",type:"series",year:2017,polina:9.4,nastya:8.9,date:"2026-08-04" },
  { id:4,title:"PERFECT BLUE",type:"animation",year:1997,polina:9.6,nastya:9.3,date:"2026-07-28" },
  { id:5,title:"HER",type:"film",year:2013,polina:8.9,nastya:9,date:"2026-07-21" },
];

const TMDB_GENRES = {
  16:"ANIMATION",18:"DRAMA",35:"COMEDY",80:"CRIME",99:"DOCUMENTARY",14:"FANTASY",27:"HORROR",9648:"MYSTERY",10749:"ROMANCE",878:"SCI-FI",53:"THRILLER",28:"ACTION",12:"ADVENTURE",36:"HISTORY",10402:"MUSIC",10751:"FAMILY",10752:"WAR",37:"WESTERN",10759:"ACTION & ADVENTURE",10765:"SCI-FI & FANTASY"
};
const MOVIE_NIGHT_COUNTRIES = {US:"USA",GB:"UK",FR:"FRANCE",DE:"GERMANY",IT:"ITALY",ES:"SPAIN",JP:"JAPAN",KR:"SOUTH KOREA",CN:"CHINA",HK:"HONG KONG",TW:"TAIWAN",IN:"INDIA",CA:"CANADA",AU:"AUSTRALIA",NZ:"NEW ZEALAND",RU:"RUSSIA",SE:"SWEDEN",NO:"NORWAY",DK:"DENMARK",FI:"FINLAND",NL:"NETHERLANDS",BE:"BELGIUM",AT:"AUSTRIA",CH:"SWITZERLAND",PL:"POLAND",CZ:"CZECH REPUBLIC",BR:"BRAZIL",MX:"MEXICO",AR:"ARGENTINA",IE:"IRELAND",TR:"TURKEY",TH:"THAILAND",ID:"INDONESIA",IR:"IRAN",IL:"ISRAEL"};

function escapeHTML(value){return String(value??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&#039;")}
function padNumber(value){return String(value).padStart(2,"0")}
function getYear(value){return value?String(value).slice(0,4):"—"}
function getArchiveStyle(index){return ["wash","bordeaux","flash","darkroom","paper"][index%5]}
function getArchiveTypeLabel(type){return ({film:"ФИЛЬМ",series:"СЕРИАЛ",animation:"АНИМАЦИЯ"}[type]||"КИНО")}
function detectType(data){const ids=(data.genres||[]).map(g=>Number(g.id)).concat(Array.isArray(data.genre_ids)?data.genre_ids.map(Number):[]);if(ids.includes(16))return "animation";if(data.media_type==="tv"||data.first_air_date)return "series";return "film"}
function getFilmGenreIds(film){if(Array.isArray(film.genreIds))return film.genreIds.map(Number);if(Array.isArray(film.genre_ids))return film.genre_ids.map(Number);if(Array.isArray(film.genres))return film.genres.map(g=>Number(g?.id)).filter(Boolean);return []}
function getFilmGenreLabel(film){return getFilmGenreIds(film).map(id=>TMDB_GENRES[id]).filter(Boolean).slice(0,3).join(" / ")||"—"}
function getFilmCountry(film){if(film.countryName)return film.countryName;if(Array.isArray(film.originCountries))return film.originCountries.map(c=>MOVIE_NIGHT_COUNTRIES[c]||c).join(" / ");return film.country||"—"}
function filmIsInArchive(tmdbId){return films.some(f=>Number(f.tmdbId)===Number(tmdbId))}
function loadArchive(){try{const value=JSON.parse(localStorage.getItem(ARCHIVE_STORAGE_KEY)||"[]");return Array.isArray(value)?value:[]}catch{return []}}
function saveArchive(){try{localStorage.setItem(ARCHIVE_STORAGE_KEY,JSON.stringify(films))}catch(error){console.error("Archive saving error:",error)}}
function getVisibleArchiveFilms(){return currentArchiveType==="all"?films:films.filter(f=>f.type===currentArchiveType)}

/* Cursor */
function initCursor(){if(!cursor)return;let mx=innerWidth/2,my=innerHeight/2,cx=mx,cy=my;const interactive="button,a,input,select,textarea,.archive-card,.search-result";document.addEventListener("pointermove",e=>{mx=e.clientX;my=e.clientY;cursor.classList.remove("is-hidden")},{passive:true});document.addEventListener("pointerleave",()=>cursor.classList.add("is-hidden"));function frame(){cx+=(mx-cx)*.18;cy+=(my-cy)*.18;cursor.style.setProperty("--cursor-x",`${cx}px`);cursor.style.setProperty("--cursor-y",`${cy}px`);const el=document.elementFromPoint(mx,my);cursor.classList.toggle("is-hover",!!el?.closest(interactive));requestAnimationFrame(frame)}frame()}

/* Index */
function closeIndex(){indexPanel?.classList.remove("active");body.classList.remove("index-open")}
indexTrigger?.addEventListener("click",()=>{indexPanel?.classList.add("active");body.classList.add("index-open")});indexClose?.addEventListener("click",closeIndex);document.querySelectorAll(".index-nav a").forEach(a=>a.addEventListener("click",closeIndex));

/* Archive */
function createArchiveControls(){if(!archiveTrackWrap||archiveTrackWrap.querySelector(".archive-carousel-ui"))return;const ui=document.createElement("div");ui.className="archive-carousel-ui";ui.innerHTML=`<div class="archive-carousel-buttons"><button class="archive-carousel-button" data-carousel="prev" type="button">←</button><button class="archive-carousel-button" data-carousel="next" type="button">→</button></div><div class="archive-carousel-progress"><span class="archive-carousel-progress-bar"></span></div><div class="archive-carousel-position"><span class="archive-position-current">01</span> / <span class="archive-position-total">01</span></div>`;archiveTrackWrap.appendChild(ui);ui.addEventListener("click",e=>{const b=e.target.closest("[data-carousel]");if(b)scrollArchive(b.dataset.carousel==="next"?1:-1)})}
function updateArchiveCounter(){const visible=getVisibleArchiveFilms().length;visibleCount&&(visibleCount.textContent=padNumber(visible));totalCount&&(totalCount.textContent=padNumber(films.length))}
function renderArchive(){if(!archiveTrack)return;const list=getVisibleArchiveFilms();archiveTrack.innerHTML="";archiveCurrentIndex=0;if(!list.length){archiveTrack.innerHTML=`<div class="archive-empty"><span class="archive-empty-number">00 / EMPTY</span><h3 class="archive-empty-title">NOTHING<br><em>HERE.</em></h3><span class="archive-empty-meta">SEARCH SOMETHING TO ADD TO THE COLLECTION.</span></div>`;updateArchiveCounter();updateArchiveNavigation();return}list.forEach((film,index)=>{const card=document.createElement("article");card.className="archive-card";card.dataset.id=film.id;const image=film.image||"https://via.placeholder.com/600x900/080706/e8ddc8?text=NO+IMAGE";card.innerHTML=`<div class="archive-poster" data-style="${getArchiveStyle(index)}"><img src="${escapeHTML(image)}" alt="${escapeHTML(film.title||"UNTITLED")}" loading="lazy" draggable="false"><span class="archive-index">${padNumber(index+1)}</span></div><div class="archive-card-info"><h3 class="archive-card-title">${escapeHTML(film.title||"UNTITLED")}</h3><span class="archive-card-year">${escapeHTML(film.year||"—")}</span></div><div class="archive-card-director">${escapeHTML(film.director||"DIRECTOR UNKNOWN")}</div><div class="archive-actions"><button class="archive-action archive-action-start" data-action="watch" type="button">${film.watchStarted?"CONTINUE WATCHING":"START WATCHING"}</button><button class="archive-action" data-action="rate" type="button">RATE</button><button class="archive-action archive-action-remove" data-action="remove" type="button">×</button></div>`;archiveTrack.appendChild(card)});archiveTrack.scrollLeft=0;updateArchiveCounter();requestAnimationFrame(()=>{updateArchiveFocus();updateArchiveNavigation()})}
function getArchiveCards(){return archiveTrack?[...archiveTrack.querySelectorAll(".archive-card")]:[]}
function updateArchiveFocus(){if(!archiveTrack)return;const cards=getArchiveCards();if(!cards.length){archiveCurrentIndex=0;updateArchiveNavigation();return}const rect=archiveTrack.getBoundingClientRect(),center=rect.left+rect.width/2;let closest=0,dist=Infinity;cards.forEach((card,i)=>{const r=card.getBoundingClientRect(),d=r.left+r.width/2-center,a=Math.abs(d),influence=Math.min(a/Math.max(r.width,1),2);if(a<dist){dist=a;closest=i}card.style.setProperty("--card-scale",1-influence*.045);card.style.setProperty("--card-opacity",Math.max(.55,1-influence*.18));card.style.setProperty("--card-y",`${influence*8}px`);card.style.setProperty("--card-rotate",`${Math.max(-1.5,Math.min(1.5,d*.002))}deg`);card.classList.toggle("is-active",i===closest)});archiveCurrentIndex=closest;updateArchiveNavigation()}
function updateArchiveNavigation(){if(!archiveTrackWrap)return;const cards=getArchiveCards(),cur=archiveTrackWrap.querySelector(".archive-position-current"),total=archiveTrackWrap.querySelector(".archive-position-total"),progress=archiveTrackWrap.querySelector(".archive-carousel-progress-bar"),prev=archiveTrackWrap.querySelector('[data-carousel="prev"]'),next=archiveTrackWrap.querySelector('[data-carousel="next"]');if(!cards.length){cur&&(cur.textContent="00");total&&(total.textContent="00");progress&&(progress.style.width="0%");if(prev)prev.disabled=true;if(next)next.disabled=true;return}const i=Math.max(0,Math.min(archiveCurrentIndex,cards.length-1));cur&&(cur.textContent=padNumber(i+1));total&&(total.textContent=padNumber(cards.length));if(progress)progress.style.width=`${cards.length<2?100:i/(cards.length-1)*100}%`;if(prev)prev.disabled=i===0;if(next)next.disabled=i===cards.length-1}
function scrollArchive(dir){const cards=getArchiveCards();if(!cards.length)return;const next=Math.max(0,Math.min(cards.length-1,archiveCurrentIndex+dir));if(next===archiveCurrentIndex)return;cards[next].scrollIntoView({behavior:"smooth",block:"nearest",inline:"center"});archiveCurrentIndex=next;updateArchiveNavigation()}
function snapArchive(){if(!archiveTrack||archiveDragState.active)return;const cards=getArchiveCards();if(!cards.length)return;let best=cards[0],distance=Infinity;const center=archiveTrack.getBoundingClientRect().left+archiveTrack.getBoundingClientRect().width/2;cards.forEach(card=>{const r=card.getBoundingClientRect(),d=Math.abs(r.left+r.width/2-center);if(d<distance){distance=d;best=card}});best.scrollIntoView({behavior:"smooth",block:"nearest",inline:"center"})}
archiveTrack?.addEventListener("scroll",()=>{if(!archiveScrollFrame)archiveScrollFrame=requestAnimationFrame(()=>{updateArchiveFocus();archiveScrollFrame=null});clearTimeout(archiveSnapTimer);archiveSnapTimer=setTimeout(snapArchive,180)},{passive:true});
archiveTrack?.addEventListener("pointerdown",e=>{if(e.button!==0||e.target.closest("button,a,input,select,textarea"))return;archiveDragState.active=true;archiveDragState.moved=false;archiveDragState.startX=e.clientX;archiveDragState.startScrollLeft=archiveTrack.scrollLeft;archiveDragState.pointerId=e.pointerId;archiveTrack.classList.add("dragging");try{archiveTrack.setPointerCapture(e.pointerId)}catch{}});
archiveTrack?.addEventListener("pointermove",e=>{if(!archiveDragState.active)return;const delta=e.clientX-archiveDragState.startX;if(Math.abs(delta)>6)archiveDragState.moved=true;archiveTrack.scrollLeft=archiveDragState.startScrollLeft-delta*1.15});
function endArchiveDrag(){if(!archiveDragState.active)return;archiveDragState.active=false;archiveTrack?.classList.remove("dragging");try{if(archiveDragState.pointerId!==null&&archiveTrack?.hasPointerCapture(archiveDragState.pointerId))archiveTrack.releasePointerCapture(archiveDragState.pointerId)}catch{}const moved=archiveDragState.moved;archiveDragState.pointerId=null;archiveDragState.moved=false;if(moved)setTimeout(()=>archiveDragState.moved=false,80);setTimeout(snapArchive,120)}
archiveTrack?.addEventListener("pointerup",endArchiveDrag);archiveTrack?.addEventListener("pointercancel",endArchiveDrag);archiveTrack?.addEventListener("keydown",e=>{if(e.key==="ArrowRight"){e.preventDefault();scrollArchive(1)}if(e.key==="ArrowLeft"){e.preventDefault();scrollArchive(-1)}});
document.querySelectorAll(".archive-section .filter").forEach(button=>button.addEventListener("click",()=>{document.querySelectorAll(".archive-section .filter").forEach(b=>b.classList.remove("active"));button.classList.add("active");currentArchiveType=button.dataset.type||"all";renderArchive()}));
archiveTrack?.addEventListener("click",e=>{if(archiveDragState.moved)return;const card=e.target.closest(".archive-card");if(!card)return;const film=films.find(f=>String(f.id)===String(card.dataset.id));if(!film)return;const action=e.target.closest("[data-action]")?.dataset.action;if(action==="remove"){e.preventDefault();removeFilm(film.id);return}if(action==="rate"){document.getElementById("ratings")?.scrollIntoView({behavior:"smooth"});return}if(action==="watch"){film.watchStarted=true;saveArchive();renderArchive();openFilmModal(film);return}openFilmModal(film)});
function removeFilm(id){films=films.filter(f=>String(f.id)!==String(id));saveArchive();renderArchive()}

/* Search */
function setSearchCount(count){const label=document.querySelector(".search-info span:first-child");if(label)label.textContent=count==null?"FILMS / SERIES / ANIMATION":`RESULTS / ${padNumber(count)}`}
function showSearchMessage(text){if(!searchResults)return;searchResults.innerHTML=`<div class="search-result search-empty"><span class="search-result-title">${escapeHTML(text)}</span></div>`;searchResults.classList.add("has-results")}
async function searchTMDB(query){const q=query.trim();searchController?.abort();if(!q){searchResults&&(searchResults.innerHTML="",searchResults.classList.remove("has-results"));setSearchCount(null);return}searchController=new AbortController();showSearchMessage("SEARCHING...");setSearchCount(0);try{const response=await fetch(`${TMDB_BASE_URL}/search/multi?query=${encodeURIComponent(q)}&language=ru-RU&include_adult=false&page=1`,{headers:{Authorization:`Bearer ${TMDB_API_KEY}`},signal:searchController.signal});if(!response.ok)throw new Error(`TMDB ERROR ${response.status}`);const data=await response.json();const results=(data.results||[]).filter(x=>x.media_type==="movie"||x.media_type==="tv").slice(0,15);renderSearchResults(results);setSearchCount(results.length)}catch(error){if(error.name==="AbortError")return;console.error(error);showSearchMessage("SEARCH ERROR");setSearchCount(0)}}
function renderSearchResults(results){if(!searchResults)return;if(!results.length){showSearchMessage("NOTHING FOUND");return}searchResults.innerHTML=results.map((item,index)=>{const title=item.title||item.name||"UNTITLED",original=item.original_title||item.original_name||"",date=item.release_date||item.first_air_date||"",poster=item.poster_path?`${TMDB_IMAGE_URL}${item.poster_path}`:"",exists=filmIsInArchive(item.id);return `<div class="search-result" data-tmdb-id="${item.id}" data-media-type="${item.media_type}"><span class="search-result-number">${padNumber(index+1)}</span>${poster?`<div class="search-result-poster"><img src="${escapeHTML(poster)}" alt="${escapeHTML(title)}"></div>`:`<div class="search-result-poster"></div>`}<div class="search-result-main"><div class="search-result-title">${escapeHTML(title)}</div><div class="search-result-meta"><span>${item.media_type==="movie"?"ФИЛЬМ":"СЕРИАЛ"}</span><span>${escapeHTML(getYear(date))}</span>${original?`<span>${escapeHTML(original)}</span>`:""}</div></div><button class="search-add-button ${exists?"added":""}" type="button" data-add-tmdb="${item.id}" data-media-type="${item.media_type}" ${exists?"disabled":""}>${exists?"ADDED":"ADD TO LIBRARY"}</button></div>`}).join("");searchResults.classList.add("has-results")}
searchInput?.addEventListener("input",()=>{clearTimeout(searchTimer);searchTimer=setTimeout(()=>searchTMDB(searchInput.value),350)});searchButton?.addEventListener("click",()=>searchTMDB(searchInput?.value||""));searchInput?.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();searchTMDB(searchInput.value)}});
searchResults?.addEventListener("click",async e=>{const add=e.target.closest("[data-add-tmdb]");if(add){e.preventDefault();e.stopPropagation();if(add.disabled)return;const film=await addTMDBToArchive(Number(add.dataset.addTmdb),add.dataset.mediaType);if(film){add.textContent="ADDED";add.classList.add("added");add.disabled=true;searchInput?.focus()}return}const result=e.target.closest(".search-result[data-tmdb-id]");if(!result)return;const film=await fetchTMDBFilm(Number(result.dataset.tmdbId),result.dataset.mediaType);if(film)openFilmModal(film)});
document.addEventListener("click",e=>{if(!searchResults?.classList.contains("has-results"))return;if(e.target.closest("#searchInput,#searchButton,#searchResults"))return;searchResults.innerHTML="";searchResults.classList.remove("has-results");setSearchCount(null)});

/* TMDB */
async function fetchWithTimeout(url,options={},timeout=8000){const controller=new AbortController();const external=options.signal;const timer=setTimeout(()=>controller.abort(),timeout);const abort=()=>controller.abort();external?.addEventListener("abort",abort,{once:true});try{return await fetch(url,{...options,signal:controller.signal})}finally{clearTimeout(timer);external?.removeEventListener("abort",abort)}}
async function fetchTMDBFilm(tmdbId,mediaType="movie",signal){try{const response=await fetchWithTimeout(`${TMDB_BASE_URL}/${mediaType}/${tmdbId}?language=ru-RU&append_to_response=credits`,{headers:{Authorization:`Bearer ${TMDB_API_KEY}`},signal},8000);if(!response.ok)throw new Error(`TMDB DETAIL ${response.status}`);return normalizeTMDBFilm(await response.json())}catch(error){if(error.name!=="AbortError")console.error("TMDB detail error",error);return null}}
function normalizeTMDBFilm(data){const mediaType=data.media_type||(data.first_air_date?"tv":"movie"),crew=data.credits?.crew||[],director=crew.find(p=>p.job==="Director")?.name||data.created_by?.[0]?.name||"РЕЖИССЁР НЕ УКАЗАН",genreIds=(data.genres||[]).map(g=>Number(g.id)).filter(Boolean),countries=data.origin_country?.length?data.origin_country:(data.production_countries||[]).map(c=>c.iso_3166_1).filter(Boolean),title=data.title||data.name||"UNTITLED",type=detectType({...data,media_type:mediaType});return{id:`tmdb-${data.id}`,tmdbId:data.id,mediaType,title:title.toUpperCase(),originalTitle:(data.original_title||data.original_name||"").toUpperCase(),year:getYear(data.release_date||data.first_air_date),director:director.toUpperCase(),type,genreIds,genres:genreIds.map(id=>TMDB_GENRES[id]).filter(Boolean),originCountries:countries,countryName:countries.map(c=>MOVIE_NIGHT_COUNTRIES[c]||c).join(" / ")||"—",runtime:data.runtime||data.episode_run_time?.[0]||null,voteAverage:Number(data.vote_average||0),voteCount:Number(data.vote_count||0),popularity:Number(data.popularity||0),image:data.poster_path?`${TMDB_IMAGE_URL}${data.poster_path}`:"",backdrop:data.backdrop_path?`${TMDB_BACKDROP_URL}${data.backdrop_path}`:"",description:data.overview||"Описание отсутствует.",watchStarted:false,adult:Boolean(data.adult)}}
async function addTMDBToArchive(tmdbId,mediaType="movie"){const existing=films.find(f=>Number(f.tmdbId)===Number(tmdbId));if(existing)return existing;const film=await fetchTMDBFilm(tmdbId,mediaType);if(!film)return null;films.push(film);saveArchive();renderArchive();return film}

/* Film modal */
let filmModalTimer=null;
function openFilmModal(film){if(!filmModal)return;clearTimeout(filmModalTimer);filmModal.classList.add("active");modalLoader?.classList.remove("is-hidden");modalResult?.classList.remove("active");const n=modalLoader?.querySelector(".loader-number");let value=0;const timer=setInterval(()=>{value=Math.min(99,value+8);if(n)n.textContent=padNumber(value)},45);filmModalTimer=setTimeout(()=>{clearInterval(timer);modalLoader?.classList.add("is-hidden");modalTitle&&(modalTitle.textContent=film.title||"UNTITLED");modalYear&&(modalYear.textContent=film.year||"—");modalDirector&&(modalDirector.textContent=film.director||"DIRECTOR UNKNOWN");modalDescription&&(modalDescription.textContent=film.description||"Описание отсутствует.");modalResult?.classList.add("active")},600)}
function closeFilmModal(){clearTimeout(filmModalTimer);filmModal?.classList.remove("active")}modalClose?.addEventListener("click",closeFilmModal);filmModal?.addEventListener("click",e=>{if(e.target===filmModal)closeFilmModal()});

/* Movie Night filters */
function activate(selector,button){document.querySelectorAll(selector).forEach(b=>b.classList.remove("active"));button.classList.add("active")}
document.querySelectorAll("[data-filter-type]").forEach(b=>b.addEventListener("click",()=>{activate("[data-filter-type]",b);selectedMovieType=b.dataset.filterType||"all"}));document.querySelectorAll("[data-genre]").forEach(b=>b.addEventListener("click",()=>{activate("[data-genre]",b);selectedMovieGenre=b.dataset.genre||"any"}));document.querySelectorAll("[data-year]").forEach(b=>b.addEventListener("click",()=>{activate("[data-year]",b);selectedMovieYear=b.dataset.year||"any"}));document.querySelectorAll("[data-rating]").forEach(b=>b.addEventListener("click",()=>{activate("[data-rating]",b);selectedMovieRating=Number(b.dataset.rating||0)}));movieNightCountrySelect?.addEventListener("change",()=>selectedMovieCountry=movieNightCountrySelect.value||"any");excludeArchiveControl?.addEventListener("change",()=>excludeArchive=excludeArchiveControl.checked);

/* Movie Night pool */
const genreMap={drama:[18],comedy:[35],thriller:[53],horror:[27],crime:[80],romance:[10749],fantasy:[14],"sci-fi":[878],mystery:[9648],documentary:[99]};
function applyYear(params,type){const key=type==="tv"?"first_air_date":"primary_release_date";const ranges={"before-1990":[null,"1989-12-31"],"1990-2000":["1990-01-01","1999-12-31"],"2000-2010":["2000-01-01","2009-12-31"],"2010-2020":["2010-01-01","2019-12-31"],"2020":["2020-01-01",null]};const range=ranges[selectedMovieYear];if(range){if(range[0])params.set(`${key}.gte`,range[0]);if(range[1])params.set(`${key}.lte`,range[1])}}
function buildDiscoverParams(type){const p=new URLSearchParams({language:"ru-RU",include_adult:"false",include_video:"false",page:"1",vote_count_gte:"50",sort_by:Number(selectedMovieRating)>=7?"vote_average.desc":"popularity.desc"});if(selectedMovieGenre!=="any")p.set("with_genres",(genreMap[selectedMovieGenre]||[]).join("|"));if(selectedMovieType==="animation")p.set("with_genres","16");if(selectedMovieCountry!=="any")p.set("with_origin_country",selectedMovieCountry);if(selectedMovieRating)p.set("vote_average.gte",String(selectedMovieRating));applyYear(p,type);return p}
function endpoints(){if(selectedMovieType==="film"||selectedMovieType==="animation")return ["movie"];if(selectedMovieType==="series")return ["tv"];return ["movie","tv"]}
function matchesPool(item){if(selectedMovieType==="series"&&item.media_type!=="tv")return false;if(selectedMovieType==="film"&&item.media_type!=="movie")return false;if(selectedMovieType==="animation"&&!(item.media_type==="movie"&&item.genre_ids?.includes(16)))return false;if(selectedMovieGenre!=="any"&&!item.genre_ids?.some(id=>(genreMap[selectedMovieGenre]||[]).includes(id)))return false;if(selectedMovieYear!=="any"){const y=Number(getYear(item.media_type==="tv"?item.first_air_date:item.release_date));if(!y)return false;if(selectedMovieYear==="before-1990"&&y>=1990)return false;if(selectedMovieYear==="1990-2000"&&(y<1990||y>1999))return false;if(selectedMovieYear==="2000-2010"&&(y<2000||y>2009))return false;if(selectedMovieYear==="2010-2020"&&(y<2010||y>2019))return false;if(selectedMovieYear==="2020"&&y<2020)return false}if(selectedMovieRating&&Number(item.vote_average||0)<selectedMovieRating)return false;if(excludeArchive&&filmIsInArchive(item.id))return false;return Boolean(item.title||item.name)}
async function fetchDiscover(type,signal){const response=await fetchWithTimeout(`${TMDB_BASE_URL}/discover/${type}?${buildDiscoverParams(type)}`,{headers:{Authorization:`Bearer ${TMDB_API_KEY}`},signal},7000);if(!response.ok)throw new Error(`TMDB DISCOVER ${response.status}`);const data=await response.json();return(data.results||[]).map(item=>({...item,media_type:type})).filter(matchesPool)}
async function getMovieNightPool(signal){const results=(await Promise.all(endpoints().map(type=>fetchDiscover(type,signal)))).flat();const unique=new Map();results.forEach(item=>{const key=`${item.media_type}-${item.id}`;if(!unique.has(key))unique.set(key,item)});return[...unique.values()]}

/* Movie Night animation */
function createMovieNightAnimation(){const stage=movieNightRevealTrack||movieNightReveal;if(!stage)return{promise:Promise.resolve(),setSelected(){},finish(){},fail(){},stop(){}};stage.innerHTML="";const scene=document.createElement("div");scene.className="movie-night-search-animation";const core=document.createElement("div");core.className="movie-night-search-core";const ring=document.createElement("div");ring.className="movie-night-search-ring";const particles=document.createElement("div");particles.className="movie-night-search-particles";const grain=document.createElement("div");grain.className="movie-night-search-grain";scene.append(core,ring,particles,grain);stage.appendChild(scene);for(let i=0;i<22;i++){const p=document.createElement("span");p.className="movie-night-search-particle";p.style.setProperty("--angle",`${Math.random()*360}deg`);p.style.setProperty("--distance",`${80+Math.random()*190}px`);p.style.setProperty("--size",`${1+Math.random()*2.5}px`);p.style.setProperty("--opacity",`${.25+Math.random()*.65}`);p.style.setProperty("--duration",`${1+Math.random()*1.1}s`);p.style.setProperty("--delay",`${Math.random()*.7}s`);particles.appendChild(p)}let selectedTitle="",finished=false,started=performance.now(),timer;let resolvePromise;const promise=new Promise(r=>resolvePromise=r);const finish=()=>{if(finished)return;const wait=Math.max(0,2200-(performance.now()-started));clearTimeout(timer);timer=setTimeout(()=>{if(finished)return;scene.classList.add("is-finished");const title=document.createElement("span");title.className="movie-night-search-title";title.textContent=selectedTitle||"UNTITLED";scene.appendChild(title);timer=setTimeout(()=>{finished=true;resolvePromise()},600)},wait)};return{promise,setSelected(title){selectedTitle=String(title||"").toUpperCase()},finish,fail(){if(finished)return;finished=true;clearTimeout(timer);resolvePromise()},stop(){finished=true;clearTimeout(timer);stage.innerHTML="";resolvePromise()}}}

function resetMovieNightModal(){movieNightModal?.classList.remove("is-result","is-error","is-selecting");movieNightFinal?.classList.remove("visible");if(movieNightPoster)movieNightPoster.removeAttribute("src");if(movieNightTitle)movieNightTitle.textContent="MOVIE TITLE";if(movieNightYear)movieNightYear.textContent="2026";if(movieNightRating)movieNightRating.textContent="★ 8.0";if(movieNightType)movieNightType.textContent="FILM";if(movieNightSubmeta)movieNightSubmeta.textContent="USA / DRAMA";if(movieNightOverview)movieNightOverview.textContent="Description.";if(movieNightArchiveStatus){movieNightArchiveStatus.textContent="FROM TMDB";movieNightArchiveStatus.classList.remove("in-archive")}if(movieNightOpen)movieNightOpen.classList.remove("is-hidden");if(movieNightAdd){movieNightAdd.classList.remove("is-hidden","added");movieNightAdd.disabled=false;movieNightAdd.textContent="ADD TO ARCHIVE"}if(movieNightRevealTrack)movieNightRevealTrack.innerHTML=""}
function openMovieNightModal(){if(!movieNightModal)return;resetMovieNightModal();movieNightModal.classList.add("active","is-selecting");movieNightModal.setAttribute("aria-hidden","false");body.classList.add("movie-night-modal-open")}
function closeMovieNightModal(){movieNightController?.abort();movieNightController=null;movieNightBusy=false;if(decideButton){decideButton.disabled=false;decideButton.classList.remove("is-loading");const s=decideButton.querySelector("span");if(s)s.textContent="DECIDE"}movieNightModal?.classList.remove("active","is-selecting","is-result","is-error");movieNightModal?.setAttribute("aria-hidden","true");body.classList.remove("movie-night-modal-open")}
movieNightModalClose?.addEventListener("click",closeMovieNightModal);movieNightModalBackdrop?.addEventListener("click",closeMovieNightModal);
function populateMovieNightResult(film){currentMovieNightFilm=film;const exists=filmIsInArchive(film.tmdbId);if(movieNightPoster){movieNightPoster.src=film.image||"";movieNightPoster.alt=film.title||""}if(movieNightPosterIndex)movieNightPosterIndex.textContent=padNumber(Math.floor(Math.random()*99)+1);if(movieNightType)movieNightType.textContent=getArchiveTypeLabel(film.type);if(movieNightYear)movieNightYear.textContent=film.year||"—";if(movieNightRating)movieNightRating.textContent=film.voteAverage?`★ ${film.voteAverage.toFixed(1)}`:"★ —";if(movieNightTitle)movieNightTitle.textContent=film.title||"UNTITLED";if(movieNightSubmeta)movieNightSubmeta.textContent=`${getFilmCountry(film)} / ${getFilmGenreLabel(film)}`;if(movieNightOverview)movieNightOverview.textContent=film.description||"Описание отсутствует.";if(movieNightArchiveStatus){movieNightArchiveStatus.textContent=exists?"ALREADY IN ARCHIVE":"FROM TMDB";movieNightArchiveStatus.classList.toggle("in-archive",exists)}if(movieNightAdd){movieNightAdd.disabled=exists;movieNightAdd.textContent=exists?"IN ARCHIVE":"ADD TO ARCHIVE";movieNightAdd.classList.toggle("added",exists)}movieNightOpen?.classList.remove("is-hidden")}
function showMovieNightResult(film){populateMovieNightResult(film);movieNightModal?.classList.remove("is-selecting","is-error");movieNightModal?.classList.add("is-result");movieNightFinal?.classList.add("visible")}
function showMovieNightError(message){if(!movieNightModal)return;movieNightModal.classList.remove("is-selecting");movieNightModal.classList.add("is-result","is-error");if(movieNightPoster)movieNightPoster.removeAttribute("src");if(movieNightTitle)movieNightTitle.textContent="NO MATCH";if(movieNightYear)movieNightYear.textContent="—";if(movieNightRating)movieNightRating.textContent="—";if(movieNightType)movieNightType.textContent="ARCHIVE";if(movieNightSubmeta)movieNightSubmeta.textContent="TMDB SEARCH";if(movieNightOverview)movieNightOverview.textContent=message||"COULDN'T FIND A TITLE WITH THESE PARAMETERS.";if(movieNightArchiveStatus)movieNightArchiveStatus.textContent="NO MATCH";movieNightOpen?.classList.add("is-hidden");movieNightAdd?.classList.add("is-hidden");movieNightFinal?.classList.add("visible")}
async function chooseMovieNightFilm(){if(movieNightBusy||!decideButton)return;movieNightBusy=true;decideButton.disabled=true;decideButton.classList.add("is-loading");const span=decideButton.querySelector("span");if(span)span.textContent="SEARCHING";const controller=new AbortController();movieNightController=controller;openMovieNightModal();const animation=createMovieNightAnimation();try{const pool=await getMovieNightPool(controller.signal);if(controller.signal.aborted){animation.stop();return}if(!pool.length){animation.fail();await animation.promise;showMovieNightError("COULDN'T FIND A TITLE WITH THESE PARAMETERS.");return}const selected=pool[Math.floor(Math.random()*pool.length)];animation.setSelected(selected.title||selected.name||"UNTITLED");const film=await fetchTMDBFilm(selected.id,selected.media_type,controller.signal);if(controller.signal.aborted){animation.stop();return}if(!film){animation.fail();await animation.promise;showMovieNightError("TMDB COULDN'T LOAD THIS TITLE.");return}animation.finish();await animation.promise;if(!controller.signal.aborted)showMovieNightResult(film)}catch(error){if(error.name==="AbortError"||controller.signal.aborted){animation.stop();return}console.error("Movie Night error",error);animation.fail();await animation.promise;showMovieNightError("TMDB COULDN'T LOAD THE SELECTION. TRY AGAIN.")}finally{if(movieNightController!==controller)return;movieNightController=null;movieNightBusy=false;if(decideButton){decideButton.disabled=false;decideButton.classList.remove("is-loading");if(span)span.textContent="DECIDE"}}}
decideButton?.addEventListener("click",chooseMovieNightFilm);
movieNightOpen?.addEventListener("click",()=>{if(!currentMovieNightFilm)return;const film=currentMovieNightFilm;closeMovieNightModal();setTimeout(()=>openFilmModal(film),180)});
movieNightAdd?.addEventListener("click",async()=>{if(!currentMovieNightFilm||movieNightAdd.disabled)return;const added=await addTMDBToArchive(currentMovieNightFilm.tmdbId,currentMovieNightFilm.mediaType);if(!added)return;movieNightAdd.disabled=true;movieNightAdd.textContent="ADDED TO ARCHIVE";movieNightAdd.classList.add("added");movieNightArchiveStatus&&(movieNightArchiveStatus.textContent="IN YOUR ARCHIVE",movieNightArchiveStatus.classList.add("in-archive"))});

/* Ratings */
function ratingValue(item){return(Number(item.polina||0)+Number(item.nastya||0))/2}
function renderRatings(){if(!ratingsList)return;let list=[...ratings];if(ratingFilter!=="all")list=list.filter(x=>x.type===ratingFilter);list.sort((a,b)=>ratingSort==="high"?ratingValue(b)-ratingValue(a):ratingValue(a)-ratingValue(b));ratingsList.innerHTML=list.map((item,i)=>`<article class="rating-card"><span class="rating-card-index">${padNumber(i+1)}</span><div class="rating-card-main"><h3 class="rating-card-title">${escapeHTML(item.title)}</h3><span class="rating-card-meta">${escapeHTML(getArchiveTypeLabel(item.type))} / ${item.year||"—"}</span></div><div class="rating-card-scores"><span>${Number(item.polina).toFixed(1)}</span><span>${Number(item.nastya).toFixed(1)}</span></div><strong class="rating-card-average">${ratingValue(item).toFixed(1)}</strong></article>`).join("")}
document.querySelectorAll("[data-rating-filter]").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll("[data-rating-filter]").forEach(x=>x.classList.remove("active"));b.classList.add("active");ratingFilter=b.dataset.ratingFilter||"all";renderRatings()}));document.querySelectorAll("[data-rating-sort]").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll("[data-rating-sort]").forEach(x=>x.classList.remove("active"));b.classList.add("active");ratingSort=b.dataset.ratingSort||"high";renderRatings()}));

/* Simple local identity modal */
function openAuth(){authModal?.classList.add("active")}function closeAuth(){authModal?.classList.remove("active")}authButton?.addEventListener("click",openAuth);authClose?.addEventListener("click",closeAuth);authModal?.addEventListener("click",e=>{if(e.target===authModal)closeAuth()});authForm?.addEventListener("submit",e=>{e.preventDefault();const name=authName?.value.trim();if(!name)return;try{localStorage.setItem(USER_STORAGE_KEY,JSON.stringify({name,loggedAt:new Date().toISOString()}))}catch{}closeAuth()});

window.addEventListener("keydown",e=>{if(e.key!=="Escape")return;if(indexPanel?.classList.contains("active"))closeIndex();if(filmModal?.classList.contains("active"))closeFilmModal();if(movieNightModal?.classList.contains("active"))closeMovieNightModal();if(authModal?.classList.contains("active"))closeAuth()});
window.addEventListener("resize",()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{updateArchiveFocus();updateArchiveNavigation()},120)});

function init(){initCursor();createArchiveControls();renderArchive();renderRatings();updateArchiveCounter();updateArchiveNavigation()}
init();
