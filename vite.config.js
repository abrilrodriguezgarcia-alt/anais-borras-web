import { readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { defineConfig } from 'vite';

const root = import.meta.dirname;
const readJson = (name) => JSON.parse(readFileSync(resolve(root, 'src/data', name), 'utf8'));

// Substitueix <!-- @slot:nom --> d'index.html per HTML generat a partir de src/data/*.json.
// El resultat és HTML estàtic (bo per a SEO i per a Hostinger); no hi ha render al client.
function dataSlots() {
  let base = '/';
  return {
    name: 'data-slots',
    configResolved(config) {
      base = config.base;
    },
    async transformIndexHtml(html, ctx) {
      const file = resolve(root, 'scripts/render.js');
      const render = await import(`${pathToFileURL(file).href}?v=${statSync(file).mtimeMs}`);
      const site = readJson('site.json');
      // Ruta de la pàgina que es renderitza (sobre-mi/index.html → /sobre-mi; index.html → cap).
      const dir = (ctx.filename ?? '').slice(root.length).replace(/^\/|\/?index\.html$/g, '');
      const slots = {
        base,
        nav: render.nav(site, base, dir && `/${dir}`),
        socials: render.socials(site),
        topics: render.topics(site),
        legal: render.legal(site),
        channels: render.channels(site),
        instagramUrl: render.instagramUrl(site),
        year: render.year(),
        instagram: render.instagram(readJson('social.json').slice(0, 6), base),
        partners: render.partners(readJson('partners.json')),
        projects: render.projects(readJson('projects.json'), base),
        contactUrl: `${base}contacte/`,
        trajectory: render.trajectory(readJson('trajectory.json'), readJson('projects.json'), base),
        trajectoryPreview: render.trajectoryPreview(readJson('trajectory.json'), readJson('projects.json'), base),
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
  base: '/anais-borras-web/',
  plugins:  [dataSlots()],
  build: {
    rollupOptions: {
      // Pàgines multipàgina: cada carpeta amb el seu index.html.
      input: {
        main: resolve(root, 'index.html'),
        'sobre-mi': resolve(root, 'sobre-mi/index.html'),
        contacte: resolve(root, 'contacte/index.html'),
      },
    },
  },
});
