import {
	ApplicationCommandType,
	ApplicationCommandOptionType,
} from "discord.js";

export const PetSlashCommand = /** @type {const} */ ({
	name: "pet",
	description: "Pet related commands.",
	type: ApplicationCommandType.ChatInput,
	options: [
		{
			name: "rename",
			description: "Rename your pet.",
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: "new_name",
					description: "New name for your pet",
					type: ApplicationCommandOptionType.String,
					required: true,
				},
			],
		},
		{
			name: "fight",
			description: "Battle your pet against another user's pet.",
			type: ApplicationCommandOptionType.Subcommand,
			options: [
				{
					name: "user",
					description: "The user.",
					type: ApplicationCommandOptionType.User,
					required: true,
				},
			],
		},
		{
			name: "train",
			description: "Train your pet to gain experience.",
			type: ApplicationCommandOptionType.Subcommand,
		},
		{
			name: "feed",
			description: "Feed your pet to restore it's HP",
			type: ApplicationCommandOptionType.Subcommand,
		},
	],
});
