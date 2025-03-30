import { Events, inlineCode, italic } from "discord.js";
import { Users } from "../db.js";

export default {
	name: Events.MessageCreate,
	/**
	 * @param {import("discord.js").Message} message
	 * @param {import("discord.js").Client} _client
	 */
	async execute(message, _client) {
		if (message.author.bot) {
			return;
		}

		if (!message.inGuild()) {
			return;
		}

		const afkUser = await Users.findOne({
			where: { user_id: message.author.id },
		});

		if (afkUser) {
			await Users.destroy({ where: { user_id: message.author.id } });

			const member = message.guild.members.cache.get(message.author.id);
			if (member && afkUser.old_nickname) {
				await member.setNickname(afkUser.old_nickname).catch(() => null);
			}

			await message.reply({
				content: "Welcome back! Your AFK status has been removed",
			});
		}

		const mentionedUsers = message.mentions.users;
		if (mentionedUsers.size > 0) {
			for (const [, user] of mentionedUsers) {
				const mentionedUser = await Users.findOne({
					where: { user_id: user.id },
				});

				if (mentionedUser) {
					await message.channel.send({
						content: `${inlineCode(user.tag)} is AFK — ${italic(
							mentionedUser.reason,
						)}`,
					});
				}
			}
		}
	},
};
