// Rutes /projectes/:slug per a un lloc estàtic (GitHub Pages / Hostinger).
//
//  · Build: es processa un únic motlle (projectes/_projecte.html) i després es genera dist/projectes/<slug>/index.html
//    per a cada projecte publicat; el motlle es descarta. Afegir un projecte a projects.json crea la seva URL sola.
//  · Dev: un middleware serveix aquestes mateixes URLs des del motlle. Un slug inexistent respon 404.html amb estat 404
//    (sense aquest middleware Vite serviria la Home com a fallback).
//  · Producció: GitHub Pages serveix dist/404.html per a qualsevol ruta inexistent (slugs inclosos).
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const htmlFiles = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return htmlFiles(path);
    return entry.name.endsWith('.html') ? [path] : [];
  });

export function projectPages({ root, loadScript, readProjects, allowPending }) {
  let config;

  // Carrega els mòduls frescos i retorna model + plantilles ja cablejades.
  const modules = async () => {
    const [model, pr, render] = await Promise.all([loadScript('projects.js'), loadScript('projects-render.js'), loadScript('render.js')]);
    return { model, R: pr.createProjectRenderers({ ...render, ...model }) };
  };

  // Projectes per a pàgines: amb la porta de drets (en dev es veu tot; en build, només el confirmat).
  const visibleProjects = (model) => {
    return model.gateRights(readProjects(model), { includePending: allowPending(config.command) });
  };

  return {
    name: 'project-pages',

    configResolved(resolved) {
      config = resolved;
    },

    async buildStart() {
      if (config.command !== 'build') return;
      const { model } = await modules();
      const raw = readProjects(model);
      const { excluded } = visibleProjects(model);
      if (excluded.length) {
        console.warn(`\n[projectes] ${excluded.length} imatge(s) amb drets pendents queden FORA d'aquesta build (ALLOW_PENDING_RIGHTS=1 les inclou):`);
        for (const line of excluded) console.warn(`  · ${line}`);
      }
      const pending = model.pendingRights(raw);
      if (pending.length && process.env.ALLOW_PENDING_RIGHTS === '1') console.warn('[projectes] ALLOW_PENDING_RIGHTS=1: es publiquen imatges amb drets pendents.');
    },

    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        try {
          const prefix = `${server.config.base}projectes/`;
          const path = decodeURIComponent((req.url ?? '').split('?')[0]);
          if (!path.startsWith(prefix)) return next();
          const rest = path.slice(prefix.length).replace(/\/$/, '');
          // /projectes/ (llistat) i qualsevol fitxer (.js, .css, .html…) els gestiona Vite.
          if (!rest || rest.includes('.')) return next();

          const { model, R } = await modules();
          const { list } = visibleProjects(model);
          const project = rest.includes('/') ? null : model.projectBySlug(list, rest);

          const templateUrl = project ? '/projectes/_projecte.html' : '/404.html';
          // Igual que en build: primer Vite processa el motlle (URLs, dataSlots) i després s'hi posa el contingut de la fitxa.
          // Al revés, Vite tornaria a prefixar el `base` a les imatges ja resoltes.
          let html = readFileSync(resolve(root, templateUrl.slice(1)), 'utf8');
          html = await server.transformIndexHtml(templateUrl, html, req.originalUrl);
          // `list` (sencera) hi va perquè la fitxa pugui calcular «Següent projecte» per `order`.
          if (project) html = R.fillProjectTemplate(html, project, { base: server.config.base, list });

          res.statusCode = project ? 200 : 404;
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          res.end(html);
        } catch (error) {
          next(error);
        }
      });
    },

    async closeBundle() {
      if (config.command !== 'build') return;
      const outDir = resolve(config.root, config.build.outDir);
      const template = join(outDir, 'projectes/_projecte.html');
      if (!existsSync(template)) return;

      const { model, R } = await modules();
      const { list, excludedFiles } = visibleProjects(model);
      const html = readFileSync(template, 'utf8');
      const projects = model.listProjects(list);
      for (const project of projects) {
        const dir = join(outDir, 'projectes', project.slug);
        mkdirSync(dir, { recursive: true });
        writeFileSync(join(dir, 'index.html'), R.fillProjectTemplate(html, project, { base: config.base, list }));
      }
      rmSync(template);
      console.log(`[projectes] ${projects.length} fitxes generades a projectes/<slug>/index.html`);

      // Els fitxers de public/ es copien a dist/ tant si es fan servir com si no: els que tenen drets pendents i no
      // surten a cap pàgina (Home i Sobre mi inclosos) s'esborren perquè no quedin accessibles per URL.
      const pages = htmlFiles(outDir).map((file) => readFileSync(file, 'utf8')).join('\n');
      for (const file of excludedFiles) {
        const target = join(outDir, file);
        if (!existsSync(target) || pages.includes(encodeURI(file.split('/').pop()))) continue;
        rmSync(target);
        console.log(`[projectes] retirat de dist: ${file}`);
      }
    },
  };
}
