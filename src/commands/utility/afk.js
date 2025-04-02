import { Users } from "../../db.js";
import { inlineCode, MessageFlags } from "discord.js";
import { guildConfig } from "../../util/config.js";

export default {
	name: "afk",
	/**
	 * @param {import("../../types/Interaction.js").InteractionParam} interaction
	 * @param {import("../../types/Interaction.js").ArgsParam<typeof import("../../interactions/index.js").AFKCommand>} args
	 */
	async execute(interaction, args) {
		await interaction.deferReply({
			flags: args.hide ? MessageFlags.Ephemeral : undefined,
		});

		const targetUser = args.user?.user ?? interaction.user;

		if (!targetUser) {
			return await interaction.editReply({
				content: "User not found.",
			});
		}

		const reason = args.reason || "No reason just AFK";

		const member = interaction.guild.members.cache.get(targetUser.id);

		const inactiveRole = interaction.guild.roles.cache.find(
			(role) => role.id === guildConfig.inactiveRoleId,
		);

		if (!inactiveRole) {
			return await interaction.editReply({
				content: "Inactive role doesn't exist",
			});
		}

		if (member) {
			await Users.upsert({
				user_id: targetUser.id,
				reason,
				old_nickname: member.nickname || member.user.tag,
			});

			await member.setNickname(`[💤 AFK] ${member.user.tag}`).catch(() => null);

			if (inactiveRole) {
				await member.roles.add(inactiveRole.id, args.reason).catch(() => null);
			}
		}

		await interaction.editReply({
			content: `You are now AFK ${targetUser.toString()}: ${inlineCode(
				reason,
			)}`,
		});
	},
};
