import { Users } from "../db.js";
import { addFields } from "./embed.js";
import { guildConfig } from "./config.js";
import { Op } from "sequelize";
import { COLOR } from "../constants.js";
import { setTimeout as pSetTimeout } from "node:timers/promises";
import { checkLogChannel } from "./checkLogChannel.js";

/**
 * @param {import("discord.js").Client} client
 */
export async function checkBirthdays(client) {
	const { birthdayRoleId, generalChatChannelId } = guildConfig;

	if (!generalChatChannelId) {
		return;
	}

	const guild = client.guilds.cache.first();

	if (!guild) {
		return;
	}

	const logChannel = await checkLogChannel(guild, generalChatChannelId);

	if (!logChannel) {
		return;
	}

	const role = /** @type {import("discord.js").Role} */ (
		guild.roles.cache.find((role) => role.id === birthdayRoleId)
	);

	if (!role) {
		return;
	}

	const today = new Date();
	const monthToday = today.getMonth() + 1;
	const dateToday = today.getDate();

	const users = await Users.findAll({ where: { birthday: { [Op.ne]: null } } });

	for (const user of users) {
		const birthday = new Date(user.birthday);
		if (
			birthday.getMonth() + 1 === monthToday &&
			birthday.getDate() === dateToday
		) {
			const member = await guild.members.fetch(user.user_id).catch(() => null);

			if (!member) {
				continue;
			}

			const embed = addFields({
				color: COLOR.Fuchsia,
				title: "🎉 Happy Birthday",
				description: `Everyone, wish <@${user.user_id}> a happy birthday! 🎊🎁`,
				timestamp: new Date().toISOString(),
			});

			await logChannel.send({ embeds: [embed] });

			await member.roles.add(role.id);

			await pSetTimeout(() => {
				member.roles.remove(role.id);
			}, 1_000 * 60 * 60 * 24);
		}
	}
}
