import { formatEmoji } from "discord.js";
import { Users } from "../../database.js";
import { emojiConfig } from "../../util/config.js";
import { addFields } from "../../util/embed.js";
import { COLOR } from "../../constants.js";

export default {
	name: "get_a_pet",
	/**
	 * @param {import("discord.js").ChatInputCommandInteraction} interaction
	 * @param {import("../../types/ArgumentsOf.js").ArgumentsOf<typeof import("../../interactions/index.js").GetAPetSlashCommand>} args
	 */
	async execute(interaction, args) {
		await interaction.deferReply();

		const user = await Users.findOrCreate({
			where: { user_id: interaction.user.id },
		}).then(([user]) => user);

		if (user.pets) {
			return await interaction.editReply({
				content: "You already have a pet. You can't get another one.",
			});
		}

		const emojiMap = {
			Rocket: emojiConfig.rocketEmoji,
			Mamoth: emojiConfig.mamothEmoji,
			Magma: emojiConfig.magmaEmoji,
			Bomb: emojiConfig.bombEmoji,
			Trex: emojiConfig.trexEmoji,
		};

		const petEmoji = emojiMap[args.pet_type]
			? formatEmoji(emojiMap[args.pet_type].id)
			: "";

		const petIconURL = emojiMap[args.pet_type]
			? `https://cdn.discordapp.com/emojis/${emojiMap[args.pet_type].id}.png`
			: "";

		user.pets = {
			name: args.pet_name ?? args.pet_type,
			type: args.pet_type,
			level: 1,
			experience: 0,
			hp: 100,
			max_hp: 100,
			pet_icon_url: petIconURL,
		};
		await user.save();

		const descriptionParts = [
			`## ${user.pets.name}'s Profile`,
			`- **Pet Name:** ${user.pets.name}`,
			`- **Pet Level:** ${user.pets.level}`,
			`- **Pet HP:** ${user.pets.hp}/${user.pets.max_hp}`,
		];

		const embed = addFields({
			color: COLOR.DarkButNotBlack,
			author: {
				name: user.pets.name,
				icon_url: user.pets.pet_icon_url,
			},
			thumbnail: {
				url: user.pets.pet_icon_url,
			},
			description: descriptionParts.join("\n"),
			footer: {
				text: "to rename a pet use /rename command.",
			},
			timestamp: new Date().toISOString(),
		});

		await interaction.editReply({
			content: `You got a pet ${petEmoji} **${user.pets.type}** and you named it **${user.pets.name}**.`,
			embeds: [embed],
		});
	},
};
