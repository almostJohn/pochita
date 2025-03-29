import { Events, inlineCode, italic } from "discord.js";
import { guildConfig } from "../util/config.js";

export default {
	name: Events.GuildMemberAdd,
	/**
	 * @param {import("discord.js").GuildMember} guildMember
	 * @param {import("discord.js").Client} client
	 */
	async execute(guildMember, client) {
		try {
			const { memberLogWebhookId } = guildConfig;

			if (!memberLogWebhookId) {
				return;
			}

			/** @type {import("discord.js").Webhook} */
			const webhook = client.webhooks.get(memberLogWebhookId);

			if (!webhook) {
				return;
			}

			console.log(`Member ${guildMember.user.id} joined`);

			await webhook.send({
				content: `${inlineCode(guildMember.user.tag)} (${
					guildMember.user.id
				}) — ${italic("has joined the server")}!`,
				username: "Member Log",
				avatarURL: client.user.displayAvatarURL(),
			});
		} catch (error_) {
			const error = /** @type {Error} */ (error_);
			console.error(error, error.message);
		}
	},
};
