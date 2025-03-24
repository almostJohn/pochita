import { MessageFlags } from "discord.js";
import { addFields } from "../../../../util/embed.js";
import {
	applyUserInfo,
	applyApplicationInfo,
	applyMemberInfo,
} from "../../../../util/userInfo.js";
import { COLOR } from "../../../../constants.js";

/**
 * @param {import("../../../../types/Interaction.js").InteractionParam} interaction
 * @param {import("../../../../types/Interaction.js").ArgsParam<typeof import("../../../../interactions/index.js").InfoCommand>["user"]} args
 */
export async function user(interaction, args) {
	await interaction.deferReply({
		flags: args.hide ? MessageFlags.Ephemeral : undefined,
	});

	const targetUser = args.user?.user ?? interaction.user;
	const member = await interaction.guild.members
		.fetch(targetUser.id)
		.catch(() => null);

	const embed = addFields({
		color: COLOR.DarkButNotBlack,
	});

	const notices = await applyUserInfo(embed, targetUser);

	if (member) {
		const memberNotices = await applyMemberInfo(embed, member);
		notices.push(...memberNotices);
	}

	if (targetUser.bot) {
		await applyApplicationInfo(embed, targetUser);
	}

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
