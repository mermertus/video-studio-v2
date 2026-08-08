import { chromium } from 'playwright';
const DRAFT='4e294682dcbb4cfc897e21decedc0d1d';
const ABS='/Users/lio/Maria-y-Maria/video-production/video-projects/_maria-V4-Look3/assets/voz-julio-v4.mp3';
const ctx = await chromium.launchPersistentContext('.heygen-profile', { headless:true, channel:'chrome', viewport:{width:1600,height:1000} });
const page = ctx.pages()[0] || await ctx.newPage();
await ctx.addInitScript(()=>{Object.defineProperty(navigator,'webdriver',{get:()=>undefined});});
const log=(...a)=>console.log(...a);
await page.goto('https://app.heygen.com/create-v4/'+DRAFT+'?panel=scene',{waitUntil:'domcontentloaded',timeout:45000});
await page.waitForTimeout(9000);
await page.keyboard.press('Escape').catch(()=>{});
// select scene 2 (2nd timeline thumbnail) by coords
await page.mouse.click(566,906); await page.waitForTimeout(2500);
const upCount = await page.getByText('Upload audio',{exact:false}).count();
log('Upload audio present (scene2)?', upCount);
if(upCount===0){ log('scene2 not blank â€” abort'); await page.screenshot({path:'renders/hg-um-noupload.png'}); await ctx.close(); process.exit(0); }
// open modal
await page.getByText('Upload audio',{exact:false}).first().click({timeout:8000});
await page.waitForTimeout(2500);
// click "Upload a file" inside modal -> filechooser
let set=false;
try{
  const [fc]=await Promise.all([ page.waitForEvent('filechooser',{timeout:10000}).catch(()=>null), page.getByText(/upload a file/i).first().click({timeout:6000}) ]);
  if(fc){ await fc.setFiles(ABS); set=true; log('filechooser SET via Upload a file'); }
}catch(e){ log('upload-a-file err', e.message.slice(0,60)); }
// fallback: direct input accept audio
if(!set){
  const inp=page.locator('input[type=file]');
  const n=await inp.count();
  for(let i=0;i<n;i++){ const acc=await inp.nth(i).getAttribute('accept'); if(acc&&/audio|mpeg|mp3|wav/i.test(acc)){ await inp.nth(i).setInputFiles(ABS); set=true; log('direct audio input',acc); break; } }
}
await page.waitForTimeout(7000);
await page.screenshot({path:'renders/hg-um-uploaded.png'});
// dump modal text/buttons to see confirm flow
const opts=await page.evaluate(()=>[...document.querySelectorAll('button')].map(b=>(b.innerText||'').trim()).filter(t=>t&&t.length<26));
log('buttons after upload:', JSON.stringify([...new Set(opts)].slice(0,30)));
const hasV4=await page.evaluate(()=>/voz-julio-v4|00:46/i.test(document.body.innerText));
log('v4 audio visible in modal?', hasV4);
await ctx.close();

