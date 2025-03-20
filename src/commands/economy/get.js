import { Users } from "../../database.js";
import { ERROR_RESPONSES } from "../../constants.js";
import { formatNumberToStringWithComma } from "../../util/helperFunctions.js";

export default {
	name: "get",
	/**
	 * @param {import("discord.js").ChatInputCommandInteraction} interaction
	 * @param {import("../../types/ArgumentsOf.js").ArgumentsOf<typeof import("../../interactions/index.js").GetSlashCommand>} args
	 */
	async execute(interaction, args) {
		await interaction.deferReply();

		const user = await Users.findByPk(interaction.user.id);

		if (!user) {
			return await interaction.editReply({
				content: ERROR_RESPONSES.notOnSystem,
			});
		}

		if (!user || user.vault <= 0) {
			return await interaction.editReply({
				content: "You don't have that many points on you.",
			});
		}

		user.points = args.amount;
		user.vault = Math.max(0, user.vault - args.amount);
		await user.save();

		await interaction.editReply({
			content: `**${formatNumberToStringWithComma(
				args.amount,
			)}** points have been withdrawn.`,
		});
	},
};
