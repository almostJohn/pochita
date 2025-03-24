import { set } from "./sub/birthday/set.js";
import { view } from "./sub/birthday/view.js";
import { view_list } from "./sub/birthday/view_list.js";

export default {
	name: "birthday",
	/**
	 * @param {import("../../types/Interaction.js").InteractionParam} interaction
	 * @param {import("../../types/Interaction.js").ArgsParam<typeof import("../../interactions/index.js").BirthdayCommand>} args
	 */
	async execute(interaction, args) {
		switch (Object.keys(args)[0]) {
			case "set": {
				await set(interaction, args.set);
				break;
			}

			case "view": {
				await view(interaction, args.view);
				break;
			}

			case "view_list": {
				await view_list(interaction, args.view_list);
				break;
			}
		}
	},
};
