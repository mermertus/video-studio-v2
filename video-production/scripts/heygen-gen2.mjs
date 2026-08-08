import { chromium } from 'playwright';
const DRAFT='4e294682dcbb4cfc897e21decedc0d1d';
const ctx = await chromium.launchPersistentContext('.heygen-profile', { headless:true, channel:'chrome', viewport:{width:1600,height:1000} });
const page = ctx.pages()[0] || await ctx.newPage();
await ctx.addInitScript(()=>{Object.defineProperty(navigator,'webdriver',{get:()=>undefined});});
const log=(...a)=>console.log(...a);
await page.goto('https://app.heygen.com/create-v4/'+DRAFT+'?panel=scene',{waitUntil:'domcontentloaded',timeout:45000});
await page.waitForTimeout(9000);
await page.keyboard.press('Escape').catch(()=>{});
// Generate button (top-right)
await page.getByRole('button',{name:/^Generate$/}).first().click({timeout:8000}).catch(async()=>{ await page.getByText('Generate',{exact:true}).first().click({timeout:5000}); });
await page.waitForTimeout(3000);
// wait for the Generate Video dialog
const dlgText = await page.evaluate(()=>document.body.innerText);
log('modal has "Generate Video":', /Generate Video/i.test(dlgText), '| Submit:', /Submit/i.test(dlgText));
// find Submit button coords inside dialog and click
const sb = await page.evaluate(()=>{
  const btns=[...document.querySelectorAll('button')].filter(b=>/^submit$/i.test((b.innerText||'').trim()) && b.offsetParent!==null);
  if(!btns.length) return null;
  const b=btns[btns.length-1].getBoundingClientRect();
  return {x:Math.round(b.x+b.width/2),y:Math.round(b.y+b.height/2)};
});
log('Submit coords:', JSON.stringify(sb));
if(sb){ await page.mouse.click(sb.x,sb.y); log('clicked Submit'); }
await page.waitForTimeout(6000);
await page.screenshot({path:'renders/hg-gen2-after.png'});
log('url after:', page.url());
await ctx.close();

