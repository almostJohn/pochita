/**
 * @typedef {{
 *   name: string;
 *   type?: import("discord.js").ApplicationCommandType | undefined;
 * }} Command
 */

/**
 * @typedef {{
 *  name: string;
 *  required?: boolean | undefined;
 * } & (
 *  | {
 *    choices?: readonly Readonly<{ name: string; value: number }>[] | undefined;
 *    type: import("discord.js").ApplicationCommandOptionType.Integer | import("discord.js").ApplicationCommandOptionType.Number;
 *  }
 *  | {
 *    choices?: readonly Readonly<{ name: string; value: string }>[] | undefined;
 *    type: import("discord.js").ApplicationCommandOptionType.String;
 *  }
 *  | {
 *    options?: readonly Option[] | undefined;
 *    type: import("discord.js").ApplicationCommandOptionType.Subcommand | import("discord.js").ApplicationCommandOptionType.SubcommandGroup;
 *  }
 *  | {
 *    type: | import("discord.js").ApplicationCommandOptionType.Attachment | import("discord.js").ApplicationCommandOptionType.Boolean | import("discord.js").ApplicationCommandOptionType.Channel | import("discord.js").ApplicationCommandOptionType.Mentionable | import("discord.js").ApplicationCommandOptionType.Role | import("discord.js").ApplicationCommandOptionType.User;
 *  }
 * )} Option
 */

/**
 * @template U
 * @typedef {(
 *  U extends unknown ? (k: U) => void : never
 * ) extends (k: infer I) => void ? I : never} UnionToIntersection
 */

/**
 * @template O
 * @typedef {(
 *  O extends {
 *    choices?: infer C | undefined
 *    name: infer K
 *    options?: infer O | undefined
 *    required?: infer R | undefined
 *    type: infer T
 *  }
 *    ? K extends string
 *      ? R extends true
 *        ? { [k in K]: TypeIdToType<T, O, C> }
 *        : T extends import("discord.js").ApplicationCommandOptionType.Subcommand | import("discord.js").ApplicationCommandOptionType.SubcommandGroup
 *          ? { [k in K]: TypeIdToType<T, O, C> }
 *          : { [k in K]?: TypeIdToType<T, O, C> | undefined }
 *      : never
 *    : never
 * )} OptionToObject
 */

/**
 * @template O
 * @typedef {(
 *  O extends readonly any[] ? UnionToIntersection<OptionToObject<O[number]>> : never
 * )} ArgumentsOfRaw
 */

/**
 * @template T
 * @template O
 * @template C
 * @typedef {(
 *   T extends import("discord.js").ApplicationCommandOptionType.Subcommand
 *     ? ArgumentsOfRaw<O>
 *     : T extends import("discord.js").ApplicationCommandOptionType.SubcommandGroup
 *       ? ArgumentsOfRaw<O>
 *       : T extends import("discord.js").ApplicationCommandOptionType.String
 *         ? C extends readonly { value: string }[]
 *           ? C[number]["value"]
 *           : string
 *       : T extends import("discord.js").ApplicationCommandOptionType.Integer | import("discord.js").ApplicationCommandOptionType.Number
 *         ? C extends readonly { value: number }[]
 *           ? C[number]["value"]
 *           : number
 *       : T extends import("discord.js").ApplicationCommandOptionType.Boolean
 *         ? boolean
 *       : T extends import("discord.js").ApplicationCommandOptionType.User
 *         ? { member?: import("discord.js").GuildMember | undefined; user: import("discord.js").User }
 *       : T extends import("discord.js").ApplicationCommandOptionType.Channel
 *         ? import("discord.js").GuildBasedChannel
 *       : T extends import("discord.js").ApplicationCommandOptionType.Role
 *         ? import("discord.js").Role
 *       : T extends import("discord.js").ApplicationCommandOptionType.Mentionable
 *         ? { member?: import("discord.js").GuildMember | undefined; user: import("discord.js").User } | import("discord.js").Role
 *       : T extends import("discord.js").ApplicationCommandOptionType.Attachment
 *         ? import("discord.js").Attachment
 *       : never
 * )} TypeIdToType
 */

/**
 * @template {Command} C
 * @typedef {(
 *  C extends { options: readonly Option[] }
 *    ? UnionToIntersection<OptionToObject<C["options"][number]>>
 *    : never
 * )} ArgumentsOf
 */

export {};
