import { chromium } from 'playwright';
const DRAFT='4e294682dcbb4cfc897e21decedc0d1d';
const ctx = await chromium.launchPersistentContext('.heygen-profile', { headless:true, channel:'chrome', viewport:{width:1600,height:1000} });
const page = ctx.pages()[0] || await ctx.newPage();
await ctx.addInitScript(()=>{Object.defineProperty(navigator,'webdriver',{get:()=>undefined});});
const log=(...a)=>console.log(...a);
await page.goto('https://app.heygen.com/create-v4/'+DRAFT+'?panel=scene',{waitUntil:'domcontentloaded',timeout:45000});
await page.waitForTimeout(10000);
await page.keyboard.press('Escape').catch(()=>{});
// wait until Generate enabled (up to ~60s)
const gen=page.getByRole('button',{name:/^Generate$/}).first();
let enabled=false;
for(let i=0;i<20;i++){
  try{ enabled=await gen.isEnabled({timeout:2000}); }catch(e){ enabled=false; }
  if(enabled) break;
  await page.waitForTimeout(3000);
}
log('Generate enabled:', enabled);
if(!enabled){ await page.screenshot({path:'renders/hg-gen3-disabled.png'}); await ctx.close(); process.exit(0); }
await gen.click({timeout:8000});
await page.waitForTimeout(3500);
const hasModal=await page.evaluate(()=>/Generate Video/i.test(document.body.innerText));
log('modal open:', hasModal);
// Submit inside dialog
const dlg=page.locator('[role=dialog]').last();
let sb=dlg.getByRole('button',{name:/^Submit$/i}).first();
if(await sb.count()===0) sb=page.getByRole('button',{name:/^Submit$/i}).last();
await sb.click({timeout:8000});
log('clicked Submit');
await page.waitForTimeout(7000);
await page.screenshot({path:'renders/hg-gen3-after.png'});
log('url:', page.url());
await ctx.close();

