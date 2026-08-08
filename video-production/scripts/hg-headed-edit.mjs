import { chromium } from 'playwright';
import { existsSync } from 'node:fs';
const ctx = await chromium.launchPersistentContext('.heygen-profile', { headless:false, channel:'chrome', viewport:null, ignoreDefaultArgs:['--enable-automation'], args:['--start-maximized','--disable-blink-features=AutomationControlled'] });
await ctx.addInitScript(()=>{Object.defineProperty(navigator,'webdriver',{get:()=>undefined});});
const page = ctx.pages()[0] || await ctx.newPage();
await page.goto('https://app.heygen.com/create-v4/b660ef745c0c4ee5b25e7a92a67b5ff4?panel=scene',{waitUntil:'domcontentloaded'}); await page.waitForTimeout(8000);
for(const t of ['Maybe later','Got it','Close','Skip']){ const b=page.getByRole('button',{name:t}).first(); if(await b.count().catch(()=>0)){ await b.click().catch(()=>{}); await page.waitForTimeout(400);} }
console.log('>> Editor abierto. HacÃ©: (1) Upload audio -> Voz-Maria-V3-clean.WAV, (2) verificÃ¡ motor Avatar V, (3) Generate. AvisÃ¡ (.heygen-go) cuando estÃ© generando.');
for(let i=0;i<240;i++){ // 20 min
  await page.waitForTimeout(5000);
  if(existsSync('.heygen-go')){ console.log('LISTO_SENTINEL'); break; }
}
console.log('cerrando ventana');
await ctx.close();

