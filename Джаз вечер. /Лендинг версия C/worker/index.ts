/** Cloudflare Worker entry point for the vinext-starter template. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";

interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

interface WaitlistPayload {
  name?: unknown;
  contact?: unknown;
  consent?: unknown;
  website?: unknown;
}

const json = (body: unknown, status = 200) =>
  Response.json(body, {
    status,
    headers: {
      "cache-control": "no-store",
    },
  });

function normalizeContact(contact: string) {
  const trimmed = contact.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const telegramPattern =
    /^(?:@|https?:\/\/t\.me\/)[a-zA-Z][a-zA-Z0-9_]{4,31}$/;

  if (emailPattern.test(trimmed)) {
    return {
      value: trimmed,
      normalized: `email:${trimmed.toLowerCase()}`,
    };
  }

  if (telegramPattern.test(trimmed)) {
    const username = trimmed
      .replace(/^https?:\/\/t\.me\//i, "")
      .replace(/^@/, "")
      .toLowerCase();
    return {
      value: trimmed,
      normalized: `telegram:${username}`,
    };
  }

  return null;
}

async function handleWaitlist(request: Request, env: Env) {
  if (request.method !== "POST") {
    return json({ message: "Метод не поддерживается." }, 405);
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 4096) {
    return json({ message: "Слишком большой запрос." }, 413);
  }

  let payload: WaitlistPayload;
  try {
    payload = (await request.json()) as WaitlistPayload;
  } catch {
    return json({ message: "Проверьте данные формы." }, 400);
  }

  if (typeof payload.website === "string" && payload.website.trim()) {
    return json(
      { message: "Готово. Мы сообщим, когда откроются продажи." },
      201,
    );
  }

  if (payload.consent !== true) {
    return json(
      { message: "Нужно согласие на сообщение о первом вечере." },
      400,
    );
  }

  if (typeof payload.contact !== "string" || payload.contact.length > 160) {
    return json({ message: "Укажите email или Telegram." }, 400);
  }

  const contact = normalizeContact(payload.contact);
  if (!contact) {
    return json(
      { message: "Укажите корректный email или Telegram в формате @username." },
      400,
    );
  }

  const name =
    typeof payload.name === "string" && payload.name.trim()
      ? payload.name.trim().slice(0, 80)
      : null;
  const now = new Date().toISOString();

  try {
    await env.DB.prepare(
      `INSERT INTO waitlist_leads
        (id, name, contact, contact_normalized, source, consent_at, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
    )
      .bind(
        crypto.randomUUID(),
        name,
        contact.value,
        contact.normalized,
        "prelaunch-version-d",
        now,
        now,
      )
      .run();

    return json(
      { message: "Готово. Мы сообщим, когда откроются продажи." },
      201,
    );
  } catch (error) {
    if (
      error instanceof Error &&
      /unique|constraint/i.test(error.message)
    ) {
      return json({
        message: "Этот контакт уже есть в предварительном списке.",
      });
    }

    console.error("waitlist insert failed", error);
    return json(
      { message: "Не удалось сохранить контакт. Попробуйте ещё раз." },
      500,
    );
  }
}

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/waitlist") {
      return handleWaitlist(request, env);
    }

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      return handleImageOptimization(request, {
        fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
        transformImage: async (body, { width, format, quality }) => {
          const result = await env.IMAGES.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
          return result.response();
        },
      }, allowedWidths);
    }

    return handler.fetch(request, env, ctx);
  },
};

export default worker;
