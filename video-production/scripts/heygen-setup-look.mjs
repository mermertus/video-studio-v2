import { chromium } from 'playwright';
const DRAFT='4e294682dcbb4cfc897e21decedc0d1d';
const ctx = await chromium.launchPersistentContext('.heygen-profile', { headless:true, channel:'chrome', viewport:{width:1600,height:1000} });
const page = ctx.pages()[0] || await ctx.newPage();
await ctx.addInitScript(()=>{Object.defineProperty(navigator,'webdriver',{get:()=>undefined});});
await page.goto('https://app.heygen.com/create-v4/'+DRAFT+'?panel=scene',{waitUntil:'domcontentloaded',timeout:45000});
await page.waitForTimeout(9000);
await page.keyboard.press('Escape').catch(()=>{});
const log=(...a)=>console.log(...a);

// 1) Portrait 9:16
try { await page.locator('[aria-label="Portrait (9:16)"]').click({timeout:8000}); await page.waitForTimeout(2500); log('portrait OK'); }
catch(e){ log('portrait err', e.message.slice(0,60)); }

// 2) Engine -> Avatar V
try {
  await page.getByText('Avatar III',{exact:true}).first().click({timeout:8000});
  await page.waitForTimeout(2000);
  await page.getByText('Avatar V',{exact:true}).first().click({timeout:8000});
  await page.waitForTimeout(3000);
  log('engine->V OK');
} catch(e){ log('engine err', e.message.slice(0,60)); }
await page.keyboard.press('Escape').catch(()=>{});
await page.waitForTimeout(800);

// 3) Look -> Maria-Look3
try {
  await page.getByText('Maria Bejarano',{exact:false}).first().click({timeout:8000});
  await page.waitForTimeout(3000);
  // click the look thumbnail whose alt is Maria-Look3
  const look3 = page.locator('img[alt="Maria-Look3"]').first();
  await look3.scrollIntoViewIfNeeded().catch(()=>{});
  await look3.click({timeout:8000});
  await page.waitForTimeout(5000);
  log('look->Look3 OK');
} catch(e){ log('look err', e.message.slice(0,60)); }
await page.keyboard.press('Escape').catch(()=>{});
await page.waitForTimeout(2500);

await page.screenshot({path:'renders/hg-look3-set.png'});
// report current right-panel engine + selected look hints
const info = await page.evaluate(()=>{
  const b=document.body?document.body.innerText.replace(/\s+/g,' '):'';
  return { engine:(b.match(/Motion Engine\s*(Avatar [VI]+)/)||[])[1]||(b.match(/Avatar V\b/)?'Avatar V?':'?') };
});
log('INFO', JSON.stringify(info));
await ctx.close();

