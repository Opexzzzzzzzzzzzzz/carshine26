import { chromium } from "playwright";
import { readFileSync, writeFileSync } from "fs";

const img = (f) =>
  "data:image/png;base64," + readFileSync(`deck/${f}.png`).toString("base64");

const S = {
  home: img("home"),
  catalog: img("catalog"),
  product: img("product"),
  cart: img("cart"),
  checkout: img("checkout"),
  admin: img("admin"),
  adminProducts: img("admin-products"),
  mobile: img("mobile"),
};

// Слайд со скриншотом: заголовок + пункты ценности слева, кадр справа
function shotSlide({ eyebrow, title, points, src, tag }) {
  return `<section class="slide split">
    <div class="col">
      <div class="eyebrow">${eyebrow}</div>
      <h2>${title}</h2>
      <ul>${points.map((p) => `<li>${p}</li>`).join("")}</ul>
      ${tag ? `<div class="pill">${tag}</div>` : ""}
    </div>
    <div class="frame"><div class="bar"><i></i><i></i><i></i></div><img src="${src}"></div>
  </section>`;
}

const slides = [
  // 1. Обложка
  `<section class="slide cover">
    <div class="cover-glow"></div>
    <div class="cover-inner">
      <div class="brand">Car<span class="g">Shine</span> <span class="chip">detailing</span></div>
      <div class="eyebrow">Предложение · редизайн carshine26.com</div>
      <h1>Витрину — в магазин,<br>который <span class="g">реально продаёт</span></h1>
      <p class="lede">Быстрый интернет-магазин с корзиной, онлайн-оплатой и удобной панелью управления — на эстетике премиум-детейлинга. Рабочий прототип готов.</p>
      <div class="cover-foot">
        <span>Ставрополь · автохимия и оборудование</span>
        <span>+7 905 493-99-85</span>
      </div>
    </div>
  </section>`,

  // 2. Проблема
  `<section class="slide">
    <div class="eyebrow">Что происходит сейчас</div>
    <h2 class="wide">Старый сайт теряет заказы на ровном месте</h2>
    <div class="cards">
      <div class="card bad"><h3>Каталог на главной пуст</h3><p>«Ничего не найдено» — покупатель видит пустоту и уходит.</p></div>
      <div class="card bad"><h3>Нет корзины и оплаты</h3><p>«Заказать» — форма-заявка в WhatsApp. Каждый заказ вручную.</p></div>
      <div class="card bad"><h3>Битые пункты меню</h3><p>Часть ссылок ведёт в пустоту или не кликается.</p></div>
      <div class="card bad"><h3>Каша в адресах, слабое SEO</h3><p>Транслит-URL и разрозненные страницы конструктора.</p></div>
    </div>
  </section>`,

  // Было → Стало
  `<section class="slide">
    <div class="eyebrow">Коротко</div>
    <h2 class="wide">Было → Стало</h2>
    <table class="cmp">
      <thead><tr><th>Что важно</th><th>Сайт сейчас</th><th>Новый сайт</th></tr></thead>
      <tbody>
        <tr><td>Каталог на главной</td><td class="now">Пусто, «ничего не найдено»</td><td class="new">Хиты и новинки сразу</td></tr>
        <tr><td>Оформление заказа</td><td class="now">Форма-заявка в WhatsApp</td><td class="new">Корзина + оплата онлайн</td></tr>
        <tr><td>Навигация</td><td class="now">Битые и пустые ссылки</td><td class="new">Всё кликается и ведёт куда надо</td></tr>
        <tr><td>Адреса и SEO</td><td class="now">Транслит-каша, слабое SEO</td><td class="new">Чистые URL + разметка</td></tr>
        <tr><td>Товары</td><td class="now">Разрозненные страницы</td><td class="new">Единая база + фильтры и поиск</td></tr>
        <tr><td>Управление</td><td class="now">Через конструктор</td><td class="new">Своя панель + ИИ-описания</td></tr>
      </tbody>
    </table>
  </section>`,

  // 3. Решение
  `<section class="slide">
    <div class="eyebrow">Что даёт новый сайт</div>
    <h2 class="wide">Каждый стопор — закрыт</h2>
    <div class="cards">
      <div class="card good"><h3>Живой каталог с первого экрана</h3><p>Хиты и новинки на главной, фильтры, поиск, сортировка.</p></div>
      <div class="card good"><h3>Корзина и оплата онлайн</h3><p>Набрал → увидел сумму → оплатил картой или СБП.</p></div>
      <div class="card good"><h3>Чистые адреса и SEO</h3><p>Понятные ссылки, карта сайта, разметка, быстрая загрузка.</p></div>
      <div class="card good"><h3>Простая панель управления</h3><p>Товары, цены, наличие и заказы — без программиста.</p></div>
    </div>
  </section>`,

  // 4–11 скриншоты
  shotSlide({
    eyebrow: "Прототип · Главная",
    title: "Первый экран, который продаёт",
    points: ["Премиум-герой и понятное предложение", "Плитки категорий и живые «Хиты продаж»", "Блок керамики, новинки, бренды"],
    src: S.home,
  }),
  shotSlide({
    eyebrow: "Прототип · Каталог",
    title: "Единый каталог с фильтрами",
    points: ["Фильтры по бренду, цене и наличию", "Поиск и сортировка в один клик", "Сетка карточек с ценой и статусом"],
    src: S.catalog,
  }),
  shotSlide({
    eyebrow: "Прототип · Карточка товара",
    title: "Всё для решения о покупке",
    points: ["Характеристики, рейтинг, наличие", "Кнопка «в корзину» и похожие товары", "Разметка для поисковиков (JSON-LD)"],
    src: S.product,
  }),
  shotSlide({
    eyebrow: "Прототип · Корзина",
    title: "Покупка в один клик",
    points: ["Корзина выезжает сбоку, считает сумму", "Запоминает товары между заходами", "Отсюда — прямой путь к оформлению"],
    src: S.cart,
  }),
  shotSlide({
    eyebrow: "Прототип · Оформление заказа",
    title: "Доставка и оплата на выбор",
    points: ["Курьер, самовывоз, СДЭК по России", "Оплата онлайн, при получении, счёт юрлицам", "Понятная сводка заказа"],
    src: S.checkout,
  }),
  shotSlide({
    eyebrow: "Прототип · Панель управления",
    title: "Владелец управляет сам",
    points: ["Сводка выручки и заказов", "Товары, цены, наличие — переключателем", "Никакого программиста для правок"],
    src: S.admin,
  }),
  shotSlide({
    eyebrow: "Фишка · ИИ",
    title: "Описание товара напишет ИИ",
    points: ["Ввёл название и характеристики — получил текст", "Продающее описание за пару секунд", "Заполнить каталог — часы вместо дней"],
    src: S.adminProducts,
    tag: "Экономия времени владельца",
  }),
  shotSlide({
    eyebrow: "Прототип · Мобильная версия",
    title: "Удобно с телефона",
    points: ["Большинство покупателей — со смартфона", "Адаптивная вёрстка каталога и корзины", "Быстрая загрузка на мобильном"],
    src: S.mobile,
  }),

  // 12. Этапы
  `<section class="slide">
    <div class="eyebrow">План работ</div>
    <h2 class="wide">Три этапа до запуска</h2>
    <div class="stages">
      <div class="stage done"><div class="sh"><span class="idx">01</span><b>Прототип</b><span class="badge">Готово</span></div><p>Дизайн, главная, каталог, карточка, корзина, оформление, мокап админки.</p></div>
      <div class="stage"><div class="sh"><span class="idx">02</span><b>Рабочий магазин (MVP)</b><span class="when">3–4 недели</span></div><p>База товаров и админка, онлайн-оплата, перенос ассортимента, ИИ-описания.</p></div>
      <div class="stage"><div class="sh"><span class="idx">03</span><b>Запуск и рост</b><span class="when">2–3 недели</span></div><p>Перенос домена, 301-редиректы, Метрика, SEO, обучение работе с панелью.</p></div>
    </div>
    <div class="price"><span class="lbl">Стоимость проекта под ключ</span><span class="val">45 000 ₽</span></div>
    <p class="note">Сроки ориентировочные и зависят от объёма ассортимента.</p>
  </section>`,

  // 13. Финал
  `<section class="slide cover">
    <div class="cover-glow"></div>
    <div class="cover-inner center">
      <div class="eyebrow">Следующий шаг</div>
      <h1>Запросите прототип —<br>и обсудим <span class="g">запуск</span></h1>
      <p class="lede">Дам ссылку на рабочий прототип — пощёлкаете сами. Отвечу на вопросы и составлю точную смету под ваш ассортимент.</p>
      <div class="contact">+7 905 493-99-85</div>
    </div>
  </section>`,
];

