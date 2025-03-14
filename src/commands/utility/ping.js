import { SlashCommandBuilder, MessageFlags } from "discord.js";

export default {
	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Health check"),
	/**
	 * @param {import("discord.js").ChatInputCommandInteraction} interaction
	 * @param {import("discord.js").Client} client
	 */
	async execute(interaction, _client) {
		await interaction.deferReply({ flags: MessageFlags.Ephemeral });

		const ping = interaction.client.ws.ping;
		const status = ping >= 100 ? "Health is not ok 📉" : "Health is ok 📈";

		await interaction.editReply({
			content: `${status}, ping: \`${ping}\` ms`,
		});
	},
};
