import { chromium } from 'playwright';
const ctx = await chromium.launchPersistentContext('.heygen-profile', { headless:true, channel:'chrome', viewport:{width:1500,height:950} });
const page = ctx.pages()[0] || await ctx.newPage();
await ctx.addInitScript(()=>{Object.defineProperty(navigator,'webdriver',{get:()=>undefined});});
const out = {};
// AI Studio drafts
for (const path of ['/avatar/studio','/projects']) {
  try {
    await page.goto('https://app.heygen.com'+path,{waitUntil:'domcontentloaded',timeout:30000});
    await page.waitForTimeout(6000);
    // collect any links to create-v4 / editor
    const links = await page.evaluate(()=>Array.from(document.querySelectorAll('a[href]')).map(a=>a.getAttribute('href')).filter(h=>h&&/create|edit|studio|project|video/.test(h)));
    const txt = await page.evaluate(()=>document.body?document.body.innerText:'');
    out[path]={url:page.url(), links:[...new Set(links)].slice(0,40), sample:txt.replace(/\s+/g,' ').slice(0,400)};
  } catch(e){ out[path]={err:e.message}; }
}
await page.screenshot({path:'renders/hg-studio.png'});
console.log(JSON.stringify(out,null,2));
await ctx.close();

