import { chromium } from 'playwright';
const ctx = await chromium.launchPersistentContext('.heygen-profile', { headless:true, channel:'chrome', viewport:{width:1600,height:1000} });
const page = ctx.pages()[0] || await ctx.newPage();
await ctx.addInitScript(()=>{Object.defineProperty(navigator,'webdriver',{get:()=>undefined});});
await page.goto('https://app.heygen.com/create-v4/b660ef745c0c4ee5b25e7a92a67b5ff4?panel=scene',{waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000);
await page.keyboard.press('Escape').catch(()=>{}); await page.waitForTimeout(500);
await page.getByText('Avatar V',{exact:true}).first().click().catch(()=>{});
await page.waitForTimeout(1800);
// dump the open dropdown options with selected state
const opts = await page.evaluate(()=>{
  const els=[...document.querySelectorAll('[role=option],[role=menuitem],[role=menuitemradio],li')];
  return els.map(e=>({t:e.innerText.trim().replace(/\s+/g,' ').slice(0,40), sel:e.getAttribute('aria-selected')||e.getAttribute('aria-checked')||(e.className.includes('select')?'?':'')})).filter(o=>o.t&&o.t.length<40&&/avatar/i.test(o.t));
});
console.log('OPTS:', JSON.stringify(opts));
await page.screenshot({path:'renders/hg-engine2.png', clip:{x:1080,y:330,width:520,height:260}});
await ctx.close();

