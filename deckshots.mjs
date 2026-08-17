import { chromium } from "playwright";
import { mkdirSync } from "fs";

const OUT = "deck";
mkdirSync(OUT, { recursive: true });
const BASE = "http://localhost:3000";
const HIDE =
  "nextjs-portal,#__next-build-watcher,[data-nextjs-dev-tools-button],[data-next-badge-root],[data-next-badge]{display:none!important}";

const browser = await chromium.launch();

async function shot(name, url, { mobile = false, prep } = {}) {
  const ctx = await browser.newContext({
    viewport: mobile ? { width: 430, height: 900 } : { width: 1600, height: 1000 },
    deviceScaleFactor: 2,
  });
  const page = await ctx.newPage();
  await page.goto(BASE + url, { waitUntil: "networkidle" });
  await page.addStyleTag({ content: HIDE });
  await page.waitForTimeout(600);
  if (prep) await prep(page);
  await page.screenshot({ path: `${OUT}/${name}.png` });
  console.log("✓", name);
  await ctx.close();
}

await shot("home", "/");
await shot("catalog", "/catalog");
await shot("product", "/product/koch-chemie-h9-02-250");
await shot("cart", "/", {
  prep: async (p) => {
    await p.getByRole("button", { name: "В корзину" }).first().click();
    await p.waitForTimeout(700);
  },
});
await shot("checkout", "/product/carshine-ceramic-coating-30", {
  prep: async (p) => {
    await p.getByRole("button", { name: "Добавить в корзину" }).click();
    await p.waitForTimeout(400);
    await p.goto(BASE + "/checkout", { waitUntil: "networkidle" });
    await p.addStyleTag({ content: HIDE });
    await p.waitForTimeout(500);
  },
});
await shot("admin", "/admin");
await shot("admin-products", "/admin", {
  prep: async (p) => {
    await p.getByRole("button", { name: "Товары" }).click();
    await p.waitForTimeout(400);
  },
});
await shot("mobile", "/", { mobile: true });

await browser.close();
console.log("done");
