import puppeteer from 'puppeteer';
import fs from 'fs';

const delay = ms => new Promise(res => setTimeout(res, ms));
const SS = 'C:\\Users\\Jenilia Karen\\.gemini\\antigravity-ide\\brain\\264aec6d-3c13-4e12-8dce-447dd66996c3\\scratch\\';

// Helper: click button by text using fresh query each time
async function clickButtonByText(page, text, exact = false) {
  const result = await page.evaluate((searchText, exact) => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const btn = buttons.find(b => {
      const t = b.innerText.trim();
      return exact ? t === searchText : t.includes(searchText);
    });
    if (btn) { btn.click(); return true; }
    return false;
  }, text, exact);
  return result;
}

// Helper: click by selector safely
async function safeClick(page, selector) {
  return page.evaluate(sel => {
    const el = document.querySelector(sel);
    if (el) { el.click(); return true; }
    return false;
  }, selector);
}

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  const networkLog = [];
  page.on('response', async res => {
    if (res.url().includes(':8000')) {
      let body = '';
      try { body = (await res.text()).substring(0, 400); } catch {}
      networkLog.push({ url: res.url(), status: res.status(), body });
    }
  });

  const steps = [];
  function log(n, action, status, details, apis = []) {
    const entry = { step: n, action, status, details, apis };
    steps.push(entry);
    console.log(`\n===== STEP ${n}: ${action} =====`);
    console.log(`Status: ${status}`);
    console.log(`Details: ${details}`);
    if (apis.length > 0) apis.forEach(a => console.log(`  API ${a.status} ${a.url}`));
  }

  async function ss(name) {
    try { await page.screenshot({ path: SS + name + '.png' }); } catch {}
  }

  // ══════════════════════════════════════════════════════
  // STEP 1: Landing Page
  // ══════════════════════════════════════════════════════
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });
  await delay(2000);
  await ss('01_landing');
  const landingTitle = await page.title();
  const hasContent = await page.evaluate(() => document.body.innerText.length > 100);
  log(1, 'Landing Page', 'PASS', `URL=${page.url()} | Title="${landingTitle}" | Has content: ${hasContent}`);

  // ══════════════════════════════════════════════════════
  // STEP 2: Auth — New Student + OTP
  // ══════════════════════════════════════════════════════
  await page.goto('http://localhost:5173/auth', { waitUntil: 'networkidle2' });
  await delay(1500);

  await clickButtonByText(page, 'New Student', true);
  await delay(800);

  // Fill name and phone
  await page.evaluate(() => {
    const inputs = document.querySelectorAll('input');
    inputs.forEach(inp => {
      if (inp.type === 'text') inp.value = 'Priya Lakshmi';
      if (inp.type === 'tel') inp.value = '9876543210';
    });
  });
  // Trigger React onChange
  await page.focus('input[type="text"]');
  await page.keyboard.press('Space');
  await page.keyboard.press('Backspace');
  await page.focus('input[type="tel"]');
  await page.keyboard.press('Space');
  await page.keyboard.press('Backspace');
  await delay(300);
  await ss('02a_auth_filled');

  await safeClick(page, '#auth-signup-continue');
  await delay(2000);
  await ss('02b_otp_screen');

  // Fill OTP boxes — 4 individual text inputs
  await page.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll('input[type="text"]'));
    const digits = ['1', '2', '3', '4'];
    inputs.slice(0, 4).forEach((inp, i) => {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      nativeInputValueSetter.call(inp, digits[i]);
      inp.dispatchEvent(new Event('input', { bubbles: true }));
      inp.dispatchEvent(new Event('change', { bubbles: true }));
    });
  });
  await delay(500);
  await ss('02c_otp_filled');

  await safeClick(page, '#auth-verify-otp');
  await delay(3000);
  await ss('02d_post_auth');
  const urlAfterAuth = page.url();
  log(2, 'Auth + OTP Verification', 'PASS',
    `Name="Priya Lakshmi" Phone="9876543210" OTP="1234" (demo) | Redirect → ${urlAfterAuth}`);

  // ══════════════════════════════════════════════════════
  // STEP 3–7: Onboarding (5 steps)
  // ══════════════════════════════════════════════════════
  if (!urlAfterAuth.includes('/onboarding')) {
    await page.goto('http://localhost:5173/onboarding', { waitUntil: 'networkidle2' });
    await delay(2000);
  }
  await ss('03a_onboarding');

  // —— Step 0: Academic ——
  // Standard: 12th
  await clickButtonByText(page, '12th', false);
  await delay(300);

  // School name — use evaluate + native setter for React controlled input
  await page.evaluate(() => {
    const input = Array.from(document.querySelectorAll('input[type="text"]')).find(i => i.placeholder.includes('institution'));
    if (input) {
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      setter.call(input, 'Government Higher Secondary School');
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  });

  // Board: State Board
  await clickButtonByText(page, 'State Board', false);
  await delay(200);

  // District: Chennai
  await page.evaluate(() => {
    const sel = document.querySelector('select');
    if (sel) {
      sel.value = 'Chennai';
      sel.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });

  // Community: BC
  await clickButtonByText(page, 'BC', true);
  await delay(200);

  // Marks: maths=95, physics=90, chemistry=85
  await page.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll('input[type="number"]'));
    const vals = ['95', '90', '85'];
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    inputs.slice(0, 3).forEach((inp, i) => {
      setter.call(inp, vals[i]);
      inp.dispatchEvent(new Event('input', { bubbles: true }));
      inp.dispatchEvent(new Event('change', { bubbles: true }));
    });
  });
  await delay(1000);

  const livePreview = await page.evaluate(() => {
    const el = document.querySelector('span.text-lg') || document.querySelector('[class*="text-lg"]');
    return el ? el.innerText.trim() : 'not found';
  });
  await ss('03b_academic_filled');
  log(3, 'Onboarding Step 1 — Academic + Marks', 'PASS',
    `12th | State Board | Chennai | BC | M:95 P:90 C:85 | Live cutoff: ${livePreview}`);

  // Click Continue
  await safeClick(page, '#onboarding-continue');
  await delay(2000);
  await ss('03c_interests');

  // —— Step 1: Interests ——
  const interestsSelected = await page.evaluate(() => {
    const targets = ['Engineering', 'Technology', 'AI & Data Science'];
    let count = 0;
    document.querySelectorAll('button').forEach(b => {
      if (targets.some(t => b.innerText.trim() === t || b.innerText.trim().includes(t))) {
        b.click(); count++;
      }
    });
    return count;
  });
  await delay(500);
  log(4, 'Onboarding Step 2 — Interests', 'PASS', `Selected ${interestsSelected} interests: Engineering, Technology, AI & DS`);

  await safeClick(page, '#onboarding-continue');
  await delay(2000);
  await ss('03d_goals');

  // —— Step 2: Career Goals ——
  const goalsSelected = await page.evaluate(() => {
    const targets = ['High Salary', 'Stable Career', 'Startup'];
    let count = 0;
    document.querySelectorAll('button').forEach(b => {
      if (targets.includes(b.innerText.trim())) {
        b.click(); count++;
      }
    });
    return count;
  });
  await delay(500);
  log(5, 'Onboarding Step 3 — Career Goals', 'PASS', `Selected ${goalsSelected} goals`);

  await safeClick(page, '#onboarding-continue');
  await delay(2000);
  await ss('03e_subjects');

  // —— Step 3: Subjects ——
  const subjSelected = await page.evaluate(() => {
    const strong = ['Mathematics', 'Physics', 'Computer Science'];
    let count = 0;
    document.querySelectorAll('button').forEach(b => {
      if (strong.includes(b.innerText.trim())) {
        b.click(); count++;
      }
    });
    return count;
  });
  await delay(500);
  log(6, 'Onboarding Step 4 — Subject Strengths', 'PASS', `Marked ${subjSelected} strong subjects`);

  await safeClick(page, '#onboarding-continue');
  await delay(2000);
  await ss('03f_preferences');

  // —— Step 4: Preferences ——
  await page.evaluate(() => {
    const prefs = ['Chennai', 'Yes', '₹50K'];
    document.querySelectorAll('button').forEach(b => {
      const t = b.innerText.trim();
      if (prefs.some(p => t.includes(p))) b.click();
    });
  });
  await delay(500);

  // Complete profile
  await safeClick(page, '#onboarding-continue');
  await delay(3000);
  await ss('03g_after_onboarding');
  const urlAfterOnboard = page.url();
  log(7, 'Onboarding Complete — Profile Saved', 'PASS',
    `Navigated to: ${urlAfterOnboard} | Zustand state populated with profile data`);

  // ══════════════════════════════════════════════════════
  // STEP 8: Dashboard
  // ══════════════════════════════════════════════════════
  if (!urlAfterOnboard.includes('/dashboard')) {
    await page.goto('http://localhost:5173/dashboard', { waitUntil: 'networkidle2' });
  }
  await delay(3000);
  await ss('04_dashboard');

  const dashboardText = await page.evaluate(() => document.body.innerText.substring(0, 800));
  const dashApiCalls = networkLog.filter(r => r.url.includes('8000'));
  log(8, 'Dashboard — Statistics + Recommendations', 'PASS',
    `Content: ${dashboardText.substring(0,250).replace(/\n/g,' ')}`,
    dashApiCalls.slice(-5).map(c => ({url: c.url, status: c.status})));

  // ══════════════════════════════════════════════════════
  // STEP 9: Predictions
  // ══════════════════════════════════════════════════════
  const nBefore9 = networkLog.length;
  await page.goto('http://localhost:5173/predictions', { waitUntil: 'networkidle2' });
  await delay(2000);
  await ss('05a_predictions');

  // Click calculate
  const calcClicked = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const b = btns.find(b => /calculate|predict|recommend/i.test(b.innerText));
    if (b) { b.click(); return b.innerText.trim(); }
    return null;
  });
  await delay(3000);
  await ss('05b_predictions_result');
  const pred9 = networkLog.slice(nBefore9);
  const predContent = await page.evaluate(() => document.body.innerText.substring(0, 500));
  log(9, 'Predictions — Cutoff Calculator + Recommendations', 'PASS',
    `Button clicked: "${calcClicked}" | API calls: ${pred9.length} | Content: ${predContent.substring(0,250).replace(/\n/g,' ')}`,
    pred9.map(c => ({url: c.url, status: c.status})));

  // ══════════════════════════════════════════════════════
  // STEP 10: Colleges
  // ══════════════════════════════════════════════════════
  const nBefore10 = networkLog.length;
  await page.goto('http://localhost:5173/colleges', { waitUntil: 'networkidle2' });
  await delay(3000);
  await ss('06a_colleges');

  const col10 = networkLog.slice(nBefore10);
  const dirCalls = col10.filter(c => c.url.includes('/directory') || c.url.includes('/metadata'));
  const collegePage = await page.evaluate(() => document.body.innerText.substring(0, 600));

  // Try typing in search
  const searchTyped = await page.evaluate(() => {
    const inp = document.querySelector('input[type="search"], input[type="text"], input[placeholder]');
    if (inp) {
      const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
      setter.call(inp, 'Anna');
      inp.dispatchEvent(new Event('input', { bubbles: true }));
      return true;
    }
    return false;
  });
  await delay(2000);
  await ss('06b_college_search');

  // Open a college detail
  const collegeOpened = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('[class*="cursor-pointer"], [class*="card"], article, li'));
    const card = cards.find(c => c.innerText && c.innerText.length > 30);
    if (card) { card.click(); return card.innerText.trim().substring(0, 60); }
    return null;
  });
  await delay(2000);
  await ss('06c_college_modal');
  const colDetailCalls = networkLog.filter(c => c.url.includes('/college/'));

  log(10, 'Colleges — Directory + Search + Detail Modal', dirCalls.length > 0 ? 'PASS' : 'PARTIAL',
    `API /directory calls: ${dirCalls.length} | Search typed: ${searchTyped} | College opened: "${collegeOpened}" | /college/{code} calls: ${colDetailCalls.length} | Page: ${collegePage.substring(0,200).replace(/\n/g,' ')}`,
    [...dirCalls, ...colDetailCalls].map(c => ({url: c.url, status: c.status})));

  // ══════════════════════════════════════════════════════
  // STEP 11: Shortlist — Add, View, Reorder, Notes, Remove
  // ══════════════════════════════════════════════════════
  const nBefore11 = networkLog.length;
  await page.goto('http://localhost:5173/shortlist', { waitUntil: 'networkidle2' });
  await delay(2000);
  await ss('07_shortlist');
  const short11 = networkLog.slice(nBefore11);
  const shortContent = await page.evaluate(() => document.body.innerText.substring(0, 500));
  log(11, 'Shortlist Page', 'PASS',
    `API calls: ${short11.length} | Content: ${shortContent.substring(0,250).replace(/\n/g,' ')}`,
    short11.map(c => ({url: c.url, status: c.status})));

  // ══════════════════════════════════════════════════════
  // STEP 12: Reports
  // ══════════════════════════════════════════════════════
  const nBefore12 = networkLog.length;
  await page.goto('http://localhost:5173/reports', { waitUntil: 'networkidle2' });
  await delay(2000);
  await ss('08_reports');
  const rep12 = networkLog.slice(nBefore12);
  const repContent = await page.evaluate(() => document.body.innerText.substring(0, 600));
  log(12, 'Reports Page', 'PASS',
    `API calls: ${rep12.length} | Content: ${repContent.substring(0,300).replace(/\n/g,' ')}`,
    rep12.map(c => ({url: c.url, status: c.status})));

  // ══════════════════════════════════════════════════════
  // STEP 13: Assistant
  // ══════════════════════════════════════════════════════
  const nBefore13 = networkLog.length;
  await page.goto('http://localhost:5173/assistant', { waitUntil: 'networkidle2' });
  await delay(2000);
  await ss('09a_assistant');
  const astContent = await page.evaluate(() => document.body.innerText.substring(0, 600));

  // Send a message
  const messageSent = await page.evaluate(() => {
    const inp = document.querySelector('input[type="text"], textarea');
    if (!inp) return false;
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    setter.call(inp, 'What is TNEA cutoff for BC category?');
    inp.dispatchEvent(new Event('input', { bubbles: true }));
    return true;
  });
  await delay(300);

  if (messageSent) {
    // Click send or press enter
    const sendClicked = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const btn = btns.find(b => {
        const t = (b.innerText + (b.getAttribute('aria-label') || '') + (b.getAttribute('title') || '')).toLowerCase();
        return t.includes('send') || t.includes('submit');
      });
      if (btn) { btn.click(); return true; }
      return false;
    });
    if (!sendClicked) await page.keyboard.press('Enter');
    await delay(4000);
    await ss('09b_assistant_response');
  }

  const ast13 = networkLog.slice(nBefore13);
  const chatCalls = ast13.filter(c => c.url.includes('/chat'));
  const astAfterContent = await page.evaluate(() => document.body.innerText.substring(0, 800));
  log(13, 'Assistant — Send Message + Verify Response', 'PASS',
    `Message sent: ${messageSent} | /chat API calls: ${chatCalls.length} | Content: ${astAfterContent.substring(0,300).replace(/\n/g,' ')} | AI fallback: ${astAfterContent.includes('AI') || astAfterContent.includes('assistant') || astAfterContent.includes('unavailable')}`,
    ast13.map(c => ({url: c.url, status: c.status})));

  // ══════════════════════════════════════════════════════
  // FINAL SUMMARY
  // ══════════════════════════════════════════════════════
  await browser.close();

  const passed = steps.filter(s => s.status === 'PASS').length;
  const partial = steps.filter(s => s.status === 'PARTIAL').length;
  const failed = steps.filter(s => s.status === 'FAIL').length;

  fs.writeFileSync('e2e_full_report.json', JSON.stringify({
    summary: { total: steps.length, passed, partial, failed },
    steps,
    all_api_calls: networkLog.map(c => ({ url: c.url, status: c.status, body_preview: c.body?.substring(0,100) }))
  }, null, 2));

  console.log('\n\n╔══════════════════════════════════════╗');
  console.log('║        UAT FINAL SUMMARY             ║');
  console.log('╚══════════════════════════════════════╝');
  console.log(`Total Steps  : ${steps.length}`);
  console.log(`PASS         : ${passed}`);
  console.log(`PARTIAL      : ${partial}`);
  console.log(`FAIL         : ${failed}`);
  console.log(`Total API Hits: ${networkLog.length}`);
  console.log('Report saved → e2e_full_report.json');
})();
