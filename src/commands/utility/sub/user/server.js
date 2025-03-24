import { MessageFlags } from "discord.js";
import { addFields } from "../../../../util/embed.js";
import { applyServerInfo } from "../../../../util/serverInfo.js";
import { COLOR } from "../../../../constants.js";

/**
 * @param {import("../../../../types/Interaction.js").InteractionParam} interaction
 * @param {import("../../../../types/Interaction.js").ArgsParam<typeof import("../../../../interactions/index.js").InfoCommand>["server"]} args
 */
export async function server(interaction, args) {
	await interaction.deferReply({
		flags: args.hide ? MessageFlags.Ephemeral : undefined,
	});

	const embed = addFields({
		color: COLOR.DarkButNotBlack,
	});

	const notices = await applyServerInfo(embed, interaction.guild);

	if (notices.length) {
		embed.fields = [
			...(embed.fields ?? []),
			{
				name: "Notices",
				value: notices.map((notice) => `- ${notice}`).join("\n"),
			},
		];
	}

	await interaction.editReply({ embeds: [embed] });
}
