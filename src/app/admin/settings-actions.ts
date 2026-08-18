"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";
import { setSetting, getSetting, getTelegramConfig } from "@/lib/settings";

export async function saveTelegram(formData: FormData) {
  await requireAuth();
  await setSetting("telegram_bot_token", String(formData.get("token") || "").trim());
  await setSetting("telegram_chat_id", String(formData.get("chatId") || "").trim());
  revalidatePath("/admin/settings");
  redirect("/admin/settings?saved=1");
}

export async function detectChatId() {
  await requireAuth();
  const token = await getSetting("telegram_bot_token");
  if (!token) redirect("/admin/settings?err=notoken");

  let chatId = "";
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/getUpdates`);
    const data = await res.json();
    const updates: unknown[] = data?.result ?? [];
    for (let i = updates.length - 1; i >= 0; i--) {
      const u = updates[i] as Record<string, { chat?: { id?: number } }>;
      const c = u.message?.chat ?? u.my_chat_member?.chat ?? u.edited_message?.chat;
      if (c?.id) {
        chatId = String(c.id);
        break;
      }
    }
  } catch {}

  if (!chatId) redirect("/admin/settings?err=nochat");
  await setSetting("telegram_chat_id", chatId);
  revalidatePath("/admin/settings");
  redirect(`/admin/settings?detected=${chatId}`);
}

export async function testTelegram() {
  await requireAuth();
  const { token, chatId } = await getTelegramConfig();
  if (!token || !chatId) redirect("/admin/settings?err=incomplete");

  let ok = false;
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: "✅ CarShine: тестовое сообщение. Заявки с сайта будут приходить сюда.",
      }),
    });
    ok = res.ok;
  } catch {
    ok = false;
  }
  redirect(ok ? "/admin/settings?test=ok" : "/admin/settings?test=fail");
}
