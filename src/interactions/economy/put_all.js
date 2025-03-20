import { ApplicationCommandType } from "discord.js";

export const PutAllSlashCommand = /** @type {const} */ ({
	name: "put_all",
	description: "Put all your points into your vault.",
	type: ApplicationCommandType.ChatInput,
});
