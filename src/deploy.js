import "dotenv/config.js";
import { REST, Routes } from "discord.js";
import {
	// admin
	SetPointsSlashCommand,

	// economy
	DailySlashCommand,
	BoostSlashCommand,
	NegSlashCommand,
	PointsSlashCommand,
	PutSlashCommand,
	PutAllSlashCommand,
	RobSlashCommand,
	VaultSlashCommand,
	GetSlashCommand,
	GetAllSlashCommand,
	LeaderboardSlashCommand,
	SlotSlashCommand,
	WorkSlashCommand,
	GetAPetSlashCommand,
	PetSlashCommand,
	ProfileSlashCommand,

	// utility
	BirthdaysSlashCommand,
	PingSlashCommand,
	SetBirthdaySlashCommand,
	WhoIsSlashCommand,
} from "./interactions/index.js";

const rest = new REST().setToken(process.env.DISCORD_BOT_TOKEN);

(async () => {
	try {
		console.log("Started refreshing interaction (/) commands");

		await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID), {
			body: [
				// economy
				DailySlashCommand,
				BoostSlashCommand,
				NegSlashCommand,
				PointsSlashCommand,
				PutSlashCommand,
				PutAllSlashCommand,
				RobSlashCommand,
				VaultSlashCommand,
				GetSlashCommand,
				GetAllSlashCommand,
				LeaderboardSlashCommand,
				SlotSlashCommand,
				WorkSlashCommand,
				GetAPetSlashCommand,
				PetSlashCommand,
				ProfileSlashCommand,

				// utility
				BirthdaysSlashCommand,
				PingSlashCommand,
				SetBirthdaySlashCommand,
				WhoIsSlashCommand,

				// admin
				SetPointsSlashCommand,
			],
		});

		console.log("Successfully reloaded interaction (/) commands");
	} catch (error) {
		console.error(error);
	}
})();
