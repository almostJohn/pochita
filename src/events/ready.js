import { Events, PermissionFlagsBits } from "discord.js";
import { guildConfig } from "../util/config.js";

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
				console.log("No permission to fetch webhooks");
				continue;
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

		console.log(`Logged in as ${client.user.tag} (${client.user.id})`);
	},
};
