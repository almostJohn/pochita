const { Events, Client, VoiceState, TextChannel } = require("discord.js");
const { color } = require("../util/color");
const { guildConfig } = require("../util/config");

module.exports = {
	name: Events.VoiceStateUpdate,
	/**
	 * @param {VoiceState | null} oldState
	 * @param {VoiceState} newState
	 * @param {Client} client
	 */
	execute(oldState, newState, client) {
		if (oldState.member.user.bot || newState.member.user.bot) {
			return;
		}

		try {
			const guildLogChannelId = guildConfig.guildLogChannelId;

			if (!guildLogChannelId) {
				return;
			}

			/** @type {TextChannel} */
			const guildLogChannel = newState.guild.channels.cache.find(
				(channel) => channel.id === guildLogChannelId,
			);

			if (!guildLogChannel) {
				return;
			}

			let description = "";
			let author;

			if (!oldState.channel && newState.channel) {
				if (!newState.member) {
					return;
				}

				console.log(`Member ${newState.member.id} joined a voice channel`);

				description = `Joined ${newState.channel.toString()} - \`${
					newState.channel.name
				}\` (${newState.channel.id})`;
				author = {
					name: `${newState.member.user.tag} (${newState.member.user.id})`,
					icon_url: newState.member.user.displayAvatarURL(),
				};
			} else if (oldState.channel && !newState.channel) {
				if (!oldState.member) {
					return;
				}

				console.log(`Member ${oldState.member.id} left a voice channel`);

				description = `Left ${oldState.channel.toString()} - \`${
					oldState.channel.name
				}\` (${oldState.channel.id})`;
				author = {
					name: `${oldState.member.user.tag} (${oldState.member.user.id})`,
					icon_url: oldState.member.user.displayAvatarURL(),
				};
			} else if (
				oldState.channel &&
				newState.channel &&
				oldState.channel.id !== newState.channel.id
			) {
				if (!newState.member) {
					return;
				}

				console.log(
					`Member left a voice channel and moved from ${oldState.channel.id} to ${newState.channel.id}`,
				);

				description = `Moved from ${oldState.channel.toString()} - \`${
					oldState.channel.name
				}\` (${oldState.channel.id}) to ${newState.channel.toString()} - \`${
					newState.channel.name
				}\` (${newState.channel.id})`;
				author = {
					name: `${newState.member.user.tag} (${newState.member.user.id})`,
					icon_url: newState.member.user.displayAvatarURL(),
				};
			} else {
				return;
			}

			const embed = {
				title: "Voice state update",
				color: color.Blurple,
				author,
				description,
				timestamp: new Date().toISOString(),
			};

			guildLogChannel.send({ embeds: [embed] });
		} catch (error) {
			console.error(error);
		}
	},
};
