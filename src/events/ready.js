import { Events, PermissionFlagsBits } from "discord.js";
import { guildConfig } from "../util/config.js";
import { checkBirthdays } from "../util/checkBirthdays.js";
import { logger } from "../logger.js";

export default {
	name: Events.ClientReady,
	once: true,
	/**
	 * @param {import("discord.js").Client} client
	 */
	async execute(client) {
		console.log("Caching webhooks");

		for (const guild of client.guilds.cache.values()) {
			if (
				!guild.members.me.permissions.has(
					PermissionFlagsBits.ManageWebhooks,
					true,
				)
			) {
				logger.warn("No permission to fetch webhooks");
				return;
			}

			const { memberLogWebhookId, guildLogWebhookId } = guildConfig;

			const webhooks = await guild.fetchWebhooks();

			if (memberLogWebhookId) {
				const webhook = webhooks.get(memberLogWebhookId);

				if (!webhook) {
					continue;
				}

				client.webhooks.set(webhook.id, webhook);
			}

			if (guildLogWebhookId) {
				const webhook = webhooks.get(guildLogWebhookId);

				if (!webhook) {
					return;
				}

				client.webhooks.set(webhook.id, webhook);
			}
		}

		await checkBirthdays(client);

		logger.info(`Logged in as ${client.user.tag} (${client.user.id})`);
	},
};
