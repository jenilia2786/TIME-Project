import puppeteer from 'puppeteer';

const delay = ms => new Promise(res => setTimeout(res, ms));

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  // Step 1: Landing
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });
  await delay(2000);
  console.log('STEP 1 URL:', page.url());
  
  // Step 2: Navigate directly to /auth
  await page.goto('http://localhost:5173/auth', { waitUntil: 'networkidle2' });
  await delay(2000);
  console.log('STEP 2 URL:', page.url());

  // See what's on auth page
  const authEls = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('button')).map(b => b.innerText.trim());
  });
  console.log('Auth page buttons:', authEls);

  // Click "New Student"
  for (let b of await page.$$('button')) {
    const t = await b.evaluate(el => el.innerText.trim());
    if (t === 'New Student') {
      await b.click();
      await delay(1000);
      break;
    }
  }
  
  // Now check what we see
  const afterNewStudent = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('input, button')).map(el => ({
      tag: el.tagName,
      type: el.type,
      placeholder: el.placeholder,
      text: el.innerText || '',
      id: el.id
    }));
  });
  console.log('After "New Student" click:', afterNewStudent);
  
  // Fill name and phone
  const nameInput = await page.$('input[type="text"]');
  const phoneInput = await page.$('input[type="tel"]');
  if (nameInput) {
    await nameInput.type('Test Student');
    console.log('Typed name');
  }
  if (phoneInput) {
    await phoneInput.type('9876543210');
    console.log('Typed phone');
  }
  
  // Click Continue
  for (let b of await page.$$('button')) {
    const t = await b.evaluate(el => el.innerText.trim().toLowerCase());
    if (t === 'continue') {
      await b.click();
      break;
    }
  }
  await delay(2000);
  console.log('STEP 3 URL after Continue:', page.url());

  // Dump all DOM elements on this page
  const domDump = await page.evaluate(() => {
    const els = Array.from(document.querySelectorAll('button, input, select, textarea, h1, h2, h3, p'));
    return els.slice(0, 40).map(el => ({
      tag: el.tagName,
      type: el.type || '',
      id: el.id || '',
      text: (el.innerText || el.placeholder || el.value || '').trim().substring(0, 80)
    }));
  });
  console.log('DOM after continue:', JSON.stringify(domDump, null, 2));

  await browser.close();
})();
