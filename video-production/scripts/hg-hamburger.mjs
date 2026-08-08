import { chromium } from 'playwright';
const ctx = await chromium.launchPersistentContext('.heygen-profile', { headless:true, channel:'chrome', viewport:{width:1600,height:1000} });
const page = ctx.pages()[0] || await ctx.newPage();
await ctx.addInitScript(()=>{Object.defineProperty(navigator,'webdriver',{get:()=>undefined});});
await page.goto('https://app.heygen.com/create-v4/b660ef745c0c4ee5b25e7a92a67b5ff4?panel=scene',{waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000);
await page.keyboard.press('Escape').catch(()=>{}); await page.waitForTimeout(500);
await page.mouse.click(232, 22); await page.waitForTimeout(1500);
await page.screenshot({path:'renders/hg-hamb.png'});
const items = await page.evaluate(()=>Array.from(document.querySelectorAll('[role=menuitem],[role=menu] *,li')).map(b=>b.innerText.trim()).filter(t=>t&&t.length<30));
console.log('HAMBURGER MENU:', JSON.stringify([...new Set(items)].slice(0,40)));
await ctx.close();

