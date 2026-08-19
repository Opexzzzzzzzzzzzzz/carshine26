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

  return (
    <div>
      <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-[#f4f4f2]">
        <Image
          src={list[active]}
          alt={title}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
          unoptimized={list[active].startsWith("/")}
          className="object-contain p-6"
        />
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
