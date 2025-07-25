import { Events, escapeMarkdown } from "discord.js";
import { guildConfig } from "../util/config.js";
import { addFields } from "../util/embed.js";
import { COLOR } from "../constants.js";
import { diffLines, diffWords } from "diff";

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

			let description = "";

			if (
				/```(.*?)```/s.test(oldMessage.content) &&
				/```(.*?)```/s.test(newMessage.content)
			) {
				const strippedOldMessage = /```(?:(\S+)\n)?\s*([^]+?)\s*```/.exec(
					oldMessage.content,
				);

				if (!strippedOldMessage?.[2]) {
					return;
				}

				const strippedNewMessage = /```(?:(\S+)\n)?\s*([^]+?)\s*```/.exec(
					newMessage.content,
				);

				if (!strippedNewMessage?.[2]) {
					return;
				}

				if (strippedOldMessage[2] === strippedNewMessage[2]) {
					return;
				}

				const diffMessage = diffLines(
					strippedOldMessage[2],
					strippedNewMessage[2],
					{ newlineIsToken: true },
				);

				for (const part of diffMessage) {
					if (part.value === "\n") {
						continue;
					}

					const deleted = part.added ? "+ " : part.removed ? "- " : "";
					description += `${deleted}${part.value.replaceAll("\n", "")}\n`;
				}

				const prepend = "```diff\n";
				const append = "\n```";
				description = `${prepend}${description.slice(0, 3_900)}${append}`;
			} else {
				const diffMessage = diffWords(
					escapeMarkdown(oldMessage.content),
					escapeMarkdown(newMessage.content),
				);

				for (const part of diffMessage) {
					const markdown = part.added ? "**" : part.removed ? "~~" : "";
					description += `${markdown}${part.value}${markdown}`;
				}

				description = `${description.slice(0, 3_900)}` || "\u200B";
			}

			const info = `• Channel: ${newMessage.channel.toString()} - ${
				newMessage.inGuild ? newMessage.channel.name : ""
			} (${newMessage.channel.id})\n• [Jump to](${newMessage.url})`;

			const embed = addFields({
				author: {
					name: `${newMessage.author.tag} (${newMessage.author.id})`,
					icon_url: newMessage.author.displayAvatarURL(),
				},
				color: COLOR.Purple,
				title: "Message updated",
				description,
				fields: [
					{
						name: "\u200B",
						value: info,
					},
				],
				footer: {
					text: newMessage.id,
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
