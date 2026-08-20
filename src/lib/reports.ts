import "server-only";
import { prisma } from "@/lib/db";

export type StatusMode = "active" | "all" | "done";

export type ReportLine = {
  date: Date;
  orderId: number;
  status: string;
  customer: string;
  phone: string;
  title: string;
  qty: number;
  price: number | null;
  sum: number;
};

export type TopProduct = { title: string; qty: number; revenue: number };
export type DayPoint = { day: string; revenue: number; orders: number };
export type StatusBreak = { status: string; orders: number; revenue: number };

export type Report = {
  from: Date;
  to: Date; // включительно (конец дня)
  statusMode: StatusMode;
  revenue: number;
  ordersCount: number;
  itemsCount: number;
  avgOrder: number;
  customers: number;
  lines: ReportLine[];
  topProducts: TopProduct[];
  byDay: DayPoint[];
  byStatus: StatusBreak[];
};

type RawItem = { title?: string; qty?: number; price?: number | null; sum?: number };

const STATUS_TITLES: Record<string, string> = {
  new: "Новый",
  processing: "В работе",
  done: "Выполнен",
  canceled: "Отменён",
};

export const statusTitle = (s: string) => STATUS_TITLES[s] ?? s;

function statusesFor(mode: StatusMode): string[] | undefined {
  if (mode === "done") return ["done"];
  if (mode === "active") return ["new", "processing", "done"];
  return undefined; // all
}

// Ключ дня по ЛОКАЛЬНОМУ времени сервера (а не UTC) — чтобы заказы и ось
// графика бакетировались одинаково независимо от часового пояса сервера.
function dayKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Считает отчёт по продажам за период [from, to] (to — включительно). */
export async function buildReport(
  from: Date,
  to: Date,
  statusMode: StatusMode
): Promise<Report> {
  const toEnd = new Date(to);
  toEnd.setHours(23, 59, 59, 999);

  const statuses = statusesFor(statusMode);
  const orders = await prisma.order.findMany({
    where: {
      createdAt: { gte: from, lte: toEnd },
      ...(statuses ? { status: { in: statuses } } : {}),
    },
    orderBy: { createdAt: "asc" },
  });

  const lines: ReportLine[] = [];
  const topMap = new Map<string, TopProduct>();
  const dayMap = new Map<string, DayPoint>();
  const statusMap = new Map<string, StatusBreak>();
  const phones = new Set<string>();

  let revenue = 0;
  let itemsCount = 0;

  for (const o of orders) {
    let items: RawItem[] = [];
    try {
      const parsed = JSON.parse(o.itemsJson);
      if (Array.isArray(parsed)) items = parsed;
    } catch {}

    let orderRevenue = 0;
    for (const it of items) {
      const title = String(it.title ?? "").trim() || "—";
      const qty = Math.max(0, Math.round(Number(it.qty) || 0));
      const price =
        it.price === null || it.price === undefined ? null : Math.round(Number(it.price) || 0);
      const sum = typeof it.sum === "number" ? it.sum : (price ?? 0) * qty;

      lines.push({
        date: o.createdAt,
        orderId: o.id,
        status: o.status,
        customer: o.name || "",
        phone: o.phone,
        title,
        qty,
        price,
        sum,
      });

      orderRevenue += sum;
      itemsCount += qty;

      const t = topMap.get(title) ?? { title, qty: 0, revenue: 0 };
      t.qty += qty;
      t.revenue += sum;
      topMap.set(title, t);
    }

    // Если позиции не распарсились — берём total заказа.
    if (items.length === 0) orderRevenue = o.total;

    revenue += orderRevenue;
    if (o.phone) phones.add(o.phone.replace(/\D/g, ""));

    const dk = dayKey(o.createdAt);
    const dp = dayMap.get(dk) ?? { day: dk, revenue: 0, orders: 0 };
    dp.revenue += orderRevenue;
    dp.orders += 1;
    dayMap.set(dk, dp);

    const sb = statusMap.get(o.status) ?? { status: o.status, orders: 0, revenue: 0 };
    sb.orders += 1;
    sb.revenue += orderRevenue;
    statusMap.set(o.status, sb);
  }

  // Непрерывный ряд по дням (включая дни без продаж) — для графика.
  const byDay: DayPoint[] = [];
  const cursor = new Date(from);
  cursor.setHours(0, 0, 0, 0);
  const last = new Date(to);
  last.setHours(0, 0, 0, 0);
  let guard = 0;
  while (cursor <= last && guard < 4000) {
    const dk = dayKey(cursor);
    byDay.push(dayMap.get(dk) ?? { day: dk, revenue: 0, orders: 0 });
    cursor.setDate(cursor.getDate() + 1);
    guard++;
  }

  const topProducts = [...topMap.values()].sort((a, b) => b.revenue - a.revenue);
  const byStatus = [...statusMap.values()].sort((a, b) => b.revenue - a.revenue);
  const ordersCount = orders.length;

  return {
    from,
    to,
    statusMode,
    revenue,
    ordersCount,
    itemsCount,
    avgOrder: ordersCount ? Math.round(revenue / ordersCount) : 0,
    customers: phones.size,
    lines,
    topProducts,
    byDay,
    byStatus,
  };
}

/** Разбор query-параметров периода/статуса из URL админки. */
export function parseReportParams(sp: {
  from?: string;
  to?: string;
  preset?: string;
  status?: string;
}): { from: Date; to: Date; statusMode: StatusMode; preset: string } {
  const statusMode: StatusMode =
    sp.status === "all" ? "all" : sp.status === "done" ? "done" : "active";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const preset = sp.preset || (sp.from || sp.to ? "custom" : "30d");

  const parse = (s?: string): Date | null => {
    if (!s) return null;
    const d = new Date(s + "T00:00:00");
    return isNaN(d.getTime()) ? null : d;
  };

  let from: Date;
  let to: Date = new Date(today);

  switch (preset) {
    case "today":
      from = new Date(today);
      break;
    case "7d":
      from = new Date(today);
      from.setDate(from.getDate() - 6);
      break;
    case "month":
      from = new Date(today.getFullYear(), today.getMonth(), 1);
      break;
    case "prevmonth": {
      from = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      to = new Date(today.getFullYear(), today.getMonth(), 0);
      break;
    }
    case "year":
      from = new Date(today.getFullYear(), 0, 1);
      break;
    case "all":
      from = new Date(2020, 0, 1);
      break;
    case "custom": {
      from = parse(sp.from) ?? (() => { const d = new Date(today); d.setDate(d.getDate() - 30); return d; })();
      to = parse(sp.to) ?? new Date(today);
      break;
    }
    case "30d":
    default:
      from = new Date(today);
      from.setDate(from.getDate() - 29);
      break;
  }

  if (from > to) [from, to] = [to, from];
  return { from, to, statusMode, preset };
}
