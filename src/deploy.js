import "dotenv/config.js";
import { REST, Routes } from "discord.js";
import {
	// utility
	PingCommand,
	InfoCommand,
} from "./interactions/index.js";

const rest = new REST().setToken(process.env.DISCORD_BOT_TOKEN);

(async () => {
	try {
		console.log("Started refreshing interaction (/) commands");

		await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID), {
			body: [
				// utility
				PingCommand,
				InfoCommand,
			],
		});

		console.log("Successfully reloaded interaction (/) commands");
	} catch (error) {
		console.error(error);
	}
})();
