import { Users } from "../../database.js";
import { formatNumberToStringWithComma } from "../../util/helperFunctions.js";
import { addFields } from "../../util/embed.js";
import { COLOR } from "../../constants.js";

export default {
	name: "leaderboard",
	/**
	 * @param {import("discord.js").ChatInputCommandInteraction} interaction
	 * @param {import("../../types/ArgumentsOf.js").ArgumentsOf<typeof import("../../interactions/index.js").LeaderboardSlashCommand>} _args
	 */
	async execute(interaction, _args) {
		await interaction.deferReply();

		const topUsers = await Users.findAll();

		if (!topUsers.length) {
			return await interaction.editReply({
				content: "No data available.",
			});
		}

		const sortedUsers = topUsers
			.map((user) => ({
				user_id: user.user_id,
				totalWealth: user.vault + user.points,
			}))
			.sort((a, b) => b.totalWealth - a.totalWealth)
			.slice(0, 10);

		const description = sortedUsers
			.map(
				(user, index) =>
					`**${index + 1}**. <@${
						user.user_id
					}> - **${formatNumberToStringWithComma(user.totalWealth)}** points.`,
			)
			.join("\n\n");

		const embed = addFields({
			title: `Top 10 Richest in ${interaction.guild.name}`,
			thumbnail: {
				url: interaction.guild.iconURL(),
			},
			color: COLOR.Blurple,
			description,
			footer: {
				text: "Keep grinding to reach the top.",
			},
			timestamp: new Date().toISOString(),
		});

		await interaction.editReply({
			embeds: [embed],
		});
	},
};
