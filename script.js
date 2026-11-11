/* =====================================================================
   شاشة كلية تكنولوجيا المعلومات – جامعة البترا
   ===================================================================== */

const categories = [
  { id: "clubs",        name: "الأندية الطلابية",      icon: "✦", color: "#36e0e8" },
  { id: "majors",       name: "التخصصات",              icon: "⌘", color: "#4da3ff" },
  { id: "achievements", name: "المشاركات والإنجازات",  icon: "🏆", color: "#f0b86e" },
  { id: "research",     name: "الأبحاث العلمية",        icon: "⌬", color: "#a78bfa" },
  { id: "projects",     name: "مشاريع التخرج",         icon: "◈", color: "#44f2ba" },
  { id: "abet",         name: "ABET",                  icon: "✓", color: "#ff7a8a" },
  { id: "threat",       name: "Live Cyber Threat Map", icon: "◉", color: "#ff5c7a", url: "https://livethreatmap.radware.com/" }
];

const ALL_COLOR = "#36e0e8";
const vcats = categories.filter(c => !c.url);

/* قائمة الفيديوهات
   title : الاسم الظاهر تحت الفيديو
   sound : true = الفيديو فيه صوت مسموع ← الموسيقى تتوقف تلقائياً وقت تشغيله
           (تم قياسها بـ ffmpeg: الفيديوهات 04، 05، 06، 08، 12 فيها مسار صوت لكنه صامت تماماً)
   vol   : مستوى صوت الفيديو (0 إلى 1) لتقريب الفيديوهات العالية من المنخفضة */
const videos = [
  { title: "الحياة الطلابية والأندية",                 file: "videos/video01.mp4", category: "clubs",        sound: false },

  { title: "نبذة عن الكلية والأقسام",                  file: "videos/video03.mp4", category: "majors",       sound: false },
  { title: "علم الحاسوب",                              file: "videos/video04.mp4", category: "majors",       sound: false },
  { title: "أمن المعلومات",                            file: "videos/video05.mp4", category: "majors",       sound: false },
  { title: "الواقع الافتراضي والمعزز",                 file: "videos/video06.mp4", category: "majors",       sound: false },
  { title: "هندسة البرمجيات",                          file: "videos/video09.mp4", category: "majors",       sound: true, vol: 0.9 },
  { title: "علم البيانات والذكاء الاصطناعي",           file: "videos/video08.mp4", category: "majors",       sound: false },

  { title: "أخبار وإنجازات الكلية",                    file: "videos/video02.mp4", category: "achievements", sound: false },
  { title: "مشاركة علمية دولية · ICCIAA 2026",         file: "videos/video11.mp4", category: "achievements", sound: false },
  { title: "إنجازات فريق VCoders",                     file: "videos/video17.mp4", category: "achievements", sound: true, vol: 0.5 },

  { title: "بحث علمي: مشروع السمح",                    file: "videos/video10.mp4", category: "research",     sound: true, vol: 1 },

  { title: "مشاريع تخرج طلابنا",                       file: "videos/video12.mp4", category: "projects",     sound: false },
  { title: "Analytica: تحليل تفاعل الجمهور",           file: "videos/video13.mp4", category: "projects",     sound: true, vol: 0.9 },
  { title: "ساعة ذكية مساعدة",                         file: "videos/video14.mp4", category: "projects",     sound: true, vol: 1 },
  { title: "UOP Virtual Campus",                       file: "videos/video15.mp4", category: "projects",     sound: true, vol: 0.75 },
  { title: "جولة افتراضية في جامعة البترا",            file: "videos/video16.mp4", category: "projects",     sound: true, vol: 0.75 },

  { title: "اعتماد ABET",                              file: "videos/video18.mp4", category: "abet",         sound: false }
];

