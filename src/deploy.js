import "dotenv/config.js";
import { REST, Routes } from "discord.js";
import fs from "node:fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const commands = [];

const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs
		.readdirSync(commandsPath)
		.filter((file) => file.endsWith(".js"));
	for (const file of commandFiles) {
		const filePath = pathToFileURL(path.join(commandsPath, file)).href;
		const { default: command } = await import(filePath);
		if ("data" in command && "execute" in command) {
			commands.push(command.data.toJSON());
		} else {
			console.log(
				`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property`,
			);
		}
	}
}

const rest = new REST().setToken(process.env.DISCORD_BOT_TOKEN);

(async () => {
	try {
		console.log("Started refreshing interaction (/) commands");

		await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID), {
			body: commands,
		});

		console.log("Successfully reloaded interaction (/) commands");
	} catch (error) {
		console.error(error);
	}
})();
