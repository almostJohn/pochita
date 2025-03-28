import { Events } from "discord.js";
import { guildConfig } from "../util/config.js";
import { generateMemberLog } from "../util/generateMemberLog.js";
import { logger } from "../logger.js";

export default {
	name: Events.GuildMemberAdd,
	/**
	 * @param {import("discord.js").GuildMember} guildMember
	 * @param {import("discord.js").Client} client
	 */
	async execute(guildMember, client) {
		try {
			const { memberLogWebhookId } = guildConfig;

			if (!memberLogWebhookId) {
				return;
			}

			/** @type {import("discord.js").Webhook} */
			const webhook = client.webhooks.get(memberLogWebhookId);

			if (!webhook) {
				return;
			}

			logger.info(`Member joined ${guildMember.user.id}`);

			await webhook.send({
				embeds: [generateMemberLog(guildMember)],
				username: client.user.username,
				avatarURL: client.user.displayAvatarURL(),
			});
		} catch (error_) {
			const error = /** @type {Error} */ (error_);
			console.error(error, error.message);
		}
	},
};
