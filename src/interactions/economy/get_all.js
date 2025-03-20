import { ApplicationCommandType } from "discord.js";

export const GetAllSlashCommand = /** @type {const} */ ({
	name: "get_all",
	description: "Get all your points from your vault.",
	type: ApplicationCommandType.ChatInput,
});
