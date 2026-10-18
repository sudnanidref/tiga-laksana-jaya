import { cp, mkdir } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const output = path.join(root, 'dist');
await mkdir(path.join(output, 'assets'), { recursive: true });
await cp(path.join(root, 'assets'), path.join(output, 'assets'), { recursive: true });
for (const file of ['robots.txt', 'sitemap.xml', 'site.webmanifest.json', 'favicon.ico']) {
  await cp(path.join(root, file), path.join(output, file));
}
await mkdir(path.join(output, '.well-known'), { recursive: true });
await cp(path.join(root, '.well-known/security.txt'), path.join(output, '.well-known/security.txt'));
console.log('Copied static assets and control files into dist/.');
