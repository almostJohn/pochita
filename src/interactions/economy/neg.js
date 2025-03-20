import {
	ApplicationCommandType,
	ApplicationCommandOptionType,
} from "discord.js";

export const NegSlashCommand = /** @type {const} */ ({
	name: "neg",
	description: "Decrease another user's fame.",
	type: ApplicationCommandType.ChatInput,
	options: [
		{
			name: "user",
			description: "The user",
			type: ApplicationCommandOptionType.User,
			required: true,
		},
	],
});
