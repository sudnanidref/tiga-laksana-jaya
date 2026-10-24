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
  assert.equal((html.match(/googletagmanager\.com\/gtag\/js\?id=AW-18519737603/g) || []).length, 1, `${route.path}: Google tag loader count`);
  assert.equal((html.match(/google-tag-init\.js/g) || []).length, 1, `${route.path}: Google tag init count`);
  assert.equal((html.match(/whatsapp-tracking\.js/g) || []).length, 1, `${route.path}: WhatsApp handler count`);
  assert.match(html, /class="floating-wa"[\s\S]*?<span>WhatsApp<\/span>/, `${route.path}: labeled floating WhatsApp button`);
  assert.doesNotMatch(html, /Puri Shantika|AW-[0-9]+\//, `${route.path}: forbidden foreign or placeholder conversion label`);
}

const home = fs.readFileSync(path.join(root, 'dist/index.html'), 'utf8');
assert.equal((home.match(/class="project-card/g) || []).length, 5, 'home should show five selected projects');
assert.match(home, /class="hero-card"[\s\S]*?klinik-orthopedi-articular-960\.webp/, 'homepage should use the landscape clinic hero');
assert.doesNotMatch(home, /class="hero-card"[\s\S]*?kantor-wisma-ratu-960\.webp/, 'homepage must not use the tall office hero');
const styles = fs.readFileSync(path.join(root, 'dist/assets/styles.css'), 'utf8');
assert.match(styles, /\.hero-card img\{[^}]*aspect-ratio:16\/10/, 'homepage hero must use a compact landscape ratio');
assert.match(styles, /\.floating-wa\{[^}]*width:auto[^}]*display:flex/, 'floating WhatsApp button must be a labeled pill');
assert.match(home, /styles\.css\?v=20261024-burger-customers/, 'homepage should use the current cached CSS release');
assert.match(home, /srcset="[^"]+480w,[^"]+960w"/, 'homepage responsive project images');
assert.match(home, /sizes="\(max-width: 700px\) 100vw,/, 'homepage project image sizes');
const portfolio = fs.readFileSync(path.join(root, 'dist/portfolio/index.html'), 'utf8');
assert.equal((portfolio.match(/class="project-card/g) || []).length, 10, 'portfolio company project count');
assert.equal((portfolio.match(/class="reference-card/g) || []).length, 20, 'portfolio building reference count');
assert.doesNotMatch(portfolio, /Daftar ini ditampilkan sesuai klasifikasi/, 'portfolio should not show the removed PPTX classification note');
assert.match(portfolio, /"@type":"ItemList"/, 'portfolio ItemList schema');

const clientsPage = fs.readFileSync(path.join(root, 'dist/our-clients/index.html'), 'utf8');
assert.equal((clientsPage.match(/class="client-directory-card"/g) || []).length, 8, 'Our Clients card count');
assert.equal((clientsPage.match(/class="client-directory-logo"/g) || []).length, 7, 'Our Clients real logo count');
assert.match(clientsPage, /class="client-monogram"[^>]*>WR</, 'Wisma Ratu monogram');
assert.match(clientsPage, /<link rel="canonical" href="https:\/\/tigalaksanajaya\.com\/our-clients\/"/, 'Our Clients canonical');
assert.match(clientsPage, /class="mobile-only-nav active"[^>]*href="\/our-clients\/"[^>]*aria-current="page"[^>]*>Our Customers<\/a>/, 'burger menu Our Customers active link');
assert.match(styles, /\.mobile-only-nav\{display:none\}/, 'Our Customers link hidden in desktop navigation');
assert.match(styles, /@media\(max-width:980px\)[^{]*\{[^}]*\.mobile-only-nav\{display:block\}/, 'Our Customers link visible in burger menu');
assert.match(home, /href="\/our-clients\/"/, 'homepage link to Our Clients');
const sitemap = fs.readFileSync(path.join(root, 'dist/sitemap.xml'), 'utf8');
assert.match(sitemap, /https:\/\/tigalaksanajaya\.com\/our-clients\//, 'Our Clients sitemap URL');

for (const rel of ['assets/styles.css', 'assets/projects-2026/resort-kai-padalarang.webp', 'favicon.ico', '.well-known/security.txt']) {
  assert.ok(fs.existsSync(path.join(root, 'dist', rel)), `missing static release asset: ${rel}`);
}

console.log(`Astro release checks passed for ${routes.length} routes.`);
