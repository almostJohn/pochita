import { MessageType, messageLink, Events, inlineCode } from "discord.js";
import { COLOR } from "../constants.js";
import { guildConfig } from "../util/config.js";
import { logger } from "../logger.js";
import { addFields } from "../util/embed.js";

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

			logger.info(
				`Message by ${message.author.id} deleted in channel ${message.channelId}`,
			);

			const infoParts = [
				`• Channel: ${message.channel.toString()} - ${inlineCode(
					message.channel.name,
				)} (${message.channel.id})`,
			];

			let embed = addFields({
				author: {
					name: `${message.author.tag} (${message.author.id})`,
					icon_url: message.author.displayAvatarURL(),
				},
				title: "Message deleted",
				color: COLOR.Teal,
				description: `${
					message.content.length ? message.content : "No message content"
				}`,
				footer: {
					text: message.id,
				},
				timestamp: new Date().toISOString(),
			});

			if (!message.content && message.embeds.length) {
				infoParts.push(`• Embeds: ${message.embeds.length}`);
			}

			if (message.attachments.size) {
				const attachmentParts = [];
				let counter = 1;
				for (const attachment of message.attachments.values()) {
					attachmentParts.push(`[${counter}](${attachment.proxyURL})`);
					counter++;
				}

				infoParts.push(`• Attachments: ${attachmentParts.join(" ")}`);
			}

			if (message.stickers.size) {
				infoParts.push(
					`• Stickers: ${message.stickers
						.map((sticker) => inlineCode(sticker.name))
						.join(", ")}`,
				);
			}

			infoParts.push(`• [Jump to](${message.url})`);

			if (
				message.type === MessageType.Reply &&
				message.reference &&
				message.mentions.repliedUser
			) {
				const { channelId, messageId, guildId } = message.reference;
				const replyURL = messageLink(channelId, messageId, guildId);

				infoParts.push(
					message.mentions.users.has(message.mentions.repliedUser.id)
						? `• @Replying to [${messageId}](${replyURL}) by ${inlineCode(
								message.mentions.repliedUser.tag,
						  )} (${message.mentions.repliedUser.id})`
						: `• Replying to [${messageId}](${replyURL}) by ${inlineCode(
								message.mentions.repliedUser.tag,
						  )} (${message.mentions.repliedUser.id})`,
				);
			}

			embed = addFields(embed, {
				name: "\u200B",
				value: infoParts.join("\n"),
			});

			await webhook.send({
				embeds: [embed],
				username: client.user.username,
				avatarURL: client.user.displayAvatarURL(),
			});
		} catch (error_) {
			const error = /** @type {Error} */ (error_);
			logger.error(error, error.message);
		}
	},
};
