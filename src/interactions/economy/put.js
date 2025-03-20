import {
	ApplicationCommandType,
	ApplicationCommandOptionType,
} from "discord.js";

export const PutSlashCommand = /** @type {const} */ ({
	name: "put",
	description: "Put only a specific amount into your vault.",
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
