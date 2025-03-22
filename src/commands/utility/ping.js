import { MessageFlags } from "discord.js";

export default {
	name: "ping",
	/**
	 * @param {import("discord.js").ChatInputCommandInteraction<"cached">} interaction
	 * @param {import("../../types/ArgumentsOf.js").ArgumentsOf<typeof import("../../interactions/index.js").PingCommand>} args
	 */
	async execute(interaction, args) {
		await interaction.deferReply({
			flags: args.hide ? MessageFlags.Ephemeral : undefined,
		});

		await interaction.editReply({ content: "Ok" });
	},
};
