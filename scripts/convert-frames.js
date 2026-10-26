const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const SRC_DIR = path.join(__dirname, '..', 'ezgif-24e86249b767ab17-jpg');
const OUT_HERO = path.join(__dirname, '..', 'assets', 'img', 'hero');
const OUT_DESKTOP = path.join(OUT_HERO, 'desktop');
const OUT_MOBILE = path.join(OUT_HERO, 'mobile');

// Ensure output directories exist
[OUT_HERO, OUT_DESKTOP, OUT_MOBILE].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Pad number to 3 digits
function pad(num) {
  return String(num).padStart(3, '0');
}

async function convertDesktopFrames() {
  console.log('Converting 200 desktop frames (1600x900)...');
  const t0 = Date.now();
  
  // We process in batches of 4 to balance memory and speed
  const total = 200;
  const batchSize = 6;
  
  for (let i = 1; i <= total; i += batchSize) {
    const promises = [];
    for (let j = i; j < i + batchSize && j <= total; j++) {
      const srcFile = path.join(SRC_DIR, `ezgif-frame-${pad(j)}.jpg`);
      const baseName = `frame-${pad(j)}`;
      
      const p = (async () => {
        const pipeline = sharp(srcFile).resize(1600, 900);
        await Promise.all([
          pipeline.clone().webp({ quality: 78 }).toFile(path.join(OUT_DESKTOP, `${baseName}.webp`)),
          pipeline.clone().avif({ quality: 60, effort: 2 }).toFile(path.join(OUT_DESKTOP, `${baseName}.avif`))
        ]);
        
        // Also if frame 1, create root hero poster fallbacks
        if (j === 1) {
          await Promise.all([
            pipeline.clone().jpeg({ quality: 82 }).toFile(path.join(OUT_HERO, 'hero-poster-desktop.jpg')),
            pipeline.clone().webp({ quality: 78 }).toFile(path.join(OUT_HERO, 'hero-poster-desktop.webp')),
            pipeline.clone().avif({ quality: 60, effort: 2 }).toFile(path.join(OUT_HERO, 'hero-poster-desktop.avif'))
          ]);
        }
      })();
      promises.push(p);
    }
    await Promise.all(promises);
    process.stdout.write(`Desktop frames: ${Math.min(i + batchSize - 1, total)}/${total} done\r`);
  }
  console.log(`\nDesktop conversion finished in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
}

async function convertMobileFrames() {
  console.log('\nConverting 66 mobile frames (720x1080 crop centered on rosette)...');
  const t0 = Date.now();
  
  // 66 frames sampled evenly from 1 to 200
  const mobileCount = 66;
  const sampleIndices = [];
  for (let i = 0; i < mobileCount; i++) {
    const frameIndex = Math.round(i * (199 / (mobileCount - 1))) + 1;
    sampleIndices.push(frameIndex);
  }
  
  const batchSize = 6;
  for (let i = 0; i < sampleIndices.length; i += batchSize) {
    const promises = [];
    for (let j = i; j < i + batchSize && j < sampleIndices.length; j++) {
      const srcFrameNum = sampleIndices[j];
      const mobileSeqNum = j + 1; // 1 to 66
      const srcFile = path.join(SRC_DIR, `ezgif-frame-${pad(srcFrameNum)}.jpg`);
      const baseName = `frame-${pad(mobileSeqNum)}`;
      
      const p = (async () => {
        // Crop: left: 600, top: 0, width: 720, height: 1080
        const pipeline = sharp(srcFile).extract({ left: 600, top: 0, width: 720, height: 1080 });
        await Promise.all([
          pipeline.clone().webp({ quality: 76 }).toFile(path.join(OUT_MOBILE, `${baseName}.webp`)),
          pipeline.clone().avif({ quality: 58, effort: 2 }).toFile(path.join(OUT_MOBILE, `${baseName}.avif`))
        ]);
        
        if (mobileSeqNum === 1) {
          await Promise.all([
            pipeline.clone().jpeg({ quality: 80 }).toFile(path.join(OUT_HERO, 'hero-poster-mobile.jpg')),
            pipeline.clone().webp({ quality: 76 }).toFile(path.join(OUT_HERO, 'hero-poster-mobile.webp')),
            pipeline.clone().avif({ quality: 58, effort: 2 }).toFile(path.join(OUT_HERO, 'hero-poster-mobile.avif'))
          ]);
        }
      })();
      promises.push(p);
    }
    await Promise.all(promises);
    process.stdout.write(`Mobile frames: ${Math.min(i + batchSize, sampleIndices.length)}/${sampleIndices.length} done\r`);
  }
  console.log(`\nMobile conversion finished in ${((Date.now() - t0) / 1000).toFixed(1)}s`);
}

async function run() {
  await convertDesktopFrames();
  await convertMobileFrames();
  console.log('\nAll frame sequences successfully generated in assets/img/hero/');
}

run().catch(err => {
  console.error('Conversion failed:', err);
  process.exit(1);
});
