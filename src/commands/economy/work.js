const {
	SlashCommandBuilder,
	ChatInputCommandInteraction,
	Client,
} = require("discord.js");
const { Users } = require("../../database");
const { addComma } = require("../../util/addComma");
const { emojiConfig } = require("../../util/config");
const { emojiFormatter } = require("../../util/emojiFormatter");
const { addFields } = require("../../util/embed");
const { color } = require("../../util/color");

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

		let displayedStreak = user.work_streak;
		if (timeDiff > 1_800 && timeDiff < 1_920) {
			user.work_streak += 1;
		} else {
			user.work_streak = 1;
		}

		let earnings = Math.floor(Math.random() * 500) + 200;

		let streakWorkApplied = false;

		if (user.work_streak === 5) {
			earnings *= 2;
			streakWorkApplied = true;
			user.work_streak = 0;
		}

		user.vault += earnings;
		user.last_work = new Date();
		await user.save();

		let streakDescription = ["⭕", "⭕", "⭕", "⭕", "⭕"];
		for (let i = 0; i < displayedStreak; i++) {
			streakDescription[i] = "🔴";
		}
		const streakDisplay = streakDescription.join(" ");

		const { name, id } = emojiConfig.ccamp_gold;
		const emoji = emojiFormatter(name, id, true);

		const embed = addFields({
			color: color.DarkButNotBlack,
			description: `You worked hard and earned ${emoji} **${addComma(
				earnings,
			)}** coins`,
			fields: [
				{
					name: "Work Streak",
					value: streakDisplay + (streakWorkApplied ? "🎉 x5 Bonus!" : ""),
				},
			],
		});

		await interaction.editReply({
			embeds: [embed],
		});
	},
};