/* الموسيقى الخلفية: أي ملف mp3 تحطوه بمجلد music وتضيفوه هون */
const MUSIC_TRACKS = ["music/track-a.mp3", "music/track-b.mp3"];
const MUSIC_VOLUME = 0.35;          // مستوى الموسيقى (0 إلى 1)
const IDLE_RESUME_MS = 2 * 60 * 1000; // إذا ما حدا لمس الشاشة دقيقتين: يرجع العرض يشتغل لحاله

/* ===================================================================== */

const $ = id => document.getElementById(id);
const player = $("player");
const bgm = $("bgm");
const list = $("categoryList");
const emptyState = $("emptyState");
const overlay = $("overlay");
const screenShell = $("screenShell");

let currentCategory = "all";
let playlist = [...videos];
let currentIndex = 0;
let isPaused = false;
let soundOn = true;      // الصوت العام (كل شي)
let musicOn = true;      // الموسيقى الخلفية
let audioUnlocked = false;

const colorOf = id => categories.find(c => c.id === id)?.color || ALL_COLOR;
const catName = id => categories.find(c => c.id === id)?.name || "";
const isWebMode = () => document.body.classList.contains("web-mode");
const currentItem = () => (isWebMode() || !playlist.length) ? null : playlist[currentIndex];
const titleOf = (item, i, pl) => item.title?.trim() || `${catName(item.category)} · ${i + 1}`;
const escapeHTML = s => s.replace(/[&<>"]/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch]));

/* ---------------- الأقسام ---------------- */
function renderCategories() {
  list.innerHTML = "";
  list.appendChild(makeCategoryButton("all", "الكل", "▦", ALL_COLOR, videos.length));
  categories.forEach(c => list.appendChild(
    makeCategoryButton(c.id, c.name, c.icon, c.color, c.url ? "LIVE" : videos.filter(v => v.category === c.id).length)
  ));
}

function makeCategoryButton(id, name, icon, color, count) {
  const button = document.createElement("button");
  button.className = "category" + (id === currentCategory ? " active" : "");
  button.dataset.id = id;
  button.style.setProperty("--c", color);
  button.innerHTML = `<span class="cat-icon">${icon}</span><span class="cat-name">${name}</span><span class="cat-count">${count}</span>`;
  button.addEventListener("click", () => selectCategory(id));
  return button;
}

function refreshActiveButton() {
  [...list.children].forEach(b => b.classList.toggle("active", b.dataset.id === currentCategory));
}

function selectCategory(id, atEnd = false) {
  currentCategory = id;
  playlist = id === "all" ? [...videos] : videos.filter(v => v.category === id);
  currentIndex = atEnd ? Math.max(playlist.length - 1, 0) : 0;
  refreshActiveButton();
  const web = categories.find(c => c.id === id && c.url);
  if (web) { showWeb(web); return; }
  hideWeb();
  loadCurrent();
}

/* ---------------- قسم الموقع المباشر ---------------- */
const webFrame = $("webFrame");
function showWeb(cat) {
  player.pause();
  player.removeAttribute("src");
  player.load();
  emptyState.style.display = "none";
  overlay.style.display = "flex";
  $("nowTitle").textContent = cat.name;
  $("nowCategory").textContent = "بث مباشر";
  $("nowCount").textContent = "";
  $("nextInfo").textContent = "";
  document.documentElement.style.setProperty("--c", cat.color);
  if (webFrame.getAttribute("src") !== cat.url) webFrame.src = cat.url;
  $("webOpen").href = cat.url;
  webFrame.style.display = "block";
  document.body.classList.add("web-mode");
  document.body.classList.remove("voice");
  updateAudio();
}
function hideWeb() {
  if (!isWebMode()) return;
  webFrame.style.display = "none";
  webFrame.removeAttribute("src");
  document.body.classList.remove("web-mode");
}

/* ---------------- تشغيل الفيديو ---------------- */
function loadCurrent() {
  if (!playlist.length) {
    player.pause();
    player.removeAttribute("src");
    player.load();
    emptyState.style.display = "flex";
    overlay.style.display = "none";
    document.body.classList.remove("voice");
    updateAudio();
    return;
  }

  const item = playlist[currentIndex];
  document.documentElement.style.setProperty("--c", colorOf(item.category));

  emptyState.style.display = "none";
  overlay.style.display = "flex";
  $("nowTitle").textContent = titleOf(item, currentIndex, playlist);
  $("nowCategory").textContent = catName(item.category);
  $("nowCount").textContent = playlist.length > 1 ? `${currentIndex + 1} / ${playlist.length}` : "";

  const ni = (currentIndex + 1) % playlist.length;
  $("nextInfo").innerHTML = playlist.length > 1 ? `التالي: <b>${escapeHTML(titleOf(playlist[ni], ni, playlist))}</b>` : "";

  $("progressBar").style.width = "0%";
  $("fsBar").style.width = "0%";
  $("curTime").textContent = "0:00";
  $("durTime").textContent = "0:00";

  isPaused = false;
  updatePauseButton();
  // الموسيقى تبدأ تخفت قبل ما يبلش الفيديو اللي فيه صوت
  updateAudio();

  // أول فيديو (ما في فيديو قبله) ما بيحتاج انتظار الـ fade
  const firstLoad = !player.getAttribute("src");
  player.classList.add("swap");
  clearTimeout(loadCurrent.t);
  loadCurrent.t = setTimeout(() => {
    player.src = item.file;
    applyVideoAudio();
    player.load();
    playVideo();
  }, firstLoad ? 0 : 300);
}

function applyVideoAudio() {
  const item = currentItem();
  player.volume = item?.vol ?? 1;
  player.muted = !(item && item.sound && soundOn && audioUnlocked);
}

function playVideo() {
  return player.play()
    .then(() => { isPaused = false; updatePauseButton(); updateAudio(); })
    .catch(e => {
      if (e && e.name === "AbortError") return;   // انقطع لأنه انضغط "التالي" بسرعة: عادي
      // المتصفح منع التشغيل بصوت قبل أول ضغطة: نشغله صامت ونطلب ضغطة
      if (!player.muted) {
        lockAudio();
        player.muted = true;
        return player.play().then(() => { isPaused = false; updatePauseButton(); }).catch(() => {});
      }
      isPaused = true; updatePauseButton();
    });
}

player.addEventListener("playing", () => {
  player.classList.remove("swap");
  // فيديو جديد بدون sound محدد؟ نكتشف لحالنا إذا فيه مسار صوت
  const item = currentItem();
  if (item && item.sound === undefined) {
    const src = player.getAttribute("src");
    setTimeout(() => {
      if (player.getAttribute("src") !== src || item.sound !== undefined) return;
      item.sound = !!(player.mozHasAudio || player.webkitAudioDecodedByteCount > 0 || player.audioTracks?.length);
      updateAudio();
    }, 800);
  }
});
["play", "pause"].forEach(ev => player.addEventListener(ev, updateAudio));

function nextVideo() {
  if (!playlist.length) return;
  if (currentCategory !== "all" && currentIndex === playlist.length - 1) {
    const i = vcats.findIndex(c => c.id === currentCategory);
    return selectCategory(vcats[(i + 1) % vcats.length].id);
  }
  currentIndex = (currentIndex + 1) % playlist.length;
  loadCurrent();
}

function previousVideo() {
  if (!playlist.length) return;
  if (currentCategory !== "all" && currentIndex === 0) {
    const i = vcats.findIndex(c => c.id === currentCategory);
    return selectCategory(vcats[(i - 1 + vcats.length) % vcats.length].id, true);
  }
  currentIndex = (currentIndex - 1 + playlist.length) % playlist.length;
  loadCurrent();
}

function togglePause() {
  if (!currentItem()) return;
  if (player.paused) { isPaused = false; playVideo(); }
  else { player.pause(); isPaused = true; }
  updatePauseButton();
  updateAudio();
}

function updatePauseButton() {
  const label = isPaused ? "▶ تشغيل" : "Ⅱ إيقاف";
  $("pauseBtn").textContent = label;
  $("fsPause").textContent = label;
}

let autoPlay = true;
player.addEventListener("ended", () => {
  if (autoPlay) nextVideo();
  else { isPaused = true; updatePauseButton(); updateAudio(); }
});
$("autoBtn").addEventListener("click", () => {
  autoPlay = !autoPlay;
  $("autoBtn").classList.toggle("off", !autoPlay);
  $("autoBtn").setAttribute("aria-pressed", autoPlay);
  $("autoText").textContent = autoPlay ? "العرض التلقائي مفعّل" : "العرض التلقائي متوقف";
  if (autoPlay && player.ended) nextVideo();
});

const fmt = t => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`;
player.addEventListener("timeupdate", () => {
  if (player.duration) {
    const pct = `${player.currentTime / player.duration * 100}%`;
    $("progressBar").style.width = pct;
    $("fsBar").style.width = pct;
    $("curTime").textContent = fmt(player.currentTime);
    $("durTime").textContent = fmt(player.duration);
  }
});

// إذا فيديو ما اشتغل (ملف ناقص مثلاً) ننتقل للي بعده
player.addEventListener("error", () => {
  if (!player.getAttribute("src")) return;
  console.warn("تعذر تشغيل:", player.getAttribute("src"));
  player.classList.remove("swap");
  isPaused = true; updatePauseButton(); updateAudio();   // الموسيقى ترجع بدل ما تضل الشاشة ساكتة
  if (autoPlay && (playlist.length > 1 || currentCategory !== "all")) setTimeout(nextVideo, 1200);
});

/* =====================================================================
   الموسيقى الخلفية
   القاعدة: الموسيقى شغالة إلا إذا كان في فيديو "بصوت" شغال هلأ
   → تخفت بنعومة لما يبلش الفيديو اللي فيه صوت، وترجع لما يخلص أو ينوقف
   ===================================================================== */
let musicIdx = 0;
bgm.src = MUSIC_TRACKS[0];
bgm.volume = 0;
bgm.addEventListener("ended", () => {
  musicIdx = (musicIdx + 1) % MUSIC_TRACKS.length;
  bgm.src = MUSIC_TRACKS[musicIdx];
  if (musicShouldPlay()) bgm.play().catch(() => {});
});
bgm.addEventListener("error", () => console.warn("ملف الموسيقى غير موجود:", bgm.src));

function voiceActive() {
  const item = currentItem();
  return !!(item && item.sound && soundOn && !isPaused);
}
function musicShouldPlay() {
  return musicOn && soundOn && !voiceActive();
}

let fadeTimer = null;
function fadeMusic(target, ms, done) {
  clearInterval(fadeTimer);
  const start = bgm.volume, t0 = performance.now();
  fadeTimer = setInterval(() => {
    const k = Math.min((performance.now() - t0) / ms, 1);
    bgm.volume = Math.max(0, Math.min(1, start + (target - start) * (k * k * (3 - 2 * k))));
    if (k >= 1) { clearInterval(fadeTimer); done && done(); }
  }, 30);
}

function updateAudio() {
  if (musicShouldPlay()) {
    if (bgm.paused) {
      bgm.play().then(() => fadeMusic(MUSIC_VOLUME, 1800)).catch(e => { if (e.name === "NotAllowedError") lockAudio(); });
    } else fadeMusic(MUSIC_VOLUME, 1800);
  } else if (!bgm.paused) {
    fadeMusic(0, 900, () => { if (!musicShouldPlay()) bgm.pause(); });
  }
  if (audioUnlocked && player.getAttribute("src")) applyVideoAudio();
  document.body.classList.toggle("voice", voiceActive() && !player.muted);
  renderAudioButtons();
}

function renderAudioButtons() {
  const ducked = musicOn && soundOn && voiceActive();
  const pill = $("musicPill");
  pill.classList.toggle("music-on", musicOn && soundOn && !ducked);
  pill.classList.toggle("music-ducked", ducked);
  pill.classList.toggle("music-off", !musicOn || !soundOn);
  $("musicText").textContent = musicOn && soundOn ? "ON" : "OFF";
  ["musicBtn", "fsMusic"].forEach(id => {
    $(id).textContent = musicOn ? "🎵 الموسيقى" : "🎵 الموسيقى ✕";
    $(id).classList.toggle("is-off", !musicOn);
  });
  $("soundBtn").textContent = soundOn ? "🔊 الصوت" : "🔇 الصوت";
  $("soundBtn").classList.toggle("is-off", !soundOn);
}

function toggleMusic() { musicOn = !musicOn; updateAudio(); }
function toggleSound() { soundOn = !soundOn; updateAudio(); }
$("musicBtn").addEventListener("click", toggleMusic);
$("fsMusic").addEventListener("click", toggleMusic);
$("musicPill").addEventListener("click", toggleMusic);
$("soundBtn").addEventListener("click", toggleSound);

/* المتصفح بيمنع الصوت قبل أول تفاعل (إلا إذا اشتغل من ملف التشغيل START_BOOTH.bat) */
function lockAudio() {
  // المتصفح رفض الصوت: نرجع نطلب ضغطة (حتى لو كنا مفكرين إنه انفتح)
  audioUnlocked = false;
  document.body.classList.add("audio-locked");
}
function unlockAudio() {
  if (audioUnlocked) return;
  audioUnlocked = true;
  document.body.classList.remove("audio-locked");
  if (currentItem() && player.getAttribute("src")) {
    applyVideoAudio();
    if (!isPaused && player.paused) playVideo();
  }
  updateAudio();
}
// فقط الأحداث اللي المتصفح بيعتبرها "تفاعل حقيقي" (بالشاشات اللمس: لما يرفع الإصبع مش لما يلمس)
["pointerdown", "pointerup", "touchend", "click", "keydown"].forEach(ev => document.addEventListener(ev, () => {
  if (navigator.userActivation && !navigator.userActivation.isActive) return;
  unlockAudio();
}, { capture: true }));

/* نجرب: إذا المتصفح بيسمح بالصوت التلقائي، منفعّله فوراً بدون ما نستنى ضغطة */
async function probeAutoplay() {
  try {
    if (navigator.getAutoplayPolicy && navigator.getAutoplayPolicy("mediaelement") === "allowed") return unlockAudio();
    bgm.volume = 0;
    await bgm.play();
    unlockAudio();
  } catch (e) { lockAudio(); }
}

/* ---------------- الأزرار ---------------- */
$("nextBtn").addEventListener("click", nextVideo);
$("prevBtn").addEventListener("click", previousVideo);
$("pauseBtn").addEventListener("click", togglePause);
$("unlockBtn").addEventListener("click", unlockAudio);

$("kioskBtn").addEventListener("click", async () => {
  document.body.classList.toggle("kiosk");
  try {
    if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
    else await document.exitFullscreen();
  } catch (e) {}
});

async function exitFull() {
  document.body.classList.remove("kiosk");
  try { if (document.fullscreenElement) await document.exitFullscreen(); } catch (e) {}
}
$("fsExit").addEventListener("click", exitFull);
$("kioskExit").addEventListener("click", exitFull);
$("fsPause").addEventListener("click", togglePause);
$("fsNext").addEventListener("click", nextVideo);
$("fsPrev").addEventListener("click", previousVideo);

player.addEventListener("dblclick", () => {
  if (document.fullscreenElement) exitFull();
  else $("fullscreenBtn").click();
});

document.addEventListener("fullscreenchange", () => {
  if (!document.fullscreenElement) document.body.classList.remove("kiosk", "ui-hidden");
  showUI();
});

let uiTimer;
function showUI() {
  document.body.classList.remove("ui-hidden");
  clearTimeout(uiTimer);
  if (document.fullscreenElement) {
    uiTimer = setTimeout(() => document.body.classList.add("ui-hidden"), 3000);
  }
}
["mousemove", "pointerdown", "touchstart"].forEach(ev => document.addEventListener(ev, showUI));

$("fullscreenBtn").addEventListener("click", async () => {
  try {
    if (!document.fullscreenElement) await screenShell.requestFullscreen();
    else await document.exitFullscreen();
  } catch (error) {
    console.log("Fullscreen error:", error);
  }
});

/* ---------------- الكيبورد ---------------- */
document.addEventListener("keydown", e => {
  if (e.ctrlKey || e.altKey || e.metaKey) return;
  const k = e.key.toLowerCase();
  if (e.key === "ArrowRight") previousVideo();
  else if (e.key === "ArrowLeft") nextVideo();
  else if (e.key === "ArrowUp") { e.preventDefault(); skip(10); }
  else if (e.key === "ArrowDown") { e.preventDefault(); skip(-10); }
  else if (e.code === "Space") { e.preventDefault(); togglePause(); }
  else if (e.code === "KeyM" || k === "ة") toggleMusic();
  else if (e.code === "KeyS" || k === "س") toggleSound();
  else if (e.code === "KeyF" || k === "ب") $("fullscreenBtn").click();
});

/* ---------------- الساعة ---------------- */
const TZ = "Asia/Amman";
let timeOffset = 0, synced = false;

function setOffset(serverMs, t0) {
  const rtt = Date.now() - t0;
  timeOffset = serverMs + rtt / 2 - Date.now();
  synced = true;
}

async function syncTime() {
  const t0 = Date.now();
  try {
    const r = await fetch("https://timeapi.io/api/Time/current/zone?timeZone=UTC", { cache: "no-store" });
    setOffset(Date.parse((await r.json()).dateTime.slice(0, 23) + "Z"), t0);
  } catch (e) {
    try {
      const r = await fetch("https://worldtimeapi.org/api/timezone/Asia/Amman", { cache: "no-store" });
      setOffset((await r.json()).unixtime * 1000, t0);
    } catch (e2) { synced = false; }  // بدون إنترنت: يستخدم ساعة الجهاز
  }
  tick();
}

function tick() {
  const now = new Date(Date.now() + timeOffset);
  $("clock").textContent = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: TZ });
  $("date").textContent = now.toLocaleDateString("ar-JO", { weekday: "long", day: "numeric", month: "long", timeZone: TZ });
  $("clock").classList.toggle("offline", !synced);
}
tick();
syncTime();
setInterval(tick, 1000);
setInterval(syncTime, 10 * 60 * 1000);
setInterval(() => { if (!synced) syncTime(); }, 30000);

/* ---------------- البداية ---------------- */
renderCategories();
renderAudioButtons();
probeAutoplay();

/* الشاشة الافتتاحية: أول فيديو بيبلش يتحمّل من ورا الشعار فوراً،
   والشعار بيختفي أول ما يجهز الفيديو (بعد 1.2 ثانية على الأقل، و3 ثواني كحد أقصى) */
const INTRO_MIN_MS = 1200, INTRO_MAX_MS = 3000;
const introStart = performance.now();
let introDone = false;
function endIntro() {
  if (introDone) return;
  introDone = true;
  $("intro").classList.add("hide");
  setTimeout(() => $("intro").remove(), 600);
}
player.addEventListener("playing", () => {
  setTimeout(endIntro, Math.max(0, INTRO_MIN_MS - (performance.now() - introStart)));
}, { once: true });
$("intro").addEventListener("click", endIntro);
setTimeout(endIntro, INTRO_MAX_MS);
selectCategory("all");

/* ---------------- منع إطفاء الشاشة ---------------- */
let wakeLock = null;
async function keepAwake() {
  try { if ("wakeLock" in navigator && !wakeLock) wakeLock = await navigator.wakeLock.request("screen"); wakeLock?.addEventListener("release", () => wakeLock = null); }
  catch (e) {}
}
keepAwake();
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") keepAwake(); });
document.addEventListener("pointerdown", keepAwake);

/* ---------------- رجوع تلقائي للعرض إذا الجناح فاضي ---------------- */
let lastTouch = Date.now();
["pointerdown", "keydown", "touchstart", "mousemove"].forEach(ev => document.addEventListener(ev, () => lastTouch = Date.now()));
setInterval(() => {
  if (Date.now() - lastTouch < IDLE_RESUME_MS || !introDone) return;
  if (isWebMode()) { selectCategory("all"); lastTouch = Date.now(); return; }
  if (isPaused && autoPlay && currentItem()) { togglePause(); lastTouch = Date.now(); }
}, 5000);

/* ---------------- جزيئات الخلفية ---------------- */
const pc = $("particles"), px = pc.getContext("2d");
let W, H;
const dots = [];
function sizeCanvas() { W = pc.width = innerWidth; H = pc.height = innerHeight; }
sizeCanvas();
addEventListener("resize", sizeCanvas);
for (let i = 0; i < 70; i++) {
  dots.push({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 2 + .6,
              v: Math.random() * .35 + .1, d: Math.random() * 6.28, gold: Math.random() < .3 });
}
function drawDots() {
  px.clearRect(0, 0, W, H);
  for (const p of dots) {
    p.y -= p.v; p.d += .01; p.x += Math.sin(p.d) * .3;
    if (p.y < -5) { p.y = H + 5; p.x = Math.random() * W; }
    const col = p.gold ? "240,184,110" : "54,224,232";
    px.beginPath();
    px.arc(p.x, p.y, p.r, 0, 6.28);
    px.fillStyle = `rgba(${col},.55)`;
    px.shadowBlur = 12; px.shadowColor = `rgb(${col})`;
    px.fill();
  }
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) requestAnimationFrame(drawDots);
}
drawDots();

/* ---------------- الإضاءة المحيطية ---------------- */
const gctx = $("glow").getContext("2d");
setInterval(() => {
  try {
    if (!player.paused && player.readyState >= 2) gctx.drawImage(player, 0, 0, 32, 18);
  } catch (e) {}
}, 100);

/* ---------------- تقديم/ترجيع وسرعة ---------------- */
function skip(sec) {
  if (!player.duration) return;
  player.currentTime = Math.min(Math.max(0, player.currentTime + sec), player.duration - 0.1);
}
["back10", "fsBack"].forEach(id => $(id).addEventListener("click", () => skip(-10)));
["fwd10", "fsFwd"].forEach(id => $(id).addEventListener("click", () => skip(10)));

const rates = [1, 1.5, 2, 0.5];
let rateIdx = 0;
function cycleSpeed() {
  rateIdx = (rateIdx + 1) % rates.length;
  const r = rates[rateIdx];
  player.defaultPlaybackRate = r;
  player.playbackRate = r;
  ["speedBtn", "fsSpeed"].forEach(id => $(id).textContent = `⚡ ${r}x`);
}
["speedBtn", "fsSpeed"].forEach(id => $(id).addEventListener("click", cycleSpeed));

["progress", "fsProgress"].forEach(id => {
  const el = $(id);
  const seekTo = e => {
    if (!player.duration) return;
    const r = el.getBoundingClientRect();
    const frac = Math.min(Math.max((r.right - e.clientX) / r.width, 0), 1);
    player.currentTime = frac * player.duration;
  };
  el.addEventListener("pointerdown", e => {
    el.setPointerCapture(e.pointerId);
    seekTo(e);
    el.onpointermove = seekTo;
  });
  el.addEventListener("pointerup", () => { el.onpointermove = null; });
});
