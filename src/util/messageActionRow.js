import { ComponentType } from "discord.js";

/**
 * @param {import("discord.js").APIMessageActionRowComponent[]} components
 *
 * @returns {import("discord.js").APIActionRowComponent<import("discord.js").APIMessageActionRowComponent>}
 */
export function createMessageActionRow(components) {
	return {
		type: ComponentType.ActionRow,
		components,
	};
}
