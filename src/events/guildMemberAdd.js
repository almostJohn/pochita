const { Events, GuildMember, Client, Webhook } = require("discord.js");
const { guildConfig } = require("../util/config");

module.exports = {
	name: Events.GuildMemberAdd,
	/**
	 * @param {GuildMember} guildMember
	 * @param {Client} client
	 */
	async execute(guildMember, client) {
		try {
			const mainChannelWebookId = guildConfig.mainChannelWebhookId;

			if (!mainChannelWebookId) {
				return;
			}

			/** @type {Webhook} */
			const webhook = client.webhooks.get(mainChannelWebookId);

			if (!webhook) {
				return;
			}

			console.log(`Member joined ${guildMember.user.id}`);

			await webhook.send({
				content: `${guildMember.user.toString()} **(${
					guildMember.user.tag
				})** has joined the server.`,
				username: client.user.username,
				avatarURL: client.user.displayAvatarURL(),
			});
		} catch (error) {
			console.error(error);
		}
	},
};
