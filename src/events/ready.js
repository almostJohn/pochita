import { Events, PermissionFlagsBits } from "discord.js";
import { guildConfig } from "../util/config.js";
import cron from "node-cron";
import dayjs from "dayjs";
import { Users } from "../database.js";
import { Op } from "sequelize";

export default {
	name: Events.ClientReady,
	once: true,
	/**
	 * @param {import("discord.js").Client} client
	 */
	async execute(client) {
		console.log("Caching webhooks");

		for (const guild of client.guilds.cache.values()) {
			if (
				!guild.members.me.permissions.has(
					PermissionFlagsBits.ManageWebhooks,
					true,
				)
			) {
				console.warn("No permission to fetch webhooks");
				return;
			}

			const mainChannelWebhookId = guildConfig.mainChannelWebhookId;

			const webhooks = await guild.fetchWebhooks();

			if (mainChannelWebhookId) {
				const webhook = webhooks.get(mainChannelWebhookId);

				if (!webhook) {
					continue;
				}

				client.webhooks.set(webhook.id, webhook);
			}

			cron.schedule("0 0 * * *", async () => {
				const today = dayjs().format("MM-DD");

				const usersWithBirthdays = await Users.findAll({
					where: { birthday: { [Op.ne]: null } },
				});

				const birthdayUsers = usersWithBirthdays.filter(
					(user) => dayjs(user.birthday).format("MM-DD") === today,
				);

				const birthdayRole = guild.roles.cache.find(
					(role) => role.id === guildConfig.birthdayRoleId,
				);

				if (!birthdayRole) {
					return;
				}

				for (const user of birthdayUsers) {
					const member = guild.members.cache.get(user.user_id);

					if (!member) {
						continue;
					}

					await member.roles.add(birthdayRole.id);

					/** @type {import("discord.js").TextChannel} */
					const channel = guild.channels.cache.find(
						(channel) => channel.id === guildConfig.mainChannelId,
					);

					if (!channel) {
						continue;
					}

					await channel.send({
						content: `🎉 Happiest birthday to you ${member.user.toString()}! Wishing you a good health and success.`,
					});
				}

				const membersWithRole = guild.members.cache.filter((member) => {
					member.roles.cache.has(birthdayRole.id);
				});

				for (const guildMember of membersWithRole.values()) {
					const user = await Users.findOne({
						where: { user_id: guildMember.user.id },
					});

					if (!user) {
						continue;
					}

					const isBirthdayPassed =
						dayjs(user.birthday).format("MM-DD") !== today;

					if (isBirthdayPassed) {
						await guildMember.roles.remove(birthdayRole.id);
					}
				}
			});
		}

		console.log(`Logged in as ${client.user.tag} (${client.user.id})`);
	},
};
