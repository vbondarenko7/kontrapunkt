declare global {
  interface Window {
    ym?: (...args: unknown[]) => void;
  }
}

const rawCounterId =
  process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID ?? "111267605";
const counterId = /^\d+$/.test(rawCounterId)
  ? Number.parseInt(rawCounterId, 10)
  : null;

export const METRIKA_GOALS = {
  telegramClick: "telegram_click",
  whatsappClick: "whatsapp_click",
  ticketClick: "ticket_click",
} as const;

export function trackTelegramClick(placement: string) {
  if (typeof window === "undefined" || !counterId) {
    return;
  }

  window.ym?.(counterId, "reachGoal", METRIKA_GOALS.telegramClick, {
    placement,
  });
}

export function trackWhatsAppClick(placement: string) {
  if (typeof window === "undefined" || !counterId) {
    return;
  }

  window.ym?.(counterId, "reachGoal", METRIKA_GOALS.whatsappClick, {
    placement,
  });
}

export function trackTicketClick(placement: string) {
  if (typeof window === "undefined" || !counterId) {
    return;
  }

  window.ym?.(counterId, "reachGoal", METRIKA_GOALS.ticketClick, {
    placement,
  });
}
