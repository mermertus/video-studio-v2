import { chromium } from 'playwright';
const ctx = await chromium.launchPersistentContext('.heygen-profile', { headless:true, channel:'chrome', viewport:{width:1600,height:1000} });
const page = ctx.pages()[0] || await ctx.newPage();
await ctx.addInitScript(()=>{Object.defineProperty(navigator,'webdriver',{get:()=>undefined});});
await page.goto('https://app.heygen.com/create-v4/b660ef745c0c4ee5b25e7a92a67b5ff4?panel=scene',{waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000);
await page.keyboard.press('Escape').catch(()=>{}); await page.waitForTimeout(500);
// existing file inputs
let inputs = await page.evaluate(()=>Array.from(document.querySelectorAll('input[type=file]')).map(i=>({accept:i.accept,id:i.id,name:i.name})));
console.log('FILE INPUTS (initial):', JSON.stringify(inputs));
// the audio chip: find element showing 00:00 / 01:00 and dump its container's buttons
const info = await page.evaluate(()=>{
  const all=[...document.querySelectorAll('*')];
  const t=all.find(e=>/00:00\s*\/\s*0?1:0/.test(e.textContent||'') && e.children.length<6);
  if(!t) return 'audio chip not found';
  let c=t; for(let i=0;i<4;i++){ if(c.parentElement) c=c.parentElement; }
  return {chip:t.textContent.trim().slice(0,30), btns:[...c.querySelectorAll('button,[role=button]')].map(b=>(b.getAttribute('aria-label')||b.title||b.innerText||'icon').trim()).slice(0,10), boxes:[...c.querySelectorAll('button,[role=button]')].map(b=>{const r=b.getBoundingClientRect();return Math.round(r.x)+','+Math.round(r.y);})};
});
console.log('AUDIO CHIP CTX:', JSON.stringify(info));
await ctx.close();

