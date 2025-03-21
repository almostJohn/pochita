import { feed } from "../economy/sub/pet/feed.js";
import { fight } from "../economy/sub/pet/fight.js";
import { rename } from "../economy/sub/pet/rename.js";
import { train } from "../economy/sub/pet/train.js";

export default {
	name: "pet",
	cooldown: 900,
	/**
	 * @param {import("discord.js").ChatInputCommandInteraction} interaction
	 * @param {import("../../types/ArgumentsOf.js").ArgumentsOf<typeof import("../../interactions/index.js").PetSlashCommand>} args
	 */
	async execute(interaction, args) {
		switch (Object.keys(args)[0]) {
			case "rename": {
				await rename(interaction, args.rename);
				break;
			}

			case "fight": {
				await fight(interaction, args.fight);
				break;
			}

			case "train": {
				await train(interaction, args.train);
				break;
			}

			case "feed": {
				await feed(interaction, args.feed);
				break;
			}
		}
	},
};
