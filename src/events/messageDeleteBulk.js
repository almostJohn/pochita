import { Buffer } from "node:buffer";
import { Events } from "discord.js";
import { guildConfig } from "../util/config.js";
import { addFields } from "../util/embed.js";
import { COLOR } from "../constants.js";
import { formatMessagesToAttachment } from "../util/formatMessagesToAttachment.js";

export default {
	name: Events.MessageBulkDelete,
	/**
	 * @param {import("discord.js").Client} client
	 * @param {import("discord.js").Collection<import("discord.js").Snowflake, import("discord.js").Message | import("discord.js").PartialMessage>} messages
	 */
	async execute(client, messages) {
		const userMessages = messages.filter((message) => !message.author.bot);
		const firstMessage = userMessages.first();

		if (!firstMessage.inGuild()) {
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
				ignoreChannels.includes(firstMessage.channelId) ||
				(firstMessage.channel.parentId &&
					ignoreChannels.includes(firstMessage.channel.parentId)) ||
				(firstMessage.channel.parent.parentId &&
					ignoreChannels.includes(firstMessage.channel.parent.parentId))
			) {
				return;
			}

			const uniqueAuthors = new Set();
			for (const message of userMessages.values()) {
				if (message.author) {
					uniqueAuthors.add(message.author.id);
				}
			}

			const embed = addFields({
				author: {
					name:
						uniqueAuthors.size === 1
							? `${firstMessage.author.tag} (${firstMessage.author.id})`
							: "Multiple authors",
					icon_url:
						uniqueAuthors.size === 1
							? firstMessage.author.displayAvatarURL()
							: client.user.displayAvatarURL(),
				},
				color: COLOR.Purple,
				title: "Message deleted bulk",
				description: `• Channel: ${firstMessage.channel.toString()} - \`${
					firstMessage.inGuild() ? firstMessage.channel.name : ""
				}\` (${firstMessage.channel.id})`,
				timestamp: new Date().toISOString(),
			});

			await webhook.send({
				embeds: [embed],
				files: [
					{
						name: "logs.txt",
						attachment: Buffer.from(
							formatMessagesToAttachment(userMessages),
							"utf8",
						),
					},
				],
				username: client.user.username,
				avatarURL: client.user.displayAvatarURL(),
			});
		} catch (error_) {
			const error = /** @type {Error} */ (error_);
			console.error(error.message, error);
		}
	},
};
