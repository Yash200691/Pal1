import { removeBackground } from '@imgly/background-removal-node';
import * as fs from 'fs';

async function processImage() {
  try {
    const inputPath = 'd:/pallo/public/pal_woman.png';
    const outputPath = 'd:/pallo/public/pal_woman_transparent.png';
    console.log('Loading image:', inputPath);
    
    const buffer = fs.readFileSync(inputPath);
    const blob = new Blob([buffer], { type: 'image/png' });

    console.log('Running AI background removal...');
    const resultBlob = await removeBackground(blob, {
       output: {
          format: 'image/png',
       }
    });

    const resultBuffer = Buffer.from(await resultBlob.arrayBuffer());
    fs.writeFileSync(outputPath, resultBuffer);
    console.log('Successfully saved transparent image to', outputPath);
  } catch (err) {
    console.error('Error removing background:', err);
  }
}
processImage();
