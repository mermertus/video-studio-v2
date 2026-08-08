import { chromium } from 'playwright';
const DRAFT='4e294682dcbb4cfc897e21decedc0d1d';
const ABS='/Users/lio/Maria-y-Maria/video-production/video-projects/_maria-V4-Look3/assets/voz-julio-v4.mp3';
const ctx = await chromium.launchPersistentContext('.heygen-profile', { headless:true, channel:'chrome', viewport:{width:1600,height:1000} });
const page = ctx.pages()[0] || await ctx.newPage();
await ctx.addInitScript(()=>{Object.defineProperty(navigator,'webdriver',{get:()=>undefined});});
const log=(...a)=>console.log(...a);
const est=async()=>page.evaluate(()=>{const m=document.body.innerText.match(/\b(\d{1,3}(?:\.\d)?)\s*s\s*est/i);return m?m[1]+'s':'?';});
const findCoords=(re)=>page.evaluate((src)=>{const rx=new RegExp(src,'i');const el=[...document.querySelectorAll('button,[role=menuitem],[role=option],a,div,span')].find(e=>{const t=(e.childElementCount<3?(e.innerText||''):'').trim();return rx.test(t)&&t.length<26&&e.offsetParent!==null&&e.getClientRects().length;});if(!el)return null;const b=el.getBoundingClientRect();return{x:Math.round(b.x+b.width/2),y:Math.round(b.y+b.height/2),t:(el.innerText||'').trim().slice(0,24)};},re.source);
await page.goto('https://app.heygen.com/create-v4/'+DRAFT+'?panel=scene',{waitUntil:'domcontentloaded',timeout:45000});
await page.waitForTimeout(9000);
await page.keyboard.press('Escape').catch(()=>{});

// open chip popover at known-good coords
await page.mouse.click(138,166); await page.waitForTimeout(1800);
let rm=await findCoords(/^Remove$/);
log('Remove coords:', JSON.stringify(rm));
if(rm){ await page.mouse.click(rm.x,rm.y); await page.waitForTimeout(2500); }
// confirm dialog
let cf=await findCoords(/^(Remove|Confirm|Delete|Yes)$/);
if(cf){ await page.mouse.click(cf.x,cf.y); await page.waitForTimeout(1800); log('confirmed remove'); }
await page.screenshot({path:'renders/hg-a4-removed.png'});

// upload audio
let ua=await findCoords(/upload audio/i);
log('Upload audio coords:', JSON.stringify(ua));
let set=false;
if(ua){
  const [fc]=await Promise.all([ page.waitForEvent('filechooser',{timeout:9000}).catch(()=>null), page.mouse.click(ua.x,ua.y) ]);
  if(fc){ await fc.setFiles(ABS); set=true; log('filechooser set'); }
}
await page.waitForTimeout(4500);
await page.screenshot({path:'renders/hg-a4-modal.png'});
// Add audio button
let aa=await findCoords(/add audio/i);
log('Add audio coords:', JSON.stringify(aa));
if(aa){ await page.mouse.click(aa.x,aa.y); log('clicked Add audio'); }
await page.waitForTimeout(8000);
await page.screenshot({path:'renders/hg-a4-after.png'});
log('scene est AFTER:', await est());
await ctx.close();

