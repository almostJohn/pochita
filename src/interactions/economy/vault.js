import { ApplicationCommandType } from "discord.js";

export const VaultSlashCommand = /** @type {const} */ ({
	name: "vault",
	description: "View your points in your vault.",
	type: ApplicationCommandType.ChatInput,
});
