const {
	SlashCommandBuilder,
	ChatInputCommandInteraction,
	Client,
	MessageFlags,
} = require("discord.js");
const { Users } = require("../../database");
const { addComma } = require("../../util/addComma");
const { guildConfig } = require("../../util/config");
const { emojiFormatter } = require("../../util/emojiFormatter");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("set_coin")
		.setDescription("Set an amount of coins to give")
		.addUserOption((option) =>
			option.setName("target").setDescription("The user").setRequired(true),
		)
		.addIntegerOption((option) =>
			option.setName("amount").setDescription("The amount").setRequired(true),
		)
		.setDefaultMemberPermissions(0),
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 * @param {Client} client
	 */
	async execute(interaction, client) {
		await interaction.deferReply({ flags: MessageFlags.Ephemeral });

		const targetUser = interaction.options.getUser("target");
		const amount = interaction.options.getInteger("amount");

		if (amount <= 0) {
			return await interaction.editReply({
				content: "Must be greater than zero",
			});
		}

		let target = await Users.findOne({ where: { user_id: targetUser.id } });

		if (!target) {
			target = await Users.create({ user_id: targetUser.id });
		}

		target.vault += amount;
		target.save();

		const emojiId = guildConfig.emoji.chillCampGoldEmojiId;
		const emoji = emojiFormatter("ccamp_gold", emojiId, true);

		await interaction.editReply({
			content: `Successfully set the ${emoji} **${addComma(
				amount,
			)}** coins to ${targetUser.toString()}`,
		});
	},
};
