import { Users } from "../../../../database.js";

/**
 * @param {import("discord.js").ChatInputCommandInteraction} interaction
 * @param {import("../../../../types/ArgumentsOf.js").ArgumentsOf<typeof import("../../../../interactions/index.js").PetSlashCommand>["rename"]} args
 */
export async function rename(interaction, args) {
	await interaction.deferReply();

	const user = await Users.findOne({ where: { user_id: interaction.user.id } });

	if (!user?.pets) {
		return await interaction.editReply({
			content: "You don't have to pet. To get a pet use `/get_a_pet` command.",
		});
	}

	const pet = { ...user.pets, name: args.new_name };

	await Users.update(
		{ pets: pet },
		{ where: { user_id: interaction.user.id } },
	);

	await interaction.editReply({
		content: `Your pet is now named **${args.new_name}**!`,
	});
}
