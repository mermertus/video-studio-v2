import { chromium } from 'playwright';
const DRAFT='4e294682dcbb4cfc897e21decedc0d1d';
const ABS='/Users/lio/Maria-y-Maria/video-production/video-projects/_maria-V4-Look3/assets/voz-julio-v4.mp3';
const ctx = await chromium.launchPersistentContext('.heygen-profile', { headless:true, channel:'chrome', viewport:{width:1600,height:1000} });
const page = ctx.pages()[0] || await ctx.newPage();
await ctx.addInitScript(()=>{Object.defineProperty(navigator,'webdriver',{get:()=>undefined});});
const log=(...a)=>console.log(...a);
const est=async()=>page.evaluate(()=>{const m=document.body.innerText.match(/\b(\d{1,3}(?:\.\d)?)\s*s\s*est/i);return m?m[1]+'s':'?';});
await page.goto('https://app.heygen.com/create-v4/'+DRAFT+'?panel=scene',{waitUntil:'domcontentloaded',timeout:45000});
await page.waitForTimeout(9000);
await page.keyboard.press('Escape').catch(()=>{});

// 1) Open Delivery style menu, click Remove
try{
  await page.getByText('Delivery style',{exact:false}).first().click({timeout:6000});
  await page.waitForTimeout(1500);
  await page.getByText('Remove',{exact:true}).first().click({timeout:6000});
  await page.waitForTimeout(2000);
  log('Removed delivery/audio');
}catch(e){ log('remove err', e.message.slice(0,50)); }
// confirm dialog if any
try{ const c=page.getByRole('button',{name:/remove|confirm|delete|yes/i}).first(); if(await c.count()){ await c.click({timeout:3000}); await page.waitForTimeout(1500);} }catch(e){}
await page.screenshot({path:'renders/hg-after-remove.png'});
log('upload audio present now?', await page.getByText('Upload audio',{exact:false}).count());

// 2) Upload audio via filechooser
let set=false;
try{
  const [fc]=await Promise.all([ page.waitForEvent('filechooser',{timeout:9000}).catch(()=>null), page.getByText('Upload audio',{exact:false}).first().click({timeout:6000}) ]);
  if(fc){ await fc.setFiles(ABS); set=true; log('filechooser set'); }
}catch(e){ log('upload click err', e.message.slice(0,50)); }
await page.waitForTimeout(4500);
await page.screenshot({path:'renders/hg-audio3-modal.png'});

// 3) Confirm "Add audio"
try{
  let btn=page.getByRole('button',{name:/add audio/i}).first();
  if(await btn.count()===0) btn=page.getByText('Add audio',{exact:false}).first();
  await btn.click({timeout:7000});
  log('clicked Add audio');
}catch(e){ log('add audio err', e.message.slice(0,50)); }
await page.waitForTimeout(8000);
await page.screenshot({path:'renders/hg-audio3-after.png'});
log('scene est AFTER:', await est());
const dur=await page.evaluate(()=>{const a=document.querySelector('audio');return a?Math.round(a.duration||0):'noaudio';});
log('audio el dur:', dur);
await ctx.close();

