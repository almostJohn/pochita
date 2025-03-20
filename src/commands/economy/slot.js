import { Users } from "../../database.js";
import { COLOR, SLOT_EMOJIS, ERROR_RESPONSES } from "../../constants.js";
import { addFields } from "../../util/embed.js";
import {
	randomizeNumber,
	formatNumberToStringWithComma,
} from "../../util/helperFunctions.js";

export default {
	name: "slot",
	/**
	 * @param {import("discord.js").ChatInputCommandInteraction} interaction
	 * @param {import("../../types/ArgumentsOf.js").ArgumentsOf<typeof import("../../interactions/index.js").SlotSlashCommand>} args
	 */
	async execute(interaction, args) {
		await interaction.deferReply();

		const user = await Users.findByPk(interaction.user.id);

		if (!user) {
			return await interaction.editReply({
				content: ERROR_RESPONSES.notOnSystem,
			});
		}

		if (args.bet <= 0) {
			return await interaction.editReply({
				content: "Your bet must be greater than zero.",
			});
		}

		if (user.points < args.bet) {
			return await interaction.editReply({
				content: "You don't have enough points to place this bet.",
			});
		}

		const result = [
			SLOT_EMOJIS[randomizeNumber(0, SLOT_EMOJIS.length - 1)],
			SLOT_EMOJIS[randomizeNumber(0, SLOT_EMOJIS.length - 1)],
			SLOT_EMOJIS[randomizeNumber(0, SLOT_EMOJIS.length - 1)],
		];

		const isWin = result[0] === result[1] && result[1] === result[2];
		const winnings = isWin ? args.bet * 5 : -args.bet;

		user.points += winnings;
		await user.save();

		const embed = addFields({
			title: "🎰 Slot machine",
			color: COLOR.DarkButNotBlack,
			description: result.join(" | "),
			fields: [
				{
					name: "Result",
					value: `${
						isWin
							? `You won **${formatNumberToStringWithComma(winnings)}** points!`
							: `You lost **${formatNumberToStringWithComma(
									args.bet,
							  )}** points. Better luck next time.`
					}`,
				},
			],
			footer: {
				text: "x5 multiplier for every win you get.",
			},
		});

		await interaction.editReply({
			embeds: [embed],
		});
	},
};
