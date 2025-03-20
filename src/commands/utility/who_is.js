import { MessageFlags, time, TimestampStyles } from "discord.js";
import dayjs from "dayjs";
import { addFields } from "../../util/embed.js";
import { COLOR } from "../../constants.js";
import { colorFromDuration } from "../../util/colorFromDuration.js";
import { ERROR_RESPONSES } from "../../constants.js";

export default {
	name: "who_is",
	/**
	 * @param {import("discord.js").ChatInputCommandInteraction} interaction
	 * @param {import("../../types/ArgumentsOf.js").ArgumentsOf<typeof import("../../interactions/index.js").WhoIsSlashCommand>} args
	 */
	async execute(interaction, args) {
		await interaction.deferReply({
			flags: args.hide ? MessageFlags.Ephemeral : undefined,
		});

		const targetUser = args.user?.user ?? interaction.user;

		if (!targetUser) {
			return await interaction.editReply({
				content: ERROR_RESPONSES.targetUserNotFound,
			});
		}

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
			`- Username: ${targetUser.toString()} - \`${targetUser.tag}\` (${
				targetUser.id
			})`,
			`- Created: ${creationFormatted} (${sinceCreationFormatted})`,
		];

		if (guildMember.joinedTimestamp) {
			const sinceJoinFormatted = time(
				dayjs(guildMember.joinedTimestamp).unix(),
				TimestampStyles.RelativeTime,
			);
			const joinFormatted = time(
				dayjs(guildMember.joinedTimestamp).unix(),
				TimestampStyles.ShortDateTime,
			);

			descriptionParts.push(
				`- Joined: ${joinFormatted} (${sinceJoinFormatted})`,
			);
		}

		let joined = true;
		const embed = addFields({
			author: {
				name: `${targetUser.tag} (${targetUser.id})`,
				icon_url: targetUser.displayAvatarURL(),
			},
			color: joined
				? colorFromDuration(Date.now() - targetUser.createdTimestamp)
				: COLOR.DarkButNotBlack,
			description: descriptionParts.join("\n"),
			footer: {
				text: `requested by ${interaction.user.tag}`,
			},
			timestamp: new Date().toISOString(),
		});

		await interaction.editReply({
			embeds: [embed],
		});
	},
};
