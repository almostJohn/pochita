import { Events, escapeMarkdown, inlineCode, italic } from "discord.js";
import { guildConfig } from "../util/config.js";

export default {
	name: Events.MessageUpdate,
	/**
	 * @param {import("discord.js").Message} oldMessage
	 * @param {import("discord.js").Message} newMessage
	 * @param {import("discord.js").Client} client
	 */
	async execute(oldMessage, newMessage, client) {
		if (newMessage.author.bot) {
			return;
		}

		if (!newMessage.inGuild()) {
			return;
		}

		if (
			escapeMarkdown(oldMessage.content) === escapeMarkdown(newMessage.content)
		) {
			return;
		}

		try {
			const { guildLogWebhookId, logIgnoreChannels: ignoreChannels } =
				guildConfig;

			if (!guildLogWebhookId) {
				return;
			}

			/**
			 * @type {import("discord.js").Webhook}
			 */
			const webhook = client.webhooks.get(guildLogWebhookId);

			if (!webhook) {
				return;
			}

			if (
				ignoreChannels.includes(newMessage.channelId) ||
				(newMessage.channel.parentId &&
					ignoreChannels.includes(newMessage.channel.parentId)) ||
				(newMessage.channel.parent.parentId &&
					ignoreChannels.includes(newMessage.channel.parent.parentId))
			) {
				return;
			}

			console.log(`Member ${newMessage.author.id} updated a message`);

			await webhook.send({
				content: `${inlineCode(newMessage.author.tag)} (${
					newMessage.author.id
				}) — ${italic(`edited their [message](${newMessage.url})`)}!`,
				username: "Server Log",
				avatarURL: client.user.displayAvatarURL(),
			});
		} catch (error_) {
			const error = /** @type {Error} */ (error_);
			console.error(error);
		}
	},
};
