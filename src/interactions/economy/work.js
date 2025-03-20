import {
	ApplicationCommandType,
	ApplicationCommandOptionType,
} from "discord.js";

export const WorkSlashCommand = /** @type {const} */ ({
	name: "work",
	description:
		"Work and earn points or work for somebody to give them a points.",
	type: ApplicationCommandType.ChatInput,
	options: [
		{
			name: "user",
			description: "The user (optional)",
			type: ApplicationCommandOptionType.User,
		},
	],
});
