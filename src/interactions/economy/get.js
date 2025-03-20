import {
	ApplicationCommandType,
	ApplicationCommandOptionType,
} from "discord.js";

export const GetSlashCommand = /** @type {const} */ ({
	name: "get",
	description: "Get only a specific amount from your vault.",
	type: ApplicationCommandType.ChatInput,
	options: [
		{
			name: "amount",
			description: "The amount",
			type: ApplicationCommandOptionType.Integer,
			required: true,
		},
	],
});
