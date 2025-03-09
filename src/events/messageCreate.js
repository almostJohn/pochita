const { Events, Client, Message, TextChannel } = require("discord.js");
const { Op } = require("sequelize");
const { Messages } = require("../database");
const { guildConfig } = require("../util/config");

module.exports = {
	name: Events.MessageCreate,
	/**
	 * @param {Message} message
	 * @param {Client} client
	 */
	async execute(message, client) {
		if (message.author.bot) {
			return;
		}

		try {
			const channelId = guildConfig.mainChannelId;

			if (!channelId) {
				return;
			}

			/** @type {TextChannel} */
			const channel = message.guild.channels.cache.find(
				(channel) => channel.id === channelId,
			);

			if (!channel) {
				return;
			}

			if (channel.id !== channelId) {
				return;
			}

			await Messages.create({
				message_id: message.id,
				user_id: message.author.id,
				user_tag: message.author.tag,
				channel_id: message.channel.id,
				content: message.content,
				timestamp: message.createdAt,
			});

			const sevenDaysAgo = new Date();
			sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

			await Messages.destroy({
				where: {
					timestamp: { [Op.lt]: sevenDaysAgo },
				},
			});

			console.log(`Saved message from ${message.author.id}`);
		} catch (error) {
			console.error(error);
		}
	},
};
