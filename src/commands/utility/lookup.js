const {
	SlashCommandBuilder,
	ChatInputCommandInteraction,
	Client,
	time,
	TimestampStyles,
	italic,
	MessageFlags,
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
		.setName("lookup")
		.setDescription("Look up a member stats")
		.addUserOption((option) =>
			option
				.setName("user")
				.setDescription("The user to look up")
				.setRequired(true),
		)
		.setDefaultMemberPermissions(0),
	/**
	 * @param {ChatInputCommandInteraction} interaction
	 * @param {Client} client
	 */
	async execute(interaction, client) {
		await interaction.deferReply();

		const user = interaction.options.getUser("user");

		const guildMember = await interaction.guild.members
			.fetch(user.id)
			.catch(() => null);

		if (!guildMember) {
			return await interaction.editReply({
				content: "The member is not in this server",
				flags: MessageFlags.Ephemeral,
			});
		}

		const rank = getInfoOnMemberRank(guildMember);

		const sinceCreationFormatted = time(
			dayjs(user.createdTimestamp).unix(),
			TimestampStyles.RelativeTime,
		);
		const creationFormatted = time(
			dayjs(user.createdTimestamp).unix(),
			TimestampStyles.ShortDateTime,
		);

		const sinceJoinedFormatted = time(
			dayjs(guildMember.joinedTimestamp).unix(),
			TimestampStyles.RelativeTime,
		);
		const joinedFormatted = time(
			dayjs(guildMember.joinedTimestamp).unix(),
			TimestampStyles.ShortDateTime,
		);

		const descriptionParts = [
			`• Username: ${user.toString()} - \`${user.tag}\` (${user.id})`,
			`• Created: ${creationFormatted} (${sinceCreationFormatted})`,
			`• Joined: ${joinedFormatted} (${sinceJoinedFormatted})`,
		];

		const embed = {
			author: {
				name: `${user.tag} (${user.id})`,
				icon_url: user.displayAvatarURL(),
			},
			color: true
				? colorFromDuration(Date.now() - guildMember.joinedTimestamp)
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
