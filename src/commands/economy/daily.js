import { Users } from "../../database.js";
import { randomizeNumber } from "../../util/helperFunctions.js";

export default {
	name: "daily",
	cooldown: 86_400,
	/**
	 * @param {import("discord.js").ChatInputCommandInteraction} interaction
	 * @param {import("../../types/ArgumentsOf.js").ArgumentsOf<typeof import("../../interactions/index.js").DailySlashCommand>} _args
	 */
	async execute(interaction, _args) {
		await interaction.deferReply();

		const user = await Users.findOrCreate({
			where: {
				user_id: interaction.user.id,
			},
		}).then(([user]) => user);

		const reward = randomizeNumber(100, 500);
		user.points += reward;
		await user.save();

		await interaction.editReply({
			content: `You received **${reward}** points.`,
		});
	},
};
