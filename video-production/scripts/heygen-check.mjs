// Chequea si el perfil .heygen-profile estÃ¡ logueado (headless): va a /avatars y busca seÃ±ales de auth.
import { chromium } from 'playwright';
const ctx = await chromium.launchPersistentContext('.heygen-profile', { headless: true, channel: 'chrome', viewport: { width: 1440, height: 900 } });
const page = ctx.pages()[0] || await ctx.newPage();
const out = {};
for (const path of ['/home', '/avatars', '/projects']) {
  try {
    await page.goto('https://app.heygen.com' + path, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(5000);
    const url = page.url();
    const txt = await page.evaluate(() => document.body ? document.body.innerText : '');
    out[path] = { url, len: txt.length, hasMaria: /julio/i.test(txt), hasLogin: /continue with google|sign up|log in|get started free/i.test(txt), sample: txt.replace(/\s+/g, ' ').slice(0, 200) };
  } catch (e) { out[path] = { err: e.message }; }
}
await page.screenshot({ path: 'renders/heygen-check.png', fullPage: false }).catch(() => {});
console.log(JSON.stringify(out, null, 2));
await ctx.close();

