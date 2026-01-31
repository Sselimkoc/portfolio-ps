import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.join(__dirname, '../public');
const DEST_DIR = path.join(PUBLIC_DIR, 'wallpapers');

if (!fs.existsSync(DEST_DIR)) {
  fs.mkdirSync(DEST_DIR, { recursive: true });
}

const wallpapers = [
  { name: 'abstract-swirls', file: 'desktop-bg2.jpg' },
  { name: 'swirls', file: 'desktop-bg.jpg' },
  { name: 'railroad-cat', file: 'railroad-cat.png' },
  { name: 'windows-xp', file: 'windows-xp.jpg' },
  { name: 'cosmic-purple', file: 'trippy-purple.png' },
];

async function processImages() {
  console.log('Starting image optimization...');

  for (const wp of wallpapers) {
    const inputPath = path.join(PUBLIC_DIR, wp.file);
    
    if (!fs.existsSync(inputPath)) {
      console.warn(`Source file not found: ${wp.file}`);
      continue;
    }

    console.log(`Processing ${wp.name}...`);

    // Create Full Version (Optimized WebP, max 1920px)
    await sharp(inputPath)
      .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80, effort: 6 }) // effort 6 = better compression, slower
      .toFile(path.join(DEST_DIR, `${wp.name}.webp`));

    // Create Thumbnail (Small WebP, w=300px)
    await sharp(inputPath)
      .resize(400, 225, { fit: 'cover' })
      .webp({ quality: 70 })
      .toFile(path.join(DEST_DIR, `${wp.name}-thumb.webp`));
    
    console.log(`✓ ${wp.name} optimized`);
  }

  console.log('Done!');
}

processImages().catch(console.error);
