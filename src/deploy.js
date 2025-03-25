import "dotenv/config.js";
import { REST, Routes } from "discord.js";
import {
	// utility
	PingCommand,
	InfoCommand,
	BirthdayCommand,
} from "./interactions/index.js";
import { logger } from "./logger.js";

const rest = new REST().setToken(process.env.DISCORD_BOT_TOKEN);

(async () => {
	try {
		logger.info("Started refreshing interaction (/) commands");

		await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID), {
			body: [
				// utility
				PingCommand,
				InfoCommand,
				BirthdayCommand,
			],
		});

		logger.success("Successfully reloaded interaction (/) commands");
	} catch (error_) {
		const error = /** @type {Error} */ (error_);
		logger.error(error, error.message);
	}
})();
