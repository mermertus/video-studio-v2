import { chromium } from 'playwright';
const DRAFT='4e294682dcbb4cfc897e21decedc0d1d';
const ABS='/Users/lio/Maria-y-Maria/video-production/video-projects/_maria-V4-Look3/assets/voz-julio-v4.mp3';
const ctx = await chromium.launchPersistentContext('.heygen-profile', { headless:true, channel:'chrome', viewport:{width:1600,height:1000} });
const page = ctx.pages()[0] || await ctx.newPage();
await ctx.addInitScript(()=>{Object.defineProperty(navigator,'webdriver',{get:()=>undefined});});
const log=(...a)=>console.log(...a);
const sceneEst=async()=>page.evaluate(()=>{const m=document.body.innerText.match(/\b(\d{1,3}(?:\.\d)?)\s*s\s*est\.?/i);return m?m[1]+'s':'?';});
await page.goto('https://app.heygen.com/create-v4/'+DRAFT+'?panel=scene',{waitUntil:'domcontentloaded',timeout:45000});
await page.waitForTimeout(9000);
await page.keyboard.press('Escape').catch(()=>{});
log('scene est before:', await sceneEst());

// reveal Upload audio: if not present, remove existing empty audio chip
let hasUpload = await page.getByText('Upload audio',{exact:false}).count();
log('Upload audio present?', hasUpload);
if(!hasUpload){
  // click the audio chip in left panel to open its menu / reveal remove
  const chip = page.locator('button:has(svg)').filter({hasText:/^\s*$/}).first();
  // hover the leftmost script chip area and try to find a delete
  try{
    // find a button near a "00:00" time and hover
    const t = page.getByText('00:00',{exact:false}).first();
    if(await t.count()){ await t.hover(); await page.waitForTimeout(800); await t.click({timeout:4000}).catch(()=>{}); await page.waitForTimeout(1500); }
    await page.screenshot({path:'renders/hg-chip-open.png'});
    // look again for upload / replace
    hasUpload = await page.getByText(/upload audio|replace audio/i).count();
    log('after chip click, upload/replace?', hasUpload);
  }catch(e){ log('chip err', e.message.slice(0,50)); }
}

// trigger filechooser
let set=false;
for(const label of [/replace audio/i,/upload audio/i]){
  if(set) break;
  const el = page.getByText(label).first();
  if(await el.count()===0) continue;
  try{
    const [fc]=await Promise.all([ page.waitForEvent('filechooser',{timeout:9000}).catch(()=>null), el.click({timeout:6000}) ]);
    if(fc){ await fc.setFiles(ABS); set=true; log('filechooser via', String(label)); }
  }catch(e){ log('click '+label+' err', e.message.slice(0,40)); }
}
await page.waitForTimeout(4000);
await page.screenshot({path:'renders/hg-audio2-modal.png'});

// Confirm modal: click primary button (Add audio)
try{
  const dlg = page.locator('[role=dialog]').last();
  let btn = dlg.getByRole('button',{name:/add audio|confirm|add/i}).first();
  if(await btn.count()===0) btn = page.getByText(/add audio/i).first();
  await btn.click({timeout:7000});
  log('confirmed Add audio');
}catch(e){ log('confirm err', e.message.slice(0,50)); }
await page.waitForTimeout(7000);
await page.screenshot({path:'renders/hg-audio2-after.png'});
log('scene est AFTER:', await sceneEst());
await ctx.close();

