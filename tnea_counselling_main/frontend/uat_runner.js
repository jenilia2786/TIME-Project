import puppeteer from 'puppeteer';
import fs from 'fs';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // Set viewport
  await page.setViewport({ width: 1280, height: 800 });

  const logs = [];
  page.on('console', msg => logs.push('CONSOLE: ' + msg.text()));
  page.on('pageerror', err => logs.push('PAGE ERROR: ' + err.message));

  console.log('--- Test Scenario 1: Application Launch ---');
  try {
      const response = await page.goto('http://localhost:5173', { waitUntil: 'networkidle0', timeout: 15000 });
      console.log('Landing page loaded with status:', response.status());
      
      const content = await page.content();
      if (!content.includes('TNEA')) {
          console.log('WARN: Did not find expected text on landing page.');
      }
      console.log('Landing page length:', content.length);
      
      // Let's dump clickable elements to see where to go next
      const elements = await page.evaluate(() => {
          const els = Array.from(document.querySelectorAll('a, button, [role="button"]'));
          return els.map(e => ({
              tag: e.tagName,
              text: e.innerText.trim() || e.textContent.trim(),
              href: e.href || ''
          })).filter(e => e.text);
      });
      console.log('Clickable elements found on landing page:', elements);
      
      await page.screenshot({ path: 'C:\\\\Users\\\\Jenilia Karen\\\\.gemini\\\\antigravity-ide\\\\brain\\\\264aec6d-3c13-4e12-8dce-447dd66996c3\\\\scratch\\\\landing.png' });
      console.log('Screenshot saved.');
      
  } catch(e) {
      console.error('Error during launch:', e);
  }
  
  console.log('Page Logs:', logs);
  await browser.close();
})();
