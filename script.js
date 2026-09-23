const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const body = document.body;

/* ---------- Background: event lights (bokeh + sweeping spotlights) ---------- */
const canvas = document.querySelector(".lights");
const ctx = canvas.getContext("2d");
const palette = ["224,122,95", "242,195,139", "255,255,255", "140,120,220"];
let width, height, dpr, particles;
const pointer = { x: 0, y: 0 };

function resize() {
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const count = width < 760 ? 35 : 70;
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    r: 2 + Math.random() * 38,
    depth: 0.2 + Math.random(),
    vx: (Math.random() - 0.5) * 0.15,
    vy: -0.05 - Math.random() * 0.2,
    alpha: 0.05 + Math.random() * 0.22,
    phase: Math.random() * Math.PI * 2,
    color: palette[Math.floor(Math.random() * palette.length)],
  }));
}

function drawSpotlight(originX, angle, color) {
  const length = height * 1.3;
  const spread = 0.22;
  const grad = ctx.createLinearGradient(originX, 0, originX + Math.sin(angle) * length, Math.cos(angle) * length);
  grad.addColorStop(0, `rgba(${color},0.22)`);
  grad.addColorStop(1, `rgba(${color},0)`);
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(originX, -10);
  ctx.lineTo(originX + Math.sin(angle - spread) * length, Math.cos(angle - spread) * length);
  ctx.lineTo(originX + Math.sin(angle + spread) * length, Math.cos(angle + spread) * length);
  ctx.closePath();
  ctx.fill();
}

function frame(time) {
  const t = time / 1000;
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = "#0b0e1a";
  ctx.fillRect(0, 0, width, height);
  ctx.globalCompositeOperation = "lighter";

  drawSpotlight(width * 0.2, Math.sin(t * 0.35) * 0.5 - 0.25 + pointer.x * 0.1, "224,122,95");
  drawSpotlight(width * 0.8, Math.sin(t * 0.3 + 2) * 0.5 + 0.25 + pointer.x * 0.1, "242,195,139");

  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;
    if (p.y < -p.r * 2) { p.y = height + p.r; p.x = Math.random() * width; }
    if (p.x < -p.r * 2) p.x = width + p.r;
    if (p.x > width + p.r * 2) p.x = -p.r;

    const x = p.x - pointer.x * 30 * p.depth;
    const y = p.y - pointer.y * 30 * p.depth;
    const a = p.alpha * (0.6 + 0.4 * Math.sin(t * 1.2 + p.phase));
    const g = ctx.createRadialGradient(x, y, 0, x, y, p.r);
    g.addColorStop(0, `rgba(${p.color},${a})`);
    g.addColorStop(1, `rgba(${p.color},0)`);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, p.r, 0, Math.PI * 2);
    ctx.fill();
  }

  if (!reducedMotion) requestAnimationFrame(frame);
}

resize();
window.addEventListener("resize", resize);
requestAnimationFrame(frame);

/* Pointer parallax: moves lights and hotspots slightly */
const stage = document.getElementById("stage");
window.addEventListener("pointermove", (e) => {
  pointer.x = e.clientX / width - 0.5;
  pointer.y = e.clientY / height - 0.5;
  stage.style.setProperty("--mx", (pointer.x * 2).toFixed(3));
  stage.style.setProperty("--my", (pointer.y * 2).toFixed(3));
  if (reducedMotion) requestAnimationFrame(frame);
});

/* ---------- Intro sequence ---------- */
const intro = document.getElementById("intro");
const timers = [];

function playIntro() {
  const steps = [[200, "1"], [3000, "2"], [6000, "3"]];
  steps.forEach(([delay, scene]) => timers.push(setTimeout(() => (intro.dataset.scene = scene), delay)));
}

function enterStage() {
  timers.forEach(clearTimeout);
  intro.classList.add("is-leaving");
  body.classList.add("is-live");
  setTimeout(() => (intro.hidden = true), reducedMotion ? 0 : 1000);
  try { sessionStorage.setItem("introSeen", "1"); } catch (e) {}

  const tab = location.hash.slice(1);
  if (tabIds.includes(tab)) openPanel(tab);
}

let introSeen = false;
try { introSeen = sessionStorage.getItem("introSeen") === "1"; } catch (e) {}

intro.querySelector(".intro__enter").addEventListener("click", enterStage);
intro.querySelector(".intro__skip").addEventListener("click", enterStage);

