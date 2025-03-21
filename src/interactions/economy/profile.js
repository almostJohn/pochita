import {
	ApplicationCommandType,
	ApplicationCommandOptionType,
} from "discord.js";

export const ProfileSlashCommand = /** @type {const} */ ({
	name: "profile",
	description: "Check a user profile or a pet profile.",
	type: ApplicationCommandType.ChatInput,
	options: [
		{
			name: "user",
			description: "Check a user profile.",
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: "user",
					description: "The user",
					type: ApplicationCommandOptionType.User,
					required: true,
				},
			],
		},
		{
			name: "pet",
			description: "Check a pet profile",
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: "owner",
					description: "The pet owner in order to get the pet's profile",
					type: ApplicationCommandOptionType.User,
					required: true,
				},
			],
		},
	],
});
