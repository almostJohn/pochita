const { Events, GuildMember, Client, TextChannel } = require("discord.js");
const { generateMemberLog } = require("../util/generateMemberLog");
const { guildConfig } = require("../util/config");

module.exports = {
	name: Events.GuildMemberAdd,
	/**
	 * @param {GuildMember} guildMember
	 * @param {Client} client
	 */
	execute(guildMember, client) {
		try {
			const memberLogChannelId = guildConfig.memberLogChannelId;

			if (!memberLogChannelId) {
				return;
			}

			/** @type {TextChannel} */
			const memberLogChannel = guildMember.guild.channels.cache.find(
				(channel) => channel.id === memberLogChannelId,
			);

			if (!memberLogChannel) {
				return;
			}

			console.log(`Member ${guildMember.id} joined`);

			memberLogChannel.send({
				embeds: [generateMemberLog(guildMember)],
			});
		} catch (error) {
			console.error(error);
		}
	},
};
