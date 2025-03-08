const {
	SlashCommandBuilder,
	ChatInputCommandInteraction,
	Client,
} = require("discord.js");
const { Users } = require("../../database");
const { color } = require("../../util/color");
const { addComma } = require("../../util/addComma");
const { guildConfig } = require("../../util/config");
const { emojiFormatter } = require("../../util/emojiFormatter");

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

		const emojiId = guildConfig.emoji.chillCampGoldEmojiId;
		const emoji = emojiFormatter("ccamp_gold", emojiId, true);

		const leaderboard = topUsers
			.map(
				(user, index) =>
					`- ${index + 1} <@${user.user_id}> - ${emoji} **${addComma(
						user.vault,
					)}** coins`,
			)
			.join("\n");

		const embed = {
			title: `${interaction.guild.name} Top 10 Richest`,
			thumbnail: {
				url: interaction.guild.iconURL(),
			},
			description: leaderboard,
			color: color.Blurple,
			footer: { text: "Keep grinding to reach the top!" },
		};

		await interaction.editReply({ embeds: [embed] });
	},
};
