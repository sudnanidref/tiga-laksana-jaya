import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const requiredSource = [
  'src/layouts/BaseLayout.astro',
  'src/components/Header.astro',
  'src/components/Footer.astro',
  'src/components/ProjectCard.astro',
  'src/components/ReferenceCard.astro',
  'src/data/projects.mjs',
];
for (const rel of requiredSource) {
  assert.ok(fs.existsSync(path.join(root, rel)), `missing reusable source: ${rel}`);
}

const routes = JSON.parse(fs.readFileSync(path.join(root, 'src/data/routes.json'), 'utf8'));
assert.ok(routes.length >= 21, 'expected all sitemap routes in the Astro manifest');
for (const route of routes) {
  const rel = route.path === '/' ? 'index.html' : `${route.path.replace(/^\//, '').replace(/\/$/, '')}/index.html`;
  const file = path.join(root, 'dist', rel);
  assert.ok(fs.existsSync(file), `missing built route: ${route.path}`);
  const html = fs.readFileSync(file, 'utf8');
  assert.equal((html.match(/class="site-header"/g) || []).length, 1, `${route.path}: header count`);
  assert.equal((html.match(/class="footer"/g) || []).length, 1, `${route.path}: footer count`);
  assert.match(html, /<link rel="canonical" href="https:\/\/tigalaksanajaya\.com\//, `${route.path}: canonical`);
  assert.match(html, /<meta name="description" content="[^"]{80,160}"/, `${route.path}: description length`);
  assert.equal((html.match(/<h1[ >]/g) || []).length, 1, `${route.path}: H1 count`);
}

const home = fs.readFileSync(path.join(root, 'dist/index.html'), 'utf8');
assert.equal((home.match(/class="project-card/g) || []).length, 5, 'home should show five selected projects');
assert.match(home, /srcset="[^"]+480w,[^"]+960w"/, 'homepage responsive project images');
assert.match(home, /sizes="\(max-width: 700px\) 100vw,/, 'homepage project image sizes');
const portfolio = fs.readFileSync(path.join(root, 'dist/portfolio/index.html'), 'utf8');
assert.equal((portfolio.match(/class="project-card/g) || []).length, 10, 'portfolio company project count');
assert.equal((portfolio.match(/class="reference-card/g) || []).length, 20, 'portfolio building reference count');
assert.match(portfolio, /"@type":"ItemList"/, 'portfolio ItemList schema');

for (const rel of ['assets/styles.css', 'assets/projects-2026/resort-kai-padalarang.webp', 'favicon.ico', '.well-known/security.txt']) {
  assert.ok(fs.existsSync(path.join(root, 'dist', rel)), `missing static release asset: ${rel}`);
}

console.log(`Astro release checks passed for ${routes.length} routes.`);
