import { Events } from "discord.js";
import { guildConfig } from "../util/config.js";
import { COLOR } from "../constants.js";
import { addFields } from "../util/embed.js";

export default {
	name: Events.ThreadCreate,
	/**
	 * @param {import("discord.js").ThreadChannel} thread
	 * @param {boolean} newlyCreated
	 * @param {import("discord.js").Client} client
	 */
	async execute(thread, newlyCreated, client) {
		try {
			if (!newlyCreated) {
				return;
			}

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

			console.log(`Thread ${thread.name} created`);

			const descriptionParts = [
				`• Thread: ${thread.toString()} \`${thread.name}\` (${thread.id})`,
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
				title: "Thread created",
				timestamp: (thread.createdAt ?? new Date()).toISOString(),
				color: COLOR.Fuchsia,
			});

			await webhook.send({
				embeds: [embed],
				username: client.user.username,
				avatarURL: client.user.displayAvatarURL(),
			});
		} catch (error_) {
			const error = /** @type {Error} */ (error_);
			console.error(error.message, error);
		}
	},
};
