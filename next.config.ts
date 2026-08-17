import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Самодостаточная сборка: на сервер уезжает ~150–200 МБ вместо всего node_modules.
  // Собираем локально/в CI и заливаем — под 1 ГБ ОЗУ это обязательно.
  output: "standalone",
  images: {
    // На время разработки фото берём с оригинала (tildacdn). При переезде
    // на свой хостинг добавим сюда его хост и переключим пути в данных.
    remotePatterns: [
      { protocol: "https", hostname: "static.tildacdn.com", pathname: "/**" },
      { protocol: "https", hostname: "optim.tildacdn.com", pathname: "/**" },
    ],
  },
};

export default nextConfig;
