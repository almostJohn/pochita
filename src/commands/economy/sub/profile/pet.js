import { COLOR } from "../../../../constants.js";
import { Users } from "../../../../database.js";
import { addFields } from "../../../../util/embed.js";

/**
 * @param {import("discord.js").ChatInputCommandInteraction} interaction
 * @param {import("../../../../types/ArgumentsOf.js").ArgumentsOf<typeof import("../../../../interactions/index.js").ProfileSlashCommand>["pet"]} args
 */
export async function pet(interaction, args) {
	await interaction.deferReply();

	const owner = await Users.findOne({ where: { user_id: args.owner.user.id } });

	if (!owner?.pets) {
		return interaction.editReply({
			content: `${args.owner.user.toString()} doesn't have a pet. To get a pet use \`/get_a_pet\` command.`,
		});
	}

	const progress = Math.floor((owner.pets.experience / 100) * 10);
	const progressBar = "🟩".repeat(progress) + "⬜".repeat(10 - progress);

	const hpDisplay =
		owner.pets.hp === 0
			? `0/${owner.pets.max_hp} (Fainted)`
			: `${owner.pets.hp}/${owner.pets.max_hp}`;

	const descriptionParts = [
		`## ${owner.pets.name}'s Profile`,
		`- **Pet Name:** ${owner.pets.name}`,
		`- **Pet Type:** ${owner.pets.type}`,
		`- **Pet HP:** ${hpDisplay}`,
		`- **Pet Current Level:** ${owner.pets.level}`,
	];

	const embed = addFields({
		author: {
			name: owner.pets.name,
			icon_url: owner.pets.pet_icon_url,
		},
		thumbnail: {
			url: owner.pets.pet_icon_url,
		},
		color: COLOR.DarkButNotBlack,
		description: descriptionParts.join("\n"),
		fields: [
			{
				name: "XP",
				value: `${progressBar} **(${owner.pets.experience}/100)**`,
			},
		],
		footer: {
			text: `requested by ${interaction.user.tag}`,
		},
		timestamp: new Date().toISOString(),
	});

	await interaction.editReply({
		embeds: [embed],
	});
}
