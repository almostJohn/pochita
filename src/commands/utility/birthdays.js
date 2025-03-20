import { Users } from "../../database.js";
import { addFields } from "../../util/embed.js";
import dayjs from "dayjs";
import { Op } from "sequelize";
import { COLOR } from "../../constants.js";
import { MessageFlags } from "discord.js";

export default {
	name: "birthdays",
	/**
	 * @param {import("discord.js").ChatInputCommandInteraction} interaction
	 * @param {import("../../types/ArgumentsOf.js").ArgumentsOf<typeof import("../../interactions/index.js").BirthdaysSlashCommand>} args
	 */
	async execute(interaction, args) {
		await interaction.deferReply({
			flags: args.hide ? MessageFlags.Ephemeral : undefined,
		});

		const today = dayjs().format("MM-DD");

		const usersWithBirthdays = await Users.findAll({
			where: {
				birthday: { [Op.ne]: null },
			},
		});

		const upcomingBirthdays = usersWithBirthdays
			.filter((user) => dayjs(user.birthday).format("MM-DD") >= today)
			.map(
				(user) =>
					`- <@${user.user_id}> - ${dayjs(user.birthday).format("MMMM D")}`,
			)
			.join("\n");

		const embed = addFields({
			color: COLOR.Fuchsia,
			title: "🎉 Upcoming birthdays",
			description: upcomingBirthdays,
			footer: { text: `requested by ${interaction.user.tag}` },
			timestamp: new Date().toISOString(),
		});

		await interaction.editReply({
			embeds: [embed],
		});
	},
};
