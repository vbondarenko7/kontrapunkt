import { sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const waitlistLeads = sqliteTable(
  "waitlist_leads",
  {
    id: text("id").primaryKey(),
    name: text("name"),
    contact: text("contact").notNull(),
    contactNormalized: text("contact_normalized").notNull(),
    source: text("source").notNull(),
    consentAt: text("consent_at").notNull(),
    createdAt: text("created_at").notNull(),
  },
  (table) => [
    uniqueIndex("waitlist_leads_contact_normalized_unique").on(
      table.contactNormalized,
    ),
  ],
);
