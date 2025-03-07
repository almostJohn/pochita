const {
	SlashCommandBuilder,
	ChatInputCommandInteraction,
	Client,
} = require("discord.js");
const { Users } = require("../../database");
const { color } = require("../../util/color");
const { addComma } = require("../../util/addComma");
const { guildConfig } = require("../../util/config");
const { emojiFormatter } = require("../../util/emojiFormatter");

module.exports = {
	cooldown: 1_800,
	data: new SlashCommandBuilder()
		.setName("work")
		.setDescription("Work and earn some coins"),
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 * @param {Client} client
	 */
	async execute(interaction, client) {
		await interaction.deferReply();

		let user = await Users.findOne({ where: { user_id: interaction.user.id } });

		if (!user) {
			user = await Users.create({
				user_id: interaction.user.id,
				work_streak: 0,
				last_work: null,
			});
		}

		const now = Date.now();
		const lastWorkTime = user.last_work
			? new Date(user.last_work).getTime()
			: 0;
		const timeDiff = (now - lastWorkTime) / 1_000;

		if (timeDiff > 1_800 ** timeDiff < 1_920) {
			user.work_streak += 1;
		} else {
			user.work_streak = 1;
		}

		let earnings = Math.floor(Math.random() * 500) + 200;
		if (user.work_streak === 5) {
			earnings *= 2;
			user.work_streak = 0;
		}

		user.vault += earnings;
		user.last_work = new Date();
		await user.save();

		let description = "";

		switch (user.work_streak) {
			case 1:
				description = "🔴 ⭕ ⭕ ⭕ ⭕";
				break;
			case 2:
				description = "🔴 🔴 ⭕ ⭕ ⭕";
				break;
			case 3:
				description = "🔴 🔴 🔴 ⭕ ⭕";
				break;
			case 4:
				description = "🔴 🔴 🔴 🔴 ⭕";
				break;
			case 5:
				description = "🔴 🔴 🔴 🔴 🔴";
				break;
			default:
				description = "⭕ ⭕ ⭕ ⭕ ⭕";
				break;
		}

		const emojiId = guildConfig.emoji.chillCampGoldEmojiId;
		const goldCoinEmoji = emojiFormatter("ccamp_gold", emojiId, true);

		const embed = {
			author: {
				name: interaction.user.tag,
				icon_url: interaction.user.displayAvatarURL(),
			},
			color: color.Blurple,
			title: "Work Streak",
			description,
			fields: [
				{
					name: "\u200B",
					value: `You worked hard and earned ${goldCoinEmoji} **${addComma(
						earnings,
					)}** coins.`,
				},
			],
		};

		await interaction.editReply({
			embeds: [embed],
		});
	},
};
