// Группировка категорий в разделы меню (как на carshine26.ru).
// Чистые данные без импортов — используются и на клиенте, и в seed-скрипте.

export type Group = {
  slug: string;
  title: string;
  icon: string;
  categorySlugs: string[];
};

export const groups: Group[] = [
  {
    slug: "polirovka",
    title: "Полировка",
    icon: "✨",
    categorySlugs: [
      "abrazivnye-pasty-dlya-lkp",
      "polirovalnye-krugi-i-pady",
      "podlozhki-k-polirovalnikam",
      "sostavy-dlya-polirovki",
      "polirovka-stekol",
    ],
  },
  {
    slug: "moyka-i-uhod",
    title: "Мойка и уход",
    icon: "🧴",
    categorySlugs: [
      "shampuny-ruchnoy-moyki",
      "beskontaktnye-shampuny",
      "osushiteli-kuzova",
      "dolgovremennaya-zasshita-kuzova",
      "voski-poliroli-silanty-glejzy",
      "antidozhd",
      "ochestiteli-diskov-reziny-chroma",
      "ochistiteli-bituma-smol-kleya",
      "ochestiteli-motornogo-otseka",
      "sostavy-dlya-ochistki-kuzova",
      "sredstva-obsshej-khimchistki",
      "sredstva-dlya-kozhi",
      "sredstva-dlya-stekol",
      "ukhod-za-vinilom-i-plastikom",
      "ukhod-za-rezinoj-i-plastikom",
      "aromatizatory-i-avtoparfyum",
      "pyatnovyvoditeli-salona",
      "dymovye-shashki",
    ],
  },
  {
    slug: "aksessuary",
    title: "Аксессуары",
    icon: "🧽",
    categorySlugs: [
      "protirochnyj-material",
      "sshetki-i-kisti",
      "gubki-applikatory-rukavicy",
      "raspryskivateli-i-triggery",
      "butylki-emkosti-vedra",
      "avtoskraby-abrazivnye-mat-ly",
      "sredstva-individualnoj-zasshity",
      "ukryvochnye-materialy",
    ],
  },
  {
    slug: "oborudovanie",
    title: "Оборудование",
    icon: "⚙️",
    categorySlugs: [
      "polirovalnye-mashinki",
      "turbosushki-tornadory-ozonatory",
      "drugoe-oborudovanye",
    ],
  },
  {
    slug: "plenka-i-instrumenti",
    title: "Плёнка и инструменты",
    icon: "🎞️",
    categorySlugs: ["plenka-i-instrumenti", "sostavy-dlya-plenok"],
  },
  {
    slug: "nabori",
    title: "Наборы",
    icon: "🎁",
    categorySlugs: ["nabori"],
  },
];

export const groupByCategory: Record<string, string> = (() => {
  const m: Record<string, string> = {};
  for (const g of groups) for (const c of g.categorySlugs) m[c] = g.slug;
  return m;
})();
