import { getSetting } from "@/lib/settings";
import { saveTelegram, detectChatId, testTelegram } from "../../settings-actions";

export const dynamic = "force-dynamic";

const inputCls =
  "w-full rounded-lg border border-border-strong bg-bg px-3 py-2.5 text-sm outline-none focus:border-gold font-mono";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{
    saved?: string;
    detected?: string;
    test?: string;
    err?: string;
  }>;
}) {
  const sp = await searchParams;
  const [token, chatId] = await Promise.all([
    getSetting("telegram_bot_token"),
    getSetting("telegram_chat_id"),
  ]);
  const configured = Boolean(token && chatId);

  const errText: Record<string, string> = {
    notoken: "Сначала введите токен бота и нажмите «Сохранить».",
    nochat: "Не нашёл чат. Напишите боту в Telegram /start и попробуйте снова.",
    incomplete: "Заполните и сохраните токен и chat_id.",
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Уведомления</h1>
        <p className="mt-1 text-sm text-fg-muted">
          Новые заказы звучат и всплывают прямо в этой панели, пока она открыта, и всегда видны в разделе «Заказы».
        </p>
      </div>

      <div className="rounded-lg bg-danger/10 px-4 py-3 text-sm text-danger">
        Telegram с текущего хостинга заблокирован провайдером — прямая отправка не работает.
        Блок ниже пригодится, только если позже подключим внешний релей. Основной канал сейчас —
        уведомления в самой панели (кнопка «🔔 Уведомления» вверху разрешает всплывающие оповещения браузера).
      </div>

      <h2 className="pt-2 font-display text-lg font-bold text-fg-muted">Telegram (опционально, требует релей)</h2>

      <div className="flex items-center gap-2 text-sm">
        <span className={`h-2.5 w-2.5 rounded-full ${configured ? "bg-success" : "bg-fg-dim"}`} />
        {configured ? (
          <span className="text-success">Бот подключён — заявки приходят в Telegram</span>
        ) : (
          <span className="text-fg-muted">Бот не настроен — заявки пока только в разделе «Заказы»</span>
        )}
      </div>

      {sp.saved && <Msg ok>Сохранено</Msg>}
      {sp.detected && <Msg ok>chat_id определён: {sp.detected}</Msg>}
      {sp.test === "ok" && <Msg ok>Тестовое сообщение отправлено — проверьте Telegram</Msg>}
      {sp.test === "fail" && <Msg>Не удалось отправить. Проверьте токен и chat_id.</Msg>}
      {sp.err && <Msg>{errText[sp.err] ?? "Ошибка"}</Msg>}

      {/* Инструкция */}
      <ol className="surface-card space-y-2 rounded-2xl p-5 text-sm text-fg-muted">
        <li>1. В Telegram напишите <b className="text-fg">@BotFather</b> → команда <b className="text-fg">/newbot</b> → получите токен.</li>
        <li>2. Вставьте токен ниже и нажмите <b className="text-fg">«Сохранить»</b>.</li>
        <li>3. Напишите своему новому боту в Telegram <b className="text-fg">/start</b> (обязательно — иначе бот не сможет вам писать).</li>
        <li>4. Нажмите <b className="text-fg">«Определить chat_id»</b> — подставится автоматически.</li>
        <li>5. Нажмите <b className="text-fg">«Отправить тест»</b> — должно прийти сообщение.</li>
      </ol>

      {/* Форма сохранения */}
      <form action={saveTelegram} className="surface-card space-y-4 rounded-2xl p-5">
        <label className="block">
          <span className="mb-1 block text-xs text-fg-muted">Токен бота (от @BotFather)</span>
          <input name="token" defaultValue={token} placeholder="7712345678:AAH..." className={inputCls} />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs text-fg-muted">chat_id (заполнится кнопкой ниже)</span>
          <input name="chatId" defaultValue={chatId} placeholder="напр. 123456789" className={inputCls} />
        </label>
        <button className="rounded-xl bg-gold px-6 py-3 font-semibold text-black hover:bg-gold-2">
          Сохранить
        </button>
      </form>

      {/* Кнопки-помощники */}
      <div className="flex flex-wrap gap-3">
        <form action={detectChatId}>
          <button className="rounded-xl border border-border-strong px-5 py-2.5 text-sm text-fg-muted hover:border-gold hover:text-gold">
            Определить chat_id
          </button>
        </form>
        <form action={testTelegram}>
          <button className="rounded-xl border border-gold/40 bg-gold/10 px-5 py-2.5 text-sm font-semibold text-gold hover:bg-gold/20">
            Отправить тест
          </button>
        </form>
      </div>
    </div>
  );
}

function Msg({ children, ok }: { children: React.ReactNode; ok?: boolean }) {
  return (
    <div className={`rounded-lg px-4 py-2.5 text-sm ${ok ? "bg-success/10 text-success" : "bg-danger/10 text-danger"}`}>
      {children}
    </div>
  );
}
