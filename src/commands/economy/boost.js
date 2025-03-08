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
	cooldown: 3_600,
	data: new SlashCommandBuilder()
		.setName("boost")
		.setDescription("Boost another user's fame")
		.addUserOption((option) =>
			option
				.setName("target")
				.setDescription("The user to boost")
				.setRequired(true),
		),
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 * @param {Client} client
	 */
	async execute(interaction, client) {
		await interaction.deferReply();

		const targetUser = interaction.options.getUser("target");

		let target = await Users.findOne({ where: { user_id: targetUser.id } });

		if (!target) {
			target = await Users.create({ user_id: targetUser.id });
		}

		const boostAmount = Math.floor(Math.random() * 100) + 1;

		target.fame += boostAmount;
		await target.save();

		const { name, id } = emojiConfig.ccamp_increase;
		const emoji = emojiFormatter(name, id, true);

		const embed = addFields({
			color: color.Green,
			description: `${targetUser.toString()} received a ${emoji} **${boostAmount}** fame boost`,
		});

		await interaction.editReply({
			embeds: [embed],
		});
	},
};
