import { Users } from "../../../../database.js";

/**
 *
 * @param {import("discord.js").ChatInputCommandInteraction} interaction
 * @param {import("../../../../types/ArgumentsOf.js").ArgumentsOf<typeof import("../../../../interactions/index.js").PetSlashCommand>["train"]} _args
 */
export async function train(interaction, _args) {
	await interaction.deferReply();

	const user = await Users.findOne({ where: { user_id: interaction.user.id } });

	if (!user?.pets) {
		return await interaction.editReply({
			content: "You don't have a pet. To get a pet use `/get_a_pet` command.",
		});
	}

	const pet = { ...user.pets };

	if (pet.hp === 0) {
		return interaction.editReply({
			content: `**${pet.name}** is too weak to train! Feed your pet to restore it's HP.`,
		});
	}

	const rng = Math.random();
	let xpGain = 0;
	let hpLoss = 0;
	let message = "";

	if (rng < 0.7) {
		xpGain = Math.floor(Math.random() * 10) + 5;
		message = `**${pet.name}** trained hard and gained **${xpGain}** XP!`;
	} else {
		const enemyList = [
			"a wild Dragon",
			"a fierce Wolf Pack",
			"a cunning Bandit",
			"a raging Ogre",
			"a deadly Snake Pit",
			"a twin-headed Dragon",
			"a crazy Bandit with a large club",
		];
		const enemy = enemyList[Math.floor(Math.random() * enemyList.length)];
		hpLoss = Math.floor(Math.random() * 20) + 10;
		pet.hp = Math.max(0, pet.hp - hpLoss);
		message = `**${pet.name}** got caught by **${enemy}** and lost **${hpLoss}** HP!`;
	}

	pet.experience += xpGain;

	if (pet.experience >= 100) {
		pet.experience -= 100;
		pet.level += 1;
		message = `**${pet.name}** has leveled up to **Level ${pet.level}**!`;
	}

	await Users.update(
		{ pets: pet },
		{ where: { user_id: interaction.user.id } },
	);

	await interaction.editReply({
		content: message,
	});
}
