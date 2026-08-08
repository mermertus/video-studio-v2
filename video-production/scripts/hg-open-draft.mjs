import { chromium } from 'playwright';
const ctx = await chromium.launchPersistentContext('.heygen-profile', { headless:true, channel:'chrome', viewport:{width:1600,height:1000} });
const page = ctx.pages()[0] || await ctx.newPage();
await ctx.addInitScript(()=>{Object.defineProperty(navigator,'webdriver',{get:()=>undefined});});
await page.goto('https://app.heygen.com/avatar/studio',{waitUntil:'domcontentloaded'}); await page.waitForTimeout(5000);
await page.keyboard.press('Escape').catch(()=>{});
// click the draft tile (the av-III 9:16 one)
const draft = page.getByText('a21eb4ed',{exact:false}).first();
let clicked=false;
if(await draft.count().catch(()=>0)){ await draft.click().catch(()=>{}); clicked=true; }
await page.waitForTimeout(9000); // editor is heavy
await page.screenshot({path:'renders/hg-editor1.png'});
console.log('clicked draft:',clicked,'| URL:', page.url());
const txt = await page.evaluate(()=>document.body?document.body.innerText:'');
console.log(txt.replace(/\s+/g,' ').slice(0,500));
const btns = await page.evaluate(()=>Array.from(document.querySelectorAll('button,a,[role=menuitem],[aria-label]')).map(b=>(b.innerText||b.getAttribute('aria-label')||'').trim()).filter(t=>t&&t.length<34));
console.log('CTRLS:', JSON.stringify([...new Set(btns)].slice(0,60)));
await ctx.close();

