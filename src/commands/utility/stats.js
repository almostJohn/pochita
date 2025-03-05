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

		const joinedDuration = dayjs.duration(
			dayjs().diff(dayjs(interaction.member.joinedTimestamp)),
		);
		const monthsJoined = joinedDuration.asMonths();

		let rank = "";

		switch (true) {
			case monthsJoined < 1:
				rank = "You're not qualified yet for roles/ranks in this server";
				break;
			case monthsJoined < 3:
				rank = "You can now claim the `Bronze Arc I` role";
				break;
			case monthsJoined < 6:
				rank = "You can now claim the `Silver Arc II` role";
				break;
			case monthsJoined < 12:
				rank = "You can now claim the `Gold Arc III` role";
				break;
			case monthsJoined < 24:
				rank = "You can now claim the `Platinum Arc IV` role";
				break;
			case monthsJoined < 36:
				rank = "You can now claim the `Diamond Arc V` role";
				break;
			case monthsJoined < 60:
				rank = "You can now claim the `Emerald Arc VI` role";
				break;
			case monthsJoined < 72:
				rank = "You can now claim the `Ruby Arc VII` role";
				break;
			case monthsJoined >= 72:
				rank = "You can now claim the `Opal Arc VIII` role";
				break;
		}

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
