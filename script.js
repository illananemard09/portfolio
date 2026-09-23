const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const body = document.body;

/* Pointer parallax and custom cursor */
const stage = document.getElementById("stage");
const cursor = document.querySelector(".cursor");
window.addEventListener("pointermove", (e) => {
  const x = e.clientX / window.innerWidth - 0.5;
  const y = e.clientY / window.innerHeight - 0.5;
  stage.style.setProperty("--mx", (x * 2).toFixed(3));
  stage.style.setProperty("--my", (y * 2).toFixed(3));

  if (e.pointerType !== "mouse") return;
  cursor.classList.add("is-visible");
  cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
  cursor.classList.toggle("is-hover", !!e.target.closest("button, a"));
});
document.addEventListener("pointerleave", () => cursor.classList.remove("is-visible"));

/* ---------- Intro sequence ---------- */
const intro = document.getElementById("intro");
const timers = [];

function playIntro() {
  intro.dataset.scene = "1";

  // "Brewing" counter from 0 to 100%
  const count = intro.querySelector(".intro__count");
  const duration = 2200;
  const start = performance.now();
  (function tick(now) {
    const p = Math.min((now - start) / duration, 1);
    count.textContent = Math.round((1 - Math.pow(1 - p, 3)) * 100);
    if (p < 1 && intro.dataset.scene === "1") requestAnimationFrame(tick);
  })(start);

  const steps = [[2800, "2"], [5600, "3"]];
  steps.forEach(([delay, scene]) => timers.push(setTimeout(() => (intro.dataset.scene = scene), delay)));
}

function enterStage() {
  timers.forEach(clearTimeout);
  intro.classList.add("is-leaving");
  body.classList.add("is-live");
  setTimeout(() => (intro.hidden = true), reducedMotion ? 0 : 1200);
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
document.querySelector(".stamp").addEventListener("click", (e) => {
  e.preventDefault();
  if (!panel.hidden) closePanel();
});

/* ---------- Start ---------- */
if (reducedMotion || introSeen) {
  enterStage();
} else {
  playIntro();
}
