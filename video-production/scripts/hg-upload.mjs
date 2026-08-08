import { chromium } from 'playwright';
const ctx = await chromium.launchPersistentContext('.heygen-profile', { headless:true, channel:'chrome', viewport:{width:1600,height:1000} });
const page = ctx.pages()[0] || await ctx.newPage();
await ctx.addInitScript(()=>{Object.defineProperty(navigator,'webdriver',{get:()=>undefined});});
let fired=false;
page.on('filechooser', async fc=>{ fired=true; console.log('FILECHOOSER fired'); await fc.setFiles('assets/voz-julio-clean.mp3').catch(e=>console.log('err',e.message)); });
await page.goto('https://app.heygen.com/create-v4/b660ef745c0c4ee5b25e7a92a67b5ff4?panel=scene',{waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000);
await page.keyboard.press('Escape').catch(()=>{}); await page.waitForTimeout(500);
await page.mouse.click(412,147); await page.waitForTimeout(2000); // remove old
await page.mouse.click(133,174); await page.waitForTimeout(3000); // upload audio
// if a modal/dialog appeared instead of native chooser, screenshot it
await page.screenshot({path:'renders/hg-upload-dialog.png'});
console.log('filechooser fired:', fired);
// if not fired, look for an inner file input or a dialog with drop area
if(!fired){
  const fi = await page.evaluate(()=>Array.from(document.querySelectorAll('input[type=file]')).map(i=>i.accept));
  console.log('file inputs now:', JSON.stringify(fi));
  const dlg = await page.evaluate(()=>document.body.innerText.replace(/\s+/g,' ').slice(0,300));
  console.log('page text:', dlg);
}
await page.waitForTimeout(12000); // processing
await page.screenshot({path:'renders/hg-after-upload.png', clip:{x:0,y:60,width:440,height:300}});
const time = await page.evaluate(()=>{const e=[...document.querySelectorAll('span,div,p')].find(x=>/^\d{1,2}:\d{2}\s*\/\s*\d{1,2}:\d{2}$/.test((x.textContent||'').trim()));return e?e.textContent.trim():'no-audio-time';});
console.log('AUDIO TIME NOW:', time);
await ctx.close();

