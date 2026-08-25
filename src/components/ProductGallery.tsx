"use client";

import Image from "next/image";
import { useState } from "react";

export default function ProductGallery({
  photos,
  title,
}: {
  photos: string[];
  title: string;
}) {
  const [active, setActive] = useState(0);
  const list = photos.length ? photos : [];

  if (!list.length) {
    return (
      <div className="flex aspect-square w-full items-center justify-center rounded-3xl bg-surface text-fg-dim">
        нет фото
      </div>
    );
  }

  const many = list.length > 1;
  const go = (dir: 1 | -1) => setActive((a) => (a + dir + list.length) % list.length);

  return (
    <div>
      <div
        className="group relative aspect-square w-full overflow-hidden rounded-3xl bg-[#f4f4f2]"
        onKeyDown={(e) => {
          if (!many) return;
          if (e.key === "ArrowRight") go(1);
          if (e.key === "ArrowLeft") go(-1);
        }}
        tabIndex={many ? 0 : -1}
      >
        <Image
          src={list[active]}
          alt={title}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
          unoptimized={list[active].startsWith("/")}
          className="object-contain p-6"
        />
        {many && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Предыдущее фото"
              className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm transition-all hover:bg-black/70 hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold sm:opacity-0 sm:group-hover:opacity-100"
            >
              <Chevron dir="left" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Следующее фото"
              className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm transition-all hover:bg-black/70 hover:text-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-gold sm:opacity-0 sm:group-hover:opacity-100"
            >
              <Chevron dir="right" />
            </button>
            <div className="absolute bottom-3 right-3 rounded-full bg-black/55 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
              {active + 1} / {list.length}
            </div>
          </>
        )}
      </div>
      {list.length > 1 && (
        <div className="mt-4 flex flex-wrap gap-3">
          {list.map((src, i) => (
            <button
              key={src + i}
              onClick={() => setActive(i)}
              className={`relative h-20 w-20 overflow-hidden rounded-xl bg-[#f4f4f2] transition-all ${
                i === active ? "ring-2 ring-gold" : "opacity-70 hover:opacity-100"
              }`}
            >
              <Image src={src} alt="" fill sizes="80px" unoptimized={src.startsWith("/")} className="object-contain p-1.5" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path
        d={dir === "left" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
