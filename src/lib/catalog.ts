// Демо-данные каталога для прототипа CarShine.
// На этапе MVP заменяется на БД (Prisma) + админку. Структура полей уже "боевая".

export type SubCategory = {
  slug: string;
  title: string;
};

export type Category = {
  slug: string;
  title: string;
  tagline: string;
  icon: string; // emoji-заглушка, на MVP -> SVG-иконки
  subcategories: SubCategory[];
};

export type Product = {
  slug: string;
  title: string;
  brand: string;
  price: number;
  oldPrice?: number;
  category: string; // slug верхней категории
  subcategory: string; // slug подкатегории
  volume?: string;
  inStock: boolean;
  hit?: boolean;
  isNew?: boolean;
  rating: number;
  reviews: number;
  description: string;
  specs: { label: string; value: string }[];
};

export const categories: Category[] = [
  {
    slug: "polirovka",
    title: "Полировка",
    tagline: "Пасты, круги, составы и всё для идеального ЛКП",
    icon: "✨",
    subcategories: [
      { slug: "abrazivnye-pasty", title: "Абразивные пасты для ЛКП" },
      { slug: "krugi-i-pady", title: "Полировальные круги и пады" },
      { slug: "podlozhki", title: "Подложки к полировальникам" },
      { slug: "sostavy", title: "Составы для полировки" },
      { slug: "polirovka-stekol", title: "Полировка стёкол" },
    ],
  },
  {
    slug: "moyka-i-uhod",
    title: "Мойка и уход",
    tagline: "Химия для кузова, салона и защиты",
    icon: "🧴",
    subcategories: [
      { slug: "exterior", title: "Экстерьер" },
      { slug: "interior", title: "Интерьер" },
      { slug: "keramika", title: "Керамика и защита" },
    ],
  },
  {
    slug: "oborudovanie",
    title: "Оборудование",
    tagline: "Машинки, турбосушки, торнадоры, озонаторы",
    icon: "⚙️",
    subcategories: [
      { slug: "polirovalnye-mashinki", title: "Полировальные машинки" },
      { slug: "sushki-tornadory", title: "Турбосушки, торнадоры, озонаторы" },
      { slug: "drugoe", title: "Другое оборудование" },
    ],
  },
  {
    slug: "aksessuary",
    title: "Аксессуары",
    tagline: "Микрофибра, аппликаторы, кисти, тара",
    icon: "🧽",
    subcategories: [
      { slug: "protirochnyj-material", title: "Протирочный материал" },
      { slug: "gubki-applikatory", title: "Губки и аппликаторы" },
      { slug: "shchetki-kisti", title: "Щётки и кисти" },
      { slug: "raspyliteli-tara", title: "Распылители и тара" },
    ],
  },
  {
    slug: "plenka-i-instrumenty",
    title: "Плёнка и инструменты",
    tagline: "Антигравийная плёнка и инструмент для оклейки",
    icon: "🎞️",
    subcategories: [
      { slug: "plenka", title: "Плёнка" },
      { slug: "instrument", title: "Инструмент для оклейки" },
    ],
  },
  {
    slug: "nabory",
    title: "Наборы",
    tagline: "Готовые комплекты для старта и подарка",
    icon: "🎁",
    subcategories: [{ slug: "startovye", title: "Стартовые наборы" }],
  },
];

export const brands = [
  "Koch Chemie",
  "Shine Systems",
  "POLYTOP",
  "CarShine",
];

