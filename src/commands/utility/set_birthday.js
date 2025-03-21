import { ButtonStyle, ComponentType, MessageFlags } from "discord.js";
import { createButton } from "../../util/button.js";
import { createMessageActionRow } from "../../util/messageActionRow.js";
import { Users } from "../../database.js";
import { nanoid } from "nanoid";
import { ERROR_RESPONSES } from "../../constants.js";

export default {
	name: "set_birthday",
	/**
	 * @param {import("discord.js").ChatInputCommandInteraction} interaction
	 * @param {import("../../types/ArgumentsOf.js").ArgumentsOf<typeof import("../../interactions/index.js").SetBirthdaySlashCommand>} args
	 */
	async execute(interaction, args) {
		const reply = await interaction.deferReply({
			flags: args.hide ? MessageFlags.Ephemeral : undefined,
		});

		const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(args.date);

		if (!isValidDate) {
			return await interaction.editReply({
				content: ERROR_RESPONSES.invalidDateFormat,
				components: [],
			});
		}

		const setKey = nanoid();
		const cancelKey = nanoid();

		const setButton = createButton({
			label: "Set birthday",
			customId: setKey,
			style: ButtonStyle.Primary,
		});
		const cancelButton = createButton({
			label: "Cancel",
			customId: cancelKey,
			style: ButtonStyle.Secondary,
		});

		await interaction.editReply({
			content: `Do you want to finalize your birthday as \`${args.date}\`?`,
			components: [createMessageActionRow([cancelButton, setButton])],
		});

		const collectedInteraction = await reply
			.awaitMessageComponent({
				filter: (collected) => collected.user.id === interaction.user.id,
				componentType: ComponentType.Button,
				time: 15_000,
			})
			.catch(async () => {
				try {
					await interaction.editReply({
						content: ERROR_RESPONSES.timedOut,
						components: [],
					});
					// eslint-disable-next-line no-empty
				} catch {}

				return undefined;
			});

		if (collectedInteraction.customId === cancelKey) {
			await collectedInteraction.update({
				content: "Canceled operation.",
				components: [],
			});
		} else if (collectedInteraction.customId === setKey) {
			await collectedInteraction.deferUpdate();

			try {
				const [user, created] = await Users.findOrCreate({
					where: { user_id: collectedInteraction.user.id },
					defaults: { birthday: args.date },
				});

				if (created) {
					await user.update({ birthday: args.date });
					return await collectedInteraction.editReply({
						content: `Your birthday has been updated to \`${args.date}\``,
						components: [],
					});
				}

				await collectedInteraction.editReply({
					content: `Your birthday has been set on \`${args.date}\``,
					components: [],
				});
			} catch (error) {
				console.error(error);
				return await collectedInteraction.editReply({
					content: ERROR_RESPONSES.globalError,
					components: [],
				});
			}
		}
	},
};
