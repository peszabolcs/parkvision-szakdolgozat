import { chromium } from '@playwright/test';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const wireframesDir = join(__dirname, '../sprints/02/wireframes');

async function captureScreenshots() {
  console.log('Starting browser...');
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
  });
  const page = await context.newPage();

  const baseURL = 'http://localhost:5173';

  try {
    console.log('Navigating to Dashboard...');
    await page.goto(`${baseURL}/dashboard`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: join(wireframesDir, '01-dashboard.png'),
      fullPage: true,
    });
    console.log('✓ Dashboard screenshot saved');

    console.log('Navigating to Parking Spaces...');
    await page.goto(`${baseURL}/parking-spaces`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: join(wireframesDir, '02-parking-spaces.png'),
      fullPage: true,
    });
    console.log('✓ Parking Spaces screenshot saved');

    console.log('Navigating to Areas...');
    await page.goto(`${baseURL}/areas`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: join(wireframesDir, '03-areas.png'),
      fullPage: true,
    });
    console.log('✓ Areas screenshot saved');

    console.log('\\nAll screenshots captured successfully!');
  } catch (error) {
    console.error('Error capturing screenshots:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

captureScreenshots();
