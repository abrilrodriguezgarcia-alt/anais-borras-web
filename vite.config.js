import { readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { defineConfig } from 'vite';
import { projectPages } from './scripts/vite-project-pages.js';

const root = import.meta.dirname;
const readJson = (name) => JSON.parse(readFileSync(resolve(root, 'src/data', name), 'utf8'));

// Carrega un script de scripts/ amb cache-busting perquè els canvis es vegin en dev sense reiniciar.
const loadScript = (name) => {
  const file = resolve(root, 'scripts', name);
  return import(`${pathToFileURL(file).href}?v=${statSync(file).mtimeMs}`);
};

// Llegeix i valida src/data/projects.json (un error de dades atura el build amb un missatge clar).
const readProjects = (model) => {
  const list = readJson('projects.json');
  model.assertValidProjects(list, { publicDir: resolve(root, 'public') });
  return list;
};

// Les imatges de Projectes amb rightsConfirmed !== true només es veuen en dev; en build queden fora
// (ALLOW_PENDING_RIGHTS=1 les inclou). Home i Sobre mi no depenen d'aquesta porta.
const allowPending = (command) => command === 'serve' || process.env.ALLOW_PENDING_RIGHTS === '1';

// Substitueix <!-- @slot:nom --> de les pàgines per HTML generat a partir de src/data/*.json.
// El resultat és HTML estàtic (bo per a SEO i per a Hostinger); no hi ha render al client.
function dataSlots() {
  let base = '/';
  let command = 'serve';
  return {
    name: 'data-slots',
    configResolved(config) {
      base = config.base;
      command = config.command;
    },
    async transformIndexHtml(html, ctx) {
      const [render, model, projectsRender] = await Promise.all([loadScript('render.js'), loadScript('projects.js'), loadScript('projects-render.js')]);
      const projectRenderers = projectsRender.createProjectRenderers({ ...render, ...model });
      const site = readJson('site.json');
      const projects = readProjects(model);
      const { list: visibleProjects } = model.gateRights(projects, { includePending: allowPending(command) });
      // Secció de la pàgina que es renderitza (sobre-mi/index.html → /sobre-mi; projectes/x/… → /projectes; index.html → cap).
      const dir = (ctx.filename ?? '').slice(root.length).replace(/^\/|\/?index\.html$/g, '');
      const section = dir.split('/')[0];
      const slots = {
        base,
        nav: render.nav(site, base, section && `/${section}`),
        socials: render.socials(site),
        topics: render.topics(site),
        legal: render.legal(site, base),
        channels: render.channels(site),
        instagramUrl: render.instagramUrl(site),
        year: render.year(),
        instagram: render.instagram(readJson('social.json').slice(0, 6), base),
        partners: render.partners(readJson('partners.json'), base),
        projects: render.projects(model.homeCards(projects), base),
        // FASE 4C: la retícula ja mostra tots els projectes publicats (destacat + la resta), com Home i Sobre mi.
        projectsPage: projectRenderers.projectsPage(visibleProjects, { base }),
        contactUrl: `${base}contacte/`,
        trajectory: render.trajectory(readJson('trajectory.json'), model.trajectoryProjects(projects), base),
        trajectoryPreview: render.trajectoryPreview(readJson('trajectory.json'), model.trajectoryProjects(projects), base),
        videos: render.videos(readJson('videos.json').slice(0, 3)),
        featuredArticles: render.articles(readJson('articles.json').filter((a) => a.featured).slice(0, 3)),
      };
      return html.replace(/<!-- @slot:(\w+) -->/g, (_, key) => slots[key] ?? '');
    },
    handleHotUpdate({ file, server }) {
      if (file.includes('/src/data/') || file.includes('/scripts/')) {
        server.ws.send({ type: 'full-reload' });
        return [];
      }
    },
  };
}

export default defineConfig({
  base: '/anais-borras-web/',
  plugins: [dataSlots(), projectPages({ root, loadScript, readProjects, allowPending })],
  build: {
    rollupOptions: {
      // Pàgines multipàgina: cada carpeta amb el seu index.html.
      // projectes/_projecte.html és el motlle de les fitxes /projectes/:slug (vegeu scripts/vite-project-pages.js):
      // es genera una pàgina per projecte i el motlle es descarta. 404.html és el fallback de GitHub Pages.
      input: {
        main: resolve(root, 'index.html'),
        'sobre-mi': resolve(root, 'sobre-mi/index.html'),
        contacte: resolve(root, 'contacte/index.html'),
        projectes: resolve(root, 'projectes/index.html'),
        'projecte-motlle': resolve(root, 'projectes/_projecte.html'),
        'no-trobat': resolve(root, '404.html'),
      },
    },
  },
});
