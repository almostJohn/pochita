const {
	SlashCommandBuilder,
	ChatInputCommandInteraction,
	Client,
} = require("discord.js");
const { Users } = require("../../database");
const { emojiConfig } = require("../../util/config");
const { emojiFormatter } = require("../../util/emojiFormatter");
const { addFields } = require("../../util/embed");
const { addComma } = require("../../util/addComma");
const { color } = require("../../util/color");

const slotSymbols = ["🍒", "🍋", "🍉", "🍇", "🔔", "⭐", "7️⃣"];

module.exports = {
	data: new SlashCommandBuilder()
		.setName("slots")
		.setDescription("Play the slot machine")
		.addIntegerOption((option) =>
			option.setName("bet").setDescription("Amount to bet").setRequired(true),
		),
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 * @param {Client} client
	 */
	async execute(interaction, client) {
		await interaction.deferReply();

		const bet = interaction.options.getInteger("bet");

		let user = await Users.findOne({ where: { user_id: interaction.user.id } });

		if (!user || user.vault < bet) {
			return await interaction.editReply({
				content: `You don't have enough coins to place this bet`,
			});
		}

		const slotOne = slotSymbols[Math.floor(Math.random() * slotSymbols.length)];
		const slotTwo = slotSymbols[Math.floor(Math.random() * slotSymbols.length)];
		const slotThree =
			slotSymbols[Math.floor(Math.random() * slotSymbols.length)];

		let winnings = 0;
		if (slotOne === slotTwo && slotTwo === slotThree) {
			winnings = bet * 3;
		} else if (
			slotOne === slotTwo ||
			slotTwo === slotThree ||
			slotOne === slotThree
		) {
			winnings = bet * 2;
		} else {
			winnings = -bet;
		}

		user.vault += winnings;
		await user.save();

		const { name, id } = emojiConfig.ccamp_gold;
		const emoji = emojiFormatter(name, id, true);

		let resultMessage = `${slotOne} | ${slotTwo} | ${slotThree}`;
		let description = "";
		if (winnings > 0) {
			description += `You won ${emoji} **${addComma(winnings)}** coins`;
		} else {
			description += `You lost ${emoji} **${addComma(
				bet,
			)}** coins. Better luck next time`;
		}

		const embed = addFields({
			color: color.DarkButNotBlack,
			title: "🎰 Slot Machine",
			description: resultMessage,
			fields: [
				{
					name: "\u200b",
					value: description,
				},
			],
		});

		await interaction.editReply({
			embeds: [embed],
		});
	},
};
