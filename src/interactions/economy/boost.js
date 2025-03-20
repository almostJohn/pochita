import {
	ApplicationCommandType,
	ApplicationCommandOptionType,
} from "discord.js";

export const BoostSlashCommand = /** @type {const} */ ({
	name: "boost",
	description: "Boost another user's fame.",
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
