import { chromium } from 'playwright';
const DRAFT='4e294682dcbb4cfc897e21decedc0d1d';
const ctx = await chromium.launchPersistentContext('.heygen-profile', { headless:true, channel:'chrome', viewport:{width:1600,height:1000} });
const page = ctx.pages()[0] || await ctx.newPage();
await ctx.addInitScript(()=>{Object.defineProperty(navigator,'webdriver',{get:()=>undefined});});
const log=(...a)=>console.log(...a);
await page.goto('https://app.heygen.com/create-v4/'+DRAFT+'?panel=scene',{waitUntil:'domcontentloaded',timeout:45000});
await page.waitForTimeout(9000);
await page.keyboard.press('Escape').catch(()=>{});

// --- LOOK: open picker, pick Maria-Look3 ---
try {
  await page.getByText('Maria Bejarano',{exact:false}).first().click({timeout:8000});
  await page.waitForTimeout(3500);
  const l3 = page.locator('[alt="Maria-Look3"]').first();
  const cnt = await page.locator('[alt="Maria-Look3"]').count();
  log('Look3 elems:', cnt);
  await l3.scrollIntoViewIfNeeded().catch(()=>{});
  await l3.click({timeout:8000, force:true});
  await page.waitForTimeout(6000);
  log('look click done');
} catch(e){ log('LOOK err', e.message.slice(0,80)); }
await page.keyboard.press('Escape').catch(()=>{});
await page.waitForTimeout(2000);
await page.screenshot({path:'renders/hg-s2-look.png'});

// --- ENGINE: Avatar III -> Avatar V ---
try {
  const eng = page.getByText('Avatar III',{exact:true}).first();
  if(await eng.count()>0){
    await eng.click({timeout:8000});
    await page.waitForTimeout(2500);
    await page.screenshot({path:'renders/hg-s2-enginemenu.png'});
    // click the menu row that starts with "Avatar V"
    const v = page.getByText(/^Avatar V\b/).first();
    await v.click({timeout:8000});
    await page.waitForTimeout(3000);
    log('engine set to V');
  } else { log('engine label not "Avatar III" â€” maybe already V'); }
} catch(e){ log('ENGINE err', e.message.slice(0,80)); }
await page.keyboard.press('Escape').catch(()=>{});
await page.waitForTimeout(1500);

// --- PORTRAIT ---
try { await page.locator('[aria-label="Portrait (9:16)"]').click({timeout:8000}); await page.waitForTimeout(2500); log('portrait set'); }
catch(e){ log('PORTRAIT err', e.message.slice(0,60)); }

await page.waitForTimeout(2000);
await page.screenshot({path:'renders/hg-s2-final.png'});
const b = await page.evaluate(()=>document.body?document.body.innerText.replace(/\s+/g,' '):'');
log('engine now contains Avatar V:', /Avatar V\b/.test(b), '| Avatar III:', /Avatar III\b/.test(b));
await ctx.close();

