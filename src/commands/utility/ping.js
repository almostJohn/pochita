const {
	SlashCommandBuilder,
	CommandInteraction,
	Client,
	MessageFlags,
} = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Health check"),
	/**
	 * @param {CommandInteraction<"cached">} interaction
	 * @param {Client} client
	 */
	async execute(interaction, client) {
		await interaction.deferReply({ flags: MessageFlags.Ephemeral });

		const ping = interaction.client.ws.ping;
		const status = ping >= 100 ? "Health is not ok 📉" : "Health is ok 📈";

		await interaction.editReply({
			content: `${status}, ping: \`${ping}\` ms`,
		});
	},
};
