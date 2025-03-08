const {
	SlashCommandBuilder,
	ChatInputCommandInteraction,
	Client,
} = require("discord.js");
const { Users } = require("../../database");
const { emojiConfig } = require("../../util/config");
const { emojiFormatter } = require("../../util/emojiFormatter");
const { addFields } = require("../../util/embed");
const { color } = require("../../util/color");
const { addComma } = require("../../util/addComma");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("leaderboard")
		.setDescription("View the top 10 richest users"),
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 * @param {Client} client
	 */
	async execute(interaction, client) {
		await interaction.deferReply();

		const topUsers = await Users.findAll({
			order: [["vault", "DESC"]],
			limit: 10,
		});

		if (!topUsers.length) {
			return await interaction.editReply({
				content: "No users found in the leaderboard",
			});
		}

		const { name, id } = emojiConfig.ccamp_gold;
		const emoji = emojiFormatter(name, id, true);

		const leaderboard = topUsers
			.map(
				(user, index) =>
					`${index + 1}. <@${user.user_id}> - ${emoji} **${addComma(
						user.vault,
					)}** coins`,
			)
			.join("\n");

		const embed = addFields({
			author: {
				name: `${interaction.guild.name} Top 10 Richest`,
				icon_url: interaction.guild.iconURL(),
			},
			thumbnail: {
				url: interaction.guild.iconURL(),
			},
			fields: [
				{
					name: "\u200B",
					value: leaderboard,
				},
			],
			color: color.DarkButNotBlack,
			footer: { text: "Keep grinding to reach the top!" },
		});

		await interaction.editReply({ embeds: [embed] });
	},
};
