import { SlashCommandBuilder } from "discord.js";
import { Users } from "../../database.js";
import { addFields } from "../../util/embed.js";
import dayjs from "dayjs";
import { Op } from "sequelize";
import { color } from "../../util/color.js";

export default {
	data: new SlashCommandBuilder()
		.setName("birthdays")
		.setDescription("View upcoming birthdays"),
	/**
	 * @param {import("discord.js").ChatInputCommandInteraction} interaction
	 * @param {import("discord.js").client} client
	 */
	async execute(interaction, _client) {
		await interaction.deferReply();

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
			color: color.Fuchsia,
			title: "🎉 Upcoming Birthdays",
			description: upcomingBirthdays,
			footer: { text: `Requested by ${interaction.user.tag}` },
			timestamp: new Date().toISOString(),
		});

		await interaction.editReply({ embeds: [embed] });
	},
};
