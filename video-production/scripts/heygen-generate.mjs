import { chromium } from 'playwright';
const DRAFT='4e294682dcbb4cfc897e21decedc0d1d';
const ctx = await chromium.launchPersistentContext('.heygen-profile', { headless:true, channel:'chrome', viewport:{width:1600,height:1000} });
const page = ctx.pages()[0] || await ctx.newPage();
await ctx.addInitScript(()=>{Object.defineProperty(navigator,'webdriver',{get:()=>undefined});});
const log=(...a)=>console.log(...a);
await page.goto('https://app.heygen.com/create-v4/'+DRAFT+'?panel=scene',{waitUntil:'domcontentloaded',timeout:45000});
await page.waitForTimeout(9000);
await page.keyboard.press('Escape').catch(()=>{});
// ensure Portrait
try{ await page.locator('[aria-label="Portrait (9:16)"]').click({timeout:6000}); await page.waitForTimeout(1500); log('portrait ensured'); }catch(e){ log('portrait skip'); }
// Generate
try{ await page.getByRole('button',{name:/^Generate$/i}).first().click({timeout:8000}); }
catch(e){ await page.getByText('Generate',{exact:true}).first().click({timeout:6000}).catch(()=>{}); }
await page.waitForTimeout(3500);
await page.screenshot({path:'renders/hg-gen-modal.png'});
// Submit in confirmation modal
let submitted=false;
for(const re of [/^Submit$/i,/submit/i,/generate/i,/confirm/i]){
  try{ const b=page.getByRole('button',{name:re}).last(); if(await b.count()){ await b.click({timeout:5000}); submitted=true; log('clicked',String(re)); break; } }catch(e){}
}
await page.waitForTimeout(5000);
await page.screenshot({path:'renders/hg-gen-after.png'});
const body=await page.evaluate(()=>document.body.innerText.replace(/\s+/g,' ').slice(0,300));
log('submitted:', submitted);
log('post-submit body:', body.slice(0,200));
await ctx.close();

