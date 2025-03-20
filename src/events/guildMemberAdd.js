import { Events } from "discord.js";
import { guildConfig } from "../util/config.js";
import { COLOR } from "../constants.js";
import { colorFromDuration } from "../util/colorFromDuration.js";
import { addFields } from "../util/embed.js";

export default {
	name: Events.GuildMemberAdd,
	/**
	 * @param {import("discord.js").GuildMember} guildMember
	 * @param {import("discord.js").Client} client
	 */
	async execute(guildMember, client) {
		try {
			const mainChannelWebookId = guildConfig.mainChannelWebhookId;

			if (!mainChannelWebookId) {
				return;
			}

			/** @type {import("discord.js").Webhook} */
			const webhook = client.webhooks.get(mainChannelWebookId);

			if (!webhook) {
				return;
			}

			let joined = true;

			const embed = addFields({
				color: joined
					? colorFromDuration(Date.now() - guildMember.user.createdTimestamp)
					: COLOR.DarkButNotBlack,
				description: `${guildMember.user.toString()} - \`${
					guildMember.user.tag
				}\` has joined the server.`,
			});

			console.log(`Member joined ${guildMember.user.id}`);

			await webhook.send({
				embeds: [embed],
				username: client.user.username,
				avatarURL: client.user.displayAvatarURL(),
			});
		} catch (error) {
			console.error(error);
		}
	},
};
