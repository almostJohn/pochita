import { ApplicationCommandType } from "discord.js";

export const LeaderboardSlashCommand = /** @type {const} */ ({
	name: "leaderboard",
	description: "View the top 10 richest in the server.",
	type: ApplicationCommandType.ChatInput,
});
