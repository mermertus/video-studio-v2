// Login HeyGen con perfil persistente + anti-detecciÃ³n (para que Google no bloquee "navegador no seguro").
// Maria se loguea con Google una vez; la sesiÃ³n queda en .heygen-profile (reusable headless).
import { chromium } from 'playwright';
import { existsSync } from 'node:fs';

const ctx = await chromium.launchPersistentContext('.heygen-profile', {
  headless: false,
  channel: 'chrome',
  viewport: null,
  ignoreDefaultArgs: ['--enable-automation'],
  args: ['--start-maximized', '--disable-blink-features=AutomationControlled', '--no-default-browser-check'],
});
// enmascarar webdriver en cada pÃ¡gina
await ctx.addInitScript(() => {
  Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
});
const page = ctx.pages()[0] || await ctx.newPage();
await page.goto('https://app.heygen.com/login', { waitUntil: 'domcontentloaded' }).catch(() => {});
console.log('>> Ventana abierta. Logueate con Google (equipopopup@gmail.com). Detectando...');

const probe = await ctx.newPage();
let ok = false;
for (let i = 0; i < 220; i++) { // ~15 min
  await page.waitForTimeout(4000);
  if (existsSync('.heygen-go')) { ok = true; console.log('  sentinel .heygen-go'); break; }
  try {
    await probe.goto('https://app.heygen.com/projects', { waitUntil: 'domcontentloaded', timeout: 20000 });
    await probe.waitForTimeout(2500);
    const txt = await probe.evaluate(() => document.body ? document.body.innerText : '');
    const wall = /continuar con google|sign in with google|sign in with apple|magic link/i.test(txt);
    if (i % 4 === 0) console.log(`  [check ${i}] loginWall=${wall} len=${txt.length}`);
    if (!wall && txt.length > 250) { ok = true; break; }
  } catch (e) { if (i % 6 === 0) console.log('  probe err', e.message.slice(0, 50)); }
}
try { await probe.close(); } catch {}
try { await page.bringToFront(); await page.screenshot({ path: 'renders/heygen-login-state.png' }); } catch {}
if (ok) { await ctx.storageState({ path: '.heygen-auth.json' }); console.log('HEYGEN_LOGIN_OK'); }
else console.log('HEYGEN_LOGIN_TIMEOUT');
await ctx.close();

