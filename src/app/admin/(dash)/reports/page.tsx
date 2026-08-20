import { formatPrice } from "@/lib/shop";
import { buildReport, parseReportParams, statusTitle, type Report } from "@/lib/reports";
import { StatusPill } from "../page";

export const dynamic = "force-dynamic";

const PRESETS: [string, string][] = [
  ["today", "Сегодня"],
  ["7d", "7 дней"],
  ["30d", "30 дней"],
  ["month", "Этот месяц"],
  ["prevmonth", "Прошлый месяц"],
  ["year", "Этот год"],
  ["all", "Всё время"],
];

const STATUS_OPTIONS: [string, string][] = [
  ["active", "Без отменённых"],
  ["done", "Только выполненные"],
  ["all", "Все статусы"],
];

const iso = (d: Date) => d.toISOString().slice(0, 10);
const fmtDay = (d: string) =>
  new Date(d + "T00:00:00").toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit" });

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string; preset?: string; status?: string }>;
}) {
  const sp = await searchParams;
  const { from, to, statusMode, preset } = parseReportParams(sp);
  const report = await buildReport(from, to, statusMode);

  const statusQ = `status=${statusMode}`;
  const exportHref =
    `/api/admin/reports/export?preset=${preset}&${statusQ}` +
    (preset === "custom" ? `&from=${iso(from)}&to=${iso(to)}` : "");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">Отчёты по продажам</h1>
          <p className="mt-1 text-sm text-fg-muted">
            {from.toLocaleDateString("ru-RU")} — {to.toLocaleDateString("ru-RU")} ·{" "}
            {STATUS_OPTIONS.find((s) => s[0] === statusMode)?.[1]}
          </p>
        </div>
        <a
          href={exportHref}
          className="inline-flex items-center gap-2 rounded-xl bg-gold px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-gold-2"
        >
          <ExcelIcon /> Экспорт в Excel
        </a>
      </div>

      {/* Пресеты периода */}
      <div className="flex flex-wrap gap-2">
        {PRESETS.map(([key, label]) => {
          const active = preset === key;
          return (
            <a
              key={key}
              href={`/admin/reports?preset=${key}&${statusQ}`}
              className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${
                active
                  ? "bg-gold text-black"
                  : "border border-border-strong text-fg-muted hover:border-gold hover:text-gold"
              }`}
            >
              {label}
            </a>
          );
        })}
      </div>

      {/* Произвольный период + статус */}
      <form method="GET" className="surface-card flex flex-wrap items-end gap-3 rounded-2xl p-4">
        <input type="hidden" name="preset" value="custom" />
        <label className="block">
          <span className="mb-1 block text-xs text-fg-muted">С даты</span>
          <input
            type="date"
            name="from"
            defaultValue={iso(from)}
            className="rounded-lg border border-border-strong bg-bg px-3 py-2 text-sm outline-none focus:border-gold"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-fg-muted">По дату</span>
          <input
            type="date"
            name="to"
            defaultValue={iso(to)}
            className="rounded-lg border border-border-strong bg-bg px-3 py-2 text-sm outline-none focus:border-gold"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-fg-muted">Статусы</span>
          <select
            name="status"
            defaultValue={statusMode}
            className="rounded-lg border border-border-strong bg-bg px-3 py-2 text-sm outline-none focus:border-gold"
          >
            {STATUS_OPTIONS.map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </label>
        <button className="rounded-lg bg-surface-2 px-4 py-2 text-sm font-medium text-fg hover:text-gold">
          Показать
        </button>
      </form>

      {/* KPI */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Kpi label="Выручка" value={formatPrice(report.revenue)} accent />
        <Kpi label="Заказов" value={report.ordersCount.toLocaleString("ru-RU")} />
        <Kpi label="Средний чек" value={formatPrice(report.avgOrder)} />
        <Kpi label="Товаров продано" value={report.itemsCount.toLocaleString("ru-RU")} />
        <Kpi label="Клиентов" value={report.customers.toLocaleString("ru-RU")} />
      </div>

      {/* График выручки по дням */}
      <div className="surface-card rounded-2xl p-5">
        <h3 className="mb-4 font-semibold">Выручка по дням</h3>
        <RevenueChart report={report} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Топ товаров */}
        <div className="surface-card overflow-hidden rounded-2xl">
          <div className="border-b border-border p-4 font-semibold">Топ товаров</div>
          {report.topProducts.length === 0 ? (
            <div className="p-8 text-center text-fg-muted">Нет данных за период</div>
          ) : (
            <div className="scroll-thin max-h-96 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-surface text-left text-xs uppercase tracking-wider text-fg-dim">
                  <tr>
                    <th className="p-3 font-medium">Товар</th>
                    <th className="p-3 text-right font-medium">Кол-во</th>
                    <th className="p-3 text-right font-medium">Выручка</th>
                  </tr>
                </thead>
                <tbody>
                  {report.topProducts.slice(0, 50).map((p) => (
                    <tr key={p.title} className="border-t border-border/60">
                      <td className="p-3">{p.title}</td>
                      <td className="p-3 text-right text-fg-muted">{p.qty}</td>
                      <td className="p-3 text-right font-medium">{formatPrice(p.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* По статусам */}
        <div className="surface-card overflow-hidden rounded-2xl">
          <div className="border-b border-border p-4 font-semibold">По статусам заказов</div>
          {report.byStatus.length === 0 ? (
            <div className="p-8 text-center text-fg-muted">Нет данных за период</div>
          ) : (
            <table className="w-full text-sm">
              <tbody>
                {report.byStatus.map((s) => (
                  <tr key={s.status} className="border-t border-border/60 first:border-t-0">
                    <td className="p-3"><StatusPill status={s.status} /></td>
                    <td className="p-3 text-right text-fg-muted">{s.orders} зак.</td>
                    <td className="p-3 text-right font-medium">{formatPrice(s.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Детализация */}
      <div className="surface-card overflow-hidden rounded-2xl">
        <div className="flex items-center justify-between border-b border-border p-4">
          <h3 className="font-semibold">Детализация продаж</h3>
          <span className="text-sm text-fg-dim">{report.lines.length} строк</span>
        </div>
        {report.lines.length === 0 ? (
          <div className="p-8 text-center text-fg-muted">Нет продаж за выбранный период</div>
        ) : (
          <div className="scroll-thin max-h-[32rem] overflow-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead className="sticky top-0 bg-surface text-left text-xs uppercase tracking-wider text-fg-dim">
                <tr>
                  <th className="p-3 font-medium">Дата</th>
                  <th className="p-3 font-medium">№</th>
                  <th className="p-3 font-medium">Товар</th>
                  <th className="p-3 text-right font-medium">Кол-во</th>
                  <th className="p-3 text-right font-medium">Цена</th>
                  <th className="p-3 text-right font-medium">Сумма</th>
                  <th className="p-3 font-medium">Статус</th>
                </tr>
              </thead>
              <tbody>
                {report.lines.slice(0, 300).map((l, i) => (
                  <tr key={i} className="border-t border-border/60">
                    <td className="whitespace-nowrap p-3 text-fg-muted">
                      {new Date(l.date).toLocaleDateString("ru-RU")}
                    </td>
                    <td className="p-3 text-fg-muted">#{l.orderId}</td>
                    <td className="p-3">{l.title}</td>
                    <td className="p-3 text-right text-fg-muted">{l.qty}</td>
                    <td className="p-3 text-right text-fg-muted">{formatPrice(l.price)}</td>
                    <td className="p-3 text-right font-medium">{formatPrice(l.sum)}</td>
                    <td className="p-3"><StatusPill status={l.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {report.lines.length > 300 && (
              <div className="border-t border-border p-3 text-center text-xs text-fg-dim">
                Показаны первые 300 строк. Полные данные — в экспорте Excel.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Kpi({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`surface-card rounded-2xl p-5 ${accent ? "ring-1 ring-gold/30" : ""}`}>
      <div className="text-xs text-fg-dim">{label}</div>
      <div className={`mt-2 font-display text-xl font-bold ${accent ? "text-gold-gradient" : ""}`}>
        {value}
      </div>
    </div>
  );
}

function RevenueChart({ report }: { report: Report }) {
  const data = report.byDay;
  if (data.length === 0) return <div className="text-sm text-fg-muted">Нет данных.</div>;

  const W = 900;
  const H = 200;
  const pad = { top: 10, right: 8, bottom: 22, left: 8 };
  const innerW = W - pad.left - pad.right;
  const innerH = H - pad.top - pad.bottom;
  const max = Math.max(1, ...data.map((d) => d.revenue));
  const n = data.length;
  const gap = n > 60 ? 1 : 3;
  const bw = Math.max(1, innerW / n - gap);

  // Метки по оси X: первый, средний, последний.
  const labelIdx = new Set([0, Math.floor(n / 2), n - 1]);

  return (
    <div className="scroll-thin overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-52 w-full min-w-[560px]" preserveAspectRatio="none">
        {data.map((d, i) => {
          const h = (d.revenue / max) * innerH;
          const x = pad.left + (innerW / n) * i;
          const y = pad.top + innerH - h;
          return (
            <rect
              key={d.day}
              x={x}
              y={y}
              width={bw}
              height={h}
              rx={bw > 4 ? 2 : 0}
              fill="var(--gold)"
              opacity={0.85}
            >
              <title>{`${fmtDay(d.day)}: ${formatPrice(d.revenue)} (${d.orders} зак.)`}</title>
            </rect>
          );
        })}
        {data.map((d, i) =>
          labelIdx.has(i) ? (
            <text
              key={`l${i}`}
              x={pad.left + (innerW / n) * i + bw / 2}
              y={H - 6}
              textAnchor="middle"
              fontSize="11"
              fill="var(--fg-dim)"
            >
              {fmtDay(d.day)}
            </text>
          ) : null
        )}
      </svg>
    </div>
  );
}

function ExcelIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M14 3v5h5M14 3l5 5v11a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h8Z" strokeLinejoin="round" />
      <path d="m9 12 4 5m0-5-4 5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
