declare global {
  interface Window {
    ym?: (...args: unknown[]) => void;
  }
}

const rawCounterId = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID ?? "";
const counterId = /^\d+$/.test(rawCounterId)
  ? Number.parseInt(rawCounterId, 10)
  : null;

export const METRIKA_GOALS = {
  telegramClick: "telegram_click",
} as const;

export function trackTelegramClick(placement: string) {
  if (typeof window === "undefined" || !counterId) {
    return;
  }

  window.ym?.(counterId, "reachGoal", METRIKA_GOALS.telegramClick, {
    placement,
  });
}
