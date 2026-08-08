import { chromium } from 'playwright';
const DRAFT='4e294682dcbb4cfc897e21decedc0d1d';
const ABS='/Users/lio/Maria-y-Maria/video-production/video-projects/_maria-V4-Look3/assets/voz-julio-v4.mp3';
const ctx = await chromium.launchPersistentContext('.heygen-profile', { headless:true, channel:'chrome', viewport:{width:1600,height:1000} });
const page = ctx.pages()[0] || await ctx.newPage();
await ctx.addInitScript(()=>{Object.defineProperty(navigator,'webdriver',{get:()=>undefined});});
const log=(...a)=>console.log(...a);
const est=async()=>page.evaluate(()=>{const m=document.body.innerText.match(/\b(\d{1,3}(?:\.\d)?)\s*s\s*est/i);return m?m[1]+'s':'?';});
// scoped finder: only elements with center x < XMAX
const find=(src,xmax=600)=>page.evaluate(([s,xm])=>{const rx=new RegExp(s,'i');const els=[...document.querySelectorAll('button,[role=menuitem],[role=option],a,div,span')];for(const e of els){const t=(e.childElementCount<3?(e.innerText||''):'').trim();if(rx.test(t)&&t.length<26&&e.offsetParent!==null&&e.getClientRects().length){const b=e.getBoundingClientRect();const cx=b.x+b.width/2;if(cx<xm)return{x:Math.round(cx),y:Math.round(b.y+b.height/2),t:t.slice(0,24)};}}return null;},[src,xmax]);
await page.goto('https://app.heygen.com/create-v4/'+DRAFT+'?panel=scene',{waitUntil:'domcontentloaded',timeout:45000});
await page.waitForTimeout(9000);
await page.keyboard.press('Escape').catch(()=>{});
await page.screenshot({path:'renders/hg-a5-initial.png'});

// open the audio chip's own menu: the small ... button next to "Delivery style" (~x425,y166)
await page.mouse.click(425,166); await page.waitForTimeout(1600);
let rm=await find('^Remove$',600);
log('LEFT Remove:', JSON.stringify(rm));
if(!rm){ // try the other small button
  await page.mouse.click(393,166); await page.waitForTimeout(1500);
  rm=await find('^Remove$',600); log('LEFT Remove retry:', JSON.stringify(rm));
}
if(rm){ await page.mouse.click(rm.x,rm.y); await page.waitForTimeout(2500); }
let cf=await find('^(Remove|Confirm|Delete|Yes)$',900); if(cf){ await page.mouse.click(cf.x,cf.y); await page.waitForTimeout(1800);} 
await page.screenshot({path:'renders/hg-a5-removed.png'});
let ua=await find('upload audio',600);
log('Upload audio:', JSON.stringify(ua));
let set=false;
if(ua){ const [fc]=await Promise.all([page.waitForEvent('filechooser',{timeout:9000}).catch(()=>null), page.mouse.click(ua.x,ua.y)]); if(fc){await fc.setFiles(ABS); set=true; log('FILE SET');} }
await page.waitForTimeout(5000);
await page.screenshot({path:'renders/hg-a5-modal.png'});
let aa=await find('add audio',1600);
log('Add audio:', JSON.stringify(aa));
if(aa){ await page.mouse.click(aa.x,aa.y); }
await page.waitForTimeout(8000);
await page.screenshot({path:'renders/hg-a5-final.png'});
log('scene est AFTER:', await est());
await ctx.close();

