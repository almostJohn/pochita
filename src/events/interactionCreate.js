import {
	Events,
	MessageFlags,
	Collection,
	time,
	TimestampStyles,
} from "discord.js";
import { setTimeout } from "node:timers";
import { transformInteraction } from "../util/transformInteraction.js";

export default {
	name: Events.InteractionCreate,
	/**
	 * @param {import("discord.js").Interaction} interaction
	 * @param {import("discord.js").Client} client
	 */
	async execute(interaction, _client) {
		if (
			!interaction.isChatInputCommand() &&
			!interaction.isUserContextMenuCommand() &&
			!interaction.isMessageContextMenuCommand() &&
			!interaction.isAutocomplete()
		) {
			return;
		}

		const command = interaction.client.commands.get(
			interaction.commandName.toLowerCase(),
		);

		if (!command) {
			return;
		}

		const { cooldowns } = interaction.client;

		if (!cooldowns.has(command.name)) {
			cooldowns.set(command.name, new Collection());
		}

		const now = Date.now();
		const timestamps = cooldowns.get(command.name);
		const defaultCooldownDuration = 3;
		const cooldownAmount =
			(command.cooldown ?? defaultCooldownDuration) * 1_000;

		if (timestamps.has(interaction.user.id)) {
			const expirationTime =
				timestamps.get(interaction.user.id) + cooldownAmount;

			if (now < expirationTime) {
				const expiredTimestamp = Math.round(expirationTime / 1_000);
				return interaction.reply({
					content: `Please wait, you are on cooldown for \`${
						command.name
					}\`. You can use it again ${time(
						expiredTimestamp,
						TimestampStyles.RelativeTime,
					)}`,
					flags: MessageFlags.Ephemeral,
				});
			}
		}

		timestamps.set(interaction.user.id, now);
		setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

		try {
			await command.execute(
				interaction,
				transformInteraction(interaction.options.data),
			);
		} catch (error_) {
			/** @type {Error} */
			const error = error_;
			console.error(error, error.message);

			try {
				if (interaction.isAutocomplete()) {
					return;
				}

				if (!interaction.deferred || !interaction.replied) {
					console.warn(
						"Command interaction has not been deferred before throwing",
					);
					await interaction.deferReply({ flags: MessageFlags.Ephemeral });
				}

				await interaction.editReply({ content: error.message, components: [] });
			} catch (error__) {
				/** @type {Error} */
				const subError = error__;
				console.error(subError, subError.message);
			}
		}
	},
};
