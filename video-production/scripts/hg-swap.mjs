import { chromium } from 'playwright';
const ctx = await chromium.launchPersistentContext('.heygen-profile', { headless:true, channel:'chrome', viewport:{width:1600,height:1000} });
const page = ctx.pages()[0] || await ctx.newPage();
await ctx.addInitScript(()=>{Object.defineProperty(navigator,'webdriver',{get:()=>undefined});});
page.on('filechooser', async fc=>{ console.log('FILECHOOSER!'); await fc.setFiles('assets/voz-julio-clean.mp3').catch(e=>console.log('setFiles err',e.message)); });
await page.goto('https://app.heygen.com/create-v4/b660ef745c0c4ee5b25e7a92a67b5ff4?panel=scene',{waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000);
await page.keyboard.press('Escape').catch(()=>{}); await page.waitForTimeout(500);
// find the audio time display precisely (text like '00:00 / 01:00')
const loc = await page.evaluate(()=>{
  const els=[...document.querySelectorAll('span,div,p')].filter(e=>{
    const t=(e.textContent||'').trim();
    return /^\d{1,2}:\d{2}\s*\/\s*\d{1,2}:\d{2}$/.test(t) && e.children.length<=1;
  });
  if(!els.length) return null;
  const e=els[0]; const r=e.getBoundingClientRect();
  // find the row container and any buttons (X) to its right
  let row=e; for(let i=0;i<3;i++) if(row.parentElement) row=row.parentElement;
  const rr=row.getBoundingClientRect();
  const btns=[...row.querySelectorAll('button,[role=button],svg')].map(b=>{const br=b.getBoundingClientRect();return {x:Math.round(br.x+br.width/2),y:Math.round(br.y+br.height/2),lbl:(b.getAttribute('aria-label')||'').slice(0,16)};}).filter(b=>b.x>0);
  return {time:e.textContent.trim(), tx:Math.round(r.x), ty:Math.round(r.y+r.height/2), rowRight:Math.round(rr.x+rr.width), btns};
});
console.log('AUDIO ROW:', JSON.stringify(loc));
if(loc){
  // hover the row to reveal controls, click the rightmost button (likely X / replace)
  await page.mouse.move(loc.tx+40, loc.ty); await page.waitForTimeout(800);
  await page.screenshot({path:'renders/hg-swap-hover.png', clip:{x:0,y:Math.max(0,loc.ty-40),width:460,height:120}});
}
await ctx.close();

