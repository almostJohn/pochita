const {
	SlashCommandBuilder,
	Client,
	ChatInputCommandInteraction,
	ButtonBuilder,
	ActionRowBuilder,
	MessageFlags,
	ButtonStyle,
	ComponentType,
	PermissionFlagsBits,
	OverwriteType,
	ChannelType,
} = require("discord.js");
const { nanoid } = require("nanoid");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("approve_ticket")
		.setDescription("Admin approve a ticket")
		.addUserOption((option) =>
			option
				.setName("user")
				.setDescription("The user that created the ticket")
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
		const messageLink = interaction.options.getString("message_link");

		const approveKey = nanoid();
		const cancelKey = nanoid();

		const approveButton = new ButtonBuilder()
			.setCustomId(approveKey)
			.setLabel("Approve")
			.setStyle(ButtonStyle.Success);
		const cancelButton = new ButtonBuilder()
			.setCustomId(cancelKey)
			.setLabel("Cancel")
			.setStyle(ButtonStyle.Secondary);

		const row = new ActionRowBuilder().addComponents(
			cancelButton,
			approveButton,
		);

		await interaction.editReply({
			content: `Do you really want to approve this ticket and create a text channel exclusive to \`${user.tag}\` and the staff team?`,
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
		} else if (collectedInteraction.customId === approveKey) {
			await collectedInteraction.deferUpdate();

			const channel = await interaction.guild.channels.create({
				name: `ticket-approved-${user.tag}`,
				type: ChannelType.GuildText,
				permissionOverwrites: [
					{
						id: interaction.guildId,
						allow: 0n,
						deny:
							PermissionFlagsBits.SendMessages |
							PermissionFlagsBits.ViewChannel |
							PermissionFlagsBits.ReadMessageHistory,
						type: OverwriteType.Role,
					},
					{
						id: user.id,
						allow:
							PermissionFlagsBits.ViewChannel |
							PermissionFlagsBits.ReadMessageHistory |
							PermissionFlagsBits.SendMessages |
							PermissionFlagsBits.AddReactions,
						type: OverwriteType.Member,
					},
				],
			});

			const closeKey = nanoid();
			const closeButton = new ButtonBuilder()
				.setCustomId(closeKey)
				.setLabel("Resolved")
				.setStyle(ButtonStyle.Danger);

			const row = new ActionRowBuilder().addComponents(closeButton);

			const ticketMessage = await channel.send({
				content: `${user.toString()}, your [ticket](${messageLink}) has been approved by \`${
					collectedInteraction.user.tag
				}\` your channel is open until your requests gets resolved.\n\nIf you don't have any questions, violent reactions, confusions, a staff member can safely close this ticket.`,
				components: [row],
			});

			const collector = ticketMessage.createMessageComponentCollector({
				componentType: ComponentType.Button,
			});

			collector.on("collect", async (interaction) => {
				if (
					interaction.member.permissions.has(
						PermissionFlagsBits.ManageChannels,
						true,
					)
				) {
					await interaction.reply({
						content: "Closing this ticket in 5 seconds",
					});

					setTimeout(async () => {
						await channel.delete(
							"Channel deleted dus to ticket has been closed",
						);
					}, 5_000);
				} else {
					await interaction.reply({
						content: "You do not have enough permissions to close this channel",
					});
				}
			});

			await interaction.editReply({
				content: `Successfully approved ticket created by \`${user.tag}\`. You may close this message now.`,
				components: [],
			});
		}
	},
};
