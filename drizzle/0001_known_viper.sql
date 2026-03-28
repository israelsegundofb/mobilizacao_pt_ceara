CREATE TABLE `petition_signatures` (
	`id` int AUTO_INCREMENT NOT NULL,
	`fullName` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(20),
	`city` varchar(100),
	`state` varchar(2),
	`message` text,
	`agreeToShare` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `petition_signatures_id` PRIMARY KEY(`id`),
	CONSTRAINT `petition_signatures_email_unique` UNIQUE(`email`)
);
