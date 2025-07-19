
export const generateSitemap = () => {
  const baseUrl = window.location.origin;
  const currentDate = new Date().toISOString().split('T')[0];
  
  const urls = [
    {
      loc: `${baseUrl}/`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '1.0'
    },
    {
      loc: `${baseUrl}/books/creation`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.9'
    },
    {
      loc: `${baseUrl}/books/noahs-ark`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.9'
    },
    {
      loc: `${baseUrl}/books/jonah`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.9'
    },
    {
      loc: `${baseUrl}/books/gods-love`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.9'
    },
    {
      loc: `${baseUrl}/books/ai-adventures`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: '0.9'
    },
    {
      loc: `${baseUrl}/videos`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: '0.8'
    }
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return sitemap;
};

export const downloadSitemap = () => {
  const sitemap = generateSitemap();
  const blob = new Blob([sitemap], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'sitemap.xml';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
