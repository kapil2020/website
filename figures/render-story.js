/* Exports "Research in 30 seconds" as a video file.
 *
 *   npm i --no-save playwright && node figures/render-story.js [out.mp4]
 *
 * Serves the site locally, sizes the story to 360 x 450 CSS px and captures
 * it at 3x, so the video is 1080 x 1350 (4:5, the portrait size LinkedIn and
 * Instagram use). Every frame is drawn by the page's own clock through
 * window.__story.seek, so the video matches the site exactly. Needs ffmpeg
 * with libx264. Set CHROMIUM=/path/to/chrome to use an installed browser. */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const { chromium } = require('playwright');

const ROOT = path.join(__dirname, '..');
const OUT = path.resolve(process.argv[2] || 'research-in-30-seconds.mp4');
const FPS = 30;
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.jpg': 'image/jpeg',
  '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.webp': 'image/webp' };

const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p.endsWith('/')) p += 'index.html';
  const f = path.join(ROOT, p);
  if (!f.startsWith(ROOT) || !fs.existsSync(f)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
});

server.listen(0, '127.0.0.1', async () => {
  const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
  const page = await browser.newPage({ viewport: { width: 1280, height: 1000 }, deviceScaleFactor: 3 });
  await page.goto(`http://127.0.0.1:${server.address().port}/`, { waitUntil: 'networkidle' });
  await page.addStyleTag({ content: '.intro { grid-template-columns: minmax(0, 1fr) 360px !important; } .story-screen { border-radius: 0; box-shadow: none; }' });
  await page.evaluate(() => document.fonts.ready);

  const screen = page.locator('.story-screen');
  await screen.scrollIntoViewIfNeeded();
  const duration = await page.evaluate(() => window.__story.duration);

  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '20', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', OUT],
    { stdio: ['pipe', 'inherit', 'inherit'] });

  const frames = Math.round(duration * FPS);
  for (let i = 0; i < frames; i++) {
    await page.evaluate((t) => window.__story.seek(t), i / FPS);
    const png = await screen.screenshot({ type: 'png' });
    if (!ff.stdin.write(png)) await new Promise((r) => ff.stdin.once('drain', r));
    if (i % FPS === 0) process.stdout.write(`\r  ${Math.round(i / FPS)} / ${duration} s`);
  }
  ff.stdin.end();
  await new Promise((r) => ff.on('close', r));
  process.stdout.write(`\r  wrote ${OUT}\n`);
  await browser.close();
  server.close();
});
