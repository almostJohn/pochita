import { inlineCode, italic, time, TimestampStyles } from "discord.js";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime.js";
import { TAB } from "../constants.js";
import { formatNumberToStringWithComma } from "./helperFunctions.js";

dayjs.extend(relativeTime);

/**
 * @param {import("discord.js").APIEmbed} embed
 * @param {import("discord.js").Guild} guild
 */
export async function applyServerInfo(embed, guild) {
	const notices = [];
	const serverInfo = [
		`Name: ${inlineCode(guild.name)}`,
		`ID: ${inlineCode(guild.id)}`,
		`Created: ${time(
			dayjs(guild.createdTimestamp).unix(),
			TimestampStyles.ShortDateTime,
		)} (${time(
			dayjs(guild.createdTimestamp).unix(),
			TimestampStyles.RelativeTime,
		)})`,
	];

	if (guild.icon) {
		serverInfo.push(
			`Icon: [${guild.icon}](${guild.iconURL({
				extension: "png",
				size: 2_048,
			})})`,
		);
	}

	const bannerURL = guild.bannerURL({ extension: "png", size: 2_048 });
	if (guild.banner && bannerURL) {
		serverInfo.push(`Banner: [${guild.banner}](${bannerURL})`);
	}

	embed.thumbnail = {
		url: guild.iconURL({ extension: "png", size: 2_048 }),
	};

	if (guild.available) {
		notices.push(
			`${
				!guild.available
					? "This server is undergoing outage"
					: "This server is available"
			}`,
		);
	}

	if (guild.roles.cache.size > 1) {
		serverInfo.push(
			`Roles: (${guild.roles.cache.size - 1}):\n${TAB}${guild.roles.cache
				.filter((role) => role.id !== role.guild.roles.everyone.id)
				.sorted((a, b) => b.rawPosition - a.rawPosition)
				.reduce((acc, current) => {
					return [...acc, italic(`<@&${current.id}>`)];
				}, [])
				.join(", ")}`,
		);
	}

	if (guild.memberCount) {
		serverInfo.push(
			`Member count: ${formatNumberToStringWithComma(guild.memberCount)}`,
		);
	}

	const owner = await guild.client.users.fetch(guild.ownerId).catch(() => null);
	if (owner) {
		notices.push(
			`Owner: ${owner.toString()} - ${inlineCode(owner.tag)} (${owner.id})`,
		);
	}

	embed.fields = [
		...(embed.fields ?? []),
		{
			name: "Server info",
			value: serverInfo.map((part) => `- ${part}`).join("\n"),
		},
	];

	return notices;
}
