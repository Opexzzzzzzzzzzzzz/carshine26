import { chromium } from "playwright";
const b = await chromium.launch();
const ctx = await b.newContext();
const page = await ctx.newPage();
const feeds = [];
page.on("response", (r) => {
  const u = r.url();
  if (/store|product|catalog|\.js(\?|$)|\.csv|tovar/i.test(u) && !/tilda.*\.js/.test(u)) feeds.push(`${r.status()} ${u}`);
});
await page.goto("https://carshine26.com/abrazivnye-pasty-dlya-lkp", { waitUntil: "networkidle" });
await page.waitForTimeout(1500);

// найдём карточки товаров
const info = await page.evaluate(() => {
  const out = {};
  // Tilda store product cards
  const cards = document.querySelectorAll('.t-store__card, .js-product, [data-product-id], .t-store__card__wrapper');
  out.cardCount = cards.length;
  out.firstCardHTML = cards[0] ? cards[0].outerHTML.slice(0, 1200) : null;
  // ссылки на товары
  const links = Array.from(document.querySelectorAll('a')).map(a=>a.href).filter(h=>/tovar|tproduct|product|#!/.test(h));
  out.productLinks = [...new Set(links)].slice(0,5);
  // глобальные переменные Tilda с товарами
  out.hasTstoreData = typeof window.tstoreProducts !== 'undefined' || !!document.querySelector('script[data-products]');
  return out;
});
console.log("FEEDS:\n" + feeds.join("\n"));
console.log("\nCARDS:", info.cardCount);
console.log("PRODUCT LINKS:", JSON.stringify(info.productLinks, null, 2));
console.log("hasTstoreData:", info.hasTstoreData);
console.log("\nFIRST CARD HTML:\n", info.firstCardHTML);
await b.close();
