CREATE TABLE `chapters` (
	`id` int AUTO_INCREMENT NOT NULL,
	`outlineId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`chapterNumber` int,
	`craftBlockId` varchar(255),
	`status` enum('planning','writing','reviewing','completed') DEFAULT 'planning',
	`wordCount` int DEFAULT 0,
	`order` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `chapters_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `characterRelationships` (
	`id` int AUTO_INCREMENT NOT NULL,
	`character1Id` int NOT NULL,
	`character2Id` int NOT NULL,
	`relationshipType` varchar(100),
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `characterRelationships_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `characters` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`outlineId` int,
	`name` varchar(255) NOT NULL,
	`description` text,
	`traits` text,
	`role` varchar(100),
	`craftCollectionItemId` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `characters_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contentAnalysis` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`outlineId` int,
	`chapterId` int,
	`sceneId` int,
	`analysisType` varchar(100),
	`content` text,
	`sentimentScore` varchar(50),
	`keywordDensity` text,
	`highlights` text,
	`suggestions` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `contentAnalysis_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `craftCredentials` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`accessToken` text NOT NULL,
	`refreshToken` text,
	`tokenExpiresAt` timestamp,
	`spaceId` varchar(255),
	`isActive` int DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `craftCredentials_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `obsidianSync` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`vaultPath` varchar(512) NOT NULL,
	`filePath` varchar(512) NOT NULL,
	`craftDocumentId` varchar(255),
	`lastSyncedAt` timestamp,
	`fileHash` varchar(64),
	`syncStatus` enum('pending','synced','failed','conflict') DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `obsidianSync_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `outlines` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`craftDocumentId` varchar(255),
	`craftCollectionId` varchar(255),
	`status` enum('draft','in_progress','completed','archived') DEFAULT 'draft',
	`wordCount` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `outlines_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `scenes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`chapterId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`sceneNumber` int,
	`craftBlockId` varchar(255),
	`status` enum('planning','writing','reviewing','completed') DEFAULT 'planning',
	`wordCount` int DEFAULT 0,
	`order` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `scenes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `slackIntegration` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`slackUserId` varchar(255) NOT NULL,
	`slackTeamId` varchar(255) NOT NULL,
	`accessToken` text,
	`refreshToken` text,
	`tokenExpiresAt` timestamp,
	`isActive` int DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `slackIntegration_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `writingProgress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`outlineId` int,
	`date` varchar(10) NOT NULL,
	`wordsWritten` int DEFAULT 0,
	`sessionsCompleted` int DEFAULT 0,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `writingProgress_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `chapters` ADD CONSTRAINT `chapters_outlineId_outlines_id_fk` FOREIGN KEY (`outlineId`) REFERENCES `outlines`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `characterRelationships` ADD CONSTRAINT `characterRelationships_character1Id_characters_id_fk` FOREIGN KEY (`character1Id`) REFERENCES `characters`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `characterRelationships` ADD CONSTRAINT `characterRelationships_character2Id_characters_id_fk` FOREIGN KEY (`character2Id`) REFERENCES `characters`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `characters` ADD CONSTRAINT `characters_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `characters` ADD CONSTRAINT `characters_outlineId_outlines_id_fk` FOREIGN KEY (`outlineId`) REFERENCES `outlines`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `contentAnalysis` ADD CONSTRAINT `contentAnalysis_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `contentAnalysis` ADD CONSTRAINT `contentAnalysis_outlineId_outlines_id_fk` FOREIGN KEY (`outlineId`) REFERENCES `outlines`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `contentAnalysis` ADD CONSTRAINT `contentAnalysis_chapterId_chapters_id_fk` FOREIGN KEY (`chapterId`) REFERENCES `chapters`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `contentAnalysis` ADD CONSTRAINT `contentAnalysis_sceneId_scenes_id_fk` FOREIGN KEY (`sceneId`) REFERENCES `scenes`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `craftCredentials` ADD CONSTRAINT `craftCredentials_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `obsidianSync` ADD CONSTRAINT `obsidianSync_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `outlines` ADD CONSTRAINT `outlines_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `scenes` ADD CONSTRAINT `scenes_chapterId_chapters_id_fk` FOREIGN KEY (`chapterId`) REFERENCES `chapters`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `slackIntegration` ADD CONSTRAINT `slackIntegration_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `writingProgress` ADD CONSTRAINT `writingProgress_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `writingProgress` ADD CONSTRAINT `writingProgress_outlineId_outlines_id_fk` FOREIGN KEY (`outlineId`) REFERENCES `outlines`(`id`) ON DELETE cascade ON UPDATE no action;