import { chromium } from 'playwright';
const DRAFT='4e294682dcbb4cfc897e21decedc0d1d';
const ctx = await chromium.launchPersistentContext('.heygen-profile', { headless:true, channel:'chrome', viewport:{width:1600,height:1000} });
const page = ctx.pages()[0] || await ctx.newPage();
await ctx.addInitScript(()=>{Object.defineProperty(navigator,'webdriver',{get:()=>undefined});});
const log=(...a)=>console.log(...a);
await page.goto('https://app.heygen.com/create-v4/'+DRAFT+'?panel=scene',{waitUntil:'domcontentloaded',timeout:45000});
await page.waitForTimeout(9000);
await page.keyboard.press('Escape').catch(()=>{});
// dump all interactive elements with center x<560 (left script panel)
const dump=()=>page.evaluate(()=>{
  const out=[];
  document.querySelectorAll('button,[role=button],[role=menuitem],svg,input,[contenteditable]').forEach(e=>{
    const b=e.getBoundingClientRect(); const cx=b.x+b.width/2, cy=b.y+b.height/2;
    if(cx<560 && cy<460 && b.width>0 && e.offsetParent!==null){
      const t=(e.innerText||'').trim().replace(/\s+/g,' ').slice(0,20);
      const al=e.getAttribute('aria-label')||e.getAttribute('title')||'';
      const tag=e.tagName.toLowerCase();
      out.push(`${tag}@${Math.round(cx)},${Math.round(cy)} ${al?'['+al+']':''} ${t}`);
    }
  });
  return [...new Set(out)];
});
log('--- BEFORE click ---');
(await dump()).forEach(l=>log(l));
// click the three-dots menu (right of Delivery style)
await page.mouse.click(380,166); await page.waitForTimeout(1800);
await page.screenshot({path:'renders/hg-dots-menu.png'});
log('--- AFTER ... click (menu items anywhere) ---');
const menu=await page.evaluate(()=>{const out=[];document.querySelectorAll('[role=menuitem],[role=option],li,button').forEach(e=>{const b=e.getBoundingClientRect();if(e.offsetParent!==null&&b.width>0){const t=(e.innerText||'').trim().replace(/\s+/g,' ');if(t&&t.length<30)out.push(`${t}@${Math.round(b.x+b.width/2)},${Math.round(b.y+b.height/2)}`);}});return [...new Set(out)].slice(0,40);});
menu.forEach(l=>log(l));
await ctx.close();

