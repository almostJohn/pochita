const {
	Client,
	Events,
	GuildMember,
	AuditLogEvent,
	TextChannel,
	time,
	TimestampStyles,
} = require("discord.js");
const { setTimeout: pSetTimeout } = require("node:timers/promises");
const { color } = require("../util/color");
const { guildConfig } = require("../util/config");
const { AUDIT_LOG_WAIT_SECONDS } = require("../util/constants");
const dayjs = require("dayjs");
const relativeTime = require("dayjs/plugin/relativeTime.js");
const { addFields } = require("../util/embed");

dayjs.extend(relativeTime);

module.exports = {
	name: Events.GuildMemberUpdate,
	/**
	 * @param {GuildMember} oldMember
	 * @param {GuildMember} newMember
	 * @param {Client} client
	 */
	async execute(oldMember, newMember, client) {
		try {
			const modLogChannelId = guildConfig.modLogChannelId;

			if (!modLogChannelId) {
				return;
			}

			/** @type {TextChannel} */
			const modLogChannel = oldMember.guild.channels.cache.find(
				(channel) => channel.id === modLogChannelId,
			);

			if (
				!modLogChannel ||
				oldMember.communicationDisabledUntilTimestamp ===
					newMember.communicationDisabledUntilTimestamp ||
				(newMember.communicationDisabledUntilTimestamp ??
					Number.POSITIVE_INFINITY) < Date.now()
			) {
				return;
			}

			await pSetTimeout(AUDIT_LOG_WAIT_SECONDS * 1_000);

			const auditLogs = await oldMember.guild.fetchAuditLogs({
				limit: 10,
				type: AuditLogEvent.MemberUpdate,
			});
			const logs = auditLogs.entries.find(
				(log) =>
					log.target.id === oldMember.user.id &&
					log.changes.some(
						(change) => change.key === "communication_disabled_until",
					),
			);

			if (!logs.changes) {
				return;
			}

			const timeoutChange = logs.changes.find(
				(change) => change.key === "communication_disabled_until",
			);

			if (!timeoutChange) {
				return;
			}

			const timeoutEnded = Boolean(timeoutChange.old && !timeoutChange.new);

			console.log(`Member ${oldMember.id} timed out`);
			console.log(
				`Fetched logs for timeout ${timeoutEnded ? "end" : ""} ${oldMember.id}`,
			);

			const duration = time(
				dayjs(newMember.communicationDisabledUntilTimestamp).unix(),
				TimestampStyles.RelativeTime,
			);

			const descriptionParts = [
				`**Member:** \`${oldMember.user.tag}\` (${oldMember.id})`,
				`**Action:** Timeout`,
				`**Expiration:** ${duration}`,
				`**Reason:** ${logs.reason || "No reason provided"}`,
			];

			const embed = addFields({
				author: {
					name: `${logs.executor.tag} (${logs.executor.id})`,
					icon_url: logs.executor.displayAvatarURL(),
				},
				color: color.Orange,
				description: descriptionParts.join("\n"),
				timestamp: new Date().toISOString(),
			});

			const message = await modLogChannel.send({
				embeds: [embed],
			});

			const timeoutRemaining =
				newMember.communicationDisabledUntilTimestamp - Date.now();
			if (timeoutRemaining > 0) {
				await pSetTimeout(timeoutRemaining);
			}

			if (message) {
				const timeoutEndedDescriptionParts = [
					`**Member:** \`${oldMember.user.tag}\` (${oldMember.id})`,
					`**Action:** Timeout End`,
					`**Reason:** Timeout expired based on duration`,
					`**Reference:** [${message.id}](${message.url})`,
				];

				const timeoutEndedEmbed = addFields({
					author: {
						name: `${client.user.tag} (${client.user.id})`,
						icon_url: client.user.displayAvatarURL(),
					},
					color: 3_092_790,
					description: timeoutEndedDescriptionParts.join("\n"),
					timestamp: new Date().toISOString(),
				});

				await modLogChannel.send({
					embeds: [timeoutEndedEmbed],
				});
			}
		} catch (error) {
			console.error(error);
		}
	},
};
