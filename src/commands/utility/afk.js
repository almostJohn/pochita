import { Users } from "../../db.js";
import { inlineCode, MessageFlags } from "discord.js";

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

		const reason = args.reason || "No reason just AFK";

		const member = interaction.guild.members.cache.get(interaction.user.id);

		if (member) {
			await Users.upsert({
				user_id: interaction.user.id,
				reason,
				old_nickname: member.nickname || member.user.tag,
			});

			await member.setNickname(`[💤 AFK] ${member.user.tag}`).catch(() => null);
		}

		await interaction.editReply({
			content: `You are now AFK: ${inlineCode(reason)}`,
		});
	},
};
