import { server } from "./sub/user/server.js";
import { user } from "./sub/user/user.js";

export default {
	name: "info",
	/**
	 * @param {import("../../types/Interaction.js").InteractionParam} interaction
	 * @param {import("../../types/Interaction.js").ArgsParam<typeof import("../../interactions/index.js").InfoCommand>} args
	 */
	async execute(interaction, args) {
		switch (Object.keys(args)[0]) {
			case "user": {
				await user(interaction, args.user);
				break;
			}

			case "server": {
				await server(interaction, args.server);
				break;
			}
		}
	},
};
