import "dotenv/config.js";
import {
	Client,
	GatewayIntentBits,
	Options,
	Partials,
	Collection,
} from "discord.js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildModeration,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.MessageContent,
	],
	partials: [
		Partials.GuildMember,
		Partials.Channel,
		Partials.Reaction,
		Partials.Message,
	],
	makeCache: Options.cacheWithLimits({
		MessageManager: 100,
		StageInstanceManager: 10,
		VoiceStateManager: 10,
	}),
});
client.setMaxListeners(20);

client.commands = new Collection();
client.cooldowns = new Collection();
client.webhooks = new Collection();

const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
	.readdirSync(eventsPath)
	.filter((file) => file.endsWith(".js"));

try {
	for (const folder of commandFolders) {
		const commandsPath = path.join(foldersPath, folder);
		const commandFiles = fs
			.readdirSync(commandsPath)
			.filter((file) => file.endsWith(".js"));
		for (const file of commandFiles) {
			const filePath = pathToFileURL(path.join(commandsPath, file)).href;
			const { default: command } = await import(filePath);
			console.log(`Registering command: ${command.name}`);

			if ("execute" in command) {
				client.commands.set(command.name, command);
			} else {
				console.log(
					`[WARNING] The command at ${filePath} is missing a "required" data or "execute" property`,
				);
			}
		}
	}

	for (const file of eventFiles) {
		const filePath = pathToFileURL(path.join(eventsPath, file)).href;
		const { default: event } = await import(filePath);
		console.log(`Registering event: ${event.name}`);

		if (event.disabled) {
			continue;
		}

		if (event.once) {
			client.once(event.name, (...args) => event.execute(...args, client));
		} else {
			client.on(event.name, (...args) => event.execute(...args, client));
		}
	}

	client.login(process.env.DISCORD_BOT_TOKEN);
} catch (error) {
	console.error(error);
}
