import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime.js";
import { inlineCode, time, TimestampStyles } from "discord.js";
import { colorFromDuration } from "./helperFunctions.js";
import { COLOR } from "../constants.js";
import { addFields } from "./embed.js";

dayjs.extend(relativeTime);

/**
 * @param {import("discord.js").GuildMember} guildMember
 * @param {boolean} [joined=true]
 */
export function generateMemberLog(guildMember, joined = true) {
	const sinceCreatedFormatted = time(
		dayjs(guildMember.user.createdTimestamp).unix(),
		TimestampStyles.RelativeTime,
	);
	const createdFormatted = time(
		dayjs(guildMember.user.createdTimestamp).unix(),
		TimestampStyles.ShortDateTime,
	);

	const parts = [
		`• Username: ${guildMember.user.toString()} - ${inlineCode(
			guildMember.user.tag,
		)} (${guildMember.user.id})`,
		`• Created: ${createdFormatted} (${sinceCreatedFormatted})`,
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

		parts.push(`• Joined: ${joinFormatted} (${sinceJoinFormatted})`);
	}

	if (!joined) {
		const sinceLeftFormatted = time(
			dayjs().unix(),
			TimestampStyles.RelativeTime,
		);
		const leftFormatted = time(dayjs().unix(), TimestampStyles.ShortDateTime);

		parts.push(`• Left: ${leftFormatted} (${sinceLeftFormatted})`);
	}

	const embed = addFields({
		author: {
			name: `${guildMember.user.tag} (${guildMember.user.id})`,
			icon_url: guildMember.user.displayAvatarURL(),
		},
		color: joined
			? colorFromDuration(Date.now() - guildMember.user.createdTimestamp)
			: COLOR.DarkButNotBlack,
		description: parts.join("\n"),
		footer: {
			text: joined ? "User joined" : "User left",
		},
		timestamp: new Date().toISOString(),
	});

	return embed;
}
