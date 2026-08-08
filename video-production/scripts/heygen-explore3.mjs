import { chromium } from 'playwright';
const ctx = await chromium.launchPersistentContext('.heygen-profile', { headless:true, channel:'chrome', viewport:{width:1500,height:950} });
const page = ctx.pages()[0] || await ctx.newPage();
await ctx.addInitScript(()=>{Object.defineProperty(navigator,'webdriver',{get:()=>undefined});});
await page.goto('https://app.heygen.com/avatar/my-avatars/c0908617d3d84fd2bc40a9b5c09d1736',{waitUntil:'domcontentloaded'}); await page.waitForTimeout(5000);
await page.keyboard.press('Escape').catch(()=>{});
// hover Look5-A to reveal actions
const look = page.getByText('Maria-Look5-A',{exact:true}).first();
await look.scrollIntoViewIfNeeded().catch(()=>{});
await look.hover().catch(()=>{});
await page.waitForTimeout(1500);
await page.screenshot({path:'renders/hg-look-hover.png'});
// click it
await look.click().catch(()=>{});
await page.waitForTimeout(3500);
await page.screenshot({path:'renders/hg-look-click.png'});
console.log('URL:', page.url());
const txt = await page.evaluate(()=>document.body?document.body.innerText:'');
console.log(txt.replace(/\s+/g,' ').slice(0,600));
const btns = await page.evaluate(()=>Array.from(document.querySelectorAll('button,a,[role=menuitem]')).map(b=>b.innerText.trim()).filter(t=>t&&t.length<40));
console.log('BTNS:', JSON.stringify([...new Set(btns)].slice(0,50)));
await ctx.close();

