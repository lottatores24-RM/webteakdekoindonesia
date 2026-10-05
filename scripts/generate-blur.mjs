// Generates lib/image-meta.json: width, height and a tiny blurred WebP
// placeholder for every image in public/images. Runs automatically before `next build`.
import { readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(process.cwd(), 'public');
const exts = new Set(['.jpg', '.jpeg', '.png', '.webp']);

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)])),
  );
  return files.flat();
}

const files = (await walk(path.join(root, 'images')))
  .filter((f) => exts.has(path.extname(f).toLowerCase()) && !f.includes(`${path.sep}logo${path.sep}`))
  .sort();

const meta = {};
for (const file of files) {
  const image = sharp(file);
  const { width, height } = await image.metadata();
  const buf = await image.clone().resize(16).webp({ quality: 40 }).toBuffer();
  const key = '/' + path.relative(root, file).split(path.sep).join('/');
  meta[key] = { width, height, blur: `data:image/webp;base64,${buf.toString('base64')}` };
}

await writeFile(path.resolve('lib/image-meta.json'), JSON.stringify(meta, null, 2) + '\n');
console.log(`image-meta: ${Object.keys(meta).length} images`);
