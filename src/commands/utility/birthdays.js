const {
	SlashCommandBuilder,
	ChatInputCommandInteraction,
	Client,
} = require("discord.js");
const { Users } = require("../../database");
const { addFields } = require("../../util/embed");
const dayjs = require("dayjs");
const { Op } = require("sequelize");
const { color } = require("../../util/color");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("birthdays")
		.setDescription("View upcoming birthdays"),
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 * @param {Client} client
	 */
	async execute(interaction, client) {
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
			title: `🎉 Upcoming Birthdays`,
			description: upcomingBirthdays,
			footer: { text: `Requested by ${interaction.user.tag}` },
			timestamp: new Date().toISOString(),
		});

		await interaction.editReply({ embeds: [embed] });
	},
};
