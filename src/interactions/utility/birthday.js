import {
	ApplicationCommandType,
	ApplicationCommandOptionType,
} from "discord.js";

export const BirthdayCommand = /** @type {const} */ ({
	name: "birthday",
	description: "Set, view a user birthday, or view a list of birthdays",
	type: ApplicationCommandType.ChatInput,
	options: [
		{
			name: "set",
			description: "Set your birthday",
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: "date",
					description: "Your birthday (format: YYYY-MM-DD)",
					type: ApplicationCommandOptionType.String,
					required: true,
				},
				{
					name: "hide",
					description: "Hides the output (default: False)",
					type: ApplicationCommandOptionType.Boolean,
				},
			],
		},
		{
			name: "view",
			description: "View a user's birthday",
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: "user",
					description: "The user",
					type: ApplicationCommandOptionType.User,
					required: true,
				},
				{
					name: "hide",
					description: "Hides the output (default: False)",
					type: ApplicationCommandOptionType.Boolean,
				},
			],
		},
		{
			name: "view_list",
			description: "View a list of birthdays",
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: "hide",
					description: "Hides the output (default: False)",
					type: ApplicationCommandOptionType.Boolean,
				},
			],
		},
	],
});
