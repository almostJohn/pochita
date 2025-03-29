import { Events, inlineCode, italic } from "discord.js";
import { guildConfig } from "../util/config.js";

export default {
	name: Events.VoiceStateUpdate,
	/**
	 * @param {import("discord.js").VoiceState | null} oldState
	 * @param {import("discord.js").VoiceState} newState
	 * @param {import("discord.js").Client} client
	 */
	async execute(oldState, newState, client) {
		if (oldState?.member?.user.bot || newState.member?.user.bot) {
			return;
		}

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

			const fromIgnored = oldState?.channelId
				? ignoreChannels.includes(oldState.channelId)
				: false;
			const toIgnored = newState?.channelId
				? ignoreChannels.includes(newState.channelId)
				: false;

			let description = "";

			if ((!oldState.channel || fromIgnored) && newState.channel) {
				if (!newState.member || toIgnored) {
					return;
				}

				console.log(`Member ${newState.member.id} joined a voice channel`);

				description = `${inlineCode(newState.member.user.tag)} (${
					newState.member.id
				}) — ${italic(`joined ${newState.channel.toString()}`)}`;
			} else if (oldState?.channel && (!newState.channel || toIgnored)) {
				if (!oldState.member || fromIgnored) {
					return;
				}

				console.log(`Member ${oldState.member.id} left a voice channel`);

				description = `${inlineCode(oldState.member.user.tag)} (${
					oldState.member.id
				}) — ${italic(`left ${oldState.channel.toString()}`)}`;
			} else if (
				oldState?.channel &&
				newState.channel &&
				oldState.channelId !== newState.channelId
			) {
				if (!newState.member) {
					return;
				}

				console.log(`Member ${newState.member.id} left a voice channel`);

				description = `${inlineCode(newState.member.user.tag)} (${
					newState.member.id
				}) — ${italic(
					`moved from ${oldState.channel.toString()} to ${newState.channel.toString()}`,
				)}`;
			} else {
				return;
			}

			await webhook.send({
				content: description,
				username: "Server Log",
				avatarURL: client.user.displayAvatarURL(),
			});
		} catch (error_) {
			const error = /** @type {Error} */ (error_);
			console.error(error);
		}
	},
};
