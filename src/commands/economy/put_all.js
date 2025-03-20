import { Users } from "../../database.js";
import { ERROR_RESPONSES } from "../../constants.js";

export default {
	name: "put_all",
	/**
	 * @param {import("discord.js").ChatInputCommandInteraction} interaction
	 * @param {import("../../types/ArgumentsOf.js").ArgumentsOf<typeof import("../../interactions/index.js").PutAllSlashCommand>} _args
	 */
	async execute(interaction, _args) {
		await interaction.deferReply();

		const user = await Users.findByPk(interaction.user.id);

		if (!user) {
			return await interaction.editReply({
				content: ERROR_RESPONSES.notOnSystem,
			});
		}

		if (!user || user.points <= 0) {
			return await interaction.editReply({
				content: "You don't have that many points on you.",
			});
		}

		user.vault += user.points;
		user.points = 0;
		await user.save();

		await interaction.editReply({
			content: "All your points have been moved to the vault.",
		});
	},
};
