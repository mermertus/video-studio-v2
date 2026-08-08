import { chromium } from 'playwright';
const ctx = await chromium.launchPersistentContext('.heygen-profile', { headless:true, channel:'chrome', viewport:{width:1500,height:950} });
const page = ctx.pages()[0] || await ctx.newPage();
await ctx.addInitScript(()=>{Object.defineProperty(navigator,'webdriver',{get:()=>undefined});});
async function snap(path, name){
  await page.goto('https://app.heygen.com'+path,{waitUntil:'domcontentloaded'}).catch(()=>{});
  await page.waitForTimeout(5000);
  await page.screenshot({path:`renders/hg-${name}.png`, fullPage:false}).catch(()=>{});
  const txt = await page.evaluate(()=>document.body?document.body.innerText:'').catch(()=>'');
  console.log(`== ${name} (${path}) ==`); console.log(txt.replace(/\s+/g,' ').slice(0,500));
}
await snap('/home','home');
await snap('/avatars','avatars');
await ctx.close();

