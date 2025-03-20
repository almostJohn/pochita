import { ButtonStyle, ComponentType } from "discord.js";

/**
 * @param {Object} options
 * @param {string} [options.customId]
 * @param {boolean} [options.disabled]
 * @param {import("discord.js").APIMessageComponentEmoji} [options.emoji]
 * @param {string} [options.label]
 * @param {import("discord.js").ButtonStyle} [options.style]
 * @param {string} [options.url]
 *
 * @returns {import("discord.js").APIButtonComponent}
 */
export function createButton({ label, customId, style, url, disabled, emoji }) {
	/**
	 * @type {import("discord.js").APIButtonComponentBase<any>}
	 */
	const button = {
		type: ComponentType.Button,
		label,
		style: style ?? ButtonStyle.Primary,
		disabled,
		emoji,
	};

	if (style === ButtonStyle.Link && url) {
		return {
			...button,
			url,
		};
	}

	return {
		...button,
		custom_id: customId,
	};
}
