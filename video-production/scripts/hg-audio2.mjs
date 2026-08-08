import { chromium } from 'playwright';
const ctx = await chromium.launchPersistentContext('.heygen-profile', { headless:true, channel:'chrome', viewport:{width:1600,height:1000} });
const page = ctx.pages()[0] || await ctx.newPage();
await ctx.addInitScript(()=>{Object.defineProperty(navigator,'webdriver',{get:()=>undefined});});
let chooserFired=false;
page.on('filechooser', async fc=>{ chooserFired=true; await fc.setFiles('assets/Voz-Maria-V3-clean.WAV').catch(e=>console.log('setFiles err',e.message)); });
await page.goto('https://app.heygen.com/create-v4/b660ef745c0c4ee5b25e7a92a67b5ff4?panel=scene',{waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000);
await page.keyboard.press('Escape').catch(()=>{}); await page.waitForTimeout(500);
// click the X to remove current audio (approx 412,88)
await page.mouse.click(412,88); await page.waitForTimeout(2500);
await page.screenshot({path:'renders/hg-audio-removed.png', clip:{x:0,y:60,width:430,height:300}});
console.log('chooserFired after X:', chooserFired);
const items = await page.evaluate(()=>Array.from(document.querySelectorAll('button,[role=button],[role=menuitem],label')).map(b=>(b.getAttribute('aria-label')||b.innerText||'').trim()).filter(t=>t&&t.length<28));
console.log('CTRLS:', JSON.stringify([...new Set(items)].slice(0,40)));
await ctx.close();

