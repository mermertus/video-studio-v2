import { chromium } from 'playwright';
const DRAFT='4e294682dcbb4cfc897e21decedc0d1d';
const ctx = await chromium.launchPersistentContext('.heygen-profile', { headless:true, channel:'chrome', viewport:{width:1600,height:1000} });
const page = ctx.pages()[0] || await ctx.newPage();
await ctx.addInitScript(()=>{Object.defineProperty(navigator,'webdriver',{get:()=>undefined});});
const log=(...a)=>console.log(...a);
await page.goto('https://app.heygen.com/create-v4/'+DRAFT+'?panel=scene',{waitUntil:'domcontentloaded',timeout:45000});
await page.waitForTimeout(9000);
await page.keyboard.press('Escape').catch(()=>{});

const inputs = await page.evaluate(()=>[...document.querySelectorAll('input[type=file]')].map(i=>({accept:i.getAttribute('accept')||'', name:i.getAttribute('name')||'', hidden:i.offsetParent===null})));
log('FILE INPUTS:', JSON.stringify(inputs,null,1));

const audios = await page.evaluate(()=>[...document.querySelectorAll('audio')].map(a=>({src:(a.currentSrc||a.src||'').slice(-40), dur:Math.round(a.duration||0)})));
log('AUDIO ELS:', JSON.stringify(audios));

// scene duration + any mm:ss text in left/timeline
const times = await page.evaluate(()=>{ const out=[]; document.querySelectorAll('*').forEach(e=>{const t=(e.childElementCount===0?(e.innerText||''):'').trim(); if(/^\d{1,2}:\d{2}(\s*\/\s*\d{1,2}:\d{2})?$/.test(t)) out.push(t);}); return [...new Set(out)].slice(0,12); });
log('TIME LABELS on page:', JSON.stringify(times));

// left script panel buttons/text
const leftBtns = await page.evaluate(()=>[...document.querySelectorAll('button,[role=button]')].map(b=>(b.innerText||'').trim().replace(/\s+/g,' ')).filter(t=>t&&t.length<30));
log('BUTTONS:', JSON.stringify([...new Set(leftBtns)].slice(0,40)));
await page.screenshot({path:'renders/hg-audio-probe.png'});
await ctx.close();

