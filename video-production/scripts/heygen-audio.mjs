import { chromium } from 'playwright';
const DRAFT='4e294682dcbb4cfc897e21decedc0d1d';
const ABS='/Users/lio/Maria-y-Maria/video-production/video-projects/_maria-V4-Look3/assets/voz-julio-v4.mp3';
const ctx = await chromium.launchPersistentContext('.heygen-profile', { headless:true, channel:'chrome', viewport:{width:1600,height:1000}, acceptDownloads:true });
const page = ctx.pages()[0] || await ctx.newPage();
await ctx.addInitScript(()=>{Object.defineProperty(navigator,'webdriver',{get:()=>undefined});});
const log=(...a)=>console.log(...a);
await page.goto('https://app.heygen.com/create-v4/'+DRAFT+'?panel=scene',{waitUntil:'domcontentloaded',timeout:45000});
await page.waitForTimeout(9000);
await page.keyboard.press('Escape').catch(()=>{});

// detect existing audio chip (shows a time like 0:00 / 0:xx) and remove it
const beforeChip = await page.evaluate(()=>{ const b=document.body.innerText; const m=b.match(/\d{1,2}:\d{2}\s*\/\s*\d{1,2}:\d{2}/); return m?m[0]:null; });
log('existing audio chip:', beforeChip);
if(beforeChip){
  // try to find an X/remove near the chip
  try{ await page.locator('button:near(:text("'+beforeChip.split('/')[0].trim()+'"))').first().click({timeout:4000}); await page.waitForTimeout(1500);}catch(e){log('chip remove skip', e.message.slice(0,40));}
}

// Upload audio
let usedChooser=false;
try{
  const [fc] = await Promise.all([
    page.waitForEvent('filechooser',{timeout:9000}).catch(()=>null),
    page.getByText('Upload audio',{exact:false}).first().click({timeout:8000})
  ]);
  if(fc){ await fc.setFiles(ABS); usedChooser=true; log('filechooser set'); }
}catch(e){ log('upload click err', e.message.slice(0,60)); }
if(!usedChooser){
  try{ const inp=page.locator('input[type=file]'); const n=await inp.count(); log('file inputs:',n); await inp.last().setInputFiles(ABS); log('direct setInputFiles'); }
  catch(e){ log('direct input err', e.message.slice(0,60)); }
}
await page.waitForTimeout(5000);
await page.screenshot({path:'renders/hg-audio-modal.png'});
// Confirm modal: "Add audio"
try{
  const add = page.getByRole('button',{name:/add audio/i}).first();
  if(await add.count()>0){ await add.click({timeout:8000}); log('clicked Add audio'); }
  else { const add2=page.getByText('Add audio',{exact:false}).first(); await add2.click({timeout:6000}); log('clicked Add audio (text)'); }
}catch(e){ log('Add audio err', e.message.slice(0,60)); }
await page.waitForTimeout(6000);
await page.screenshot({path:'renders/hg-audio-after.png'});
const afterChip = await page.evaluate(()=>{ const b=document.body.innerText; const m=b.match(/\d{1,2}:\d{2}\s*\/\s*\d{1,2}:\d{2}/); return m?m[0]:null; });
log('audio chip after:', afterChip);
await ctx.close();

