import { chromium } from 'playwright';
const ctx = await chromium.launchPersistentContext('.heygen-profile', { headless:true, channel:'chrome', viewport:{width:1600,height:1000} });
const page = ctx.pages()[0] || await ctx.newPage();
await ctx.addInitScript(()=>{Object.defineProperty(navigator,'webdriver',{get:()=>undefined});});
const log=(...a)=>console.log(...a);
await page.goto('https://app.heygen.com/projects/avatar-videos',{waitUntil:'domcontentloaded',timeout:40000});
await page.waitForTimeout(7000);
await page.screenshot({path:'renders/hg-proj-check.png'});
// dump text around the first videos to find status (processing / generating / %)
const txt=await page.evaluate(()=>document.body.innerText.replace(/\s+/g,' ').slice(0,500));
log('PROJECTS txt:', txt);
const proc=await page.evaluate(()=>/processing|generating|in progress|render|%/i.test(document.body.innerText));
log('has processing-ish text:', proc);
await ctx.close();

