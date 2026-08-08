import { chromium } from 'playwright';
const AUDIO = 'video-projects/_maria-V3-3-errores-Look5A/assets/voz-julio-clean.mp3';
const ctx = await chromium.launchPersistentContext('.heygen-profile', { headless:true, channel:'chrome', viewport:{width:1600,height:1000} });
const page = ctx.pages()[0] || await ctx.newPage();
await ctx.addInitScript(()=>{Object.defineProperty(navigator,'webdriver',{get:()=>undefined});});
await page.goto('https://app.heygen.com/create-v4/b660ef745c0c4ee5b25e7a92a67b5ff4?panel=scene',{waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000);
await page.keyboard.press('Escape').catch(()=>{}); await page.waitForTimeout(500);
// if there's still an audio chip, remove it
const hasAudio = await page.evaluate(()=>[...document.querySelectorAll('span,div,p')].some(x=>/^\d{1,2}:\d{2}\s*\/\s*[1-9]\d?:\d{2}$/.test((x.textContent||'').trim())));
if(hasAudio){ await page.mouse.click(412,147); await page.waitForTimeout(2000); }
// click Upload audio to mount input
const ua = page.getByText('Upload audio',{exact:true}).first();
if(await ua.count()) { await ua.click().catch(()=>{}); await page.waitForTimeout(1500); }
const audioInput = page.locator('input[type=file][accept*="audio/mpeg"]').first();
console.log('audio inputs:', await audioInput.count());
await audioInput.setInputFiles(AUDIO);
console.log('uploaded:', AUDIO);
await page.waitForTimeout(22000); // upload + transcription
await page.screenshot({path:'renders/hg-uploaded.png', clip:{x:0,y:60,width:460,height:360}});
const time = await page.evaluate(()=>{const e=[...document.querySelectorAll('span,div,p')].find(x=>/^\d{1,2}:\d{2}\s*\/\s*\d{1,2}:\d{2}$/.test((x.textContent||'').trim()));return e?e.textContent.trim():'none';});
const est = await page.evaluate(()=>{const m=(document.body.innerText.match(/([\d.]+)s est/)||[])[1];return m||'?';});
console.log('AUDIO TIME:', time, '| est:', est);
await ctx.close();

