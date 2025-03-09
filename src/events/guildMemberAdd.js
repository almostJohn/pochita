const { Events, GuildMember, Client, TextChannel } = require("discord.js");
const { generateMemberLog } = require("../util/generateMemberLog");
const { guildConfig } = require("../util/config");
const { Users } = require("../database");

module.exports = {
	name: Events.GuildMemberAdd,
	/**
	 * @param {GuildMember} guildMember
	 * @param {Client} client
	 */
	async execute(guildMember, client) {
		try {
			/** @type {TextChannel} */
			const memberLogChannel = guildMember.guild.channels.cache.find(
				(channel) => channel.id === guildConfig.memberLogChannelId,
			);

			if (!memberLogChannel) {
				return;
			}

			console.log(`Member ${guildMember.id} joined`);

			await Users.findOrCreate({ where: { user_id: guildMember.user.id } });

			memberLogChannel.send({ embeds: [generateMemberLog(guildMember)] });
		} catch (error) {
			console.error(error);
		}
	},
};
