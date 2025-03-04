const {
	Events,
	GuildMember,
	Client,
	TextChannel,
	italic,
} = require("discord.js");
const { guildConfig } = require("../util/config");
const { getOrdinal } = require("../util/getOrdinal");

module.exports = {
	name: Events.GuildMemberAdd,
	/**
	 * @param {GuildMember} guildMember
	 * @param {Client} client
	 */
	execute(guildMember, client) {
		try {
			const mainChannelId = guildConfig.mainChannelId;

			if (!mainChannelId) {
				return;
			}

			/** @type {TextChannel} */
			const mainChannel = guildMember.guild.channels.cache.find(
				(channel) => channel.id === mainChannelId,
			);

			if (!mainChannel) {
				return;
			}

			const content = [
				`# 👋 Welcome to ${italic(guildMember.guild.name)}!`,
				`## Your the ${italic(
					getOrdinal(guildMember.guild.memberCount),
				)} member of this server, ${guildMember.user.tag}`,
				`### Thank you for joining, I hope you enjoy your stay here 💖`,
			];

			mainChannel.send({ content: content.join("\n") });
		} catch (error) {
			console.error(error);
		}
	},
};
