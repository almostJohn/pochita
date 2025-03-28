/**
 * @param {import("discord.js").Guild} guild
 * @param {import("discord.js").Snowflake} logChannelId
 */
export async function checkLogChannel(guild, logChannelId) {
	if (!logChannelId) {
		return;
	}

	const logChannel = logChannelId
		? await guild.channels.fetch(logChannelId).catch(() => null)
		: null;

	return /** @type {import("discord.js").TextChannel} */ (logChannel);
}
