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
		.setName("create_ticket")
		.setDescription("Create a ticket")
		.addStringOption((option) =>
			option
				.setName("request")
				.setDescription(
					"What are you requesting? (eg: claim role, regarding about server, etc)",
				)
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

		const request = interaction.options.getString("request");

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
			return await interaction.editReply({ content: "No ticket log channel" });
		}

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
			content: `Do you really want to create a ticket?`,
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
				content: `Your ticket has been successfully created. It will take 2-3 business days to be approved or denied. Do not create a duplicate ticket—failure to comply may result in denial and a ban from the server.`,
				components: [],
			});

			const embed = {
				author: {
					name: `${collectedInteraction.user.tag} (${collectedInteraction.user.id})`,
					icon_url: collectedInteraction.user.displayAvatarURL(),
				},
				title: `Ticket created by ${collectedInteraction.user.tag}`,
				color: color.Purple,
				description: `${request}`,
				footer: {
					text: "use /approve_ticket to approve the ticket, /deny_ticket to deny the ticket",
				},
				timestamp: new Date().toISOString(),
			};

			await ticketLogChannel.send({
				embeds: [embed],
			});
		}
	},
};
