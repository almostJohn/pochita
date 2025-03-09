const { Events, Client, ActivityType } = require("discord.js");

module.exports = {
	name: Events.ClientReady,
	once: true,
	/**
	 * @param {Client} client
	 */
	execute(client) {
		client.user.setPresence({
			activities: [
				{
					name: "tickets for support",
					type: ActivityType.Listening,
				},
			],
		});

		console.log(`Logged in as ${client.user.tag} (${client.user.id})`);
	},
};
