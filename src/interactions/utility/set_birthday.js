import {
	ApplicationCommandOptionType,
	ApplicationCommandType,
} from "discord.js";

export const SetBirthdaySlashCommand = /** @type {const} */ ({
	name: "set_birthday",
	description: "Set your birthday.",
	type: ApplicationCommandType.ChatInput,
	options: [
		{
			name: "date",
			description: "Your birthday. (format: YYYY-MM-DD)",
			type: ApplicationCommandOptionType.String,
			required: true,
		},
		{
			name: "hide",
			description: "Hides the output",
			type: ApplicationCommandOptionType.Boolean,
		},
	],
});
