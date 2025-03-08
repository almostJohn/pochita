const {
	SlashCommandBuilder,
	Client,
	ChatInputCommandInteraction,
	ButtonBuilder,
	ActionRowBuilder,
	MessageFlags,
	ButtonStyle,
	ComponentType,
	italic,
	ChannelType,
	PermissionFlagsBits,
	OverwriteType,
	time,
	TimestampStyles,
} = require("discord.js");
const dayjs = require("dayjs");
const { nanoid } = require("nanoid");
const { color } = require("../../util/color");

module.exports = {
	cooldown: 3_600,
	data: new SlashCommandBuilder()
		.setName("create_ticket")
		.setDescription("Create a ticket")
		.addStringOption((option) =>
			option
				.setName("reason")
				.setDescription("Reason for this ticket")
				.setRequired(true),
		),
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 * @param {Client} client
	 */
	async execute(interaction, client) {
		const reply = await interaction.deferReply({
			flags: MessageFlags.Ephemeral,
		});

		const reason = interaction.options.getString("reason");

		const createTicketKey = nanoid();
		const cancelKey = nanoid();

		const createTicketButton = new ButtonBuilder()
			.setCustomId(createTicketKey)
			.setLabel("Create Ticket")
			.setStyle(ButtonStyle.Success);
		const cancelButton = new ButtonBuilder()
			.setCustomId(cancelKey)
			.setLabel("Cancel")
			.setStyle(ButtonStyle.Secondary);

		const row = new ActionRowBuilder().addComponents(
			cancelButton,
			createTicketButton,
		);

		await interaction.editReply({
			content: `Do you really want to create a ticket with reason: (${italic(
				reason,
			)})?`,
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
		} else if (collectedInteraction.customId === createTicketKey) {
			await collectedInteraction.deferUpdate();

			const channel = await interaction.guild.channels.create({
				name: `ticket-created-${
					collectedInteraction.user.id
				}-(${new Date().toISOString()})`,
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
						id: collectedInteraction.user.id,
						allow:
							PermissionFlagsBits.ViewChannel |
							PermissionFlagsBits.ReadMessageHistory |
							PermissionFlagsBits.SendMessages |
							PermissionFlagsBits.AddReactions,
						type: OverwriteType.Member,
					},
				],
			});

			const resolveKey = nanoid();
			const forceCloseKey = nanoid();

			const resolveButton = new ButtonBuilder()
				.setCustomId(resolveKey)
				.setLabel("Mark ticket as solved")
				.setStyle(ButtonStyle.Success);
			const forceCloseButton = new ButtonBuilder()
				.setCustomId(forceCloseKey)
				.setLabel("Force close ticket")
				.setStyle(ButtonStyle.Danger);

			const row = new ActionRowBuilder().addComponents(
				forceCloseButton,
				resolveButton,
			);

			const messageParts = [
				"- Please note that not all staff members may be able to resolve your specific issue.",
				"- Remember to be respectful in your communication as you're speaking with a staff member who is here to help you.",
				"- Explain what exactly your issue is",
				"- Issue solved? Press the button",
			];

			const descriptionParts = [
				`**Member:** \`${collectedInteraction.user.tag}\` (${collectedInteraction.user.id})`,
				`**Reason:** ${reason}`,
				`**Created:** ${time(
					dayjs().unix(),
					TimestampStyles.ShortDateTime,
				)} (${time(dayjs().unix(), TimestampStyles.RelativeTime)})`,
			];

			let embed = {
				author: {
					name: `${collectedInteraction.user.tag} (${collectedInteraction.user.id})`,
					icon_url: collectedInteraction.user.displayAvatarURL(),
				},
				color: color.Blurple,
				title: "Ticket Created",
				description: descriptionParts.join("\n"),
				timestamp: new Date().toISOString(),
			};

			const message = await channel.send({
				content: messageParts.join("\n"),
				embeds: [embed],
				components: [row],
			});

			const collector = message.createMessageComponentCollector({
				componentType: ComponentType.Button,
			});

			collector.on("collect", async (interaction) => {
				if (interaction.customId === forceCloseKey) {
					if (
						!interaction.member.permissions.has(
							PermissionFlagsBits.ManageChannels,
						)
					) {
						return await interaction.reply({
							content: `You don't have permissions to force close this ticket. If your ticket is already solved consider marking it as solved.`,
							flags: MessageFlags.Ephemeral,
						});
					}

					if (
						interaction.guild.members.me.permissions.has(
							PermissionFlagsBits.ManageChannels,
							true,
						)
					) {
						await interaction.reply({
							content:
								"Force closing this ticket; therefore, this ticket has been administratively denied by a staff member.",
						});

						await channel.edit({
							name: `ticket-denied-${
								collectedInteraction.user.id
							}-(${new Date().toISOString()})`,
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
									id: interaction.client.user.id,
									allow:
										PermissionFlagsBits.ViewChannel |
										PermissionFlagsBits.ReadMessageHistory |
										PermissionFlagsBits.SendMessages,
									type: OverwriteType.Member,
								},
								{
									id: collectedInteraction.user.id,
									allow:
										PermissionFlagsBits.ViewChannel |
										PermissionFlagsBits.ReadMessageHistory,
									deny:
										PermissionFlagsBits.SendMessages |
										PermissionFlagsBits.SendMessagesInThreads |
										PermissionFlagsBits.AddReactions |
										PermissionFlagsBits.CreateInstantInvite,
									type: OverwriteType.Member,
								},
							],
						});

						const disabledKey = nanoid();

						const disabledButton = new ButtonBuilder()
							.setCustomId(disabledKey)
							.setLabel("Denied")
							.setStyle(ButtonStyle.Danger)
							.setDisabled(true);

						const updatedRow = new ActionRowBuilder().addComponents(
							disabledButton,
						);

						embed = {
							...embed,
							title: "Ticket Denied",
							color: color.Red,
							fields: [
								{
									name: "\u200B",
									value: `This ticket has been denied by ${interaction.user.toString()} - \`${
										interaction.user.tag
									}\` (${interaction.user.id})`,
								},
							],
						};

						await interaction.message.edit({
							embeds: [embed],
							components: [updatedRow],
						});
					}
				} else if (interaction.customId === resolveKey) {
					if (
						interaction.guild.members.me.permissions.has(
							PermissionFlagsBits.ManageChannels,
							true,
						)
					) {
						await interaction.reply({
							content: `Marking this ticket as solved; therefore, only staff members can chat on this channel.`,
						});

						await channel.edit({
							name: `ticket-solved-${
								collectedInteraction.user.id
							}-(${new Date().toISOString()})`,
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
									id: interaction.client.user.id,
									allow:
										PermissionFlagsBits.ViewChannel |
										PermissionFlagsBits.ReadMessageHistory |
										PermissionFlagsBits.SendMessages,
									type: OverwriteType.Member,
								},
								{
									id: collectedInteraction.user.id,
									allow:
										PermissionFlagsBits.ViewChannel |
										PermissionFlagsBits.ReadMessageHistory,
									deny:
										PermissionFlagsBits.SendMessages |
										PermissionFlagsBits.SendMessagesInThreads |
										PermissionFlagsBits.AddReactions |
										PermissionFlagsBits.CreateInstantInvite,
									type: OverwriteType.Member,
								},
							],
						});

						const disabledKey = nanoid();

						const disabledButton = new ButtonBuilder()
							.setCustomId(disabledKey)
							.setLabel("Solved")
							.setStyle(ButtonStyle.Primary)
							.setDisabled(true);

						const updatedRow = new ActionRowBuilder().addComponents(
							disabledButton,
						);

						const resolver = interaction.user;

						embed = {
							...embed,
							title: "Ticket Resolved",
							color: color.Green,
							fields: [
								{
									name: "\u200B",
									value: `This ticket has been resolved by ${resolver.toString()} - \`${
										resolver.tag
									}\` (${resolver.id})`,
								},
							],
						};

						await interaction.message.edit({
							embeds: [embed],
							components: [updatedRow],
						});
					}
				}
			});

			await collectedInteraction.editReply({
				content: `Your ticket has been successfully created, your channel is ${channel.toString()}. Please wait for a staff member to review it. Do not create duplicate tickets—failure to comply may result in denial and a ban from the server.`,
				components: [],
			});
		}
	},
};
