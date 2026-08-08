import { chromium } from 'playwright';
const ctx = await chromium.launchPersistentContext('.heygen-profile', { headless:true, channel:'chrome', viewport:{width:1600,height:1000} });
const page = ctx.pages()[0] || await ctx.newPage();
await ctx.addInitScript(()=>{Object.defineProperty(navigator,'webdriver',{get:()=>undefined});});
await page.goto('https://app.heygen.com/avatars',{waitUntil:'domcontentloaded'}); await page.waitForTimeout(4000);
await page.keyboard.press('Escape').catch(()=>{});
// click AI Studio
const studio = page.getByText('AI Studio',{exact:true}).first();
await studio.click().catch(async()=>{ await page.goto('https://app.heygen.com/create-v3',{waitUntil:'domcontentloaded'}); });
await page.waitForTimeout(6000);
// a new-video dialog may ask landscape/portrait
await page.screenshot({path:'renders/hg-studio1.png'});
console.log('URL:', page.url());
const txt = await page.evaluate(()=>document.body?document.body.innerText:'');
console.log(txt.replace(/\s+/g,' ').slice(0,600));
const btns = await page.evaluate(()=>Array.from(document.querySelectorAll('button,a,[role=menuitem],[role=tab]')).map(b=>b.innerText.trim()).filter(t=>t&&t.length<32));
console.log('BTNS:', JSON.stringify([...new Set(btns)].slice(0,50)));
await ctx.close();

