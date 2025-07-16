CREATE TABLE `search_errors` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`ts` integer NOT NULL,
	`repo` text NOT NULL,
	`engine` text NOT NULL,
	`pattern` text NOT NULL,
	`error` text NOT NULL,
	`created_at` integer NOT NULL
);
