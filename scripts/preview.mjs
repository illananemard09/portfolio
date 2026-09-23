// Builds a self-contained preview of the home page for a claude.ai Artifact.
// The artifact serves the page from an unknown sub-path, adds its own
// <html>/<head>/<body> skeleton and reserves names starting with "_", so:
// the Next.js document wrapper is unpacked, and /_next/ becomes ./assets/.
import { cpSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { join } from "node:path";

const OUT = "out";
const DIST = "preview";

if (!process.argv.includes("--no-build")) execSync("npx next build", { stdio: "inherit" });

rmSync(DIST, { recursive: true, force: true });
mkdirSync(DIST, { recursive: true });
cpSync(join(OUT, "_next"), join(DIST, "assets"), { recursive: true });
cpSync(join(OUT, "icon.svg"), join(DIST, "icon.svg"));
cpSync(join(OUT, "images"), join(DIST, "images"), { recursive: true });

// Point every reference to the renamed asset folder (the Next.js runtime looks for "/_next/" too).
(function rewrite(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) rewrite(p);
    else if (/\.(js|css)$/.test(e.name)) {
      const src = readFileSync(p, "utf8");
      writeFileSync(p, src.replaceAll("url(/_next/static/media/", "url(../media/").replaceAll("/_next/", "/assets/").replaceAll("/images/", "./images/").replaceAll("\uFFFD", "\\uFFFD"));
    }
  }
})(join(DIST, "assets"));

const html = readFileSync(join(OUT, "index.html"), "utf8");
const htmlClass = html.match(/<html[^>]*class="([^"]*)"/)?.[1] ?? "";
const oldTitle = html.match(/<title>[^<]*<\/title>/)?.[0] ?? "";
const title = "<title>Illana's World</title>";
let head = html.match(/<head>([\s\S]*?)<\/head>/)[1];
let body = html.match(/<body[^>]*>([\s\S]*)<\/body>/)[1];
head = head.replace(oldTitle, "").replace(/<meta charSet="utf-8"\/>/, "").replace(/<meta name="viewport"[^>]*\/>/, "");

const page =
  `${title}\n` +
  `<script>document.documentElement.className+=" ${htmlClass}";document.documentElement.lang="en";var TURBOPACK_CHUNK_BASE_PATH="./assets/";</script>\n` +
  head +
  body;

writeFileSync(join(DIST, "index.html"), page.replaceAll('"/images/', '"./images/').replaceAll('"/_next/', '"./assets/').replaceAll('\\"/_next/', '\\"./assets/'));

const files = [];
(function walk(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (p !== join(DIST, "index.html")) files.push(p.slice(DIST.length + 1));
  }
})(DIST);
writeFileSync(join(DIST, "files.json"), JSON.stringify(files, null, 2));
console.log(`Preview ready in ${DIST}/ (${files.length} supporting files)`);
