import { time, TimestampStyles, SlashCommandBuilder } from "discord.js";
import dayjs from "dayjs";
import { color } from "../../util/color.js";
import { addFields } from "../../util/embed.js";

export default {
	data: new SlashCommandBuilder()
		.setName("whois")
		.setDescription(
			"Displays information about a user, such as created and joined date",
		)
		.addUserOption((option) =>
			option.setName("user").setDescription("The user to look"),
		),
	/**
	 * @param {import("discord.js").ChatInputCommandInteraction} interaction
	 * @param {import("discord.js").Client} client
	 */
	async execute(interaction, _client) {
		await interaction.deferReply();

		const targetUser = interaction.options.getUser("user") ?? interaction.user;

		const guildMember = await interaction.guild.members
			.fetch(targetUser.id)
			.catch(() => null);

		const sinceCreationFormatted = time(
			dayjs(targetUser.createdTimestamp).unix(),
			TimestampStyles.RelativeTime,
		);
		const creationFormatted = time(
			dayjs(targetUser.createdTimestamp).unix(),
			TimestampStyles.ShortDateTime,
		);

		const descriptionParts = [
			`• Username: ${targetUser.toString()} - \`${targetUser.tag}\` (${
				targetUser.id
			})`,
			`• Created: ${creationFormatted} (${sinceCreationFormatted})`,
		];

		if (guildMember.joinedTimestamp) {
			const sinceJoinedFormatted = time(
				dayjs(guildMember.joinedTimestamp).unix(),
				TimestampStyles.RelativeTime,
			);
			const joinedFormatted = time(
				dayjs(guildMember.joinedTimestamp).unix(),
				TimestampStyles.ShortDateTime,
			);

			descriptionParts.push(
				`• Joined: ${joinedFormatted} (${sinceJoinedFormatted})`,
			);
		}

		const embed = addFields({
			author: {
				name: `${targetUser.tag} (${targetUser.id})`,
				icon_url: targetUser.displayAvatarURL(),
			},
			color: color.Blurple,
			description: descriptionParts.join("\n"),
			timestamp: new Date().toISOString(),
		});

		await interaction.editReply({
			embeds: [embed],
		});
	},
};
