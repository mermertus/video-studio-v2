import { chromium } from 'playwright';
const ctx = await chromium.launchPersistentContext('.heygen-profile', { headless:true, channel:'chrome', viewport:{width:1600,height:1000} });
const page = ctx.pages()[0] || await ctx.newPage();
await ctx.addInitScript(()=>{Object.defineProperty(navigator,'webdriver',{get:()=>undefined});});
await page.goto('https://app.heygen.com/avatar/studio',{waitUntil:'domcontentloaded'}); await page.waitForTimeout(5000);
await page.keyboard.press('Escape').catch(()=>{});
// find the card containing the draft id, hover it
const idEl = page.getByText('a21eb4ed8f734f5eb4f5fcb462ab95eb',{exact:false}).first();
const card = idEl.locator('xpath=ancestor::div[3]');
await card.scrollIntoViewIfNeeded().catch(()=>{});
await card.hover().catch(async()=>{ await idEl.hover().catch(()=>{}); });
await page.waitForTimeout(1500);
await page.screenshot({path:'renders/hg-draft-hover.png'});
// try to find a more/â‹® button inside the card
const moreBtns = await card.locator('button').count().catch(()=>0);
console.log('buttons in card:', moreBtns);
// list aria-labels of buttons in card
const labels = await card.evaluate(el=>Array.from(el.querySelectorAll('button')).map(b=>b.getAttribute('aria-label')||b.innerText||b.title||'(icon)'));
console.log('card btn labels:', JSON.stringify(labels));
await ctx.close();

