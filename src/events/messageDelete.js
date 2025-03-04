const {
	Events,
	Client,
	Message,
	messageLink,
	MessageType,
	TextChannel,
} = require("discord.js");
const { color } = require("../util/color");
const { guildConfig } = require("../util/config");

module.exports = {
	name: Events.MessageDelete,
	/**
	 * @param {Message} message
	 * @param {Client} client
	 */
	execute(message, client) {
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
			const guildLogChannelId = guildConfig.guildLogChannelId;

			if (!guildLogChannelId) {
				return;
			}

			/** @type {TextChannel} */
			const guildLogChannel = message.guild.channels.cache.find(
				(channel) => channel.id === guildLogChannelId,
			);

			if (!guildLogChannel) {
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
						.map((sticker) => `${sticker.name}`)
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
						? `• @Replying to [${messageId}](${replyURL}) by \`${message.mentions.repliedUser.tag}\` (${message.mentions.repliedUser.id})`
						: `• Replying to [${messageId}](${replyURL}) by \`${message.mentions.repliedUser.tag}\` (${message.mentions.repliedUser.id})`,
				);
			}

			const embed = {
				color: color.Yellow,
				title: "Message deleted",
				author: {
					name: `${message.author.tag} (${message.author.id})`,
					icon_url: message.author.displayAvatarURL(),
				},
				description: `${
					message.content.length ? message.content : "No message content"
				}`,
				fields: [
					{
						name: "\u200B",
						value: infoParts.join("\n"),
					},
				],
				footer: { text: message.id },
				timestamp: new Date().toISOString(),
			};

			guildLogChannel.send({
				embeds: [embed],
			});
		} catch (error) {
			console.error(error);
		}
	},
};
