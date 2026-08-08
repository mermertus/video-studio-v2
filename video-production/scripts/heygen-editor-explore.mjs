import { chromium } from 'playwright';
const DRAFT='4e294682dcbb4cfc897e21decedc0d1d';
const ctx = await chromium.launchPersistentContext('.heygen-profile', { headless:true, channel:'chrome', viewport:{width:1600,height:1000} });
const page = ctx.pages()[0] || await ctx.newPage();
await ctx.addInitScript(()=>{Object.defineProperty(navigator,'webdriver',{get:()=>undefined});});
await page.goto('https://app.heygen.com/create-v4/'+DRAFT+'?panel=scene',{waitUntil:'domcontentloaded',timeout:45000});
await page.waitForTimeout(9000);
await page.keyboard.press('Escape').catch(()=>{});
await page.waitForTimeout(1000);
await page.screenshot({path:'renders/hg-editor.png'});
// dump all clickable labels + aria
const ctrls = await page.evaluate(()=>{
  const items=[];
  document.querySelectorAll('button,[role=button],[role=tab],[aria-label],a').forEach(el=>{
    const t=(el.innerText||'').trim().replace(/\s+/g,' ');
    const al=el.getAttribute('aria-label')||'';
    if((t&&t.length<46)||al) items.push((al?`[aria:${al}] `:'')+t);
  });
  return [...new Set(items)].slice(0,90);
});
// detect engine + aspect text on screen
const bodytxt = await page.evaluate(()=>document.body?document.body.innerText.replace(/\s+/g,' '):'');
console.log('URL', page.url());
console.log('ENGINE hints:', /avatar v|avatar iv|avatar iii|motion engine/i.test(bodytxt)?bodytxt.match(/.{0,30}(avatar v|avatar iv|avatar iii|motion engine).{0,30}/i)?.slice(0,3):'none');
console.log('ASPECT hints:', bodytxt.match(/.{0,20}(portrait|landscape|9:16|16:9|1:1).{0,10}/ig)?.slice(0,5));
console.log('CTRLS:', JSON.stringify(ctrls,null,1));
await ctx.close();

