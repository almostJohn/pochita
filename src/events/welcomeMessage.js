const {
	Events,
	GuildMember,
	Client,
	TextChannel,
	italic,
} = require("discord.js");
const { guildConfig } = require("../util/config");
const { getOrdinal } = require("../util/getOrdinal");
const { color } = require("../util/color");
const { Users } = require("../database");
const { addFields } = require("../util/embed");

module.exports = {
	name: Events.GuildMemberAdd,
	/**
	 * @param {GuildMember} guildMember
	 * @param {Client} client
	 */
	async execute(guildMember, client) {
		if (guildMember.user.bot) {
			return;
		}

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

			const roleId = guildConfig.discordMemberId;

			if (!roleId) {
				return;
			}

			const role = guildMember.guild.roles.cache.find(
				(role) => role.id === roleId,
			);

			if (!role) {
				return;
			}

			await Users.findOrCreate({ where: { user_id: guildMember.user.id } });

			const parts = [
				`- You're the ${italic(
					getOrdinal(guildMember.guild.memberCount),
				)} member of this server.`,
				`- Check and read our <#1346783641778389032>`,
				`- Thank you for joining. I hope you enjoy your stay here 💖`,
			];

			const embed = addFields({
				author: {
					name: `Welcome to ${guildMember.guild.name}`,
					icon_url: guildMember.guild.iconURL(),
				},
				color: color.Blurple,
				description: parts.join("\n"),
			});

			guildMember.roles.add(role.id);
			console.log(`${role.id} applied to ${guildMember.id}`);

			mainChannel.send({
				content: `## WELCOME ${guildMember.user.toString()}`,
				embeds: [embed],
			});
		} catch (error) {
			console.error(error);
		}
	},
};
