import assert from "node:assert/strict";
import test from "node:test";

const templateRoot = new URL("../", import.meta.url);

async function loadWorker() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${Math.random()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker;
}

function createEnv() {
  const contacts = new Set();
  const inserts = [];

  return {
    inserts,
    env: {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
      DB: {
        prepare(sql) {
          if (/SELECT name, contact, source, created_at/.test(sql)) {
            return {
              async all() {
                return {
                  results: inserts.map((values) => ({
                    name: values[1],
                    contact: values[2],
                    source: values[4],
                    created_at: values[6],
                  })),
                };
              },
            };
          }

          assert.match(sql, /INSERT INTO waitlist_leads/);
          return {
            bind(...values) {
              return {
                async run() {
                  const normalizedContact = values[3];
                  if (contacts.has(normalizedContact)) {
                    throw new Error("UNIQUE constraint failed");
                  }
                  contacts.add(normalizedContact);
                  inserts.push(values);
                  return { success: true };
                },
              };
            },
          };
        },
      },
      WAITLIST_ADMIN_EMAIL: "owner@example.com",
    },
  };
}

const ctx = {
  waitUntil() {},
  passThroughOnException() {},
};

test("server-renders the approved version D copy without the waitlist UI", async () => {
  const worker = await loadWorker();
  const { env } = createEnv();
  const response = await worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    env,
    ctx,
  );

  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Разговор по душам/);
  assert.match(html, /на который отвечает/);
  assert.match(html, /Коротко о важном/);
  assert.equal((html.match(/Количество билетов/g) ?? []).length, 2);
  assert.equal((html.match(/Купить билет/g) ?? []).length, 2);
  assert.doesNotMatch(html, /Купить (?:<!-- -->)?1 билет/);
  assert.match(html, /href="#ticket"/);
  assert.match(html, /target="_blank"/);
  assert.match(html, /rel="noopener noreferrer"/);
  assert.match(html, /https:\/\/payform\.ru\/qsccfki\//);
  assert.doesNotMatch(html, /aria-disabled="true"/);
  assert.doesNotMatch(html, /Предварительный список|Оставить контакт/);
  assert.doesNotMatch(html, /Your site is taking shape|react-loading-skeleton/);
});

test("ticket quantities use fixed Prodamus links", async () => {
  const { readFile } = await import("node:fs/promises");
  const page = await readFile(new URL("app/page.tsx", templateRoot), "utf8");

  for (const link of [
    "qsccfki",
    "tbcd9NC",
    "5fcd9OZ",
    "5fcd9Ph",
    "5fcd9Pk",
    "5fcd9Pl",
  ]) {
    assert.match(page, new RegExp(`https://payform\\.ru/${link}/`));
  }
  assert.match(page, /selectedTicket\.quantity \* 2300/);
});

test("Yandex Metrica is prepared with Webvisor and one conversion goal", async () => {
  const { readFile } = await import("node:fs/promises");
  const metrika = await readFile(
    new URL("app/YandexMetrika.tsx", templateRoot),
    "utf8",
  );
  const analytics = await readFile(
    new URL("app/analytics.ts", templateRoot),
    "utf8",
  );

  assert.match(metrika, /mc\.yandex\.ru\/metrika\/tag\.js/);
  assert.match(metrika, /111267605/);
  assert.match(metrika, /ssr:true/);
  assert.match(metrika, /clickmap:true/);
  assert.match(metrika, /trackLinks:true/);
  assert.match(metrika, /webvisor:true/);
  assert.match(metrika, /ecommerce:\"dataLayer\"/);
  assert.match(analytics, /telegram_click/);
  assert.match(analytics, /ticket_click/);
  assert.match(analytics, /111267605/);
});

test("waitlist endpoint stores a consented contact", async () => {
  const worker = await loadWorker();
  const { env, inserts } = createEnv();
  const response = await worker.fetch(
    new Request("http://localhost/api/waitlist", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: " Вадим ",
        contact: " Test@Example.com ",
        consent: true,
      }),
    }),
    env,
    ctx,
  );

  assert.equal(response.status, 201);
  assert.equal(inserts.length, 1);
  assert.equal(inserts[0][1], "Вадим");
  assert.equal(inserts[0][2], "Test@Example.com");
  assert.equal(inserts[0][3], "email:test@example.com");
});

