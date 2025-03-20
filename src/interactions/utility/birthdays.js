import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
} from "discord.js";

export const BirthdaysSlashCommand = /** @type {const} */ ({
	name: "birthdays",
	description: "View a list of upcoming birthdays.",
	type: ApplicationCommandType.ChatInput,
	options: [
		{
			name: "hide",
			description: "Hides the output",
			type: ApplicationCommandOptionType.Boolean,
		},
	],
});
