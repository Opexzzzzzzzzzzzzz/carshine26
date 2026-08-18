"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const POLL_MS = 15000;
const BASE_TITLE = "Панель CarShine";

export default function OrderNotifier() {
  const [count, setCount] = useState(0); // сколько новых пришло с момента открытия
  const [perm, setPerm] = useState<NotificationPermission | "unsupported">("default");
  const seenId = useRef<number | null>(null);

  // текущее состояние разрешения
  useEffect(() => {
    if (typeof Notification === "undefined") setPerm("unsupported");
    else setPerm(Notification.permission);
  }, []);

  // опрос новых заказов
  useEffect(() => {
    let stop = false;
    let timer: ReturnType<typeof setTimeout>;

    async function poll() {
      try {
        const res = await fetch("/api/admin/orders/latest", { cache: "no-store" });
        if (res.ok) {
          const { latestId } = (await res.json()) as { latestId: number };
          if (seenId.current === null) {
            seenId.current = latestId; // базовая точка при открытии
          } else if (latestId > seenId.current) {
            const delta = latestId - seenId.current;
            seenId.current = latestId;
            setCount((c) => c + delta);
            fireAlert(latestId);
          }
        }
      } catch {}
      if (!stop) timer = setTimeout(poll, POLL_MS);
    }
    poll();
    return () => {
      stop = true;
      clearTimeout(timer);
    };
  }, []);

  // мигание заголовка вкладки
  useEffect(() => {
    document.title = count > 0 ? `(${count}) Новый заказ! — CarShine` : BASE_TITLE;
  }, [count]);

  const enableNotifications = async () => {
    try {
      const p = await Notification.requestPermission();
      setPerm(p);
    } catch {}
  };

  return (
    <>
      {/* Кнопка включения браузерных уведомлений */}
      {perm === "default" && (
        <button
          onClick={enableNotifications}
          className="rounded-lg border border-border-strong px-2.5 py-1.5 text-xs text-fg-muted hover:border-gold hover:text-gold"
          title="Разрешить уведомления браузера"
        >
          🔔 Уведомления
        </button>
      )}

      {/* Плашка о новых заказах */}
      {count > 0 && (
        <Link
          href="/admin/orders"
          onClick={() => setCount(0)}
          className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-2xl border border-gold/40 bg-surface px-5 py-4 shadow-2xl transition-transform hover:-translate-y-0.5"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/15 text-xl">🔔</span>
          <span>
            <span className="block font-semibold text-gold">
              {count === 1 ? "Новый заказ!" : `Новых заказов: ${count}`}
            </span>
            <span className="block text-xs text-fg-muted">Нажмите, чтобы открыть «Заказы»</span>
          </span>
        </Link>
      )}
    </>
  );
}

// звук + браузерное уведомление
function fireAlert(latestId: number) {
  beep();
  try {
    if (typeof Notification !== "undefined" && Notification.permission === "granted") {
      new Notification("Новый заказ — CarShine", {
        body: `Заказ #${latestId}. Откройте админку → Заказы.`,
      });
    }
  } catch {}
}

function beep() {
  try {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.connect(g);
    g.connect(ctx.destination);
    o.type = "sine";
    o.frequency.value = 880;
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
    o.start();
    o.stop(ctx.currentTime + 0.42);
  } catch {}
}
