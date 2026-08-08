import { chromium } from 'playwright';
const ctx = await chromium.launchPersistentContext('.heygen-profile', { headless:true, channel:'chrome', viewport:{width:1600,height:1000} });
const page = ctx.pages()[0] || await ctx.newPage();
await ctx.addInitScript(()=>{Object.defineProperty(navigator,'webdriver',{get:()=>undefined});});
await page.goto('https://app.heygen.com/create-v4/b660ef745c0c4ee5b25e7a92a67b5ff4?panel=scene',{waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000);
await page.keyboard.press('Escape').catch(()=>{}); await page.waitForTimeout(500);
// remove old audio
await page.mouse.click(412,147); await page.waitForTimeout(2000);
// click Upload audio to ensure the audio input is mounted
await page.mouse.click(133,174); await page.waitForTimeout(2000);
// set file on the audio input
const audioInput = page.locator('input[type=file][accept*="audio/mpeg"]').first();
const cnt = await audioInput.count();
console.log('audio inputs:', cnt);
if(cnt){ await audioInput.setInputFiles('assets/voz-julio-clean.mp3'); console.log('setInputFiles done'); }
// wait for upload + transcription
await page.waitForTimeout(20000);
await page.screenshot({path:'renders/hg-uploaded.png', clip:{x:0,y:60,width:460,height:340}});
const time = await page.evaluate(()=>{const e=[...document.querySelectorAll('span,div,p')].find(x=>/^\d{1,2}:\d{2}\s*\/\s*\d{1,2}:\d{2}$/.test((x.textContent||'').trim()));return e?e.textContent.trim():'none';});
const est = await page.evaluate(()=>{const m=(document.body.innerText.match(/([\d.]+)s est\.?/)||[])[1];return m||'?';});
console.log('AUDIO TIME:', time, '| est:', est, 's');
await ctx.close();

