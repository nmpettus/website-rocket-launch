// Runs before `vite dev` and `vite build` (predev/prebuild hooks); writes public/sitemap.xml.
// Keep `entries` in sync with the public routes declared in src/App.tsx.

import { writeFileSync } from "fs";
import { resolve } from "path";

const BASE_URL = "https://booksbymaggie.com";

/**
 * @typedef {Object} SitemapEntry
 * @property {string} path
 * @property {string} [lastmod]
 * @property {"always"|"hourly"|"daily"|"weekly"|"monthly"|"yearly"|"never"} [changefreq]
 * @property {string} [priority]
 */

/** @type {SitemapEntry[]} */
const entries = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/about", changefreq: "monthly", priority: "0.7" },
  { path: "/online-library", changefreq: "weekly", priority: "0.9" },
  { path: "/videos", changefreq: "weekly", priority: "0.8" },
  { path: "/ask-maggie", changefreq: "monthly", priority: "0.7" },
  { path: "/chapter-zero", changefreq: "monthly", priority: "0.6" },
  { path: "/maggies-ai-adventures", changefreq: "monthly", priority: "0.7" },
  { path: "/matteo", changefreq: "monthly", priority: "0.6" },
  { path: "/join", changefreq: "monthly", priority: "0.8" },
  { path: "/books/creation", changefreq: "monthly", priority: "0.9" },
  { path: "/books/noahs-ark", changefreq: "monthly", priority: "0.9" },
  { path: "/books/jonah", changefreq: "monthly", priority: "0.9" },
  { path: "/books/gods-love", changefreq: "monthly", priority: "0.9" },
  { path: "/books/ai-adventures", changefreq: "monthly", priority: "0.9" },
  { path: "/books/christmas", changefreq: "monthly", priority: "0.9" },
  { path: "/books/thanksgiving", changefreq: "monthly", priority: "0.9" },
  { path: "/books/easter", changefreq: "monthly", priority: "0.9" },
  { path: "/books/independence-day", changefreq: "monthly", priority: "0.9" },
  { path: "/resources/bible-verses-gods-love", changefreq: "monthly", priority: "0.7" },
  { path: "/privacy-policy", changefreq: "yearly", priority: "0.3" },
  { path: "/terms-of-service", changefreq: "yearly", priority: "0.3" },
  { path: "/cookie-policy", changefreq: "yearly", priority: "0.3" },
];

function generateSitemap(list) {
  const urls = list.map((e) =>
    [
      `  <url>`,
      `    <loc>${BASE_URL}${e.path}</loc>`,
      e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      `  </url>`,
    ]
      .filter(Boolean)
      .join("\n"),
  );

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...urls,
    `</urlset>`,
  ].join("\n");
}

writeFileSync(resolve("public/sitemap.xml"), generateSitemap(entries) + "\n");
console.log(`sitemap.xml written (${entries.length} entries)`);
