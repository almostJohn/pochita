import { MessageFlags } from "discord.js";

export default {
	name: "ping",
	/**
	 * @param {import("../../types/Interaction.js").InteractionParam} interaction
	 * @param {import("../../types/Interaction.js").ArgsParam<typeof import("../../interactions/index.js").PingCommand>} args
	 */
	async execute(interaction, args) {
		await interaction.deferReply({
			flags: args.hide ? MessageFlags.Ephemeral : undefined,
		});

		await interaction.editReply({ content: "Ok" });
	},
};
