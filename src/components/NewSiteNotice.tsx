"use client";

import { useEffect, useState } from "react";

// Баннер самоуничтожается после этой даты (~месяц с запуска).
const EXPIRES = new Date("2026-09-19T23:59:59+03:00").getTime();
const KEY = "carshine_new_site_notice";

export default function NewSiteNotice() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (Date.now() > EXPIRES) return; // срок вышел — не показываем
    if (localStorage.getItem(KEY)) return; // пользователь закрыл
    setShow(true);
  }, []);

  if (!show) return null;

  return (
    <div className="border-b border-gold/20 bg-gold/[0.06]">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2 text-xs text-fg-muted sm:text-[13px]">
        <span className="shrink-0 text-gold">🔔</span>
        <p className="flex-1 leading-snug">
          Это <b className="text-fg">новый официальный сайт CarShine26</b> — мы его обновили.
          Остерегайтесь подделок.
        </p>
        <button
          onClick={() => {
            try {
              localStorage.setItem(KEY, "1");
            } catch {}
            setShow(false);
          }}
          aria-label="Закрыть"
          className="shrink-0 rounded p-1 text-fg-dim transition-colors hover:text-fg"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
