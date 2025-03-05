const {
	SlashCommandBuilder,
	Client,
	ChatInputCommandInteraction,
	TextChannel,
	ButtonBuilder,
	ActionRowBuilder,
	MessageFlags,
	ButtonStyle,
	ComponentType,
} = require("discord.js");
const { nanoid } = require("nanoid");
const { guildConfig } = require("../../util/config");
const { color } = require("../../util/color");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("deny_ticket")
		.setDescription("Admin deny a ticket")
		.addUserOption((option) =>
			option
				.setName("user")
				.setDescription("The user that created the ticket")
				.setRequired(true),
		)
		.addStringOption((option) =>
			option
				.setName("reason")
				.setDescription("The reason for denial")
				.setRequired(true),
		)
		.addStringOption((option) =>
			option
				.setName("message_link")
				.setDescription("The message link to the created ticket")
				.setRequired(true),
		)
		.setDefaultMemberPermissions(0),
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 * @param {Client} client
	 */
	async execute(interaction, client) {
		const reply = await interaction.deferReply({
			flags: MessageFlags.Ephemeral,
		});

		const user = interaction.options.getUser("user");
		const reason =
			interaction.options.getString("reason") || "No reason provided";
		const messageLink = interaction.options.getString("message_link");

		const rejectLogChannelId = guildConfig.rejectLogChannelId;

		if (!rejectLogChannelId) {
			return await interaction.editReply({
				content: "No reject log channel id",
			});
		}

		/** @type {TextChannel} */
		const rejectLogChannel = interaction.guild.channels.cache.find(
			(channel) => channel.id === rejectLogChannelId,
		);

		if (!rejectLogChannel) {
			return await interaction.editReply({
				content: "No reject log channel found",
			});
		}

		const denyKey = nanoid();
		const cancelKey = nanoid();

		const denyButton = new ButtonBuilder()
			.setCustomId(denyKey)
			.setLabel("Deny")
			.setStyle(ButtonStyle.Danger);
		const cancelButton = new ButtonBuilder()
			.setCustomId(cancelKey)
			.setLabel("Cancel")
			.setStyle(ButtonStyle.Secondary);

		const row = new ActionRowBuilder().addComponents(cancelButton, denyButton);

		await interaction.editReply({
			content: `Do you really want to admin deny the ticket created by \`${user.tag}\`?`,
			components: [row],
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
						content: "Action timer ran out",
						components: [],
					});
				} catch {}

				return undefined;
			});

		if (collectedInteraction.customId === cancelKey) {
			await collectedInteraction.update({
				content: "Canceled operation",
				components: [],
			});
		} else if (collectedInteraction.customId === denyKey) {
			await collectedInteraction.deferUpdate();

			await collectedInteraction.editReply({
				content: `Successfully denied ticket created by \`${user.tag}\`. You may close this message now.`,
				components: [],
			});

			const descriptionParts = [
				`**Member:** ${user.toString()} - \`${user.tag}\` (${user.id})`,
				`**Reason:** ${reason}`,
				`**Reference:** [Jump to](${messageLink})`,
			];

			const embed = {
				author: {
					name: `${collectedInteraction.user.tag} (${collectedInteraction.user.id})`,
					icon_url: collectedInteraction.user.displayAvatarURL(),
				},
				color: color.Red,
				title: "Ticket Denied",
				description: descriptionParts.join("\n"),
				footer: { text: `Denied by ${collectedInteraction.user.tag}` },
				timestamp: new Date().toISOString(),
			};

			await rejectLogChannel.send({
				embeds: [embed],
			});
		}
	},
};
