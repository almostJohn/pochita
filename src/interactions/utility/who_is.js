import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
} from "discord.js";

export const WhoIsSlashCommand = /** @type {const} */ ({
	name: "who_is",
	description:
		"Displays information about a user, created date, and joined date.",
	type: ApplicationCommandType.ChatInput,
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
});
