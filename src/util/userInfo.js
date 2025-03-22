import {
	ApplicationFlagsBitField,
	inlineCode,
	italic,
	time,
	TimestampStyles,
} from "discord.js";
import dayjs from "dayjs";
import { MAX_TRUST_ACCOUNT_AGE, TAB } from "../constants.js";
import { formatUserFlag, formatApplicationFlag } from "./formatting.js";

/**
 * @typedef {Object} ApplicationRPC
 * @property {boolean} bot_public
 * @property {boolean} bot_require_code_grant
 * @property {string} description
 * @property {number} flags
 * @property {boolean} hook
 * @property {string} icon
 * @property {string} id
 * @property {string} name
 * @property {string} summary
 * @property {string[]} tags
 */

/**
 * @param {number} timestamp
 * @param {import("discord.js").TimestampStylesString} format
 */
function timeFromTimestamp(timestamp, format) {
	return time(dayjs(timestamp).unix(), format);
}

/**
 *
 * @param {import("discord.js").APIEmbed} embed
 * @param {import("discord.js").GuildMember} member
 * @returns {string[]}
 */
export function applyMemberInfo(embed, member) {
	const notices = [];
	const memberInfo = [
		`Joined: ${timeFromTimestamp(
			member.joinedTimestamp ?? 0,
			TimestampStyles.ShortDateTime,
		)} (${timeFromTimestamp(
			member.joinedTimestamp ?? 0,
			TimestampStyles.RelativeTime,
		)})`,
	];

	if (member.avatar) {
		memberInfo.push(
			`Server avatar: [${member.avatar}](${member.avatarURL({
				extension: "png",
				size: 2_048,
			})})`,
		);
	}

	if (member.roles.color) {
		memberInfo.push(
			`Color role: ${inlineCode(member.roles.color.name)} (${inlineCode(
				member.displayHexColor,
			)})`,
		);
	}

	if (member.roles.hoist) {
		memberInfo.push(`Hoist role: ${inlineCode(member.roles.hoist.name)}`);
	}

	if (member.roles.icon) {
		embed.footer = {
			icon_url: member.roles.icon.iconURL({ extension: "png", size: 2_048 }),
			text: member.roles.icon.name,
		};

		memberInfo.push(`Icon role: ${inlineCode(member.roles.icon.name)}`);
	}

	if (
		member.communicationDisabledUntilTimestamp &&
		member.communicationDisabledUntilTimestamp > Date.now()
	) {
		notices.push(
			`🔇 Timeout until: ${timeFromTimestamp(
				member.communicationDisabledUntilTimestamp,
				TimestampStyles.ShortDateTime,
			)} (${timeFromTimestamp(
				member.communicationDisabledUntilTimestamp,
				TimestampStyles.RelativeTime,
			)})`,
		);
	}

	if (member.nickname) {
		memberInfo.push(`Nickname: ${inlineCode(member.nickname)}`);
	}

	if (member.premiumSinceTimestamp) {
		memberInfo.push(
			`Boosting since: ${timeFromTimestamp(
				member.premiumSinceTimestamp,
				TimestampStyles.ShortDateTime,
			)} (${timeFromTimestamp(
				member.premiumSinceTimestamp,
				TimestampStyles.RelativeTime,
			)})`,
		);
	}

	if (member.id === member.guild.ownerId) {
		notices.push("Owner of this server");
	}

	if (Date.now() - (member.joinedTimestamp ?? 0) < MAX_TRUST_ACCOUNT_AGE) {
		notices.push("New member");
	}

	if (member.roles.cache.size > 1) {
		memberInfo.push(
			`Roles: (${member.roles.cache.size - 1}):\n${TAB}${member.roles.cache
				.filter((role) => role.id !== role.guild.roles.everyone.id)
				.sorted((a, b) => b.rawPosition - a.rawPosition)
				.reduce((acc, current) => {
					return [...acc, italic(`<@&${current.id}>`)];
				}, [])
				.join(",")}`,
		);
	}

	embed.fields = [
		...(embed.fields ?? []),
		{
			name: "Member info",
			value: memberInfo.map((part) => `- ${part}`).join("\n"),
		},
	];

	if (member.displayColor) {
		embed.color = member.displayColor;
	}

	embed.thumbnail = {
		url: member.displayAvatarURL({ extension: "png", size: 2_048 }),
	};

	if (member.pending) {
		notices.push("Membership pending");
	}

	return notices;
}

/**
 * @param {import("discord.js").APIEmbed} embed
 * @param {import("discord.js").User} user
 * @returns {Promise<string[]>}
 */
export async function applyUserInfo(embed, user) {
	const notices = [];
	await user.fetch(true);
	const userInfo = [
		`Name: ${user.toString()} ${inlineCode(user.tag)}`,
		`ID: ${inlineCode(user.id)}`,
		`Created: ${timeFromTimestamp(
			user.createdTimestamp,
			TimestampStyles.ShortDateTime,
		)} (${timeFromTimestamp(
			user.createdTimestamp,
			TimestampStyles.RelativeTime,
		)})`,
	];

	if (user.avatar) {
		userInfo.push(
			`Avatar: [${user.avatar}](${user.avatarURL({
				extension: "png",
				size: 2_048,
			})})`,
		);
	}

	const bannerURL = user.bannerURL({ extension: "png", size: 2_048 });
	if (bannerURL && user.banner) {
		userInfo.push(`Banner: [${user.banner}](${bannerURL})`);
	}

	embed.thumbnail = {
		url: user.displayAvatarURL({ extension: "png", size: 2_048 }),
	};

	if (user.bot) {
		notices.push("Bot application");
	}

	if (user.flags.bitfield) {
		const flagStrings = user.flags
			.toArray()
			.map((flagname) => italic(formatUserFlag(flagname)));

		userInfo.push(`Badges:\n${TAB}${flagStrings.join(", ")}`);
	}

	embed.fields = [
		...(embed.fields ?? []),
		{
			name: "User info",
			value: userInfo.map((part) => `- ${part}`).join("\n"),
		},
	];

	return notices;
}

/**
 * @param {import("discord.js").APIEmbed} embed
 * @param {import("discord.js").User} user
 */
export async function applyApplicationInfo(embed, user) {
	try {
		/** @type {ApplicationRPC} */
		const res = await user.client.rest.get(`/applications/${user.id}/rpc`);
		const info = [];

		info.push(
			`${
				res.bot_public
					? "Bot is **public application**"
					: "Bot is **private application**"
			}`,
		);
		info.push(
			`${
				res.bot_require_code_grant
					? "Bot **requires** OAuth2 grant"
					: "Bot **does not requires** OAuth2 grant"
			}`,
		);

		const flags = new ApplicationFlagsBitField(res.flags)
			.toArray()
			.map((flagname) => formatApplicationFlag(flagname));

		if (flags.length) {
			info.push(...flags);
		}

		if (res.description.length) {
			embed.fields = [
				...(embed.fields ?? []),
				{
					name: "App description",
					value: res.description,
				},
			];
		}

		if (res.summary.length) {
			embed.fields = [
				...(embed.fields ?? []),
				{
					name: "App summary",
					value: res.summary,
				},
			];
		}

		if (info.length) {
			embed.fields = [
				...(embed.fields ?? []),
				{
					name: "App info",
					value: info.map((part) => `- ${part}`).join("\n"),
				},
			];
		}

		return [];
	} catch {
		return [];
	}
}
