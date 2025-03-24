import { ButtonStyle, ComponentType, MessageFlags } from "discord.js";
import { Users } from "../../../../db.js";
import { createButton } from "../../../../util/button.js";
import { createMessageActionRow } from "../../../../util/messageActionRow.js";
import { nanoid } from "nanoid";

/**
 * @param {import("../../../../types/Interaction.js").InteractionParam} interaction
 * @param {import("../../../../types/Interaction.js").ArgsParam<typeof import("../../../../interactions/index.js").BirthdayCommand>["set"]} args
 */
export async function set(interaction, args) {
	const reply = await interaction.deferReply({
		flags: args.hide ? MessageFlags.Ephemeral : undefined,
	});

	const parsedDate = new Date(args.date);
	if (isNaN(parsedDate.getTime())) {
		return await interaction.editReply({
			content: "Invalid date format. Please use `YYYY-MM-DD`.",
		});
	}

	const setKey = nanoid();
	const cancelKey = nanoid();

	const setButton = createButton({
		customId: setKey,
		label: "Set birthday",
		style: ButtonStyle.Primary,
	});
	const cancelButton = createButton({
		customId: cancelKey,
		label: "Cancel",
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
					content: "Action timer ran out.",
					components: [],
				});

				// eslint-disable-next-line no-empty
			} catch {}

			return undefined;
		});

	if (collectedInteraction?.customId === cancelKey) {
		await collectedInteraction.update({
			content: "Canceled operation.",
			components: [],
		});
	} else if (collectedInteraction?.customId === setKey) {
		await collectedInteraction.deferUpdate();

		const [user, created] = await Users.findOrCreate({
			where: {
				user_id: collectedInteraction.user.id,
			},
			defaults: {
				birthday: parsedDate,
			},
		});

		if (!created) {
			await user.update({ birthday: parsedDate });

			return await collectedInteraction.editReply({
				content: `Your birthday has been updated to \`${args.date}\`.`,
				components: [],
			});
		}

		await collectedInteraction.editReply({
			content: `Your birthday has been set to \`${args.date}\`.`,
			components: [],
		});
	}
}
