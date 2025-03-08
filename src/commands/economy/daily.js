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

		const { name, id } = emojiConfig.ccamp_gold;
		const emoji = emojiFormatter(name, id, true);

		const embed = addFields({
			color: color.DarkButNotBlack,
			description: `You claimed your daily reward ${emoji} **${dailyAmount}** coins`,
		});

		await interaction.editReply({
			embeds: [embed],
		});
	},
};
