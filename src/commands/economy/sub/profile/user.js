import { COLOR, ERROR_RESPONSES } from "../../../../constants.js";
import { Users } from "../../../../database.js";
import { addFields } from "../../../../util/embed.js";
import { formatNumberToStringWithComma } from "../../../../util/helperFunctions.js";

/**
 * @param {import("discord.js").ChatInputCommandInteraction} interaction
 * @param {import("../../../../types/ArgumentsOf.js").ArgumentsOf<typeof import("../../../../interactions/index.js").ProfileSlashCommand>["user"]} args
 */
export async function user(interaction, args) {
	await interaction.deferReply();

	const user = await Users.findOne({
		where: { user_id: args.user.user.id },
	});

	if (!user) {
		return await interaction.editReply({
			content: ERROR_RESPONSES.notOnSystem,
		});
	}

	const descriptionParts = [
		`## ${args.user.user.tag}'s Profile`,
		`- **Points:** ${formatNumberToStringWithComma(user.points)}`,
		`- **Vault:** ${formatNumberToStringWithComma(user.vault)}`,
	];

	if (user.pets) {
		descriptionParts.push(
			`- **Pet:** ${user.pets.name} (${user.pets.type}) - lvl: ${user.pets.level}`,
		);
	}

	const embed = addFields({
		author: {
			name: args.user.user.tag,
			icon_url: args.user.user.displayAvatarURL(),
		},
		thumbnail: {
			url: args.user.user.displayAvatarURL(),
		},
		color: COLOR.DarkButNotBlack,
		description: descriptionParts.join("\n"),
		footer: {
			text: `requested by ${interaction.user.tag}`,
		},
		timestamp: new Date().toISOString(),
	});

	await interaction.editReply({
		embeds: [embed],
	});
}
