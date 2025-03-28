import { Events, inlineCode } from "discord.js";
import { COLOR } from "../constants.js";
import { guildConfig } from "../util/config.js";
import { logger } from "../logger.js";
import { addFields } from "../util/embed.js";

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
			/** @type {import("discord.js").APIEmbedAuthor} */
			let author;

			if ((!oldState.channel || fromIgnored) && newState.channel) {
				if (!newState.member || toIgnored) {
					return;
				}

				logger.info(`Member ${newState.member.id} joined a voice channel`);

				description = `Joined ${newState.channel.toString()} - ${inlineCode(
					newState.channel.name,
				)} (${newState.channel.id})`;
				author = {
					name: `${newState.member.user.tag} (${newState.member.id})`,
					icon_url: newState.member.user.displayAvatarURL(),
				};
			} else if (oldState?.channel && (!newState.channel || toIgnored)) {
				if (!oldState.member || fromIgnored) {
					return;
				}

				logger.info(`Member ${oldState.member.id} left a voice channel`);

				description = `Left ${oldState.channel.toString()} - ${inlineCode(
					oldState.channel.name,
				)} (${oldState.channel.id})`;
				author = {
					name: `${oldState.member.user.tag} (${oldState.member.id})`,
					icon_url: oldState.member.user.displayAvatarURL(),
				};
			} else if (
				oldState?.channel &&
				newState.channel &&
				oldState.channelId !== newState.channelId
			) {
				if (!newState.member) {
					return;
				}

				logger.info(`Member ${newState.member.id} left a voice channel`);

				description = `Moved from ${oldState.channel.toString()} - ${inlineCode(
					oldState.channel.name,
				)} (${
					oldState.channel.id
				}) to ${newState.channel.toString()} - ${inlineCode(
					newState.channel.name,
				)} (${newState.channel.id})`;
				author = {
					name: `${newState.member.user.tag} (${newState.member.id})`,
					icon_url: newState.member.user.displayAvatarURL(),
				};
			} else {
				return;
			}

			const embed = addFields({
				description,
				author,
				color: COLOR.Blurple,
				title: "Voice state update",
				timestamp: new Date().toISOString(),
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
