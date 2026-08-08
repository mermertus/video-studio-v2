import { chromium } from 'playwright';
const ctx = await chromium.launchPersistentContext('.heygen-profile', { headless:true, channel:'chrome', viewport:{width:1600,height:1000} });
const page = ctx.pages()[0] || await ctx.newPage();
await ctx.addInitScript(()=>{Object.defineProperty(navigator,'webdriver',{get:()=>undefined});});
await page.goto('https://app.heygen.com/create-v4/b660ef745c0c4ee5b25e7a92a67b5ff4?panel=scene',{waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000);
// dismiss modal(s)
for(const t of ['Maybe later','Try Now','Got it','Close','Skip','No thanks']){
  const b=page.getByRole('button',{name:t}).first(); if(await b.count().catch(()=>0)){ await b.click().catch(()=>{}); await page.waitForTimeout(600);} }
await page.keyboard.press('Escape').catch(()=>{}); await page.waitForTimeout(500);
await page.keyboard.press('Escape').catch(()=>{}); await page.waitForTimeout(800);
await page.screenshot({path:'renders/hg-editor3.png'});
console.log('URL:', page.url());
// enumerate top-bar buttons (icon aria-labels)
const labels = await page.evaluate(()=>Array.from(document.querySelectorAll('button,[role=button],[aria-haspopup]')).map(b=>(b.getAttribute('aria-label')||b.getAttribute('title')||b.innerText||'').trim()).filter(t=>t&&t.length<30));
console.log('CTRLS:', JSON.stringify([...new Set(labels)].slice(0,70)));
await ctx.close();

