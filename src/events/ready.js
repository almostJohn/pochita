const { Events, Client } = require("discord.js");

module.exports = {
	name: Events.ClientReady,
	once: true,
	/**
	 * @param {Client} client
	 */
	async execute(client, currency) {
		console.log(`Logged in as ${client.user.tag} (${client.user.id})`);
	},
};
