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
    },
  };
}

const ctx = {
  waitUntil() {},
  passThroughOnException() {},
};

test("server-renders the version D prelaunch page", async () => {
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
  assert.match(html, /Разговор по душам/);
  assert.match(html, /Узнать о старте продаж/);
  assert.match(html, /Узнать дату первым/);
  assert.doesNotMatch(html, /Your site is taking shape|react-loading-skeleton/);
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
