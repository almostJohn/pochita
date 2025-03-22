/**
 * @template {import("./ArgumentsOf.js").CommandPayload} C
 * @template {import("discord.js").CacheType} [T="cached"]
 * @typedef {Object} ChatInput
 * @property {(interaction: import("discord.js").ChatInputCommandInteraction<T>, args: import("./ArgumentsOf.js").ArgumentsOf<C>) => Promise<any> | any} chatInput
 */

/**
 * @template {import("./ArgumentsOf.js").CommandPayload} C
 * @template {import("discord.js").CacheType} [T="cached"]
 * @typedef {(
 *  ChatInput<C, T> & {
 *    [key: string]: any;
 *  }
 * )} Commands
 */

/**
 * @template {import("./ArgumentsOf.js").CommandPayload} C
 * @template {string} [T="chatInput"]
 * @template {import("discord.js").CacheType} [Z="cached"]
 * @typedef {Parameters<Commands<C, Z>[T]>} CommandMethodParameters
 */

/**
 * @template {string} [C="chatInput"]
 * @template {import("discord.js").CacheType} [Z="cached"]
 * @typedef {CommandMethodParameters<import("./ArgumentsOf.js").CommandPayload, C, Z>[0]} InteractionParam
 */

/**
 * @template {import("./ArgumentsOf.js").CommandPayload} C
 * @template {string} [M="chatInput"]
 * @template {import("discord.js").CacheType} [Z="cached"]
 * @typedef {CommandMethodParameters<C, M, Z>[1]} ArgsParam
 */

export {};
