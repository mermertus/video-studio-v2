import { chromium } from 'playwright';
const ctx = await chromium.launchPersistentContext('.heygen-profile', { headless:true, channel:'chrome', viewport:{width:1500,height:950} });
const page = ctx.pages()[0] || await ctx.newPage();
await ctx.addInitScript(()=>{Object.defineProperty(navigator,'webdriver',{get:()=>undefined});});
await page.goto('https://app.heygen.com/avatars',{waitUntil:'domcontentloaded'}); await page.waitForTimeout(5000);
// dismiss modal if any
for(const t of ['Keep my plan','Keep my current plan','Maybe later','Close','No, thanks']){
  const b=page.getByText(t,{exact:false}).first(); if(await b.count().catch(()=>0)){ await b.click().catch(()=>{}); await page.waitForTimeout(800); break; }
}
await page.keyboard.press('Escape').catch(()=>{});
await page.waitForTimeout(500);
// click into Maria group
const grp = page.getByText('Maria Bejarano',{exact:false}).first();
if(await grp.count().catch(()=>0)){ await grp.click().catch(()=>{}); await page.waitForTimeout(4000); }
await page.screenshot({path:'renders/hg-group.png'});
console.log('URL:', page.url());
const txt = await page.evaluate(()=>document.body?document.body.innerText:'');
console.log(txt.replace(/\s+/g,' ').slice(0,700));
// list buttons visible
const btns = await page.evaluate(()=>Array.from(document.querySelectorAll('button,a')).map(b=>b.innerText.trim()).filter(t=>t&&t.length<30).slice(0,40));
console.log('BTNS:', JSON.stringify([...new Set(btns)]));
await ctx.close();

