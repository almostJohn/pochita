import dayjs from "dayjs";
import utc from "dayjs";
import { messageLink, MessageType } from "discord.js";
import { DATE_FORMAT_WITH_SECONDS } from "../constants.js";

dayjs.extend(utc);

/**
 * @param {import("discord.js").Collection<import("discord.js").Snowflake, import("discord.js").Message | import("discord.js").PartialMessage>} messages
 */
export function formatMessagesToAttachment(messages) {
	return messages
		.map((message) => {
			const outParts = [
				`[${dayjs(message.createdTimestamp)
					.utc()
					.format(DATE_FORMAT_WITH_SECONDS)} (UTC)] ${
					message.author.tag ?? "Unknown author"
				} (${message.author.id ?? "Unknown author"}): ${
					message.cleanContent ? message.content.replaceAll("\n", "\n") : ""
				}`,
			];

			if (message.attachments.size) {
				outParts.push(
					message.attachments
						.map((attachment) => `↳ Attachment: ${attachment.proxyURL}`)
						.join("\n"),
				);
			}

			if (message.stickers.size) {
				outParts.push(
					message.stickers
						.map((sticker) => `↳ Sticker: ${sticker.name}`)
						.join("\n"),
				);
			}

			if (
				message.type === MessageType.Reply &&
				message.reference &&
				message.mentions.repliedUser
			) {
				const { channelId, messageId, guildId } = message.reference;
				const replyURL = messageLink(channelId, messageId, guildId);

				outParts.push(
					message.mentions.users.has(message.mentions.repliedUser.id)
						? `↳ @Replying to ${messageId} (${replyURL}) by \`${message.mentions.repliedUser.tag}\` (${message.mentions.repliedUser.id})`
						: `↳ Replying to ${messageId} (${replyURL}) by \`${message.mentions.repliedUser.tag}\` (${message.mentions.repliedUser.id})`,
				);
			}

			outParts.join("\n");
		})
		.join("\n");
}
