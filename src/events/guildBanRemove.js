const {
	Client,
	Events,
	GuildBan,
	AuditLogEvent,
	TextChannel,
} = require("discord.js");
const { setTimeout: pSetTimeout } = require("node:timers/promises");
const { color } = require("../util/color");
const { guildConfig } = require("../util/config");
const { AUDIT_LOG_WAIT_SECONDS } = require("../util/constants");

module.exports = {
	name: Events.GuildBanRemove,
	/**
	 * @param {GuildBan} guildBan
	 * @param {Client} client
	 */
	async execute(guildBan, client) {
		try {
			const modLogChannelId = guildConfig.modLogChannelId;

			if (!modLogChannelId) {
				return;
			}

			/** @type {TextChannel} */
			const modLogChannel = guildBan.guild.channels.cache.find(
				(channel) => channel.id === modLogChannelId,
			);

			if (!modLogChannel) {
				return;
			}

			console.log(`Member ${guildBan.user.id} unbanned`);

			await pSetTimeout(AUDIT_LOG_WAIT_SECONDS * 1_000);
			const auditLogs = await guildBan.guild.fetchAuditLogs({
				limit: 10,
				type: AuditLogEvent.MemberBanRemove,
			});
			const logs = auditLogs.entries.find(
				(log) => log.target.id === guildBan.user.id,
			);

			console.log(`Fetched logs for unban ${guildBan.user.id}`);

			const descriptionParts = [
				`**Member:** \`${guildBan.user.tag}\` (${guildBan.user.id})`,
				`**Action:** Unban`,
				`**Reason:** ${logs.reason || "No reason provided."}`,
			];

			const embed = {
				author: {
					name: `${logs.executor.tag} (${logs.executor.id})`,
					icon_url: logs.executor.displayAvatarURL(),
				},
				color: color.Green,
				description: descriptionParts.join("\n"),
				timestamp: new Date().toISOString(),
			};

			await modLogChannel.send({ embeds: [embed] });
		} catch (error) {
			console.error(error);
		}
	},
};
