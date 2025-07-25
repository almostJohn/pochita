import { Events, messageLink, MessageType } from "discord.js";
import { guildConfig } from "../util/config.js";
import { addFields } from "../util/embed.js";
import { COLOR } from "../constants.js";

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

			const infoParts = [
				`• Channel: ${message.channel.toString()} - \`${
					message.channel.name
				}\` (${message.channel.id})`,
			];

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
						.map((sticker) => `\`${sticker.name}\``)
						.join(", ")}`,
				);
			}

			infoParts.push(`• [Jump to](${message.url})`);

			if (
				message.type === MessageType.Reply &&
				message.reference &&
				message.mentions.repliedUser
			) {
				const { channelId, guildId, messageId } = message.reference;
				const replyURL = messageLink(channelId, messageId, guildId);

				infoParts.push(
					message.mentions.users.has(message.mentions.repliedUser.id)
						? `• @Replying to [${messageId}](${replyURL}) by \`${message.mentions.repliedUser.tag}\` (${message.mentions.repliedUser.id})`
						: `• Replying to [${messageId}](${replyURL}) by \`${message.mentions.repliedUser.tag}\` (${message.mentions.repliedUser.id})`,
				);
			}

			const embed = addFields({
				author: {
					name: `${message.author.tag} (${message.author.id})`,
					icon_url: message.author.displayAvatarURL(),
				},
				color: COLOR.Purple,
				title: "Message deleted",
				description: `${
					message.content.length ? message.content : "No message content"
				}`,
				fields: [
					{
						name: "\u200B",
						value: infoParts.join("\n"),
					},
				],
				footer: {
					text: message.id,
				},
				timestamp: new Date().toISOString(),
			});

			await webhook.send({
				embeds: [embed],
				username: client.user.username,
				avatarURL: client.user.displayAvatarURL(),
			});
		} catch (error_) {
			const error = /** @type {Error} */ (error_);
			console.error(error);
		}
	},
};
