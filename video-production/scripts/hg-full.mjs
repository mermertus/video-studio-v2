import { chromium } from 'playwright';
const ctx = await chromium.launchPersistentContext('.heygen-profile', { headless:true, channel:'chrome', viewport:{width:1600,height:1000} });
const page = ctx.pages()[0] || await ctx.newPage();
await ctx.addInitScript(()=>{Object.defineProperty(navigator,'webdriver',{get:()=>undefined});});
await page.goto('https://app.heygen.com/create-v4/b660ef745c0c4ee5b25e7a92a67b5ff4?panel=scene',{waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000);
await page.keyboard.press('Escape').catch(()=>{}); await page.waitForTimeout(800);
await page.screenshot({path:'renders/hg-full.png'});
const time = await page.evaluate(()=>{const e=[...document.querySelectorAll('span,div,p')].find(x=>/^\d{1,2}:\d{2}\s*\/\s*\d{1,2}:\d{2}$/.test((x.textContent||'').trim()));return e?e.textContent.trim():'none';});
console.log('AUDIO TIME (after reload):', time);
const txt = await page.evaluate(()=>document.body.innerText.replace(/\s+/g,' ').slice(0,260));
console.log(txt);
await ctx.close();