const html = `<!doctype html><html lang="ru"><head><meta charset="utf-8"><style>
  * { margin:0; padding:0; box-sizing:border-box; }
  :root{
    --bg:#0a0b0d; --bg2:#101216; --surface:#15181d; --surface2:#1c2027;
    --border:#262b33; --ink:#f2f0ea; --muted:#a29b8d; --dim:#6f6a5f;
    --gold:#e6b450; --gold2:#f7d488; --danger:#ff6f61; --success:#5ccb8a;
  }
  html,body{ background:var(--bg); }
  body{ font-family:"Segoe UI",system-ui,-apple-system,Roboto,sans-serif; color:var(--ink); -webkit-print-color-adjust:exact; print-color-adjust:exact; }
  .slide{ position:relative; width:1280px; height:720px; padding:64px 72px; background:var(--bg); overflow:hidden; break-after:page; display:flex; flex-direction:column; }
  .slide:last-child{ break-after:auto; }
  .eyebrow{ font-size:14px; font-weight:700; letter-spacing:.22em; text-transform:uppercase; color:var(--gold); margin-bottom:14px; }
  h1{ font-size:60px; font-weight:800; letter-spacing:-.02em; line-height:1.04; margin-bottom:22px; }
  h2{ font-size:40px; font-weight:800; letter-spacing:-.02em; line-height:1.08; margin-bottom:26px; max-width:15ch; }
  h2.wide{ max-width:none; }
  .g{ background:linear-gradient(100deg,var(--gold2),var(--gold) 55%,#b8862f); -webkit-background-clip:text; background-clip:text; color:transparent; }
  .lede{ font-size:22px; line-height:1.5; color:var(--muted); max-width:42ch; }

  /* Split screenshot slide */
  .split{ flex-direction:row; gap:48px; align-items:center; }
  .split .col{ width:38%; flex-shrink:0; }
  .split h2{ font-size:34px; margin-bottom:22px; }
  .split ul{ list-style:none; display:flex; flex-direction:column; gap:14px; }
  .split li{ position:relative; padding-left:26px; font-size:18px; line-height:1.4; color:var(--muted); }
  .split li::before{ content:"→"; position:absolute; left:0; color:var(--gold); font-weight:700; }
  .pill{ display:inline-block; margin-top:24px; font-size:14px; font-weight:700; color:var(--gold); background:rgba(230,180,80,.14); padding:8px 14px; border-radius:999px; }
  .frame{ flex:1; height:560px; border:1px solid var(--border); border-radius:16px; overflow:hidden; background:var(--surface); box-shadow:0 40px 80px -40px rgba(0,0,0,.9); display:flex; flex-direction:column; }
  .bar{ height:34px; background:var(--surface2); border-bottom:1px solid var(--border); display:flex; align-items:center; gap:8px; padding:0 14px; flex-shrink:0; }
  .bar i{ width:11px; height:11px; border-radius:50%; background:#3a3f48; display:block; }
  .frame img{ width:100%; height:100%; object-fit:cover; object-position:top; }

  /* Comparison table */
  .cmp{ width:100%; border-collapse:collapse; border:1px solid var(--border); border-radius:16px; overflow:hidden; }
  .cmp th,.cmp td{ text-align:left; padding:16px 22px; border-bottom:1px solid var(--border); font-size:18px; vertical-align:middle; }
  .cmp thead th{ font-size:14px; text-transform:uppercase; letter-spacing:.1em; color:var(--dim); background:var(--surface2); font-weight:700; }
  .cmp tbody tr:last-child td{ border-bottom:0; }
  .cmp td:first-child{ color:var(--muted); font-weight:700; width:26%; }
  .cmp .now{ color:var(--danger); width:34%; }
  .cmp .new{ color:var(--success); font-weight:700; }
  .cmp tbody tr:nth-child(even){ background:rgba(255,255,255,.015); }

  /* Price block on stages */
  .price{ display:flex; align-items:center; gap:16px; margin-top:22px; background:var(--surface); border:1px solid var(--border); border-left:4px solid var(--gold); border-radius:14px; padding:18px 26px; }
  .price .lbl{ font-size:17px; color:var(--muted); }
  .price .val{ margin-left:auto; font-size:34px; font-weight:800; color:var(--gold); }

  /* Cards */
  .cards{ display:grid; grid-template-columns:1fr 1fr; gap:18px; margin-top:8px; }
  .card{ background:var(--surface); border:1px solid var(--border); border-radius:16px; padding:26px 28px; border-left-width:4px; }
  .card.bad{ border-left-color:var(--danger); }
  .card.good{ border-left-color:var(--success); }
  .card h3{ font-size:22px; font-weight:700; margin-bottom:8px; }
  .card p{ font-size:17px; line-height:1.45; color:var(--muted); }

  /* Stages */
  .stages{ display:flex; flex-direction:column; gap:16px; }
  .stage{ background:var(--surface); border:1px solid var(--border); border-radius:16px; padding:22px 26px; }
  .stage.done{ border-color:#2e6b48; }
  .sh{ display:flex; align-items:center; gap:14px; margin-bottom:8px; }
  .sh .idx{ font-weight:800; color:var(--gold); border:1px solid var(--border); border-radius:8px; padding:4px 10px; font-size:15px; }
  .sh b{ font-size:24px; }
  .badge{ font-size:13px; font-weight:700; text-transform:uppercase; letter-spacing:.06em; color:var(--success); background:rgba(92,203,138,.14); padding:4px 12px; border-radius:999px; }
  .when{ margin-left:auto; color:var(--muted); font-weight:600; font-size:16px; }
  .stage p{ font-size:17px; color:var(--muted); }
  .note{ margin-top:22px; font-size:14px; color:var(--dim); }

  /* Cover */
  .cover{ justify-content:center; background:var(--bg2); }
  .cover-glow{ position:absolute; inset:0; background:
     radial-gradient(50% 55% at 78% 20%, rgba(230,180,80,.16), transparent 60%),
     radial-gradient(45% 50% at 10% 95%, rgba(230,180,80,.07), transparent 60%); }
  .cover-inner{ position:relative; }
  .cover-inner.center{ text-align:center; margin:0 auto; }
  .brand{ font-size:26px; font-weight:800; margin-bottom:40px; }
  .chip{ font-size:11px; letter-spacing:.2em; text-transform:uppercase; color:var(--dim); border:1px solid var(--border); padding:4px 9px; border-radius:6px; vertical-align:middle; margin-left:6px; }
  .cover-foot{ display:flex; gap:36px; margin-top:44px; font-size:17px; color:var(--muted); }
  .cover-inner.center .lede{ margin:0 auto; }
  .contact{ margin-top:32px; font-size:30px; font-weight:800; color:var(--gold); }
</style></head><body>${slides.join("")}</body></html>`;

writeFileSync("deck.html", html);

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent(html, { waitUntil: "networkidle" });
await page.pdf({
  path: "CarShine-презентация.pdf",
  width: "1280px",
  height: "720px",
  printBackground: true,
  preferCSSPageSize: true,
});
await browser.close();
console.log("PDF готов");
