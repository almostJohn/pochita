import {
	ApplicationCommandType,
	ApplicationCommandOptionType,
} from "discord.js";

export const InfoCommand = /** @type {const} */ ({
	name: "info",
	description: "Get info about a user or the server",
	type: ApplicationCommandType.ChatInput,
	options: [
		{
			name: "user",
			description: "Get info about a user",
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: "user",
					description: "The user",
					type: ApplicationCommandOptionType.User,
				},
				{
					name: "hide",
					description: "Hides the output",
					type: ApplicationCommandOptionType.Boolean,
				},
			],
		},
		{
			name: "server",
			description: "Get info about the server",
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: "hide",
					description: "Hides the output",
					type: ApplicationCommandOptionType.Boolean,
				},
			],
		},
	],
});
