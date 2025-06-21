import { writeFile, mkdir } from 'fs/promises';
import { dirname } from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env file first
dotenv.config({ path: './.env' });

// Then import the api module
import { api } from '../src/lib/api.ts';

const BASE_URL = 'https://alien-streaming.web.app'; // Your website's base URL

async function fetchAllMediaItems(mediaType, totalPages = 5) { // Fetch a few pages as an example
  let items = [];
  for (let page = 1; page <= totalPages; page++) {
    try {
      let response;
      if (mediaType === 'movie') {
        response = await api.getPopular('movie', page);
      } else if (mediaType === 'tv') {
        response = await api.getPopular('tv', page);
      }
      if (response && response.results) {
        items = items.concat(response.results.map(item => ({ id: item.id, lastmod: item.release_date || item.first_air_date })));
      }
    } catch (error) {
      console.error(`Error fetching ${mediaType} page ${page}:`, error.message);
      // Optionally break or continue based on error handling strategy
    }
  }
  return items;
}

async function generateSitemap() {
  const urls = [];

  // Static pages
  urls.push({ loc: `${BASE_URL}/`, changefreq: 'daily', priority: '1.0' });
  urls.push({ loc: `${BASE_URL}/movies`, changefreq: 'daily', priority: '0.9' });
  urls.push({ loc: `${BASE_URL}/tv`, changefreq: 'daily', priority: '0.9' });
  urls.push({ loc: `${BASE_URL}/watchlist`, changefreq: 'weekly', priority: '0.7' });
  urls.push({ loc: `${BASE_URL}/genres`, changefreq: 'monthly', priority: '0.7' });
  urls.push({ loc: `${BASE_URL}/terms`, changefreq: 'yearly', priority: '0.3' });
  urls.push({ loc: `${BASE_URL}/privacy`, changefreq: 'yearly', priority: '0.3' });
  urls.push({ loc: `${BASE_URL}/about`, changefreq: 'monthly', priority: '0.5' });
  urls.push({ loc: `${BASE_URL}/contact`, changefreq: 'monthly', priority: '0.5' });

  // TODO: Add Genre Pages dynamically if possible, or list main ones
  // Example: urls.push({ loc: `${BASE_URL}/genres/28` (Action), changefreq: 'weekly', priority: '0.8' });


  // Dynamic pages (Movies)
  console.log('Fetching movies for sitemap...');
  const movies = await fetchAllMediaItems('movie');
  movies.forEach(movie => {
    urls.push({
      loc: `${BASE_URL}/movie/${movie.id}`,
      lastmod: movie.lastmod ? movie.lastmod.split('T')[0] : new Date().toISOString().split('T')[0], // Format YYYY-MM-DD
      changefreq: 'weekly',
      priority: '0.8'
    });
  });
  console.log(`Added ${movies.length} movie URLs.`);

  // Dynamic pages (TV Shows)
  console.log('Fetching TV shows for sitemap...');
  const tvShows = await fetchAllMediaItems('tv');
  tvShows.forEach(tv => {
    urls.push({
      loc: `${BASE_URL}/tv/${tv.id}`,
      lastmod: tv.lastmod ? tv.lastmod.split('T')[0] : new Date().toISOString().split('T')[0], // Format YYYY-MM-DD
      changefreq: 'weekly',
      priority: '0.8'
    });
  });
  console.log(`Added ${tvShows.length} TV show URLs.`);

  const sitemapContent = `
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${urls.map(url => `
        <url>
          <loc>${url.loc}</loc>
          ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
          <changefreq>${url.changefreq}</changefreq>
          <priority>${url.priority}</priority>
        </url>
      `).join('')}
    </urlset>
  `.trim();

  try {
    const publicDir = './public';
    const sitemapPath = `${publicDir}/sitemap.xml`;
    await mkdir(publicDir, { recursive: true }); // Ensure public directory exists
    await writeFile(sitemapPath, sitemapContent);
    console.log(`Sitemap generated successfully at ${sitemapPath}! Contains ${urls.length} URLs.`);
  } catch (error) {
    console.error('Error writing sitemap file:', error);
  }
}

generateSitemap();
