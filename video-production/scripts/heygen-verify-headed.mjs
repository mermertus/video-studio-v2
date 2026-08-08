import { chromium } from 'playwright';
const ctx = await chromium.launchPersistentContext('.heygen-profile', { headless:false, channel:'chrome', viewport:null, args:['--start-maximized'] });
const page = ctx.pages()[0] || await ctx.newPage();
console.log('navegando a /projects (si aparece prompt de Keychain, Maria dale Permitir)...');
await page.goto('https://app.heygen.com/projects', { waitUntil:'domcontentloaded' }).catch(()=>{});
for (let i=0;i<12;i++){
  await page.waitForTimeout(3000);
  const txt = await page.evaluate(()=>document.body?document.body.innerText:'').catch(()=>'');
  const wall = /continuar con google|sign in with google/i.test(txt);
  console.log(`[${i}] loginWall=${wall} len=${txt.length}`);
  if(!wall && txt.length>250){ console.log('LOGGED_IN'); break; }
}
await page.screenshot({path:'renders/heygen-verify.png'}).catch(()=>{});
await ctx.storageState({path:'.heygen-auth.json'}).catch(()=>{});
await ctx.close();

