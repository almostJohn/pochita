const {
	SlashCommandBuilder,
	ChatInputCommandInteraction,
	Client,
} = require("discord.js");
const { Users } = require("../../database");
const { guildConfig } = require("../../util/config");
const { emojiFormatter } = require("../../util/emojiFormatter");
const { addComma } = require("../../util/addComma");
const { color } = require("../../util/color");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("profile")
		.setDescription("View your profile")
		.addUserOption((option) =>
			option.setName("user").setDescription("The user"),
		),
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 * @param {Client} client
	 */
	async execute(interaction, client) {
		await interaction.deferReply();

		const targetUser = interaction.options.getUser("user") ?? interaction.user;

		let user = await Users.findOne({ where: { user_id: targetUser.id } });

		if (!user) {
			return await interaction.editReply({
				content: `${targetUser.toString()} is not in the system yet`,
			});
		}

		const totalCoins = addComma(Number(user.vault));
		const totalFamePoints = addComma(Number(user.fame));

		const emojiId = guildConfig.emoji.chillCampGoldEmojiId;
		const emoji = emojiFormatter("ccamp_gold", emojiId);

		const descriptionParts = [
			`# ${interaction.guild.name} Profile`,
			`- User: ${targetUser.toString()}`,
			`- Coins: ${emoji} **${totalCoins}**`,
			`- Fame Points: 🌟 **${totalFamePoints}**`,
		];

		const embed = {
			color: color.Blurple,
			thumbnail: {
				url: targetUser.displayAvatarURL(),
			},
			description: descriptionParts.join("\n"),
		};

		await interaction.editReply({
			embeds: [embed],
		});
	},
};
