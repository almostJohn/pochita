import {
	ApplicationCommandType,
	ApplicationCommandOptionType,
} from "discord.js";

export const RobSlashCommand = /** @type {const} */ ({
	name: "rob",
	description: "Attempt to rob another user.",
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
