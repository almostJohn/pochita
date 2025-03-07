const {
	SlashCommandBuilder,
	ChatInputCommandInteraction,
	Client,
} = require("discord.js");
const { Users } = require("../../database");
const { guildConfig } = require("../../util/config");
const { emojiFormatter } = require("../../util/emojiFormatter");
const { addComma } = require("../../util/addComma");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("vault")
		.setDescription("Check your current balance"),
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

		const emojiId = guildConfig.emoji.chillCampGoldEmojiId;
		const goldCoinEmoji = emojiFormatter("ccamp_gold", emojiId, true);

		await interaction.editReply({
			content: `Your balance is ${goldCoinEmoji} **${addComma(
				user.vault,
			)}** coins`,
		});
	},
};
