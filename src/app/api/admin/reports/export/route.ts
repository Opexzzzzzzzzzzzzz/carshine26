import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import { buildReport, parseReportParams, statusTitle } from "@/lib/reports";
import { buildXlsx, type Cell } from "@/lib/xlsx";

export const dynamic = "force-dynamic";

function fmtDateTime(d: Date): string {
  return new Date(d).toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export async function GET(req: Request) {
  if (!(await isAuthed())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const url = new URL(req.url);
  const { from, to, statusMode } = parseReportParams({
    from: url.searchParams.get("from") ?? undefined,
    to: url.searchParams.get("to") ?? undefined,
    preset: url.searchParams.get("preset") ?? undefined,
    status: url.searchParams.get("status") ?? undefined,
  });

  const report = await buildReport(from, to, statusMode);

  const rows: Cell[][] = [];
  rows.push(["Дата", "Заказ №", "Статус", "Клиент", "Телефон", "Товар", "Кол-во", "Цена, ₽", "Сумма, ₽"]);
  for (const l of report.lines) {
    rows.push([
      fmtDateTime(l.date),
      l.orderId,
      statusTitle(l.status),
      l.customer,
      l.phone,
      l.title,
      l.qty,
      l.price,
      l.sum,
    ]);
  }
  // Итоговая строка.
  rows.push([]);
  rows.push(["Итого", "", "", "", "", "", report.itemsCount, "", report.revenue]);

  const buf = buildXlsx(rows, "Продажи");

  const fname = `carshine-report_${from.toISOString().slice(0, 10)}_${to
    .toISOString()
    .slice(0, 10)}.xlsx`;

  return new NextResponse(new Uint8Array(buf), {
    status: 200,
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${fname}"`,
      "Cache-Control": "no-store",
    },
  });
}
