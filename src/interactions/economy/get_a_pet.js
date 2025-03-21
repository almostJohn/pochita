import {
	ApplicationCommandType,
	ApplicationCommandOptionType,
} from "discord.js";

export const GetAPetSlashCommand = /** @type {const} */ ({
	name: "get_a_pet",
	description: "Get a pet.",
	type: ApplicationCommandType.ChatInput,
	options: [
		{
			name: "pet_type",
			description: "Choose your pet?",
			type: ApplicationCommandOptionType.String,
			choices: [
				{ name: "Rocket", value: "Rocket" },
				{ name: "Mamoth", value: "Mamoth" },
				{ name: "Magma", value: "Magma" },
				{ name: "Bomb", value: "Bomb" },
				{ name: "Trex", value: "Trex" },
			],
			required: true,
		},
		{
			name: "pet_name",
			description: "What would be the name of your pet?",
			type: ApplicationCommandOptionType.String,
		},
	],
});
