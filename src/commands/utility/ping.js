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

		await interaction.editReply({
			content: `Health is ok 📈, ping: \`${interaction.client.ws.ping}\` ms`,
		});
	},
};