export const products: Product[] = [
  {
    slug: "shine-systems-easyfinish-200",
    title: "Shine Systems EasyFinish — мелкоабразивная полировальная паста, 200 мл",
    brand: "Shine Systems",
    price: 690,
    category: "polirovka",
    subcategory: "abrazivnye-pasty",
    volume: "200 мл",
    inStock: true,
    hit: true,
    rating: 4.8,
    reviews: 34,
    description:
      "Финишная мелкоабразивная паста для удаления голограмм и получения глубокого блеска на любых лаках. Не пылит, экономична.",
    specs: [
      { label: "Абразивность", value: "Мелкая (финиш)" },
      { label: "Объём", value: "200 мл" },
      { label: "Силикон", value: "Нет" },
    ],
  },
  {
    slug: "shine-systems-easyfinish-750",
    title: "Shine Systems EasyFinish — мелкоабразивная полировальная паста, 750 мл",
    brand: "Shine Systems",
    price: 2190,
    category: "polirovka",
    subcategory: "abrazivnye-pasty",
    volume: "750 мл",
    inStock: true,
    rating: 4.8,
    reviews: 21,
    description:
      "Профессиональный объём финишной пасты EasyFinish для студий детейлинга.",
    specs: [
      { label: "Абразивность", value: "Мелкая (финиш)" },
      { label: "Объём", value: "750 мл" },
    ],
  },
  {
    slug: "shine-systems-fastpolish-200",
    title: "Shine Systems FastPolish — среднеабразивная полировальная паста, 200 мл",
    brand: "Shine Systems",
    price: 890,
    category: "polirovka",
    subcategory: "abrazivnye-pasty",
    volume: "200 мл",
    inStock: true,
    hit: true,
    rating: 4.7,
    reviews: 28,
    description:
      "Универсальная среднеабразивная паста: убирает риски P1500–P2000 и сразу даёт хороший глянец.",
    specs: [
      { label: "Абразивность", value: "Средняя" },
      { label: "Объём", value: "200 мл" },
    ],
  },
  {
    slug: "shine-systems-powercut-200",
    title: "Shine Systems PowerCut — крупноабразивная полировальная паста, 200 мл",
    brand: "Shine Systems",
    price: 990,
    category: "polirovka",
    subcategory: "abrazivnye-pasty",
    volume: "200 мл",
    inStock: true,
    rating: 4.6,
    reviews: 19,
    description:
      "Крупноабразивная паста для быстрого снятия глубоких царапин и матовых лаков.",
    specs: [
      { label: "Абразивность", value: "Крупная (cut)" },
      { label: "Объём", value: "200 мл" },
    ],
  },
  {
    slug: "koch-chemie-h9-02-250",
    title: "Koch Chemie HEAVY CUT H9.02 — абразивная паста для твёрдых лаков, 250 мл",
    brand: "Koch Chemie",
    price: 1650,
    oldPrice: 1850,
    category: "polirovka",
    subcategory: "abrazivnye-pasty",
    volume: "250 мл",
    inStock: true,
    hit: true,
    rating: 4.9,
    reviews: 52,
    description:
      "Мощная режущая паста немецкого качества для керамических и твёрдых заводских лаков. Работает без пыли.",
    specs: [
      { label: "Абразивность", value: "Крупная (cut)" },
      { label: "Объём", value: "250 мл" },
      { label: "Страна", value: "Германия" },
    ],
  },
  {
    slug: "koch-chemie-f6-01-250",
    title: "Koch Chemie FINE CUT F6.01 — мелкозернистая полировальная паста, 250 мл",
    brand: "Koch Chemie",
    price: 1550,
    category: "polirovka",
    subcategory: "abrazivnye-pasty",
    volume: "250 мл",
    inStock: true,
    rating: 4.9,
    reviews: 40,
    description:
      "Полировальная паста для второго шага: убирает голограммы и матовость, даёт зеркальный блеск.",
    specs: [
      { label: "Абразивность", value: "Средняя/финиш" },
      { label: "Объём", value: "250 мл" },
      { label: "Страна", value: "Германия" },
    ],
  },
  {
    slug: "koch-chemie-p3-01-250",
    title: "Koch Chemie MICRO CUT & FINISH P3.01 — антиголограммная финишная паста, 250 мл",
    brand: "Koch Chemie",
    price: 1700,
    category: "polirovka",
    subcategory: "abrazivnye-pasty",
    volume: "250 мл",
    inStock: true,
    isNew: true,
    rating: 5.0,
    reviews: 12,
    description:
      "Финишная антиголограммная паста с воском карнауба. Идеальный результат в один проход на тёмных авто.",
    specs: [
      { label: "Абразивность", value: "Финиш" },
      { label: "Объём", value: "250 мл" },
      { label: "Воск карнауба", value: "Да" },
    ],
  },
  {
    slug: "polytop-diamant-2000-250",
    title: "POLYTOP Diamant 2000 Ultimate Cut — высокоабразивная паста P1000, 250 мл",
    brand: "POLYTOP",
    price: 1515,
    category: "polirovka",
    subcategory: "abrazivnye-pasty",
    volume: "250 мл",
    inStock: false,
    rating: 4.7,
    reviews: 8,
    description:
      "Высокорежущая паста с огромным ресурсом. Снимает риску P1000 и сразу выводит на глянец.",
    specs: [
      { label: "Абразивность", value: "Крупная (cut)" },
      { label: "Объём", value: "250 мл" },
    ],
  },
  {
    slug: "shine-systems-wool-pad-150",
    title: "Shine Systems полировальный круг из меха, 150 мм",
    brand: "Shine Systems",
    price: 720,
    category: "polirovka",
    subcategory: "krugi-i-pady",
    volume: "150 мм",
    inStock: true,
    hit: true,
    rating: 4.6,
    reviews: 17,
    description:
      "Режущий меховой круг для агрессивной полировки твёрдых лаков и глубоких дефектов.",
    specs: [
      { label: "Диаметр", value: "150 мм" },
      { label: "Тип", value: "Мех (cut)" },
    ],
  },
  {
    slug: "shine-systems-foam-pad-black-150",
    title: "Shine Systems поролоновый пад финишный чёрный, 150 мм",
    brand: "Shine Systems",
    price: 480,
    category: "polirovka",
    subcategory: "krugi-i-pady",
    volume: "150 мм",
    inStock: true,
    rating: 4.7,
    reviews: 23,
    description:
      "Мягкий финишный пад для антиголограммной полировки и нанесения защитных составов.",
    specs: [
      { label: "Диаметр", value: "150 мм" },
      { label: "Жёсткость", value: "Мягкий (финиш)" },
    ],
  },
  {
    slug: "backing-plate-125",
    title: "Подложка для полировальной машинки, 125 мм",
    brand: "Shine Systems",
    price: 990,
    category: "polirovka",
    subcategory: "podlozhki",
    volume: "125 мм",
    inStock: true,
    rating: 4.8,
    reviews: 15,
    description:
      "Опорная тарелка на липучке с мягким демпфером. Совместима с большинством роторных и эксцентриковых машинок.",
    specs: [
      { label: "Диаметр", value: "125 мм" },
      { label: "Крепление", value: "Липучка Velcro" },
    ],
  },
  {
    slug: "koch-chemie-glass-polish-250",
    title: "Koch Chemie GSP — паста для полировки стекла, 250 мл",
    brand: "Koch Chemie",
    price: 1990,
    category: "polirovka",
    subcategory: "polirovka-stekol",
    volume: "250 мл",
    inStock: true,
    rating: 4.9,
    reviews: 11,
    description:
      "Удаляет мелкие царапины, «дворники» и налёт со стекла, восстанавливает прозрачность.",
    specs: [
      { label: "Назначение", value: "Стекло, фары" },
      { label: "Объём", value: "250 мл" },
    ],
  },
  {
    slug: "koch-chemie-nsf-shampoo-1l",
    title: "Koch Chemie NanoMagic Shampoo — шампунь с эффектом лотоса, 1 л",
    brand: "Koch Chemie",
    price: 1290,
    category: "moyka-i-uhod",
    subcategory: "exterior",
    volume: "1 л",
    inStock: true,
    hit: true,
    rating: 4.9,
    reviews: 61,
    description:
      "Автошампунь с гидрофобным эффектом: вода скатывается, грязь держится меньше, блеск дольше.",
    specs: [
      { label: "Концентрат", value: "Да" },
      { label: "Эффект", value: "Гидрофоб" },
      { label: "Объём", value: "1 л" },
    ],
  },
  {
    slug: "shine-systems-active-foam-1l",
    title: "Shine Systems Active Foam — активная пена для бесконтактной мойки, 1 л",
    brand: "Shine Systems",
    price: 640,
    category: "moyka-i-uhod",
    subcategory: "exterior",
    volume: "1 л",
    inStock: true,
    isNew: true,
    rating: 4.7,
    reviews: 33,
    description:
      "Густая активная пена, бережно снимает дорожную грязь без контакта. Безопасна для ЛКП и защитных покрытий.",
    specs: [
      { label: "Тип", value: "Бесконтактная" },
      { label: "pH", value: "Нейтральный" },
      { label: "Объём", value: "1 л" },
    ],
  },
  {
    slug: "shine-systems-interior-cleaner-750",
    title: "Shine Systems очиститель салона универсальный, 750 мл",
    brand: "Shine Systems",
    price: 520,
    category: "moyka-i-uhod",
    subcategory: "interior",
    volume: "750 мл",
    inStock: true,
    rating: 4.6,
    reviews: 27,
    description:
      "Универсальный очиститель пластика, ткани и кожи. Без разводов и липкости, приятный аромат.",
    specs: [
      { label: "Поверхности", value: "Пластик, ткань, кожа" },
      { label: "Объём", value: "750 мл" },
    ],
  },
  {
    slug: "carshine-ceramic-coating-30",
    title: "CarShine керамическое покрытие 9H, 30 мл",
    brand: "CarShine",
    price: 3900,
    oldPrice: 4500,
    category: "moyka-i-uhod",
    subcategory: "keramika",
    volume: "30 мл",
    inStock: true,
    hit: true,
    isNew: true,
    rating: 4.8,
    reviews: 9,
    description:
      "Керамика 9H с защитой до 2 лет: гидрофоб, стойкость к химии и реагентам, глубокий блеск.",
    specs: [
      { label: "Твёрдость", value: "9H" },
      { label: "Ресурс", value: "до 2 лет" },
      { label: "Объём", value: "30 мл" },
    ],
  },
  {
    slug: "rupes-lhr15-mark3",
    title: "RUPES LHR 15 Mark III — эксцентриковая полировальная машинка",
    brand: "Shine Systems",
    price: 41900,
    oldPrice: 45900,
    category: "oborudovanie",
    subcategory: "polirovalnye-mashinki",
    inStock: true,
    hit: true,
    rating: 5.0,
    reviews: 7,
    description:
      "Легендарная эксцентриковая машинка с ходом 15 мм. Плавный пуск, минимум вибраций, ресурс на годы работы.",
    specs: [
      { label: "Ход", value: "15 мм" },
      { label: "Мощность", value: "500 Вт" },
      { label: "Тип", value: "Эксцентриковая" },
    ],
  },
  {
    slug: "turbo-dryer-2800",
    title: "Турбосушка для авто, 2800 Вт",
    brand: "CarShine",
    price: 18500,
    category: "oborudovanie",
    subcategory: "sushki-tornadory",
    inStock: true,
    rating: 4.7,
    reviews: 14,
    description:
      "Мощный поток тёплого воздуха выдувает воду из всех щелей — сушка без разводов и контакта с ЛКП.",
    specs: [
      { label: "Мощность", value: "2800 Вт" },
      { label: "Режимы", value: "2 скорости" },
    ],
  },
  {
    slug: "ozonator-10g",
    title: "Озонатор для устранения запахов, 10 г/ч",
    brand: "CarShine",
    price: 7900,
    category: "oborudovanie",
    subcategory: "sushki-tornadory",
    inStock: false,
    rating: 4.5,
    reviews: 6,
    description:
      "Убирает запахи табака, животных и плесени в салоне за 15–20 минут. Дезинфекция воздуха озоном.",
    specs: [
      { label: "Производительность", value: "10 г/ч" },
      { label: "Таймер", value: "Да" },
    ],
  },
  {
    slug: "microfiber-korea-40x40",
    title: "Микрофибра премиум 400 г/м², 40×40 см (5 шт)",
    brand: "CarShine",
    price: 890,
    category: "aksessuary",
    subcategory: "protirochnyj-material",
    inStock: true,
    hit: true,
    rating: 4.9,
    reviews: 88,
    description:
      "Плотная двусторонняя микрофибра без оверлока: не оставляет ворса и разводов, не царапает лак.",
    specs: [
      { label: "Плотность", value: "400 г/м²" },
      { label: "Размер", value: "40×40 см" },
      { label: "В упаковке", value: "5 шт" },
    ],
  },
  {
    slug: "applicator-foam-set",
    title: "Аппликаторы поролоновые для нанесения составов (10 шт)",
    brand: "CarShine",
    price: 320,
    category: "aksessuary",
    subcategory: "gubki-applikatory",
    inStock: true,
    rating: 4.6,
    reviews: 41,
    description:
      "Мягкие аппликаторы для равномерного нанесения восков, силантов и керамики.",
    specs: [
      { label: "В упаковке", value: "10 шт" },
      { label: "Материал", value: "Поролон" },
    ],
  },
  {
    slug: "detailing-brush-set",
    title: "Набор детейлинг-кистей для салона и дисков (5 шт)",
    brand: "CarShine",
    price: 1150,
    category: "aksessuary",
    subcategory: "shchetki-kisti",
    inStock: true,
    isNew: true,
    rating: 4.8,
    reviews: 19,
    description:
      "Кисти с мягкой синтетической щетиной и защищённым ободом — не царапают поверхности.",
    specs: [
      { label: "В наборе", value: "5 размеров" },
      { label: "Обод", value: "Защищённый" },
    ],
  },
  {
    slug: "sprayer-trigger-pro",
    title: "Триггер-распылитель профессиональный, химстойкий",
    brand: "CarShine",
    price: 290,
    category: "aksessuary",
    subcategory: "raspyliteli-tara",
    inStock: true,
    rating: 4.7,
    reviews: 52,
    description:
      "Химстойкий триггер с регулировкой факела. Держит агрессивную химию без закисания.",
    specs: [
      { label: "Резьба", value: "28/400" },
      { label: "Химстойкость", value: "Высокая" },
    ],
  },
  {
    slug: "ppf-film-glossy",
    title: "Антигравийная плёнка TPU глянцевая, погонный метр",
    brand: "CarShine",
    price: 2400,
    category: "plenka-i-instrumenty",
    subcategory: "plenka",
    inStock: true,
    rating: 4.8,
    reviews: 10,
    description:
      "Полиуретановая плёнка с эффектом самовосстановления. Защищает ЛКП от сколов и царапин.",
    specs: [
      { label: "Материал", value: "TPU" },
      { label: "Самовосстановление", value: "Да" },
    ],
  },
  {
    slug: "squeegee-pro",
    title: "Выгонка для оклейки плёнкой с фетром",
    brand: "CarShine",
    price: 350,
    category: "plenka-i-instrumenty",
    subcategory: "instrument",
    inStock: true,
    rating: 4.6,
    reviews: 22,
    description:
      "Ракель средней жёсткости с мягким фетром — выгоняет воду без царапин на плёнке.",
    specs: [
      { label: "Жёсткость", value: "Средняя" },
      { label: "Фетр", value: "Да" },
    ],
  },
  {
    slug: "starter-kit-home",
    title: "Стартовый набор для домашнего ухода за авто",
    brand: "CarShine",
    price: 4900,
    oldPrice: 6100,
    category: "nabory",
    subcategory: "startovye",
    inStock: true,
    hit: true,
    rating: 4.9,
    reviews: 31,
    description:
      "Всё для самостоятельного ухода: шампунь, микрофибра, аппликаторы, воск и защитный спрей в одном комплекте.",
    specs: [
      { label: "Предметов", value: "6" },
      { label: "Экономия", value: "≈ 1200 ₽" },
    ],
  },
];

// ---- helpers ----

export const productBySlug = (slug: string) =>
  products.find((p) => p.slug === slug);

export const categoryBySlug = (slug: string) =>
  categories.find((c) => c.slug === slug);

export const productsByCategory = (slug: string) =>
  products.filter((p) => p.category === slug);

export const hitProducts = () => products.filter((p) => p.hit);
export const newProducts = () => products.filter((p) => p.isNew);

export const relatedProducts = (p: Product, limit = 4) =>
  products
    .filter((x) => x.slug !== p.slug && x.category === p.category)
    .slice(0, limit);

export const formatPrice = (n: number) =>
  new Intl.NumberFormat("ru-RU").format(n) + " ₽";
