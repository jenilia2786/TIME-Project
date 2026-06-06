import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  await page.goto('http://localhost:5173/auth');
  await new Promise(r => setTimeout(r, 2000));
  
  // Fill Auth
  await page.type('input[placeholder="e.g. Priya Lakshmi"]', 'Test Student');
  await page.type('input[placeholder="9876543210"]', '9876543210');
  
  const buttons = await page.$$('button');
  for (let b of buttons) {
      const text = await b.evaluate(el => el.innerText);
      if (text && text.toLowerCase().includes('continue')) {
          await b.click();
          break;
      }
  }
  
  await new Promise(r => setTimeout(r, 3000));
  console.log('Current URL after auth:', page.url());
  
  // Extract inputs on onboarding
  const inputs = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('input, select, textarea, button')).map(el => {
          let labelText = '';
          if (el.id) {
              const label = document.querySelector(`label[for="${el.id}"]`);
              if (label) labelText = label.innerText;
          }
          if (!labelText) {
              const parentLabel = el.closest('label');
              if (parentLabel) labelText = parentLabel.innerText;
          }
          return {
              tag: el.tagName,
              type: el.type || '',
              placeholder: el.placeholder || '',
              label: labelText.trim(),
              text: el.innerText.trim() || el.textContent.trim(),
              value: el.value || ''
          };
      });
  });
  
  console.log('UI Elements on Onboarding:', inputs);
  
  await browser.close();
})();
