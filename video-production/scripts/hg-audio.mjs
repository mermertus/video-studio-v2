import { chromium } from 'playwright';
const ctx = await chromium.launchPersistentContext('.heygen-profile', { headless:true, channel:'chrome', viewport:{width:1600,height:1000} });
const page = ctx.pages()[0] || await ctx.newPage();
await ctx.addInitScript(()=>{Object.defineProperty(navigator,'webdriver',{get:()=>undefined});});
let chooserFired=false;
page.on('filechooser', async fc=>{ chooserFired=true; await fc.setFiles('assets/Voz-Maria-V3-clean.WAV').catch(e=>console.log('setFiles err',e.message)); });
await page.goto('https://app.heygen.com/create-v4/b660ef745c0c4ee5b25e7a92a67b5ff4?panel=scene',{waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000);
await page.keyboard.press('Escape').catch(()=>{}); await page.waitForTimeout(500);
// hover the two header icons to get tooltips
for(const x of [368,409]){
  await page.mouse.move(x,84); await page.waitForTimeout(900);
}
await page.screenshot({path:'renders/hg-audio-hover.png', clip:{x:0,y:60,width:430,height:120}});
// click the upload icon (rightmost) and see if filechooser opens
await page.mouse.click(409,84); await page.waitForTimeout(2500);
await page.screenshot({path:'renders/hg-audio-click.png', clip:{x:0,y:60,width:520,height:360}});
console.log('chooserFired:', chooserFired);
// list any menu items that appeared
const items = await page.evaluate(()=>Array.from(document.querySelectorAll('[role=menuitem],li,button')).map(b=>b.innerText.trim()).filter(t=>t&&t.length<30&&/audio|upload|record|voice|file|subir|grabar/i.test(t)));
console.log('AUDIO MENU:', JSON.stringify([...new Set(items)]));
await ctx.close();

