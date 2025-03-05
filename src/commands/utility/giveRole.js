const {
	SlashCommandBuilder,
	ChatInputCommandInteraction,
	Client,
	MessageFlags,
	ButtonBuilder,
	ButtonStyle,
	ActionRowBuilder,
	ComponentType,
	TextChannel,
} = require("discord.js");
const { nanoid } = require("nanoid");
const { guildConfig } = require("../../util/config");
const { color } = require("../../util/color");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("give-role")
		.setDescription(
			"Give a role to a member that have been active and stayed longer to the server",
		)
		.addUserOption((option) =>
			option
				.setName("user")
				.setDescription("The user to give the role")
				.setRequired(true),
		)
		.addRoleOption((option) =>
			option
				.setName("role")
				.setDescription("The role to give")
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

		const achievementsChannelId = guildConfig.achievementsChannelId;

		if (!achievementsChannelId) {
			return await interaction.editReply({
				content: "There is no such an achievements channel",
			});
		}

		/** @type {TextChannel} */
		const achievementsChannel = interaction.guild.channels.cache.find(
			(channel) => channel.id === achievementsChannelId,
		);

		const user = interaction.options.getUser("user");
		const role = interaction.options.getRole("role");

		const ignoredRoles = ["Admin", "Mod", "Automaton"];

		if (!role) {
			return await interaction.editReply({
				content: "No such role existed on the server",
			});
		}

		if (ignoredRoles.includes(role.name)) {
			return await interaction.editReply({
				content:
					"You cannot give this role to a member, this is a role with elevated permissions.",
			});
		}

		const guildMember = await interaction.guild.members
			.fetch(user.id)
			.catch(() => null);

		if (!guildMember) {
			return await interaction.editReply({
				content: "The member is not in this guild",
			});
		}

		if (guildMember.roles.cache.has(role.id)) {
			return await interaction.editReply({
				content: "Member is already have this role",
			});
		}

		const addRoleKey = nanoid();
		const cancelKey = nanoid();

		const addRoleButton = new ButtonBuilder()
			.setCustomId(addRoleKey)
			.setLabel("Add Role")
			.setStyle(ButtonStyle.Success);
		const cancelButton = new ButtonBuilder()
			.setCustomId(cancelKey)
			.setLabel("Cancel")
			.setStyle(ButtonStyle.Secondary);

		const row = new ActionRowBuilder().addComponents(
			cancelButton,
			addRoleButton,
		);

		await interaction.editReply({
			content: `Are you sure to give this role ${role.toString()} - \`${
				role.name
			}\` (${role.id}) to member \`${user.tag}\`?`,
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
				content: "Canceled giving role to user",
				components: [],
			});
		} else if (collectedInteraction.customId === addRoleKey) {
			await collectedInteraction.deferUpdate();

			await guildMember.roles.add(role.id);

			await collectedInteraction.editReply({
				content: `Successfully added a role to user \`${user.tag}\``,
				components: [],
			});

			const embed = {
				title: "Server Achievements",
				author: {
					name: `${interaction.guild.name} (${interaction.guild.id})`,
					icon_url: interaction.guild.iconURL(),
				},
				color: color.Blurple,
				thumbnail: {
					url: interaction.guild.iconURL(),
				},
				description: `You have been given the role of ${role.toString()}. Keep it up!`,
				footer: {
					text: `Given by ${interaction.user.tag}`,
				},
				timestamp: new Date().toISOString(),
			};

			await achievementsChannel.send({
				content: `🎉 Congrats! ${user.toString()} you have an achievements.`,
				embeds: [embed],
			});
		}
	},
};
