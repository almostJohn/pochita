import { ApplicationCommandType } from "discord.js";

export const DailySlashCommand = /** @type {const} */ ({
	name: "daily",
	description: "Claim your daily rewards everyday.",
	type: ApplicationCommandType.ChatInput,
});
