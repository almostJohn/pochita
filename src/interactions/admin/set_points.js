import {
	ApplicationCommandType,
	ApplicationCommandOptionType,
} from "discord.js";

export const SetPointsSlashCommand = /** @type {const} */ ({
	name: "set_points",
	description: "Set a specific amount of points to someone.",
	type: ApplicationCommandType.ChatInput,
	options: [
		{
			name: "user",
			description: "The user",
			type: ApplicationCommandOptionType.User,
			required: true,
		},
		{
			name: "amount",
			description: "The amount",
			type: ApplicationCommandOptionType.Integer,
			required: true,
		},
	],
	default_member_permissions: "0",
});