/* ---------- Panel with tabs ---------- */
const panel = document.getElementById("panel");
const sheet = panel.querySelector(".panel__sheet");
const panelBody = panel.querySelector(".panel__body");
const tabs = [...panel.querySelectorAll(".tabs [role=tab]")];
const tabIds = tabs.map((t) => t.dataset.tab);
let lastTrigger = null;

function selectTab(id, focus = false) {
  tabs.forEach((tab) => {
    const selected = tab.dataset.tab === id;
    tab.setAttribute("aria-selected", selected);
    tab.tabIndex = selected ? 0 : -1;
    const tabpanel = document.getElementById(tab.dataset.tab);
    tabpanel.hidden = !selected;
    tabpanel.classList.toggle("is-entering", selected);
    if (selected) {
      tab.scrollIntoView({ block: "nearest", inline: "center" });
      if (focus) tab.focus();
    }
  });
  panelBody.scrollTop = 0;
  history.replaceState(null, "", "#" + id);
}

function openPanel(id, trigger) {
  lastTrigger = trigger || null;
  panel.hidden = false;
  body.classList.add("panel-open");
  selectTab(id);
  requestAnimationFrame(() => requestAnimationFrame(() => panel.classList.add("is-open")));
  setTimeout(() => panel.querySelector(".tabs [aria-selected=true]").focus({ preventScroll: true }), 50);
}

function closePanel() {
  panel.classList.remove("is-open");
  body.classList.remove("panel-open");
  history.replaceState(null, "", location.pathname + location.search);
  setTimeout(() => (panel.hidden = true), reducedMotion ? 0 : 600);
  if (lastTrigger) lastTrigger.focus({ preventScroll: true });
}

document.querySelectorAll("[data-open]").forEach((el) =>
  el.addEventListener("click", () => openPanel(el.dataset.open, el))
);
panel.querySelectorAll("[data-close]").forEach((el) => el.addEventListener("click", closePanel));
tabs.forEach((tab) => tab.addEventListener("click", () => selectTab(tab.dataset.tab)));

/* Arrow-key navigation for any tablist */
function arrowNav(list, onSelect, vertical = false) {
  list.addEventListener("keydown", (e) => {
    const items = [...list.querySelectorAll("[role=tab]")];
    const i = items.indexOf(document.activeElement);
    if (i < 0) return;
    const next = vertical ? ["ArrowDown", "ArrowRight"] : ["ArrowRight"];
    const prev = vertical ? ["ArrowUp", "ArrowLeft"] : ["ArrowLeft"];
    let j = null;
    if (next.includes(e.key)) j = (i + 1) % items.length;
    if (prev.includes(e.key)) j = (i - 1 + items.length) % items.length;
    if (e.key === "Home") j = 0;
    if (e.key === "End") j = items.length - 1;
    if (j === null) return;
    e.preventDefault();
    onSelect(items[j]);
  });
}
arrowNav(panel.querySelector(".tabs"), (tab) => selectTab(tab.dataset.tab, true));

/* Keyboard: Escape closes, Tab stays inside the panel */
document.addEventListener("keydown", (e) => {
  if (panel.hidden) return;
  if (e.key === "Escape") closePanel();
  if (e.key === "Tab") {
    const focusables = [...sheet.querySelectorAll("button:not([tabindex='-1']), a[href]")].filter((el) => el.offsetParent !== null);
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
});

/* Nested tabs: experience roles */
const roleList = document.querySelector(".roles__list");
const roleTabs = [...roleList.querySelectorAll("[role=tab]")];

function selectRole(tab, focus = false) {
  roleTabs.forEach((t) => {
    const selected = t === tab;
    t.setAttribute("aria-selected", selected);
    t.tabIndex = selected ? 0 : -1;
    document.getElementById(t.getAttribute("aria-controls")).hidden = !selected;
  });
  tab.scrollIntoView({ block: "nearest", inline: "nearest" });
  if (focus) tab.focus();
}
roleTabs.forEach((t) => t.addEventListener("click", () => selectRole(t)));
arrowNav(roleList, (t) => selectRole(t, true), true);
selectRole(roleTabs[0]);

/* Logo returns to the stage */
document.querySelector(".stage__logo").addEventListener("click", (e) => {
  e.preventDefault();
  if (!panel.hidden) closePanel();
});

/* ---------- Start ---------- */
if (reducedMotion || introSeen) {
  enterStage();
} else {
  playIntro();
}
