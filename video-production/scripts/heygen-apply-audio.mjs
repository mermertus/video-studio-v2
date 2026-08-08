import { chromium } from 'playwright';
const DRAFT='4e294682dcbb4cfc897e21decedc0d1d';
const ctx = await chromium.launchPersistentContext('.heygen-profile', { headless:true, channel:'chrome', viewport:{width:1600,height:1000} });
const page = ctx.pages()[0] || await ctx.newPage();
await ctx.addInitScript(()=>{Object.defineProperty(navigator,'webdriver',{get:()=>undefined});});
const log=(...a)=>console.log(...a);
const est=async()=>page.evaluate(()=>{const m=document.body.innerText.match(/\b(\d{1,3}(?:\.\d)?)\s*s\s*est/i);return m?m[1]:'?';});
await page.goto('https://app.heygen.com/create-v4/'+DRAFT+'?panel=scene',{waitUntil:'domcontentloaded',timeout:45000});
await page.waitForTimeout(9000);
await page.keyboard.press('Escape').catch(()=>{});
// select scene 2
await page.mouse.click(566,906); await page.waitForTimeout(2500);
log('scene2 est before:', await est());
// open Upload audio modal
const up=page.getByText('Upload audio',{exact:false}).first();
if(await up.count()===0){ log('no Upload audio (maybe audio already set). est=',await est()); await page.screenshot({path:'renders/hg-apply-state.png'}); await ctx.close(); process.exit(0); }
await up.click({timeout:8000}); await page.waitForTimeout(2500);
await page.screenshot({path:'renders/hg-apply-modal.png'});
// find my v4 audio in list (00:46 duration, unique) and click it
const clicked = await page.evaluate(()=>{
  const rows=[...document.querySelectorAll('div,li,button')];
  // find a row whose text has 00:46 (mi audio) y un nombre de archivo
  const r=rows.find(e=>/00:46/.test(e.innerText||'') && (e.innerText||'').length<80 && e.offsetParent!==null && e.getClientRects().length);
  if(!r) return null;
  const b=r.getBoundingClientRect();
  return {x:Math.round(b.x+b.width/2),y:Math.round(b.y+b.height/2),t:(r.innerText||'').trim().replace(/\s+/g,' ').slice(0,40)};
});
log('v4 row (00:46):', JSON.stringify(clicked));
if(clicked){ await page.mouse.click(clicked.x,clicked.y); await page.waitForTimeout(3000); }
// some UIs need a confirm
try{ const b=page.getByRole('button',{name:/add audio|confirm|use|select/i}).first(); if(await b.count()){ await b.click({timeout:4000}); log('confirmed'); } }catch(e){}
await page.waitForTimeout(6000);
await page.screenshot({path:'renders/hg-apply-after.png'});
log('scene2 est AFTER:', await est());
await ctx.close();

