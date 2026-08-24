import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import { writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { randomBytes } from "node:crypto";

export const runtime = "nodejs";

// Лимит фото. В nginx выставлен client_max_body_size 6M (с запасом над этим).
export const MAX_MB = 5;
const MAX_BYTES = MAX_MB * 1024 * 1024;

const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export async function POST(req: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ ok: false, error: "Не авторизован" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "Файл не получен" }, { status: 400 });
  }
  const ext = EXT[file.type];
  if (!ext) {
    return NextResponse.json(
      { ok: false, error: "Только изображения: JPG, PNG, WEBP, GIF" },
      { status: 400 }
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { ok: false, error: `Файл больше ${MAX_MB} МБ (${(file.size / 1024 / 1024).toFixed(1)} МБ)` },
      { status: 400 }
    );
  }

  const buf = Buffer.from(await file.arrayBuffer());
  const dir = join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  const name = `${Date.now().toString(36)}-${randomBytes(4).toString("hex")}.${ext}`;
  await writeFile(join(dir, name), buf);

  return NextResponse.json({ ok: true, url: `/uploads/${name}` });
}
