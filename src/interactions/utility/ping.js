import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
} from "discord.js";

export const PingSlashCommand = /** @type {const} */ ({
	name: "ping",
	description: "Health check.",
	type: ApplicationCommandType.ChatInput,
	options: [
		{
			name: "hide",
			description: "Hides the output",
			type: ApplicationCommandOptionType.Boolean,
		},
	],
});
