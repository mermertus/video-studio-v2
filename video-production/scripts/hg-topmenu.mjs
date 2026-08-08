import { chromium } from 'playwright';
const ctx = await chromium.launchPersistentContext('.heygen-profile', { headless:true, channel:'chrome', viewport:{width:1600,height:1000} });
const page = ctx.pages()[0] || await ctx.newPage();
await ctx.addInitScript(()=>{Object.defineProperty(navigator,'webdriver',{get:()=>undefined});});
await page.goto('https://app.heygen.com/create-v4/b660ef745c0c4ee5b25e7a92a67b5ff4?panel=scene',{waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000);
for(const t of ['Maybe later','Got it','Close','Skip']){ const b=page.getByRole('button',{name:t}).first(); if(await b.count().catch(()=>0)){ await b.click().catch(()=>{}); await page.waitForTimeout(500);} }
await page.keyboard.press('Escape').catch(()=>{}); await page.waitForTimeout(500);
// screenshot just the top bar (full width, top 70px) at higher detail
await page.screenshot({path:'renders/hg-topbar.png', clip:{x:0,y:0,width:1600,height:70}});
// try clicking the project-name area (top-left, near x=80,y=20) to reveal menu
await page.mouse.click(80, 22); await page.waitForTimeout(1500);
await page.screenshot({path:'renders/hg-projmenu.png'});
const items = await page.evaluate(()=>Array.from(document.querySelectorAll('[role=menuitem],[role=option],li,button')).map(b=>b.innerText.trim()).filter(t=>t&&t.length<28));
console.log('MENU after title click:', JSON.stringify([...new Set(items)].slice(0,40)));
await ctx.close();

