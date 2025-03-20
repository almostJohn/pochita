import { Users } from "../../database.js";
import { ERROR_RESPONSES } from "../../constants.js";
import {
	randomizeNumber,
	formatNumberToStringWithComma,
} from "../../util/helperFunctions.js";

export default {
	name: "work",
	cooldown: 3_600,
	/**
	 * @param {import("discord.js").ChatInputCommandInteraction} interaction
	 * @param {import("../../types/ArgumentsOf.js").ArgumentsOf<typeof import("../../interactions/index.js").WorkSlashCommand>} args
	 */
	async execute(interaction, args) {
		await interaction.deferReply();

		const targetUser = args.user?.user ?? interaction.user;

		if (!targetUser) {
			return await interaction.editReply({
				content: ERROR_RESPONSES.targetUserNotFound,
			});
		}

		const user = await Users.findOrCreate({
			where: { user_id: targetUser.id },
		}).then(([user]) => user);

		const earnings = randomizeNumber(400, 800) * 3;
		user.points += earnings;
		await user.save();

		const soloWork = `You worked and earned **${formatNumberToStringWithComma(
			earnings,
		)}** points.`;
		const workForSomeone = `You worked and earned **${formatNumberToStringWithComma(
			earnings,
		)}** points and gave them to ${targetUser.toString()}`;

		await interaction.editReply({
			content: targetUser === interaction.user ? soloWork : workForSomeone,
		});
	},
};
