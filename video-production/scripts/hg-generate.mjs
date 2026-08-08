import { chromium } from 'playwright';
const ctx = await chromium.launchPersistentContext('.heygen-profile', { headless:true, channel:'chrome', viewport:{width:1600,height:1000}, ignoreDefaultArgs:['--enable-automation'], args:['--disable-blink-features=AutomationControlled'] });
await ctx.addInitScript(()=>{Object.defineProperty(navigator,'webdriver',{get:()=>undefined});});
const page = ctx.pages()[0] || await ctx.newPage();
await page.goto('https://app.heygen.com/create-v4/b660ef745c0c4ee5b25e7a92a67b5ff4?panel=scene',{waitUntil:'domcontentloaded'}); await page.waitForTimeout(9000);
await page.keyboard.press('Escape').catch(()=>{}); await page.waitForTimeout(500);
const time = await page.evaluate(()=>{const e=[...document.querySelectorAll('span,div,p')].find(x=>/^\d{1,2}:\d{2}\s*\/\s*\d{1,2}:\d{2}$/.test((x.textContent||'').trim()));return e?e.textContent.trim():'none';});
const est = await page.evaluate(()=>{const m=(document.body.innerText.match(/([\d.]+)s est/)||[])[1];return m||'?';});
console.log('AUDIO TIME:', time, '| est:', est);
if(time==='none'){ console.log('NO_AUDIO_ATTACHED'); await page.screenshot({path:'renders/hg-gen-state.png',clip:{x:0,y:60,width:460,height:300}}); await ctx.close(); process.exit(0); }
await page.screenshot({path:'renders/hg-pre-generate.png'});
// click Generate
const gen = page.getByRole('button',{name:'Generate'}).first();
await gen.click().catch(()=>{});
await page.waitForTimeout(3500);
await page.screenshot({path:'renders/hg-generate-modal.png'});
// handle confirmation dialog: common confirm labels
let confirmed=false;
for(const t of ['Submit','Generate Video','Generate video','Generate','Confirm','Continue']){
  const b=page.getByRole('button',{name:t,exact:true}).last();
  if(await b.count().catch(()=>0)){ const vis=await b.isVisible().catch(()=>false); if(vis){ await b.click().catch(()=>{}); confirmed=true; console.log('clicked confirm:',t); await page.waitForTimeout(3000); break; } }
}
await page.screenshot({path:'renders/hg-generate-after.png'});
console.log('confirmed:', confirmed, '| URL:', page.url());
const txt = await page.evaluate(()=>document.body.innerText.replace(/\s+/g,' ').slice(0,250));
console.log(txt);
await ctx.close();

