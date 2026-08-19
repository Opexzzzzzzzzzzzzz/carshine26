import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
