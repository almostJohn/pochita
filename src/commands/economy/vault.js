import { Users } from "../../database.js";
import { formatNumberToStringWithComma } from "../../util/helperFunctions.js";
import { ERROR_RESPONSES } from "../../constants.js";

export default {
	name: "vault",
	/**
	 * @param {import("discord.js").ChatInputCommandInteraction} interaction
	 * @param {import("../../types/ArgumentsOf.js").ArgumentsOf<typeof import("../../interactions/index.js").VaultSlashCommand>} _args
	 */
	async execute(interaction, _args) {
		await interaction.deferReply();

		const user = await Users.findByPk(interaction.user.id);

		if (!user) {
			return await interaction.editReply({
				content: ERROR_RESPONSES.notOnSystem,
			});
		}

		const formattedPoints = formatNumberToStringWithComma(user.vault ?? 0);

		await interaction.editReply({
			content: `You have **${formattedPoints}** points in your vault.`,
		});
	},
};
