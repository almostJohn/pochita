import {
	ApplicationCommandType,
	ApplicationCommandOptionType,
} from "discord.js";

export const AFKCommand = /** @type {const} */ ({
	name: "afk",
	description: "Set your AFK status",
	type: ApplicationCommandType.ChatInput,
	options: [
		{
			name: "user",
			description: "The user to action",
			type: ApplicationCommandOptionType.User,
		},
		{
			name: "reason",
			description: "Reason for being AFK",
			type: ApplicationCommandOptionType.String,
		},
		{
			name: "hide",
			description: "Hides the output (default: False)",
			type: ApplicationCommandOptionType.Boolean,
		},
	],
});
