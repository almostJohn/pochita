import { Events, inlineCode } from "discord.js";
import { COLOR } from "../constants.js";
import { guildConfig } from "../util/config.js";
import { logger } from "../logger.js";
import { addFields } from "../util/embed.js";

export default {
	name: Events.ThreadDelete,
	/**
	 * @param {import("discord.js").ThreadChannel} thread
	 * @param {import("discord.js").Client} client
	 */
	async execute(thread, client) {
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
				ignoreChannels.includes(thread.id) ||
				(thread.parentId && ignoreChannels.includes(thread.parentId)) ||
				(thread.parent.parentId &&
					ignoreChannels.includes(thread.parent.parentId))
			) {
				return;
			}

			logger.info(`Thread ${thread.name} deleted`);

			const descriptionParts = [
				`• Channel: ${inlineCode(thread.name)} (${thread.id})`,
			];

			const starterMessage = await thread
				.fetchStarterMessage()
				.catch(() => null);

			if (starterMessage) {
				descriptionParts.push(
					`• Starter message: ${inlineCode(starterMessage.id)}`,
					`• [Jump to starter message](${starterMessage.url})`,
				);
			}

			const owner = thread.ownerId
				? await client.users.fetch(thread.ownerId)
				: null;
			const embed = addFields({
				author: owner
					? {
							name: `${owner.tag} (${owner.id})`,
							icon_url: owner.displayAvatarURL(),
					  }
					: undefined,
				description: descriptionParts.join("\n"),
				color: COLOR.Fuchsia,
				title: "Thread deleted",
				timestamp: (thread.createdAt ?? new Date()).toISOString(),
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
