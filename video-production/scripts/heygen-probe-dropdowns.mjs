import { chromium } from 'playwright';
const DRAFT='4e294682dcbb4cfc897e21decedc0d1d';
const ctx = await chromium.launchPersistentContext('.heygen-profile', { headless:true, channel:'chrome', viewport:{width:1600,height:1000} });
const page = ctx.pages()[0] || await ctx.newPage();
await ctx.addInitScript(()=>{Object.defineProperty(navigator,'webdriver',{get:()=>undefined});});
await page.goto('https://app.heygen.com/create-v4/'+DRAFT+'?panel=scene',{waitUntil:'domcontentloaded',timeout:45000});
await page.waitForTimeout(9000);
await page.keyboard.press('Escape').catch(()=>{});

// 1) Engine dropdown: click "Avatar III"
try {
  await page.getByText('Avatar III',{exact:true}).first().click({timeout:8000});
  await page.waitForTimeout(2500);
  await page.screenshot({path:'renders/hg-engine-menu.png'});
  const opts = await page.evaluate(()=>Array.from(document.querySelectorAll('[role=option],[role=menuitem],li,button')).map(b=>(b.innerText||'').trim().replace(/\s+/g,' ')).filter(t=>/avatar (v|iv|iii)/i.test(t)&&t.length<30));
  console.log('ENGINE OPTS:', JSON.stringify([...new Set(opts)]));
} catch(e){ console.log('engine err', e.message.slice(0,80)); }
await page.keyboard.press('Escape').catch(()=>{});
await page.waitForTimeout(1000);

// 2) Avatar look picker: click the Avatar card (top of right panel = "Maria Bejarano" under "Avatar")
try {
  // the Avatar thumbnail/name in right panel
  await page.getByText('Maria Bejarano',{exact:false}).first().click({timeout:8000});
  await page.waitForTimeout(3500);
  await page.screenshot({path:'renders/hg-avatar-picker.png'});
  const looks = await page.evaluate(()=>Array.from(document.querySelectorAll('*')).map(b=>(b.getAttribute&&b.getAttribute('alt'))||'').filter(t=>/julio|look/i.test(t)).slice(0,40));
  const texts = await page.evaluate(()=>Array.from(document.querySelectorAll('div,span,button')).map(b=>(b.innerText||'').trim()).filter(t=>/look\s?\d|julio-look/i.test(t)&&t.length<24));
  console.log('LOOK alts:', JSON.stringify([...new Set(looks)]));
  console.log('LOOK texts:', JSON.stringify([...new Set(texts)].slice(0,30)));
} catch(e){ console.log('avatar err', e.message.slice(0,80)); }
await ctx.close();

