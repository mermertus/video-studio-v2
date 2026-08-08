import { chromium } from 'playwright';
const DRAFT='4e294682dcbb4cfc897e21decedc0d1d';
const ctx = await chromium.launchPersistentContext('.heygen-profile', { headless:true, channel:'chrome', viewport:{width:1600,height:1000} });
const page = ctx.pages()[0] || await ctx.newPage();
await ctx.addInitScript(()=>{Object.defineProperty(navigator,'webdriver',{get:()=>undefined});});
const log=(...a)=>console.log(...a);
await page.goto('https://app.heygen.com/create-v4/'+DRAFT+'?panel=scene',{waitUntil:'domcontentloaded',timeout:45000});
await page.waitForTimeout(9000);
await page.keyboard.press('Escape').catch(()=>{});
// find the left script panel = ancestor of "Delivery style"
const html = await page.evaluate(()=>{
  const anchor=[...document.querySelectorAll('*')].find(e=>e.childElementCount===0 && /Delivery style/i.test(e.innerText||''));
  if(!anchor) return 'NO ANCHOR';
  let p=anchor; for(let i=0;i<6;i++){ if(p.parentElement) p=p.parentElement; }
  // strip to structure: tag + key attrs + short text
  const walk=(el,d)=>{ if(d>4) return ''; let s=''; for(const c of el.children){ const tag=c.tagName.toLowerCase(); const cls=(c.getAttribute('class')||'').slice(0,30); const al=c.getAttribute('aria-label')||''; const role=c.getAttribute('role')||''; const txt=(c.childElementCount===0?(c.innerText||'').trim().slice(0,24):''); const isFile=c.tagName==='INPUT'&&c.type==='file'?` FILE accept=${c.getAttribute('accept')}`:''; const isSvg=tag==='svg'?' [svg]':''; s+= '  '.repeat(d)+`<${tag}${role?` role=${role}`:''}${al?` aria=${al}`:''}${isFile}${isSvg}> ${txt}\n`; s+=walk(c,d+1);} return s; };
  return walk(p,0);
});
log(html.slice(0,2200));
await ctx.close();

