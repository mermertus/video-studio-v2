import { chromium } from 'playwright';
const DRAFT='4e294682dcbb4cfc897e21decedc0d1d';
const ctx = await chromium.launchPersistentContext('.heygen-profile', { headless:true, channel:'chrome', viewport:{width:1600,height:1000} });
const page = ctx.pages()[0] || await ctx.newPage();
await ctx.addInitScript(()=>{Object.defineProperty(navigator,'webdriver',{get:()=>undefined});});
const log=(...a)=>console.log(...a);
await page.goto('https://app.heygen.com/create-v4/'+DRAFT+'?panel=scene',{waitUntil:'domcontentloaded',timeout:45000});
await page.waitForTimeout(9000);
await page.keyboard.press('Escape').catch(()=>{});
// click "Delivery style" text (138,166) to open popover
await page.mouse.click(138,166); await page.waitForTimeout(1800);
await page.screenshot({path:'renders/hg-dr-popover.png'});
// dump elements near the popover (x<700) with their text+coords
const near = await page.evaluate(()=>{
  const out=[];
  document.querySelectorAll('button,[role=menuitem],[role=option],div,span,li').forEach(e=>{
    const t=(e.childElementCount<2?(e.innerText||''):'').trim();
    if(!t||t.length>26||e.offsetParent===null) return;
    const b=e.getBoundingClientRect(); const cx=b.x+b.width/2, cy=b.y+b.height/2;
    if(cx<700 && cy>150 && cy<460 && b.width>0) out.push(`${t} @${Math.round(cx)},${Math.round(cy)}`);
  });
  return [...new Set(out)].slice(0,30);
});
log('NEAR POPOVER:', JSON.stringify(near,null,1));
await ctx.close();

