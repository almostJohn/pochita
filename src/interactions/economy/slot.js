import {
	ApplicationCommandType,
	ApplicationCommandOptionType,
} from "discord.js";

export const SlotSlashCommand = /** @type {const} */ ({
	name: "slot",
	description: "Play the slot machine and earn points.",
	type: ApplicationCommandType.ChatInput,
	options: [
		{
			name: "bet",
			description: "Amount to bet",
			type: ApplicationCommandOptionType.Integer,
			required: true,
		},
	],
});
