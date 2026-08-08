import { chromium } from 'playwright';
const ctx = await chromium.launchPersistentContext('.heygen-profile', { headless:true, channel:'chrome', viewport:{width:1600,height:1000} });
const page = ctx.pages()[0] || await ctx.newPage();
await ctx.addInitScript(()=>{Object.defineProperty(navigator,'webdriver',{get:()=>undefined});});
await page.goto('https://app.heygen.com/create-v4/b660ef745c0c4ee5b25e7a92a67b5ff4?panel=scene',{waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000);
await page.keyboard.press('Escape').catch(()=>{}); await page.waitForTimeout(500);
// zoom the left panel top
await page.screenshot({path:'renders/hg-left.png', clip:{x:0,y:60,width:430,height:420}});
// enumerate aria-labels of small buttons in left third
const labels = await page.evaluate(()=>{
  const out=[];
  for(const b of document.querySelectorAll('button,[role=button],svg,[aria-label],input[type=file]')){
    const r=b.getBoundingClientRect();
    if(r.x<440 && r.y<500 && r.width>0){ const l=(b.getAttribute('aria-label')||b.getAttribute('title')||b.innerText||b.tagName).trim(); if(l&&l.length<30) out.push(l+`@${Math.round(r.x)},${Math.round(r.y)}`);}
  }
  return [...new Set(out)].slice(0,30);
});
console.log('LEFT CTRLS:', JSON.stringify(labels));
await ctx.close();

