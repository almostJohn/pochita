import { ApplicationCommandType } from "discord.js";

export const PointsSlashCommand = /** @type {const} */ ({
	name: "points",
	description: "View your points.",
	type: ApplicationCommandType.ChatInput,
});
