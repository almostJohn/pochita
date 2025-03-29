import { Events, inlineCode, italic } from "discord.js";
import { guildConfig } from "../util/config.js";

export default {
	name: Events.ThreadDelete,
	/**
	 * @param {import("discord.js").ThreadChannel} thread
	 * @param {import("discord.js").Client} client
	 */
	async execute(thread, client) {
		try {
			const { guildLogWebhookId, logIgnoreChannels: ignoreChannels } =
				guildConfig;

			if (!guildLogWebhookId) {
				return;
			}

			/** @type {import("discord.js").Webhook} */
			const webhook = client.webhooks.get(guildLogWebhookId);

			if (!webhook) {
				return;
			}

			if (
				ignoreChannels.includes(thread.id) ||
				(thread.parentId && ignoreChannels.includes(thread.parentId)) ||
				(thread.parent.parentId &&
					ignoreChannels.includes(thread.parent.parentId))
			) {
				return;
			}

			console.log(`Thread ${thread.name} deleted`);

			const owner = thread.ownerId
				? await client.users.fetch(thread.ownerId)
				: null;

			await webhook.send({
				content: `${inlineCode(owner.tag)} (${owner.id}) — ${italic(
					`deleted a thread ${inlineCode(thread.name)}`,
				)}!`,
				username: "Server Log",
				avatarURL: client.user.displayAvatarURL(),
			});
		} catch (error_) {
			const error = /** @type {Error} */ (error_);
			console.error(error);
		}
	},
};
