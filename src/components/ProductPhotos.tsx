"use client";

import { useRef, useState } from "react";

const MAX_MB = 3;

/**
 * Галерея фото товара для админки.
 * Хранит массив URL, первый = главное фото.
 * Отдаёт скрытым полем `name` (по умолчанию "photos") JSON-массив URL.
 */
export default function ProductPhotos({
  name = "photos",
  defaultValue = [],
}: {
  name?: string;
  defaultValue?: string[];
}) {
  const [urls, setUrls] = useState<string[]>(defaultValue.filter(Boolean));
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  function update(next: string[]) {
    setUrls(next);
  }

  async function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setErr("");
    setBusy(true);
    const added: string[] = [];
    try {
      for (const file of files) {
        if (file.size > MAX_MB * 1024 * 1024) {
          setErr(`«${file.name}» больше ${MAX_MB} МБ (${(file.size / 1024 / 1024).toFixed(1)} МБ) — пропущен`);
          continue;
        }
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok || !data.ok) {
          setErr(data.error || "Ошибка загрузки");
          continue;
        }
        added.push(data.url);
      }
      if (added.length) update([...urls, ...added]);
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function removeAt(i: number) {
    update(urls.filter((_, idx) => idx !== i));
  }

  function makeMain(i: number) {
    if (i === 0) return;
    const next = [...urls];
    const [item] = next.splice(i, 1);
    next.unshift(item);
    update(next);
  }

  const clean = urls.map((u) => u.trim()).filter(Boolean);

  return (
    <div className="space-y-3">
      <input type="hidden" name={name} value={JSON.stringify(clean)} />

      {urls.length > 0 && (
        <div className="space-y-2">
          {urls.map((url, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border-strong bg-[#f4f4f2]">
                {url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={url} alt="" className="h-full w-full object-contain" />
                ) : (
                  <span className="text-[10px] text-fg-dim">нет фото</span>
                )}
                {i === 0 && (
                  <span className="absolute left-0 top-0 rounded-br-lg bg-gold px-1.5 py-0.5 text-[9px] font-semibold text-black">
                    главное
                  </span>
                )}
              </div>

              <div className="flex-1 space-y-2">
                <div className="truncate rounded-lg border border-border bg-bg px-3 py-2.5 text-xs text-fg-dim" title={url}>
                  {url || "нет фото"}
                </div>
                <div className="flex items-center gap-3 text-xs">
                  {i !== 0 && (
                    <button
                      type="button"
                      onClick={() => makeMain(i)}
                      className="text-fg-muted hover:text-gold"
                    >
                      сделать главным
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeAt(i)}
                    className="text-fg-dim hover:text-danger"
                  >
                    убрать
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <label className="cursor-pointer rounded-lg border border-border-strong px-3 py-2 text-sm text-fg-muted hover:border-gold hover:text-gold">
          {busy ? "Загрузка…" : "📁 Загрузить с компьютера"}
          <input
            ref={fileRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={onFiles}
            disabled={busy}
            className="hidden"
          />
        </label>
      </div>

      {err && <div className="rounded-lg bg-danger/10 px-3 py-2 text-xs text-danger">{err}</div>}
      <p className="text-xs text-fg-dim">
        Можно выбрать сразу несколько файлов. Первое фото — главное. Максимум {MAX_MB} МБ на файл. Форматы: JPG, PNG, WEBP, GIF.
      </p>
      <p className="text-xs text-fg-dim">
        Порядок меняется кнопкой «сделать главным».
      </p>
    </div>
  );
}
