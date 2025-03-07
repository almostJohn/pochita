const {
	SlashCommandBuilder,
	ChatInputCommandInteraction,
	Client,
} = require("discord.js");
const { Users } = require("../../database");
const { guildConfig } = require("../../util/config");
const { emojiFormatter } = require("../../util/emojiFormatter");

module.exports = {
	cooldown: 86_400,
	data: new SlashCommandBuilder()
		.setName("daily")
		.setDescription("Claim your daily reward."),
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 * @param {Client} client
	 */
	async execute(interaction, client) {
		await interaction.deferReply();

		let user = await Users.findOne({ where: { user_id: interaction.user.id } });

		if (!user) {
			user = await Users.create({ user_id: interaction.user.id });
		}

		const dailyAmount = 650;
		user.vault += dailyAmount;
		await user.save();

		const emojiId = guildConfig.emoji.chillCampGoldEmojiId;
		const goldCoinEmoji = emojiFormatter("ccamp_gold", emojiId, true);

		await interaction.editReply({
			content: `You claimed your daily reward ${goldCoinEmoji} **${dailyAmount}** coins`,
		});
	},
};
