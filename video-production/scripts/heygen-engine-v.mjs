import { chromium } from 'playwright';
const DRAFT='4e294682dcbb4cfc897e21decedc0d1d';
const ctx = await chromium.launchPersistentContext('.heygen-profile', { headless:true, channel:'chrome', viewport:{width:1600,height:1000} });
const page = ctx.pages()[0] || await ctx.newPage();
await ctx.addInitScript(()=>{Object.defineProperty(navigator,'webdriver',{get:()=>undefined});});
const log=(...a)=>console.log(...a);
await page.goto('https://app.heygen.com/create-v4/'+DRAFT+'?panel=scene',{waitUntil:'domcontentloaded',timeout:45000});
await page.waitForTimeout(9000);
await page.keyboard.press('Escape').catch(()=>{});

// open engine menu
await page.getByText('Avatar III',{exact:true}).first().click({timeout:8000});
await page.waitForTimeout(2500);
// find the "Avatar V" row coords via DOM and mouse-click its center
const box = await page.evaluate(()=>{
  const rows=[...document.querySelectorAll('div,li,button,[role=menuitem],[role=option]')];
  const r=rows.find(el=>{
    const t=(el.innerText||'').trim();
    return /^Avatar V\b/.test(t) && t.length<60 && el.offsetParent!==null && el.getClientRects().length;
  });
  if(!r) return null;
  const b=r.getBoundingClientRect();
  return {x:b.x+b.width/2, y:b.y+b.height/2, t:(r.innerText||'').trim().slice(0,40)};
});
log('Avatar V row:', JSON.stringify(box));
if(box){ await page.mouse.click(box.x, box.y); await page.waitForTimeout(3500); }
await page.keyboard.press('Escape').catch(()=>{});
await page.waitForTimeout(2000);
await page.screenshot({path:'renders/hg-engine-after.png'});
const b2 = await page.evaluate(()=>document.body?document.body.innerText.replace(/\s+/g,' '):'');
// the panel label "Motion Engine <X>"
const m = b2.match(/Motion Engine\s*(Avatar [VI]+)/);
log('panel Motion Engine =', m?m[1]:'(not found)');
log('has Avatar V label:', /Avatar V\b/.test(b2), '| Avatar III label:', /Avatar III\b/.test(b2));
await ctx.close();

