import { Users } from "../../database.js";
import { ERROR_RESPONSES } from "../../constants.js";
import { MessageFlags } from "discord.js";
import { formatNumberToStringWithComma } from "../../util/helperFunctions.js";

export default {
	name: "set_points",
	/**
	 * @param {import("discord.js").ChatInputCommandInteraction} interaction
	 * @param {import("../../types/ArgumentsOf.js").ArgumentsOf<typeof import("../../interactions/index.js").SetPointsSlashCommand>} args
	 */
	async execute(interaction, args) {
		await interaction.deferReply({ flags: MessageFlags.Ephemeral });

		const user = await Users.findByPk(args.user.user.id);

		if (!user) {
			return await interaction.editReply({
				content: ERROR_RESPONSES.targetUserNotOnSystem,
			});
		}

		user.vault += args.amount;
		await user.save();

		await interaction.editReply({
			content: `Successfully set **${formatNumberToStringWithComma(
				args.amount,
			)}** to ${args.user.user.toString()}`,
		});
	},
};
