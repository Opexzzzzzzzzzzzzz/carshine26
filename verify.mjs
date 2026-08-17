import { chromium } from "playwright";
import { readFileSync } from "fs";
const html = readFileSync("deck.html","utf8");
const b = await chromium.launch();
const p = await (await b.newContext({viewport:{width:1280,height:720},deviceScaleFactor:1.5})).newPage();
await p.setContent(html,{waitUntil:"networkidle"});
const secs = await p.$$("section.slide");
for (const i of [0,5,10]) { await secs[i].screenshot({path:`deck/verify-${i}.png`}); }
await b.close(); console.log("ok");
