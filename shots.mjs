import { chromium } from "playwright";
import { mkdirSync } from "fs";

const OUT = "shots";
mkdirSync(OUT, { recursive: true });
const BASE = "http://localhost:3000";

const browser = await chromium.launch();

async function shot(name, url, { mobile = false, full = false, prep } = {}) {
  const ctx = await browser.newContext({
    viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await ctx.newPage();
  await page.goto(BASE + url, { waitUntil: "networkidle" });
  await page.addStyleTag({
    content:
      "nextjs-portal,#__next-build-watcher,[data-nextjs-dev-tools-button],[data-next-badge-root],[data-next-badge]{display:none!important}",
  });
  await page.waitForTimeout(600);
  if (prep) await prep(page);
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: full });
  console.log("✓", name);
  await ctx.close();
}

// 1. Главная (весь экран, длинная)
await shot("01-home", "/", { full: true });
// 2. Главная — первый экран (герой)
await shot("02-hero", "/");
// 3. Каталог с фильтрами
await shot("03-catalog", "/catalog", { full: true });
// 4. Категория «Полировка»
await shot("04-category", "/catalog/polirovka");
// 5. Карточка товара
await shot("05-product", "/product/koch-chemie-h9-02-250", { full: true });
// 6. Корзина открыта
await shot("06-cart", "/", {
  prep: async (page) => {
    await page.getByRole("button", { name: "В корзину" }).first().click();
    await page.waitForTimeout(700);
  },
});
// 7. Оформление заказа — сначала положим товар
await shot("07-checkout", "/product/carshine-ceramic-coating-30", {
  full: true,
  prep: async (page) => {
    await page.getByRole("button", { name: "Добавить в корзину" }).click();
    await page.waitForTimeout(500);
    await page.goto(BASE + "/checkout", { waitUntil: "networkidle" });
    await page.waitForTimeout(600);
  },
});
// 8. Админка — сводка
await shot("08-admin-dash", "/admin", { full: true });
// 9. Админка — товары
await shot("09-admin-products", "/admin", {
  full: true,
  prep: async (page) => {
    await page.getByRole("button", { name: "Товары" }).click();
    await page.waitForTimeout(400);
  },
});
// 10. Мобильная главная
await shot("10-mobile-home", "/", { mobile: true, full: true });

await browser.close();
console.log("done");
