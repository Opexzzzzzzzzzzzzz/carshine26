"use client";

import { useRef, useState } from "react";

const MAX_MB = 3;

export default function ImageUpload({
  name = "photo",
  defaultValue = "",
}: {
  name?: string;
  defaultValue?: string;
}) {
  const [url, setUrl] = useState(defaultValue);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setErr("");
    if (file.size > MAX_MB * 1024 * 1024) {
      setErr(`Файл больше ${MAX_MB} МБ (${(file.size / 1024 / 1024).toFixed(1)} МБ)`);
      if (fileRef.current) fileRef.current.value = "";
      return;
    }
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Ошибка загрузки");
      setUrl(data.url);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Ошибка загрузки");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-start gap-3">
        {/* превью */}
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border-strong bg-[#f4f4f2]">
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="" className="h-full w-full object-contain" />
          ) : (
            <span className="text-[10px] text-fg-dim">нет фото</span>
          )}
        </div>

        <div className="flex-1 space-y-2">
          <input
            name={name}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="URL картинки или загрузите файл ниже"
            className="w-full rounded-lg border border-border-strong bg-bg px-3 py-2.5 text-sm outline-none focus:border-gold"
          />
          <div className="flex items-center gap-3">
            <label className="cursor-pointer rounded-lg border border-border-strong px-3 py-2 text-sm text-fg-muted hover:border-gold hover:text-gold">
              {busy ? "Загрузка…" : "📁 Загрузить с компьютера"}
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={onFile}
                disabled={busy}
                className="hidden"
              />
            </label>
            {url && (
              <button
                type="button"
                onClick={() => setUrl("")}
                className="text-xs text-fg-dim hover:text-danger"
              >
                убрать фото
              </button>
            )}
          </div>
        </div>
      </div>
      {err && <div className="rounded-lg bg-danger/10 px-3 py-2 text-xs text-danger">{err}</div>}
      <p className="text-xs text-fg-dim">Максимальный размер файла — {MAX_MB} МБ. Форматы: JPG, PNG, WEBP, GIF.</p>
    </div>
  );
}
