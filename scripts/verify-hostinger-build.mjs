import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const distDir = "dist";
const indexPath = join(distDir, "index.html");
const htaccessPath = join(distDir, ".htaccess");

function fail(message) {
  console.error(`\nHostinger build check failed: ${message}\n`);
  process.exit(1);
}

function pass(message) {
  console.log(`✓ ${message}`);
}

if (!existsSync(indexPath)) fail("dist/index.html was not created.");
if (!existsSync(htaccessPath)) fail("dist/.htaccess is missing. Upload hidden files to Hostinger too.");

const html = readFileSync(indexPath, "utf8");
const htaccess = readFileSync(htaccessPath, "utf8");

if (html.includes('/src/main.tsx')) {
  fail("dist/index.html still points to /src/main.tsx. Upload the built dist folder, not project source files.");
}

if (!htaccess.includes("Options -MultiViews")) {
  fail("dist/.htaccess must include Options -MultiViews for Hostinger.");
}

if (!htaccess.includes("no-cache, no-store, must-revalidate")) {
  fail("dist/.htaccess must disable cache for html/js/css so Hostinger does not serve stale broken bundles.");
}

if (!html.includes("Loading Books by Maggie")) {
  fail("dist/index.html is missing the visible loading/deployment fallback.");
}

const assetRefs = [...html.matchAll(/(?:src|href)="\.\/(assets\/[^"]+)"/g)].map((match) => match[1]);
if (assetRefs.length === 0) fail("No built asset references were found in dist/index.html.");

for (const assetRef of assetRefs) {
  const assetPath = join(distDir, assetRef);
  if (!existsSync(assetPath)) fail(`dist/index.html references ${assetRef}, but that file does not exist.`);
}

const assetsDir = join(distDir, "assets");
if (!existsSync(assetsDir)) fail("dist/assets is missing. Upload the entire contents of dist, including assets.");

const assetFiles = readdirSync(assetsDir).filter((file) => statSync(join(assetsDir, file)).isFile());
if (!assetFiles.some((file) => file.endsWith(".js"))) fail("dist/assets does not contain the app JavaScript file.");
if (!assetFiles.some((file) => file.endsWith(".css"))) fail("dist/assets does not contain the app CSS file.");
if (!existsSync(join(assetsDir, "app.js"))) fail("dist/assets/app.js is missing. Stable Hostinger filenames are required.");
if (!existsSync(join(assetsDir, "app.css"))) fail("dist/assets/app.css is missing. Stable Hostinger filenames are required.");

pass("Hostinger build is complete.");
pass("Upload everything INSIDE dist/ to public_html, including the assets folder and .htaccess.");