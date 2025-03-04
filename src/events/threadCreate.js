const { Client, Events, ThreadChannel, TextChannel } = require("discord.js");
const { color } = require("../util/color");
const { guildConfig } = require("../util/config");

module.exports = {
	name: Events.ThreadCreate,
	/**
	 * @param {ThreadChannel} thread
	 * @param {boolean} newlyCreated
	 * @param {Client} client
	 */
	async execute(thread, newlyCreated, client) {
		try {
			if (!newlyCreated) {
				return;
			}

			const guildLogChannelId = guildConfig.guildLogChannelId;

			if (!guildLogChannelId) {
				return;
			}

			/** @type {TextChannel} */
			const guildLogChannel = thread.guild.channels.cache.find(
				(channel) => channel.id === guildLogChannelId,
			);

			if (!guildLogChannel) {
				return;
			}

			console.log(`Thread ${thread.name} created`);

			const descriptionParts = [
				`• Thread: ${thread.toString()} - \`${thread.name}\` (${thread.id})`,
			];

			const starterMessage = await thread
				.fetchStarterMessage()
				.catch(() => null);

			if (starterMessage) {
				descriptionParts.push(
					`• Starter message: ${starterMessage.id}`,
					`• [Jump to starter message](${starterMessage.url})`,
				);
			}

			const owner = thread.ownerId
				? await thread.client.users.fetch(thread.ownerId)
				: null;
			const embed = {
				title: "Thread created",
				author: owner
					? {
							name: `${owner.tag} (${owner.id})`,
							icon_url: owner.displayAvatarURL(),
					  }
					: undefined,
				color: color.Fuchsia,
				description: descriptionParts.join("\n"),
				timestamp: (thread.createdAt ?? new Date()).toISOString(),
			};

			await guildLogChannel.send({ embeds: [embed] });
		} catch (error) {
			console.error(error);
		}
	},
};
