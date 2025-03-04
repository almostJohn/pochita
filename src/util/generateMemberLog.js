const dayjs = require("dayjs");
const relativeTime = require("dayjs/plugin/relativeTime.js");
const { time, GuildMember, TimestampStyles } = require("discord.js");

dayjs.extend(relativeTime);

const MAX_TRUST_ACCOUNT_AGE = 1_000 * 60 * 60 * 24 * 7 * 4;

/** @param {number} duration */
function colorFromDuration(duration) {
	const percent = Math.min(duration / (MAX_TRUST_ACCOUNT_AGE / 100), 100);
	let red;
	let green;
	let blue = 0;

	if (percent < 50) {
		red = 255;
		green = Math.round(5.1 * percent);
	} else {
		green = 255;
		red = Math.round(510 - 5.1 * percent);
	}

	const tintFactor = 0.3;

	red += (255 - red) * tintFactor;
	green += (255 - green) * tintFactor;
	blue += (255 - blue) * tintFactor;

	return (red << 16) + (green << 8) + blue;
}

/**
 * @param {GuildMember} member
 * @param {boolean} join
 */
function generateMemberLog(member, join = true) {
	const sinceCreationFormatted = time(
		dayjs(member.user.createdTimestamp).unix(),
		TimestampStyles.RelativeTime,
	);
	const creationFormatted = time(
		dayjs(member.user.createdTimestamp).unix(),
		TimestampStyles.ShortDateTime,
	);

	const descriptionParts = [
		`• Username: ${member.user.toString()} - ${member.user.tag} (${
			member.user.id
		})`,
		`• Created: ${creationFormatted} (${sinceCreationFormatted})`,
	];

	if (member.joinedTimestamp) {
		const sinceJoinFormatted = time(
			dayjs(member.joinedTimestamp).unix(),
			TimestampStyles.RelativeTime,
		);
		const joinFormatted = time(
			dayjs(member.joinedTimestamp).unix(),
			TimestampStyles.ShortDateTime,
		);

		descriptionParts.push(`• Joined: ${joinFormatted} (${sinceJoinFormatted})`);
	}

	if (!join) {
		const sinceLeaveFormatted = time(
			dayjs().unix(),
			TimestampStyles.RelativeTime,
		);
		const leaveFormatted = time(dayjs().unix(), TimestampStyles.ShortDateTime);

		descriptionParts.push(`• Left: ${leaveFormatted} (${sinceLeaveFormatted})`);
	}

	const embed = {
		author: {
			name: `${member.user.tag} (${member.user.id})`,
			icon_url: member.user.displayAvatarURL(),
		},
		color: join
			? colorFromDuration(Date.now() - member.user.createdTimestamp)
			: 3_092_790,
		description: descriptionParts.join("\n"),
		footer: {
			text: join ? "User joined" : "User left",
		},
		timestamp: new Date().toISOString(),
	};

	return embed;
}

exports.generateMemberLog = generateMemberLog;
