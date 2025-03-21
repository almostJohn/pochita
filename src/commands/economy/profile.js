import { pet } from "./sub/profile/pet.js";
import { user } from "./sub/profile/user.js";

export default {
	name: "profile",
	/**
	 *
	 * @param {import("discord.js").ChatInputCommandInteraction} interaction
	 * @param {import("../../types/ArgumentsOf.js").ArgumentsOf<typeof import("../../interactions/index.js").ProfileSlashCommand>} args
	 */
	async execute(interaction, args) {
		switch (Object.keys(args)[0]) {
			case "user": {
				await user(interaction, args.user);
				break;
			}
			case "pet": {
				await pet(interaction, args.pet);
				break;
			}
		}
	},
};
