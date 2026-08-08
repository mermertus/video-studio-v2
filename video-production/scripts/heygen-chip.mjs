import { chromium } from 'playwright';
const DRAFT='4e294682dcbb4cfc897e21decedc0d1d';
const ctx = await chromium.launchPersistentContext('.heygen-profile', { headless:true, channel:'chrome', viewport:{width:1600,height:1000} });
const page = ctx.pages()[0] || await ctx.newPage();
await ctx.addInitScript(()=>{Object.defineProperty(navigator,'webdriver',{get:()=>undefined});});
const log=(...a)=>console.log(...a);
await page.goto('https://app.heygen.com/create-v4/'+DRAFT+'?panel=scene',{waitUntil:'domcontentloaded',timeout:45000});
await page.waitForTimeout(9000);
await page.keyboard.press('Escape').catch(()=>{});

// locate script panel = container that has "Delivery style"
const info = await page.evaluate(()=>{
  const dl=[...document.querySelectorAll('*')].find(e=>e.childElementCount===0 && /Delivery style/i.test(e.innerText||''));
  let panel=dl; for(let i=0;i<8;i++) if(panel.parentElement) panel=panel.parentElement;
  // the chip is likely first button in panel
  const btns=[...panel.querySelectorAll('button')];
  return { nButtons:btns.length, first3:btns.slice(0,3).map(b=>{const r=b.getBoundingClientRect();return {x:Math.round(r.x+r.width/2),y:Math.round(r.y+r.height/2),w:Math.round(r.width),t:(b.innerText||'').trim().slice(0,20),al:b.getAttribute('aria-label')||''};}) };
});
log('script panel buttons:', JSON.stringify(info,null,1));
// click the first button (chip) by coords
if(info.first3 && info.first3[0]){
  const c=info.first3[0];
  await page.mouse.move(c.x,c.y); await page.waitForTimeout(700);
  await page.mouse.click(c.x,c.y); await page.waitForTimeout(2500);
  await page.screenshot({path:'renders/hg-chip-popover.png'});
  const opts=await page.evaluate(()=>[...document.querySelectorAll('button,[role=menuitem],[role=option],a,li')].map(b=>(b.innerText||'').trim().replace(/\s+/g,' ')).filter(t=>t&&t.length<28&&/audio|replace|remove|upload|delete|record|generate voice/i.test(t)));
  log('POPOVER opts:', JSON.stringify([...new Set(opts)]));
}
await ctx.close();

