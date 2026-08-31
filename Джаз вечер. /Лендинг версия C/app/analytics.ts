declare global {
  interface Window {
    ym?: (...args: unknown[]) => void;
    _tmr?: Record<string, unknown>[];
  }
}

const rawCounterId =
  process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID ?? "111267605";
const counterId = /^\d+$/.test(rawCounterId)
  ? Number.parseInt(rawCounterId, 10)
  : null;

const rawVkPixelId = process.env.NEXT_PUBLIC_VK_PIXEL_ID ?? "3790555";
const vkPixelId = /^\d+$/.test(rawVkPixelId) ? rawVkPixelId : null;

function trackVkGoal(goal: string) {
  if (typeof window === "undefined" || !vkPixelId) {
    return;
  }

  (window._tmr ||= []).push({ type: "reachGoal", id: vkPixelId, goal });
}

export const METRIKA_GOALS = {
  telegramClick: "telegram_click",
  whatsappClick: "whatsapp_click",
  ticketClick: "ticket_click",
  authorVideoOpen: "author_video_open",
} as const;

export function trackTelegramClick(placement: string) {
  if (typeof window === "undefined" || !counterId) {
    return;
  }

  window.ym?.(counterId, "reachGoal", METRIKA_GOALS.telegramClick, {
    placement,
  });
  trackVkGoal(METRIKA_GOALS.telegramClick);
}

export function trackWhatsAppClick(placement: string) {
  if (typeof window === "undefined" || !counterId) {
    return;
  }

  window.ym?.(counterId, "reachGoal", METRIKA_GOALS.whatsappClick, {
    placement,
  });
  trackVkGoal(METRIKA_GOALS.whatsappClick);
}

export function trackTicketClick(placement: string) {
  if (typeof window === "undefined" || !counterId) {
    return;
  }

  window.ym?.(counterId, "reachGoal", METRIKA_GOALS.ticketClick, {
    placement,
  });
  trackVkGoal(METRIKA_GOALS.ticketClick);
}

export function trackAuthorVideoOpen(placement: string) {
  if (typeof window === "undefined" || !counterId) {
    return;
  }

  window.ym?.(counterId, "reachGoal", METRIKA_GOALS.authorVideoOpen, {
    placement,
  });
  trackVkGoal(METRIKA_GOALS.authorVideoOpen);
}
