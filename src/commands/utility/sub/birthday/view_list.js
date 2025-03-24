import { MessageFlags } from "discord.js";
import { Users } from "../../../../db.js";
import { addFields } from "../../../../util/embed.js";
import { COLOR } from "../../../../constants.js";
import { Op } from "sequelize";
import { formatDate } from "../../../../util/helperFunctions.js";

/**
 * @param {import("../../../../types/Interaction.js").InteractionParam} interaction
 * @param {import("../../../../types/Interaction.js").ArgsParam<typeof import("../../../../interactions/index.js").BirthdayCommand>["view_list"]} args
 */
export async function view_list(interaction, args) {
	await interaction.deferReply({
		flags: args.hide ? MessageFlags.Ephemeral : undefined,
	});

	const users = await Users.findAll({ where: { birthday: { [Op.ne]: null } } });

	if (!users.length) {
		return await interaction.editReply({
			content: "No users have set their birthdays yet.",
		});
	}

	const list = users
		.map(
			(user) => `- <@${user.user_id}> - ${formatDate(new Date(user.birthday))}`,
		)
		.join("\n");

	const embed = addFields({
		color: COLOR.DarkButNotBlack,
		title: "🎉 Birthdays",
		description: list,
	});

	await interaction.editReply({ embeds: [embed] });
}
