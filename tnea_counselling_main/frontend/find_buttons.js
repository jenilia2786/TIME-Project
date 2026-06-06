import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1280, height: 800 });

  console.log('Navigating...');
  await page.goto('http://localhost:5173');
  
  let attempts = 0;
  while(attempts < 20) {
      await new Promise(r => setTimeout(r, 1000));
      const elements = await page.evaluate(() => {
          const els = Array.from(document.querySelectorAll('a, button, [role="button"]'));
          return els.map(e => ({
              tag: e.tagName,
              text: e.innerText.trim() || e.textContent.trim()
          })).filter(e => e.text);
      });
      console.log(`Attempt ${attempts}: Found ${elements.length} clickable elements.`);
      if (elements.length > 0) {
          console.log('Elements:', elements);
          break;
      }
      attempts++;
  }
  
  await page.screenshot({ path: 'C:\\\\Users\\\\Jenilia Karen\\\\.gemini\\\\antigravity-ide\\\\brain\\\\264aec6d-3c13-4e12-8dce-447dd66996c3\\\\scratch\\\\landing_after_wait.png' });
  await browser.close();
})();
