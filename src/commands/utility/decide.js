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
		.setName("decide")
		.setDescription(
			"Decision to admin approved or admin deny the request/ticket made by discord members",
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("approve")
				.setDescription(
					"Administratively approve a request/ticket made by discord members",
				)
				.addUserOption((option) =>
					option
						.setName("user")
						.setDescription("The user that creates the request/ticket")
						.setRequired(true),
				)
				.addStringOption((option) =>
					option
						.setName("message_link")
						.setDescription("Message link to the request/ticket")
						.setRequired(true),
				),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName("deny")
				.setDescription(
					"Administratively deny a request/ticket made by discord members",
				)
				.addUserOption((option) =>
					option
						.setName("user")
						.setDescription("The user that creates the request/ticket")
						.setRequired(true),
				)
				.addStringOption((option) =>
					option
						.setName("reason")
						.setDescription("Reason for denial")
						.setRequired(true),
				)
				.addStringOption((option) =>
					option
						.setName("message_link")
						.setDescription("Message link to the request/ticket")
						.setRequired(true),
				),
		)
		.setDefaultMemberPermissions(0),
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 * @param {Client} client
	 */
	async execute(interaction, client) {
		if (interaction.options.getSubcommand() === "approve") {
			const reply = await interaction.deferReply({
				flags: MessageFlags.Ephemeral,
			});

			const user = interaction.options.getUser("user");
			const messageLink = interaction.options.getString("message_link");

			const othersChannelId = guildConfig.othersChannelId;

			if (!othersChannelId) {
				return await interaction.editReply({ content: "No others channel id" });
			}

			/** @type {TextChannel} */
			const othersChannel = interaction.guild.channels.cache.find(
				(channel) => channel.id === othersChannelId,
			);

			if (!othersChannel) {
				return await interaction.editReply({
					content: "No others channel found",
				});
			}

			const approveKey = nanoid();
			const cancelKey = nanoid();

			const approveButton = new ButtonBuilder()
				.setCustomId(approveKeyKey)
				.setLabel("Approve")
				.setStyle(ButtonStyle.Danger);
			const cancelButton = new ButtonBuilder()
				.setCustomId(cancelKey)
				.setLabel("Cancel")
				.setStyle(ButtonStyle.Secondary);

			const row = new ActionRowBuilder().addComponents(
				cancelButton,
				approveButton,
			);

			await interaction.editReply({
				content: `Do you really want to approve this request/ticket made by \`${user.tag}\`?\nReason: Approved by Scenario\n[Jump to](${messageLink})`,
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

				await collectedInteraction.editReply({
					content: `Successfully approved this request/ticket made by \`${user.tag}\`. You may close this message now.`,
					components: [],
				});

				const descriptionParts = [
					`**Member:** ${user.toString()} - \`${user.tag}\` (${user.id})`,
					`**Reason:** Approved by Scenario`,
					`**Reference:** [Jump to](${messageLink})`,
				];

				const embed = {
					author: {
						name: `${collectedInteraction.user.tag} (${collectedInteraction.user.id})`,
						icon_url: collectedInteraction.user.displayAvatarURL(),
					},
					color: color.Green,
					title: "Your Request/Ticket has been approved",
					description: descriptionParts.join("\n"),
					footer: {
						text: `Approved by ${collectedInteraction.user.tag}`,
					},
					timestamp: new Date().toISOString(),
				};

				await othersChannel.send({ embeds: [embed] });
			}
		} else if (interaction.options.getSubcommand() === "deny") {
			const reply = await interaction.deferReply({
				flags: MessageFlags.Ephemeral,
			});

			const user = interaction.options.getUser("user");
			const reason = interaction.options.getString("reason");
			const messageLink = interaction.options.getString("message_link");

			const othersChannelId = guildConfig.othersChannelId;

			if (!othersChannelId) {
				return await interaction.editReply({ content: "No others channel id" });
			}

			/** @type {TextChannel} */
			const othersChannel = interaction.guild.channels.cache.find(
				(channel) => channel.id === othersChannelId,
			);

			if (!othersChannel) {
				return await interaction.editReply({
					content: "No others channel found",
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

			const row = new ActionRowBuilder().addComponents(
				cancelButton,
				denyButton,
			);

			await interaction.editReply({
				content: `Do you really want to deny this request/ticket made by \`${
					user.tag
				}\`?\nReason: ${
					reason || "No reason provided"
				}\n[Jump to](${messageLink})`,
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
					content: `Successfully denied this request/ticket made by \`${user.tag}\`. You may close this message now.`,
					components: [],
				});

				const descriptionParts = [
					`**Member:** ${user.toString()} - \`${user.tag}\` (${user.id})`,
					`**Reason:** ${reason || "No reason provided"}`,
					`**Reference:** [Jump to](${messageLink})`,
				];

				const embed = {
					author: {
						name: `${collectedInteraction.user.tag} (${collectedInteraction.user.id})`,
						icon_url: collectedInteraction.user.displayAvatarURL(),
					},
					color: color.Red,
					title: "Your Request/Ticket has been denied",
					description: descriptionParts.join("\n"),
					footer: {
						text: `Denied by ${collectedInteraction.user.tag}`,
					},
					timestamp: new Date().toISOString(),
				};

				await othersChannel.send({ embeds: [embed] });
			}
		}
	},
};
