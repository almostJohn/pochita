import { Users } from "../../database.js";
import { randomizeNumber } from "../../util/helperFunctions.js";
import { ERROR_RESPONSES } from "../../constants.js";

export default {
	name: "boost",
	cooldown: 3_600,
	/**
	 * @param {import("discord.js").ChatInputCommandInteraction} interaction
	 * @param {import("../../types/ArgumentsOf.js").ArgumentsOf<typeof import("../../interactions/index.js").BoostSlashCommand>} args
	 */
	async execute(interaction, args) {
		await interaction.deferReply();

		const targetUser = args.user.user;

		if (targetUser.id === interaction.user.id) {
			return await interaction.editReply({
				content: "You cannot do that to yourself.",
			});
		}

		const user = await Users.findByPk(targetUser.id);

		if (!user) {
			return await interaction.editReply({
				content: ERROR_RESPONSES.targetUserNotOnSystem,
			});
		}

		const increase = randomizeNumber(10, 50);
		user.fame += increase;
		await user.save();

		await interaction.editReply({
			content: `You successfully boosted ${targetUser.toString()} by **${increase}** fame.`,
		});
	},
};
