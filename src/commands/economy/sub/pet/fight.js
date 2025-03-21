import { Users } from "../../../../database.js";

/**
 * @param {import("discord.js").ChatInputCommandInteraction} interaction
 * @param {import("../../../../types/ArgumentsOf.js").ArgumentsOf<typeof import("../../../../interactions/index.js").PetSlashCommand>["fight"]} args
 */
export async function fight(interaction, args) {
	await interaction.deferReply();

	const initiatorUser = await Users.findOne({
		where: { user_id: interaction.user.id },
	});
	const targetedUser = await Users.findOne({
		where: { user_id: args.user.user.id },
	});

	if (!initiatorUser.pets || !targetedUser.pets) {
		return await interaction.editReply({
			content: "Both users must have a pet to fight",
		});
	}

	const initiatorPet = { ...initiatorUser.pets };
	const targetedPet = { ...targetedUser.pets };

	if (initiatorPet.hp === 0 || targetedPet.hp === 0) {
		return interaction.editReply({
			content: "One of the pets has fainted and unable to fight!",
		});
	}

	const winner = Math.random() < 0.5 ? initiatorPet : targetedPet;
	const loser = winner === initiatorPet ? targetedPet : initiatorPet;

	winner.experience += 50;
	loser.hp = 0;

	if (winner.experience >= 100) {
		winner.experience -= 100;
		winner.level += 1;
	}

	await Users.update(
		{ pets: initiatorPet },
		{ where: { user_id: interaction.user.id } },
	);
	await Users.update(
		{ pets: targetedPet },
		{ where: { user_id: args.user.user.id } },
	);

	await interaction.editReply({
		content: `Initiator: ${interaction.user.toString()} vs Targeted: ${args.user.user.toString()}\n\nBattle result: **${
			winner.name
		}** defeated **${loser.name}**! **${winner.name}** gained **50** XP!`,
	});
}
