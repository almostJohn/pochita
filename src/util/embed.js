/**
 * @param {import("discord.js").APIEmbed} embed
 * @param  {...import("discord.js").APIEmbedField[]} data
 */
export function addFields(embed, ...data) {
	return {
		...embed,
		fields: [...(embed.fields ?? []), ...data],
	};
}
