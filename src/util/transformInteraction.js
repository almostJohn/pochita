import { ApplicationCommandOptionType } from "discord.js";

/**
 * @template {import("../types/ArgumentsOf.js").CommandPayload} C
 * @param {readonly import("discord.js").CommandInteractionOption<C>[]} options
 * @returns {import("../types/ArgumentsOf.js").ArgumentsOf<C>}
 */
export function transformInteraction(options) {
	/**
	 * @template C
	 * @typedef {Record<
	 *  string,
	 *  | Partial<import("../types/ArgumentsOf.js").ArgumentsOf<C>>
	 *  | import("discord.js").Attachment
	 *  | import("discord.js").GuildBasedChannel
	 *  | import("discord.js").Role
	 *  | import("discord.js").Message
	 *  | boolean
	 *  | number
	 *  | string
	 *  | {
	 *    member?: import("discord.js").GuildMember | undefined
	 *    user: import("discord.js").User
	 *  }
	 *  | null
	 *  | undefined
	 * >} OptTypes
	 */

	/**
	 * @type {OptTypes<any>}
	 */
	const opts = {};

	for (const top of options) {
		switch (top.type) {
			case ApplicationCommandOptionType.Subcommand:
			case ApplicationCommandOptionType.SubcommandGroup:
				opts[top.name] = transformInteraction(
					top.options ? [...top.options] : [],
				);
				break;
			case ApplicationCommandOptionType.User:
				opts[top.name] = { user: top.user, member: top.member };
				break;
			case ApplicationCommandOptionType.Channel:
				opts[top.name] = top.channel;
				break;
			case ApplicationCommandOptionType.Role:
				opts[top.name] = top.role;
				break;
			case ApplicationCommandOptionType.Mentionable:
				opts[top.name] = top.user
					? { user: top.user, member: top.member }
					: top.role;
				break;
			case ApplicationCommandOptionType.Number:
			case ApplicationCommandOptionType.Integer:
			case ApplicationCommandOptionType.String:
			case ApplicationCommandOptionType.Boolean:
				opts[top.name] = top.value;
				break;
			case "_MESSAGE":
				opts[top.name] = top.message;
				break;
			default:
				break;
		}
	}

	return /** @type {import("../types/ArgumentsOf.js").ArgumentsOf<C>} */ (opts);
}
