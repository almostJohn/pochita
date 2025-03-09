const {
	SlashCommandBuilder,
	ChatInputCommandInteraction,
	Client,
} = require("discord.js");
const { addFields } = require("../../util/embed");
const { Op } = require("sequelize");
const { Messages } = require("../../database");
const { guildConfig } = require("../../util/config");
const { color } = require("../../util/color");
const { addComma } = require("../../util/addComma");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("messages")
		.setDescription("Check how many messages you've sent in general"),
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 * @param {Client} client
	 */
	async execute(interaction, client) {
		await interaction.deferReply();

		const channelId = guildConfig.mainChannelId;

		if (!channelId) {
			return;
		}

		const sevenDaysAgo = new Date();
		sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

		const messageCount = await Messages.count({
			where: {
				user_id: interaction.user.id,
				channel_id: channelId,
				timestamp: { [Op.gte]: sevenDaysAgo },
			},
		});

		const messageText =
			messageCount === 1
				? "**1** message"
				: `**${addComma(messageCount)}** messages`;

		const embed = addFields({
			author: {
				name: interaction.user.tag,
				icon_url: interaction.user.displayAvatarURL(),
			},
			color: color.DarkButNotBlack,
			title: "Channel Message Count",
			fields: [
				{
					name: "General",
					value: messageText,
				},
			],
			footer: {
				text: "This counts each message sent this week",
			},
		});

		await interaction.editReply({
			embeds: [embed],
		});
	},
};
