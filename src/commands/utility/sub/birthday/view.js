import { MessageFlags } from "discord.js";
import { Users } from "../../../../db.js";
import { formatDate } from "../../../../util/helperFunctions.js";

/**
 * @param {import("../../../../types/Interaction.js").InteractionParam} interaction
 * @param {import("../../../../types/Interaction.js").ArgsParam<typeof import("../../../../interactions/index.js").BirthdayCommand>["view"]} args
 */
export async function view(interaction, args) {
	await interaction.deferReply({
		flags: args.hide ? MessageFlags.Ephemeral : undefined,
	});

	const user = await Users.findOne({ where: { user_id: args.user.user.id } });

	if (!user || !user.birthday) {
		return await interaction.editReply({
			content: `${args.user.user.toString()} hasn't set their birthday yet.`,
		});
	}

	await interaction.editReply({
		content: `${args.user.user.toString()}'s birthday is on **${formatDate(
			new Date(user.birthday),
		)}**.`,
	});
}
