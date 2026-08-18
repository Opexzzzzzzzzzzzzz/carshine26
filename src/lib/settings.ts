import "server-only";
import { prisma } from "@/lib/db";

export async function getSetting(key: string): Promise<string> {
  const row = await prisma.setting.findUnique({ where: { key } });
  return row?.value ?? "";
}

export async function setSetting(key: string, value: string): Promise<void> {
  await prisma.setting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
}

// Конфиг Telegram: сначала из БД (настраивается в админке), потом из .env.
export async function getTelegramConfig(): Promise<{
  token: string;
  chatId: string;
}> {
  const [token, chatId] = await Promise.all([
    getSetting("telegram_bot_token"),
    getSetting("telegram_chat_id"),
  ]);
  return {
    token: token || process.env.TELEGRAM_BOT_TOKEN || "",
    chatId: chatId || process.env.TELEGRAM_CHAT_ID || "",
  };
}
