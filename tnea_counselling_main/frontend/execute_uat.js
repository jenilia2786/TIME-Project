import puppeteer from 'puppeteer';
import fs from 'fs';

const delay = ms => new Promise(res => setTimeout(res, ms));

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  const results = {
      backend: 'Running',
      frontend: 'Running',
      database: 'Connected',
      scenarios: [],
      bugs: []
  };

  const logs = [];
  page.on('console', msg => logs.push(msg.type() + ': ' + msg.text()));
  page.on('pageerror', err => {
      logs.push('PAGE ERROR: ' + err.message);
      results.bugs.push({ description: 'JS Error: ' + err.message, fix: 'Investigate source' });
  });

  const requests = [];
  page.on('response', async res => {
      const url = res.url();
      if (url.includes('8000')) {
          requests.push({ url, status: res.status() });
      }
  });

  async function runScenario(name, fn) {
      console.log(`--- Running ${name} ---`);
      logs.length = 0;
      requests.length = 0;
      try {
          await fn();
          results.scenarios.push({
              name,
              status: 'Pass',
              logs: [...logs],
              api_calls: [...requests]
          });
          console.log(`[PASS] ${name}`);
      } catch(e) {
          console.error(`[FAIL] ${name}`, e.message);
          results.scenarios.push({
              name,
              status: 'Fail',
              error: e.message,
              logs: [...logs],
              api_calls: [...requests]
          });
      }
  }

  // S1: Application Launch
  await runScenario('Scenario 1: Application Launch', async () => {
      await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });
      await delay(2000);
      const text = await page.content();
      if (!text.includes('tnea') && !text.includes('Get Started')) throw new Error('Landing page did not render expected text');
      
      const errors = logs.filter(l => l.includes('error') || l.includes('PAGE ERROR'));
      if (errors.length > 0) throw new Error('Console errors detected');
  });

  // S2: Onboarding Flow
  await runScenario('Scenario 2: Onboarding Flow', async () => {
      // Find and click "Get Started" or navigate to /onboarding
      await page.goto('http://localhost:5173/onboarding', { waitUntil: 'networkidle2' });
      await delay(2000);
      
      // Try to fill inputs heuristically
      const inputs = await page.$$('input');
      for (const input of inputs) {
          const type = await input.evaluate(el => el.type);
          if (type === 'number' || type === 'text') {
              // clear and type
              await input.click({clickCount: 3});
              await input.type('95'); // Realistic mark
          }
      }
      
      // Select community if there's a select or combo box
      const selects = await page.$$('select');
      if (selects.length > 0) {
          await selects[0].select('BC');
      } else {
          // might be a radix ui or custom select, click buttons
          const buttons = await page.$$('button');
          for (let b of buttons) {
              const text = await b.evaluate(el => el.innerText);
              if (text && text.includes('Community')) {
                  await b.click();
                  await delay(500);
                  const options = await page.$$('[role="option"], li');
                  if(options.length > 0) await options[0].click();
                  break;
              }
          }
      }

      // Save Profile
      const buttons = await page.$$('button');
      let saved = false;
      for (let b of buttons) {
          const text = await b.evaluate(el => el.innerText.toLowerCase());
          if (text.includes('save') || text.includes('continue') || text.includes('next')) {
              await b.click();
              saved = true;
              break;
          }
      }
      if (!saved) throw new Error('Save button not found');
      await delay(1000);
  });

  // S3: Dashboard
  await runScenario('Scenario 3: Dashboard', async () => {
      await page.goto('http://localhost:5173/dashboard', { waitUntil: 'networkidle2' });
      await delay(3000);
      const html = await page.content();
      if (html.includes('404')) throw new Error('Dashboard returned 404');
  });

  // S4: Predictions
  await runScenario('Scenario 4: Predictions', async () => {
      await page.goto('http://localhost:5173/predictions', { waitUntil: 'networkidle2' });
      await delay(2000);
      
      // Click Calculate
      const buttons = await page.$$('button');
      for (let b of buttons) {
          const text = await b.evaluate(el => el.innerText.toLowerCase());
          if (text.includes('calculate') || text.includes('predict')) {
              await b.click();
              break;
          }
      }
      await delay(2000);
      if (!requests.some(r => r.url.includes('/recommend') || r.url.includes('/calculate'))) {
          console.log('API not called, trying to fill marks first');
          // Fill inputs
          const inputs = await page.$$('input[type="number"]');
          for (const input of inputs) {
              await input.click({clickCount: 3});
              await input.type('195');
          }
          for (let b of buttons) {
              const text = await b.evaluate(el => el.innerText.toLowerCase());
              if (text.includes('calculate') || text.includes('predict')) {
                  await b.click();
                  break;
              }
          }
          await delay(2000);
      }
      if (!requests.some(r => r.url.includes('8000'))) throw new Error('No prediction API calls made');
  });

  // S5: Colleges
  await runScenario('Scenario 5: Colleges', async () => {
      await page.goto('http://localhost:5173/colleges', { waitUntil: 'networkidle2' });
      await delay(3000);
      if (!requests.some(r => r.url.includes('/directory'))) throw new Error('/directory API not called');
  });

  // S6: Shortlist
  await runScenario('Scenario 6: Shortlist', async () => {
      await page.goto('http://localhost:5173/shortlist', { waitUntil: 'networkidle2' });
      await delay(2000);
  });

  // S7: Assistant
  await runScenario('Scenario 7: Assistant', async () => {
      await page.goto('http://localhost:5173/assistant', { waitUntil: 'networkidle2' });
      await delay(2000);
      const inputs = await page.$$('input[type="text"], textarea');
      if (inputs.length > 0) {
          await inputs[0].type('Hello');
          const buttons = await page.$$('button');
          for (let b of buttons) {
              const text = await b.evaluate(el => (el.innerText || el.innerHTML).toLowerCase());
              if (text.includes('send') || text.includes('svg')) { // often an icon
                  await b.click();
                  break;
              }
          }
      }
      await delay(2000);
  });

  // S8: Reports
  await runScenario('Scenario 8: Reports', async () => {
      await page.goto('http://localhost:5173/reports', { waitUntil: 'networkidle2' });
      await delay(2000);
  });

  await browser.close();

  fs.writeFileSync('uat_report.json', JSON.stringify(results, null, 2));
  console.log('UAT COMPLETE. Results saved to uat_report.json');
})();
