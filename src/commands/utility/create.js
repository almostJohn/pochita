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
		.setName("create")
		.setDescription("Create a ticker or a request")
		.addSubcommand((subcommand) =>
			subcommand
				.setName("request")
				.setDescription("Create a request")
				.addStringOption((option) =>
					option
						.setName("message")
						.setDescription(
							"What are you requesting? (eg: claim role, regarding server requests, etc)",
						)
						.setRequired(true),
				),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("ticket")
				.setDescription("Create a ticket")
				.addStringOption((option) =>
					option
						.setName("message")
						.setDescription(
							"What are you ticketing? (eg: member reports, regarding inside server, stc)",
						)
						.setRequired(true),
				),
		),
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 * @param {Client} client
	 */
	async execute(interaction, client) {
		if (interaction.options.getSubcommand() === "request") {
			const reply = await interaction.deferReply({
				flags: MessageFlags.Ephemeral,
			});

			const message = interaction.options.getString("message");

			const requestLogChannelId = guildConfig.requestLogChannelId;

			if (!requestLogChannelId) {
				return await interaction.editReply({
					content: "No request log channel id",
				});
			}

			/** @type {TextChannel} */
			const requestLogChannel = interaction.guild.channels.cache.find(
				(channel) => channel.id === requestLogChannelId,
			);

			if (!requestLogChannel) {
				return await interaction.editReply({
					content: "No request log channel found",
				});
			}

			const createRequestKey = nanoid();
			const cancelKey = nanoid();

			const createRequestButton = new ButtonBuilder()
				.setCustomId(createRequestKey)
				.setLabel("Create Request")
				.setStyle(ButtonStyle.Primary);
			const cancelButton = new ButtonBuilder()
				.setCustomId(cancelKey)
				.setLabel("Cancel")
				.setStyle(ButtonStyle.Secondary);

			const row = new ActionRowBuilder().addComponents(
				cancelButton,
				createRequestButton,
			);

			await interaction.editReply({
				content: `Do you really want to create a request regarding your (${message})?`,
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
			} else if (collectedInteraction.customId === createRequestKey) {
				await collectedInteraction.deferUpdate();

				await collectedInteraction.editReply({
					content:
						"Your request has been successfully created. It will take 2-3 business days to be approved or denied. Do not create a duplicate request—failure to comply may result in denial and a ban from the server.",
					components: [],
				});

				const embed = {
					author: {
						name: `${collectedInteraction.user.tag} (${collectedInteraction.user.id})`,
						icon_url: collectedInteraction.user.displayAvatarURL(),
					},
					color: color.Purple,
					title: `A Request is open by ${collectedInteraction.user.tag}`,
					description: message,
					footer: {
						text: "use /decide to admin deny or admin approve this request.",
					},
					timestamp: new Date().toISOString(),
				};

				await requestLogChannel.send({ embeds: [embed] });
			}
		} else if (interaction.options.getSubcommand() === "ticket") {
			const reply = await interaction.deferReply({
				flags: MessageFlags.Ephemeral,
			});

			const message = interaction.options.getString("message");

			const ticketLogChannelId = guildConfig.ticketLogChannelId;

			if (!ticketLogChannelId) {
				return await interaction.editReply({
					content: "No ticket log channel id",
				});
			}

			/** @type {TextChannel} */
			const ticketLogChannel = interaction.guild.channels.cache.find(
				(channel) => channel.id === ticketLogChannelId,
			);

			if (!ticketLogChannel) {
				return await interaction.editReply({
					content: "No ticket log channel found",
				});
			}

			const createTicketKey = nanoid();
			const cancelKey = nanoid();

			const createTicketButton = new ButtonBuilder()
				.setCustomId(createTicketKey)
				.setLabel("Create Ticket")
				.setStyle(ButtonStyle.Primary);
			const cancelButton = new ButtonBuilder()
				.setCustomId(cancelKey)
				.setLabel("Cancel")
				.setStyle(ButtonStyle.Secondary);

			const row = new ActionRowBuilder().addComponents(
				cancelButton,
				createTicketButton,
			);

			await interaction.editReply({
				content: `Do you really want to create a ticket regarding your (${message})?`,
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

				await collectedInteraction.editReply({
					content:
						"Your ticket has been successfully created. It will take 2-3 business days to be approved or denied. Do not create a duplicate ticket—failure to comply may result in denial and a ban from the server.",
					components: [],
				});

				const embed = {
					author: {
						name: `${collectedInteraction.user.tag} (${collectedInteraction.user.id})`,
						icon_url: collectedInteraction.user.displayAvatarURL(),
					},
					color: color.Purple,
					title: `A Ticket is open by ${collectedInteraction.user.tag}`,
					description: message,
					footer: {
						text: "use /decide to admin deny or admin approve this ticket.",
					},
					timestamp: new Date().toISOString(),
				};

				await ticketLogChannel.send({ embeds: [embed] });
			}
		}
	},
};
