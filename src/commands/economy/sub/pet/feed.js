import { Users } from "../../../../database.js";

/**
 * @param {import("discord.js").ChatInputCommandInteraction} interaction
 * @param {import("../../../../types/ArgumentsOf.js").ArgumentsOf<typeof import("../../../../interactions/index.js").PetSlashCommand>["feed"]} _args
 */
export async function feed(interaction, _args) {
	await interaction.deferReply();

	const user = await Users.findOne({ where: { user_id: interaction.user.id } });

	if (!user?.pets) {
		return await interaction.editReply({
			content: "You don't have a pet. To get a pet use `/get_a_pet` command.",
		});
	}

	const pet = { ...user.pets };

	if (pet.hp === pet.max_hp) {
		return await interaction.editReply({
			content: `**${pet.name}**'s HP is already full! No need to feed.`,
		});
	}

	pet.hp = pet.max_hp;

	await Users.update(
		{ pets: pet },
		{ where: { user_id: interaction.user.id } },
	);

	await interaction.editReply({
		content: `You fed your pet **${pet.name}**! HP restored to **${pet.hp}/${pet.max_hp}**.`,
	});
}
