import { Events, inlineCode, italic } from "discord.js";
import { guildConfig } from "../util/config.js";

export default {
	name: Events.MessageDelete,
	/**
	 * @param {import("discord.js").Message} message
	 * @param {import("discord.js").Client} client
	 */
	async execute(message, client) {
		if (message.author.bot) {
			return;
		}

		if (!message.inGuild()) {
			return;
		}

		if (
			!message.content.length &&
			!message.embeds.length &&
			!message.attachments.size &&
			!message.stickers.size
		) {
			return;
		}

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
				ignoreChannels.includes(message.channelId) ||
				(message.channel.parentId &&
					ignoreChannels.includes(message.channel.parentId)) ||
				(message.channel.parent.parentId &&
					ignoreChannels.includes(message.channel.parent.parentId))
			) {
				return;
			}

			console.log(
				`Message by ${message.author.id} deleted in channel ${message.channelId}`,
			);

			await webhook.send({
				content: `${inlineCode(message.author.tag)} (${
					message.author.id
				}) — ${italic("unsent a message")}!`,
				username: "Server Log",
				avatarURL: client.user.displayAvatarURL(),
			});
		} catch (error_) {
			const error = /** @type {Error} */ (error_);
			console.error(error);
		}
	},
};
