import { chromium } from 'playwright';
const ctx = await chromium.launchPersistentContext('.heygen-profile', { headless:true, channel:'chrome', viewport:{width:1600,height:1000} });
const page = ctx.pages()[0] || await ctx.newPage();
await ctx.addInitScript(()=>{Object.defineProperty(navigator,'webdriver',{get:()=>undefined});});
await page.goto('https://app.heygen.com/create-v4/b660ef745c0c4ee5b25e7a92a67b5ff4?panel=scene',{waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000);
await page.keyboard.press('Escape').catch(()=>{}); await page.waitForTimeout(500);
const eng = page.getByText('Avatar V',{exact:true}).first();
const box = await eng.boundingBox(); console.log('engine box:', JSON.stringify(box));
await eng.click().catch(()=>{});
await page.waitForTimeout(2000);
await page.screenshot({path:'renders/hg-engine.png'});
const items = await page.evaluate(()=>Array.from(document.querySelectorAll('[role=option],[role=menuitem],li,button,[role=radio]')).map(b=>b.innerText.trim()).filter(t=>t&&t.length<40&&/avatar|engine|motor|III|IV|V|2\.0|3\.0/i.test(t)));
console.log('ENGINE OPTIONS:', JSON.stringify([...new Set(items)].slice(0,20)));
await ctx.close();

