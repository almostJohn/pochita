import { Users } from "../../database.js";
import { randomizeNumber } from "../../util/helperFunctions.js";
import { ERROR_RESPONSES } from "../../constants.js";

export default {
	name: "rob",
	cooldown: 3_600,
	/**
	 * @param {import("discord.js").ChatInputCommandInteraction} interaction
	 * @param {import("../../types/ArgumentsOf.js").ArgumentsOf<typeof import("../../interactions/index.js").RobSlashCommand>} args
	 */
	async execute(interaction, args) {
		await interaction.deferReply();

		const targetUser = args.user.user;
		const victimUser = await Users.findByPk(targetUser.id);
		const robberUser = await Users.findByPk(interaction.user.id);

		if (targetUser.id === interaction.user.id) {
			return await interaction.editReply({
				content: "You cannot do that to yourself.",
			});
		}

		if (!targetUser) {
			return await interaction.editReply({
				content: ERROR_RESPONSES.targetUserNotFound,
			});
		}

		if (!victimUser) {
			return await interaction.editReply({
				content: ERROR_RESPONSES.targetUserNotOnSystem,
			});
		}

		if (!robberUser) {
			return await interaction.editReply({
				content: ERROR_RESPONSES.notOnSystem,
			});
		}

		if (!victimUser || victimUser.points <= 0) {
			return await interaction.editReply({
				content: `${targetUser.toString()} has no points to steal.`,
			});
		}

		const caughtChance = victimUser.vault > 0 ? 70 : 30;
		if (randomizeNumber(1, 100) <= caughtChance) {
			const penalty = randomizeNumber(10, 50);
			robberUser.points = Math.max(0, robberUser.points - penalty);
			await robberUser.save();

			return await interaction.editReply({
				content: `${interaction.user.toString()} you got caught and paid a penalty of **${penalty}** points.`,
			});
		}

		const stolen = randomizeNumber(10, 50);
		robberUser.points += stolen;
		victimUser.points = Math.max(0, victimUser.points - stolen);
		await robberUser.save();
		await victimUser.save();

		await interaction.editReply({
			content: `${interaction.user.toString()} you successfully stole **${stolen}** points from ${targetUser.toString()}.`,
		});
	},
};
