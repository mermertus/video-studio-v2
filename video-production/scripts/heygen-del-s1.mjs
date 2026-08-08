import { chromium } from 'playwright';
const DRAFT='4e294682dcbb4cfc897e21decedc0d1d';
const ctx = await chromium.launchPersistentContext('.heygen-profile', { headless:true, channel:'chrome', viewport:{width:1600,height:1000} });
const page = ctx.pages()[0] || await ctx.newPage();
await ctx.addInitScript(()=>{Object.defineProperty(navigator,'webdriver',{get:()=>undefined});});
const log=(...a)=>console.log(...a);
const findc=(src,xmax=1600,ymin=0,ymax=1000)=>page.evaluate(([s,xm,ya,yb])=>{const rx=new RegExp(s,'i');for(const e of document.querySelectorAll('div,button,[role=menuitem],span,li')){const t=(e.childElementCount<2?(e.innerText||''):'').trim();if(rx.test(t)&&t.length<24&&e.offsetParent!==null&&e.getClientRects().length){const b=e.getBoundingClientRect();const cx=b.x+b.width/2,cy=b.y+b.height/2;if(cx<xm&&cy>ya&&cy<yb)return{x:Math.round(cx),y:Math.round(cy),t:t.slice(0,24)};}}return null;},[src,xmax,ymin,ymax]);
const sceneCount=()=>page.evaluate(()=>document.querySelectorAll('[data-scene-index],[class*="scene-thumb"],[class*="sceneItem"]').length);
await page.goto('https://app.heygen.com/create-v4/'+DRAFT+'?panel=scene',{waitUntil:'domcontentloaded',timeout:45000});
await page.waitForTimeout(9000);
await page.keyboard.press('Escape').catch(()=>{});
// select scene 1 (1st thumbnail)
await page.mouse.click(510,906); await page.waitForTimeout(2500);
await page.screenshot({path:'renders/hg-del-s1sel.png'});
// open "..." menu (three dots next to delivery style) ~380,166
await page.mouse.click(380,166); await page.waitForTimeout(1600);
let del=await findc('^Delete Scene$',700,160,400);
log('Delete Scene:', JSON.stringify(del));
if(del){ await page.mouse.click(del.x,del.y); await page.waitForTimeout(2000); }
// confirm dialog
let cf=await findc('^(Delete|Confirm|Yes|Remove)$',1200,300,800);
if(cf){ await page.mouse.click(cf.x,cf.y); await page.waitForTimeout(1500); log('confirmed delete'); }
await page.waitForTimeout(2000);
await page.screenshot({path:'renders/hg-del-after.png'});
// verify remaining scene est
const est=await page.evaluate(()=>{const m=document.body.innerText.match(/\b(\d{1,3}(?:\.\d)?)\s*s\s*est/i);return m?m[1]:'?';});
log('remaining scene est:', est);
// count scenes via timeline thumbs in bottom bar
const thumbs=await page.evaluate(()=>{const bar=[...document.querySelectorAll('*')].filter(e=>{const b=e.getBoundingClientRect();return b.y>860&&b.y<960&&b.width>40&&b.width<120&&b.height>60;});return bar.length;});
log('approx scene thumbs:', thumbs);
await ctx.close();

