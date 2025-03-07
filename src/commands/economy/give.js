const {
	SlashCommandBuilder,
	ChatInputCommandInteraction,
	Client,
} = require("discord.js");
const { Users } = require("../../database");
const { guildConfig } = require("../../util/config");
const { emojiFormatter } = require("../../util/emojiFormatter");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("give")
		.setDescription("Give coins to another user")
		.addUserOption((option) =>
			option
				.setName("target")
				.setDescription("The user to give coins to")
				.setRequired(true),
		)
		.addIntegerOption((option) =>
			option
				.setName("amount")
				.setDescription("The amount of coins to give")
				.setRequired(true),
		),
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 * @param {Client} client
	 */
	async execute(interaction, client) {
		await interaction.deferReply();

		const targetUser = interaction.options.getUser("target");
		const amount = interaction.options.getInteger("amount");

		if (interaction.user.id === targetUser.id) {
			return await interaction.editReply({
				content: "You can't give coins to yourself",
			});
		}

		if (amount <= 0) {
			return await interaction.editReply({
				content: "Must be greater than zero",
			});
		}

		let user = await Users.findOne({ where: { user_id: interaction.user.id } });
		let target = await Users.findOne({ where: { user_id: targetUser.id } });

		if (!user || user.vault < amount) {
			return await interaction.editReply({
				content: "You don't have enough coins",
			});
		}

		if (!target) {
			target = await Users.create({ user_id: targetUser.id });
		}

		user.vault -= amount;
		target.vault += amount;

		await user.save();
		await target.save();

		const emojiId = guildConfig.emoji.chillCampGoldEmojiId;
		const goldCoinEmoji = emojiFormatter("ccamp_gold", emojiId, true);

		await interaction.editReply({
			content: `You gave ${goldCoinEmoji} **${amount}** coins to ${targetUser.toString()}`,
		});
	},
};
