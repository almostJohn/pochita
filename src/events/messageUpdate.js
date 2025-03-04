const {
	Events,
	Client,
	Message,
	escapeMarkdown,
	TextChannel,
} = require("discord.js");
const { diffLines, diffWords } = require("diff");
const { color } = require("../util/color");
const { guildConfig } = require("../util/config");

module.exports = {
	name: Events.MessageUpdate,
	/**
	 * @param {Message} oldMessage
	 * @param {Message} newMessage
	 * @param {Client} client
	 */
	execute(oldMessage, newMessage, client) {
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
			const guildLogChannelId = guildConfig.guildLogChannelId;

			if (!guildLogChannelId) {
				return;
			}

			/** @type {TextChannel} */
			const guildLogChannel = newMessage.guild.channels.cache.find(
				(channel) => channel.id === guildLogChannelId,
			);

			if (!guildLogChannel) {
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
						return;
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

			const info = `
        • Channel: ${newMessage.channel.toString()} - \`${
				newMessage.inGuild() ? newMessage.channel.name : ""
			}\` (${newMessage.channel.id})\n• [Jump to](${newMessage.url})
      `;
			const embed = {
				color: color.Teal,
				title: "Message updated",
				author: {
					name: `${newMessage.author.tag} (${newMessage.author.id})`,
					icon_url: newMessage.author.displayAvatarURL(),
				},
				description,
				footer: { text: newMessage.id },
				timestamp: new Date().toISOString(),
				fields: [
					{
						name: "\u200B",
						value: info,
					},
				],
			};

			guildLogChannel.send({
				embeds: [embed],
			});
		} catch (error) {
			console.error(error);
		}
	},
};
