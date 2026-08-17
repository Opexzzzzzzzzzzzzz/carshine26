import { chromium } from "playwright";
const b = await chromium.launch();
const page = await (await b.newContext()).newPage();
await page.goto("https://carshine26.com/abrazivnye-pasty-dlya-lkp", { waitUntil: "domcontentloaded" });
await page.waitForTimeout(2500);
// прокрутим для ленивой загрузки
await page.evaluate(async () => { for (let y=0;y<8;y++){ window.scrollBy(0,900); await new Promise(r=>setTimeout(r,250)); } });
await page.waitForTimeout(1000);

const res = await page.evaluate(() => {
  // найти кнопки "Подробнее"
  const all = Array.from(document.querySelectorAll('a,button,div,span'));
  const more = all.filter(e => e.textContent.trim() === 'Подробнее');
  const order = all.filter(e => e.textContent.trim() === 'Заказать');
  // подняться к общему контейнеру карточки от "Подробнее"
  function cardOf(el){ let n=el; for(let i=0;i<6;i++){ if(!n.parentElement) break; n=n.parentElement; if(n.querySelector && n.textContent.match(/\d[\d\s]*р/)) return n; } return el; }
  const sample = more[0] ? cardOf(more[0]) : null;
  const moreLink = more.map(e=>e.closest('a')?.href).filter(Boolean).slice(0,3);
  return {
    moreCount: more.length,
    orderCount: order.length,
    moreTag: more[0]?.tagName,
    moreHref: more[0]?.closest('a')?.href || more[0]?.href || null,
    sampleClass: sample?.className,
    sampleHTML: sample ? sample.outerHTML.slice(0,900) : null,
    moreLinks: [...new Set(moreLink)],
  };
});
console.log(JSON.stringify(res, null, 2));
await b.close();
