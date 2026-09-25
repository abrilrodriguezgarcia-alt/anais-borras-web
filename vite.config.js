import { readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { defineConfig } from 'vite';

const root = import.meta.dirname;
const readJson = (name) => JSON.parse(readFileSync(resolve(root, 'src/data', name), 'utf8'));

// Substitueix <!-- @slot:nom --> d'index.html per HTML generat a partir de src/data/*.json.
// El resultat és HTML estàtic (bo per a SEO i per a Hostinger); no hi ha render al client.
function dataSlots() {
  return {
    name: 'data-slots',
    async transformIndexHtml(html) {
      const file = resolve(root, 'scripts/render.js');
      const render = await import(`${pathToFileURL(file).href}?v=${statSync(file).mtimeMs}`);
      const site = readJson('site.json');
      const slots = {
        nav: render.nav(site),
        socials: render.socials(site),
        topics: render.topics(site),
        legal: render.legal(site),
        instagramUrl: render.instagramUrl(site),
        year: render.year(),
        instagram: render.instagram(readJson('social.json').slice(0, 6)),
        partners: render.partners(readJson('partners.json')),
        projects: render.projects(readJson('projects.json')),
        videos: render.videos(readJson('videos.json').slice(0, 3)),
        featuredArticles: render.articles(readJson('articles.json').filter((a) => a.featured).slice(0, 3)),
      };
      return html.replace(/<!-- @slot:(\w+) -->/g, (_, key) => slots[key] ?? '');
    },
    handleHotUpdate({ file, server }) {
      if (file.includes('/src/data/') || file.includes('/scripts/render.js')) {
        server.ws.send({ type: 'full-reload' });
        return [];
      }
    },
  };
}

export default defineConfig({
  plugins: [dataSlots()],
});
