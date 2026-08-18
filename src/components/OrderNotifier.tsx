"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const POLL_MS = 10000;
const BASE_TITLE = "Панель CarShine";

let audioCtx: AudioContext | null = null;
function ensureAudio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (Ctx) audioCtx = new Ctx();
  }
  if (audioCtx && audioCtx.state === "suspended") audioCtx.resume().catch(() => {});
  return audioCtx;
}

function beep() {
  const ctx = ensureAudio();
  if (!ctx) return;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.connect(g);
  g.connect(ctx.destination);
  o.type = "sine";
  o.frequency.value = 880;
  g.gain.setValueAtTime(0.0001, ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
  o.start();
  o.stop(ctx.currentTime + 0.52);
}

export default function OrderNotifier() {
  const router = useRouter();
  const [count, setCount] = useState(0);
  const [perm, setPerm] = useState<NotificationPermission | "unsupported">("default");
  const seenId = useRef<number | null>(null);

  useEffect(() => {
    setPerm(typeof Notification === "undefined" ? "unsupported" : Notification.permission);
    // разблокировка звука по первому взаимодействию
    const unlock = () => ensureAudio();
    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  useEffect(() => {
    let stop = false;
    let timer: ReturnType<typeof setTimeout>;
    async function poll() {
      try {
        const res = await fetch("/api/admin/orders/latest", { cache: "no-store" });
        if (res.ok) {
          const { latestId } = (await res.json()) as { latestId: number };
          if (seenId.current === null) {
            seenId.current = latestId;
          } else if (latestId > seenId.current) {
            const delta = latestId - seenId.current;
            seenId.current = latestId;
            setCount((c) => c + delta);
            beep();
            try {
              if (typeof Notification !== "undefined" && Notification.permission === "granted") {
                new Notification("Новый заказ — CarShine", {
                  body: `Заказ #${latestId}. Откройте «Заказы».`,
                });
              }
            } catch {}
            router.refresh(); // подтянуть свежие данные страницы без F5
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
  }, [router]);

  useEffect(() => {
    document.title = count > 0 ? `(${count}) Новый заказ! — CarShine` : BASE_TITLE;
  }, [count]);

  const enable = async () => {
    ensureAudio();
    beep(); // тестовый сигнал — сразу слышно, что звук работает
    try {
      const p = await Notification.requestPermission();
      setPerm(p);
    } catch {}
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <span className="hidden items-center gap-1.5 text-[11px] text-fg-dim sm:flex">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success/70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
          </span>
          слежу за заказами
        </span>
        {perm !== "granted" && perm !== "unsupported" && (
          <button
            onClick={enable}
            className="rounded-lg border border-border-strong px-2.5 py-1.5 text-xs text-fg-muted hover:border-gold hover:text-gold"
            title="Включить звук и уведомления"
          >
            🔔 Включить
          </button>
        )}
      </div>

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
