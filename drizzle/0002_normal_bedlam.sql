CREATE TABLE `blog_posts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`excerpt` text NOT NULL,
	`content` text NOT NULL,
	`featuredImage` varchar(500),
	`author` varchar(255) NOT NULL,
	`category` varchar(100) NOT NULL,
	`tags` text,
	`published` boolean NOT NULL DEFAULT false,
	`views` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`publishedAt` timestamp,
	CONSTRAINT `blog_posts_id` PRIMARY KEY(`id`),
	CONSTRAINT `blog_posts_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `site_content` (
	`id` int AUTO_INCREMENT NOT NULL,
	`key` varchar(100) NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`section` varchar(100) NOT NULL,
	`type` varchar(50) NOT NULL DEFAULT 'text',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `site_content_id` PRIMARY KEY(`id`),
	CONSTRAINT `site_content_key_unique` UNIQUE(`key`)
);
--> statement-breakpoint
ALTER TABLE `petition_signatures` MODIFY COLUMN `city` varchar(100) NOT NULL;--> statement-breakpoint
ALTER TABLE `petition_signatures` MODIFY COLUMN `state` varchar(2) NOT NULL;--> statement-breakpoint
ALTER TABLE `petition_signatures` ADD `cnf` varchar(20) NOT NULL;--> statement-breakpoint
ALTER TABLE `petition_signatures` ADD `whatsapp` varchar(20) NOT NULL;--> statement-breakpoint
ALTER TABLE `petition_signatures` ADD CONSTRAINT `petition_signatures_cnf_unique` UNIQUE(`cnf`);--> statement-breakpoint
ALTER TABLE `petition_signatures` DROP COLUMN `phone`;