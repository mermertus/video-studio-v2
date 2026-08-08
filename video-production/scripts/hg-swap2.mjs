import { chromium } from 'playwright';
const ctx = await chromium.launchPersistentContext('.heygen-profile', { headless:true, channel:'chrome', viewport:{width:1600,height:1000} });
const page = ctx.pages()[0] || await ctx.newPage();
await ctx.addInitScript(()=>{Object.defineProperty(navigator,'webdriver',{get:()=>undefined});});
page.on('filechooser', async fc=>{ console.log('FILECHOOSER'); await fc.setFiles('assets/voz-julio-clean.mp3').catch(e=>console.log('err',e.message)); });
await page.goto('https://app.heygen.com/create-v4/b660ef745c0c4ee5b25e7a92a67b5ff4?panel=scene',{waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000);
await page.keyboard.press('Escape').catch(()=>{}); await page.waitForTimeout(500);
await page.mouse.click(412,147); await page.waitForTimeout(2500);
await page.screenshot({path:'renders/hg-swap2.png', clip:{x:0,y:60,width:440,height:340}});
const ctrls = await page.evaluate(()=>{
  const out=[];
  for(const b of document.querySelectorAll('button,[role=button],label,[aria-label]')){
    const r=b.getBoundingClientRect();
    if(r.x<450 && r.y>60 && r.y<460 && r.width>0){ const l=(b.getAttribute('aria-label')||b.innerText||'').trim(); if(l&&l.length<26) out.push(`${l}@${Math.round(r.x+r.width/2)},${Math.round(r.y+r.height/2)}`);}
  }
  return [...new Set(out)].slice(0,30);
});
console.log('LEFT CTRLS NOW:', JSON.stringify(ctrls));
await ctx.close();

