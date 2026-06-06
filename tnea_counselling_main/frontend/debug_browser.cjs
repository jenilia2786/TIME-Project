const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('pageerror', error => {
    console.log('BROWSER_ERROR:', error.message);
    console.log('STACK:', error.stack);
  });

  console.log('Navigating to http://localhost:5173/dashboard');
  await page.goto('http://localhost:5173/dashboard', { waitUntil: 'networkidle0' });
  
  setTimeout(async () => {
    await browser.close();
  }, 2000);
})();
