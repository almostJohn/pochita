const { APIEmbed, APIEmbedField } = require("discord.js");

/**
 * @param {APIEmbed} embed
 * @param  {...APIEmbedField[]} data
 */
function addFields(embed, ...data) {
	return {
		...embed,
		fields: [...(embed.fields ?? []), ...data],
	};
}

module.exports = { addFields };
