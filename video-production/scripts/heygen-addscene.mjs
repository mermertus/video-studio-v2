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

// Add scene
try{ await page.getByText('Add scene',{exact:false}).first().click({timeout:8000}); await page.waitForTimeout(4000); log('added scene'); }
catch(e){ log('add scene err', e.message.slice(0,50)); }
await page.screenshot({path:'renders/hg-as-new.png'});
log('Upload audio present on blank scene?', await page.getByText('Upload audio',{exact:false}).count());

// upload audio
let set=false;
try{
  const [fc]=await Promise.all([ page.waitForEvent('filechooser',{timeout:9000}).catch(()=>null), page.getByText('Upload audio',{exact:false}).first().click({timeout:6000}) ]);
  if(fc){ await fc.setFiles(ABS); set=true; log('filechooser SET'); }
}catch(e){ log('upload err', e.message.slice(0,50)); }
await page.waitForTimeout(5000);
await page.screenshot({path:'renders/hg-as-modal.png'});
// confirm
try{
  let b=page.getByRole('button',{name:/add audio/i}).first();
  if(await b.count()===0) b=page.getByText('Add audio',{exact:false}).first();
  await b.click({timeout:7000}); log('clicked Add audio');
}catch(e){ log('confirm err', e.message.slice(0,50)); }
await page.waitForTimeout(8000);
await page.screenshot({path:'renders/hg-as-after.png'});
log('scene est after:', await est());
const audur=await page.evaluate(()=>{const a=document.querySelector('audio');return a?Math.round(a.duration||0):'noaudio';});
log('audio el dur:', audur);
await ctx.close();

