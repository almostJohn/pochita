const {
	SlashCommandBuilder,
	ChatInputCommandInteraction,
	Client,
	MessageFlags,
	time,
	TimestampStyles,
	italic,
} = require("discord.js");
const dayjs = require("dayjs");
const relativeTime = require("dayjs/plugin/relativeTime.js");
const duration = require("dayjs/plugin/duration.js");
const { colorFromDuration } = require("../../util/generateMemberLog");
const { getInfoOnMemberRank } = require("../../util/getInfoOnMemberRank");

dayjs.extend(relativeTime);
dayjs.extend(duration);

module.exports = {
	data: new SlashCommandBuilder()
		.setName("stats")
		.setDescription("Look up your stats on this server"),
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 * @param {Client} client
	 */
	async execute(interaction, client) {
		await interaction.deferReply({ flags: MessageFlags.Ephemeral });

		const rank = getInfoOnMemberRank(interaction.member);

		const sinceCreationFormatted = time(
			dayjs(interaction.user.createdTimestamp).unix(),
			TimestampStyles.RelativeTime,
		);
		const creationFormatted = time(
			dayjs(interaction.user.createdTimestamp).unix(),
			TimestampStyles.ShortDateTime,
		);

		const sinceJoinedFormatted = time(
			dayjs(interaction.member.joinedTimestamp).unix(),
			TimestampStyles.RelativeTime,
		);
		const joinedFormatted = time(
			dayjs(interaction.member.joinedTimestamp).unix(),
			TimestampStyles.ShortDateTime,
		);

		const descriptionParts = [
			`• Username: ${interaction.user.toString()} - \`${
				interaction.user.tag
			}\` (${interaction.user.id})`,
			`• Created: ${creationFormatted} (${sinceCreationFormatted})`,
			`• Joined: ${joinedFormatted} (${sinceJoinedFormatted})`,
		];

		const embed = {
			author: {
				name: `${interaction.user.tag} (${interaction.user.id})`,
				icon_url: interaction.user.displayAvatarURL(),
			},
			color: true
				? colorFromDuration(Date.now() - interaction.member.joinedTimestamp)
				: 3_092_790,
			description: descriptionParts.join("\n"),
			fields: [
				{
					name: "\u200B",
					value: italic(`(${rank})`),
				},
			],
			footer: {
				text: `Requested by ${interaction.user.tag}`,
			},
			timestamp: new Date().toISOString(),
		};

		await interaction.editReply({ embeds: [embed] });
	},
};
