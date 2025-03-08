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

		const { name, id } = emojiConfig.ccamp_gold;
		const emoji = emojiFormatter(name, id, true);

		const embed = addFields({
			color: color.DarkButNotBlack,
			description: `Your balance is ${emoji} **${addComma(user.vault)}** coins`,
		});

		await interaction.editReply({
			embeds: [embed],
		});
	},
};
