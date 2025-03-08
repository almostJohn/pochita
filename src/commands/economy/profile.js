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

		const { name: cCampGoldName, id: cCampGoldId } = emojiConfig.ccamp_gold;
		const cCampGoldEmoji = emojiFormatter(cCampGoldName, cCampGoldId, true);

		const { name: cCampSparkleName, id: cCampSparkleId } =
			emojiConfig.ccamp_sparkle;
		const cCampSparkleEmoji = emojiFormatter(
			cCampSparkleName,
			cCampSparkleId,
			true,
		);

		const descriptionParts = [
			`## ${interaction.guild.name} Profile`,
			`- User: ${targetUser.toString()}`,
			`- Coins: ${cCampGoldEmoji} **${totalCoins}**`,
			`- Fame Points: ${cCampSparkleEmoji} **${totalFamePoints}**`,
		];

		const embed = addFields({
			author: {
				name: targetUser.tag,
				icon_url: targetUser.displayAvatarURL(),
			},
			color: color.DarkButNotBlack,
			thumbnail: {
				url: targetUser.displayAvatarURL(),
			},
			description: descriptionParts.join("\n"),
		});

		await interaction.editReply({
			embeds: [embed],
		});
	},
};
