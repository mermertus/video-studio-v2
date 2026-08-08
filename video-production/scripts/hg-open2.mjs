import { chromium } from 'playwright';
const ctx = await chromium.launchPersistentContext('.heygen-profile', { headless:true, channel:'chrome', viewport:{width:1600,height:1000} });
const page = ctx.pages()[0] || await ctx.newPage();
await ctx.addInitScript(()=>{Object.defineProperty(navigator,'webdriver',{get:()=>undefined});});
await page.goto('https://app.heygen.com/avatar/studio',{waitUntil:'domcontentloaded'}); await page.waitForTimeout(5000);
await page.keyboard.press('Escape').catch(()=>{});
const idEl = page.getByText('a21eb4ed8f734f5eb4f5fcb462ab95eb',{exact:false}).first();
const box = await idEl.boundingBox();
console.log('id label box:', JSON.stringify(box));
if(box){
  // thumbnail is above the label; click center of thumbnail (~110px above)
  await page.mouse.move(box.x+box.width/2, box.y-90);
  await page.waitForTimeout(800);
  await page.screenshot({path:'renders/hg-thumb-hover.png'});
  await page.mouse.click(box.x+box.width/2, box.y-90);
}
await page.waitForTimeout(9000);
console.log('URL after click:', page.url());
await page.screenshot({path:'renders/hg-editor2.png'});
const txt = await page.evaluate(()=>document.body?document.body.innerText:'');
console.log(txt.replace(/\s+/g,' ').slice(0,400));
await ctx.close();

