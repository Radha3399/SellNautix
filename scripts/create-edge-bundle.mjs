import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { extname, join, relative } from 'node:path';

const sourceDir = 'out';
const outputFile = 'dist/server/index.js';
const mimeTypes = {
  '.avif': 'image/avif', '.css': 'text/css; charset=utf-8', '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8', '.ico': 'image/x-icon', '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.png': 'image/png', '.svg': 'image/svg+xml', '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp', '.woff': 'font/woff', '.woff2': 'font/woff2'
};

async function collect(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const file = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collect(file));
    else files.push(file);
  }
  return files;
}

const assets = {};
for (const file of await collect(sourceDir)) {
  const pathname = `/${relative(sourceDir, file).split('\\\\').join('/')}`;
  assets[pathname] = {
    body: (await readFile(file)).toString('base64'),
    type: mimeTypes[extname(file).toLowerCase()] || 'application/octet-stream'
  };
}

const worker = `const assets = ${JSON.stringify(assets)};
const bytes = value => Uint8Array.from(atob(value), character => character.charCodeAt(0));
export default {
  async fetch(request) {
    const url = new URL(request.url);
    let pathname = decodeURIComponent(url.pathname);
    if (pathname === '/') pathname = '/index.html';
    let asset = assets[pathname];
    if (!asset && !pathname.includes('.')) asset = assets[\`\${pathname}.html\`] || assets[\`\${pathname}/index.html\`];
    if (!asset) return new Response('Not found', { status: 404 });
    const cacheControl = asset.type.startsWith('text/html') ? 'no-store' : 'public, max-age=3600';
    return new Response(bytes(asset.body), { headers: { 'content-type': asset.type, 'cache-control': cacheControl } });
  }
};
`;

await mkdir('dist/server', { recursive: true });
await writeFile(outputFile, worker);
