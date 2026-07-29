CREATE TABLE `waitlist_leads` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`contact` text NOT NULL,
	`contact_normalized` text NOT NULL,
	`source` text NOT NULL,
	`consent_at` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `waitlist_leads_contact_normalized_unique` ON `waitlist_leads` (`contact_normalized`);