import "server-only";
import { categoryBySlug } from "@/lib/shop";

type Input = { title: string; brand: string; category: string };

// Шаблон-заглушка, пока не подключён ИИ (нет ключа).
function template({ title, brand, category }: Input): string {
  const cat = categoryBySlug(category)?.title ?? "автохимия";
  const b = brand ? `${brand} ` : "";
  return (
    `${b}${title} — товар из категории «${cat}» для профессионального и домашнего детейлинга. ` +
    `Обеспечивает качественный результат и удобство в работе. ` +
    `В наличии в CarShine, с доставкой по Ставрополю и всей России.\n\n` +
    `⚠️ Черновик описания (заглушка). Подключите ИИ (переменная GLM_API_KEY), чтобы генерировать полноценные тексты.`
  );
}

// Генерация описания через GLM (z.ai / bigmodel). Активируется, когда задан GLM_API_KEY.
export async function generateProductDescription(input: Input): Promise<string> {
  const key = process.env.GLM_API_KEY;
  if (!key) return template(input);

  const base = process.env.GLM_BASE_URL || "https://open.bigmodel.cn/api/paas/v4";
  const model = process.env.GLM_MODEL || "glm-4-flash";
  const cat = categoryBySlug(input.category)?.title ?? "";

  const prompt =
    `Напиши продающее описание товара для интернет-магазина автохимии и детейлинга. ` +
    `Товар: "${input.title}". Бренд: ${input.brand || "—"}. Категория: ${cat}. ` +
    `Требования: 3–5 предложений на русском, по делу, без воды и без выдуманных характеристик, ` +
    `упомяни назначение и пользу. Не используй markdown и заголовки. Только текст описания.`;

  try {
    const res = await fetch(`${base}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    });
    if (!res.ok) return template(input);
    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content?.trim();
    return text || template(input);
  } catch {
    return template(input);
  }
}
