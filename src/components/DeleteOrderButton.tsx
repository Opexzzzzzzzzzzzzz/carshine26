"use client";

import { deleteOrder } from "@/app/admin/actions";

export default function DeleteOrderButton({ id }: { id: number }) {
  return (
    <form
      action={deleteOrder}
      onSubmit={(e) => {
        if (!confirm(`Удалить заказ #${id} навсегда? Это действие необратимо.`)) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        title="Удалить заказ навсегда"
        className="rounded-lg border border-danger/40 px-2.5 py-1.5 text-xs text-danger hover:bg-danger/10"
      >
        Удалить
      </button>
    </form>
  );
}