test("waitlist endpoint treats duplicate contacts as success", async () => {
  const worker = await loadWorker();
  const { env, inserts } = createEnv();
  const payload = JSON.stringify({
    contact: "@JazzGuest",
    consent: true,
  });

  const first = await worker.fetch(
    new Request("http://localhost/api/waitlist", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: payload,
    }),
    env,
    ctx,
  );
  const duplicate = await worker.fetch(
    new Request("http://localhost/api/waitlist", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: payload,
    }),
    env,
    ctx,
  );

  assert.equal(first.status, 201);
  assert.equal(duplicate.status, 200);
  assert.equal(inserts.length, 1);
  assert.match(
    (await duplicate.json()).message,
    /уже есть в предварительном списке/,
  );
});

test("waitlist endpoint rejects invalid or unconsented contacts", async () => {
  const worker = await loadWorker();
  const { env, inserts } = createEnv();

  const invalid = await worker.fetch(
    new Request("http://localhost/api/waitlist", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ contact: "not-a-contact", consent: true }),
    }),
    env,
    ctx,
  );
  const unconsented = await worker.fetch(
    new Request("http://localhost/api/waitlist", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ contact: "test@example.com", consent: false }),
    }),
    env,
    ctx,
  );

  assert.equal(invalid.status, 400);
  assert.equal(unconsented.status, 400);
  assert.equal(inserts.length, 0);
});

test("waitlist endpoint allows the GitHub Pages origin only", async () => {
  const worker = await loadWorker();
  const { env } = createEnv();
  const allowedOrigin = "https://vbondarenko7.github.io";
  const payload = JSON.stringify({
    contact: "visitor@example.com",
    consent: true,
  });

  const preflight = await worker.fetch(
    new Request("http://localhost/api/waitlist", {
      method: "OPTIONS",
      headers: { origin: allowedOrigin },
    }),
    env,
    ctx,
  );
  const allowed = await worker.fetch(
    new Request("http://localhost/api/waitlist", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        origin: allowedOrigin,
      },
      body: payload,
    }),
    env,
    ctx,
  );
  const blocked = await worker.fetch(
    new Request("http://localhost/api/waitlist", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        origin: "https://example.com",
      },
      body: JSON.stringify({
        contact: "visitor-two@example.com",
        consent: true,
      }),
    }),
    env,
    ctx,
  );

  assert.equal(preflight.status, 204);
  assert.equal(
    preflight.headers.get("access-control-allow-origin"),
    allowedOrigin,
  );
  assert.equal(allowed.status, 201);
  assert.equal(allowed.headers.get("access-control-allow-origin"), allowedOrigin);
  assert.equal(blocked.status, 201);
  assert.equal(blocked.headers.get("access-control-allow-origin"), null);
});

test("waitlist export is owner-only and returns a CSV", async () => {
  const worker = await loadWorker();
  const { env } = createEnv();
  const payload = JSON.stringify({
    name: "Гость",
    contact: "guest@example.com",
    consent: true,
  });

  await worker.fetch(
    new Request("http://localhost/api/waitlist", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: payload,
    }),
    env,
    ctx,
  );

  const anonymous = await worker.fetch(
    new Request("http://localhost/api/waitlist"),
    env,
    ctx,
  );
  const stranger = await worker.fetch(
    new Request("http://localhost/api/waitlist", {
      headers: { "oai-authenticated-user-email": "stranger@example.com" },
    }),
    env,
    ctx,
  );
  const owner = await worker.fetch(
    new Request("http://localhost/api/waitlist", {
      headers: { "oai-authenticated-user-email": "owner@example.com" },
    }),
    env,
    ctx,
  );

  assert.equal(anonymous.status, 302);
  assert.match(
    anonymous.headers.get("location") ?? "",
    /signin-with-chatgpt/,
  );
  assert.equal(stranger.status, 403);
  assert.equal(owner.status, 200);
  assert.match(owner.headers.get("content-type") ?? "", /^text\/csv/);
  assert.match(await owner.text(), /Гость.*guest@example\.com/);
});

test("generated migration creates the waitlist table and unique contact index", async () => {
  const { readFile } = await import("node:fs/promises");
  const migration = await readFile(
    new URL("drizzle/0000_deep_guardsmen.sql", templateRoot),
    "utf8",
  );

  assert.match(migration, /CREATE TABLE `waitlist_leads`/);
  assert.match(
    migration,
    /CREATE UNIQUE INDEX `waitlist_leads_contact_normalized_unique`/,
  );
});
