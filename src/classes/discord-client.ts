import { ActivityType, Client, ClientEvents, Collection, GatewayIntentBits } from 'discord.js';
import { SlashCommand } from './slash-command.js';
import { readdirSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { DISCORD_TOKEN } from '../config.js';
import { Event } from './event.js';

export class DiscordClient extends Client {
	public commands: Collection<string, SlashCommand> = new Collection();

	constructor() {
		super({
			intents: [GatewayIntentBits.Guilds],
			presence: {
				activities: [
					{
						name: `customstatus`,
						type: ActivityType.Custom,
						state: `/ping to get a response!`
					}
				],
				status: `online`
			}
		});
	}

	public async load() {
		const commandPath: string = './dist/commands/';
		const eventsPath: string = './dist/events/';

		for (const folder of readdirSync(commandPath)) {
			const folderPath: string = commandPath + folder + '/';
			for (const file of readdirSync(folderPath).filter((file) => file.endsWith('.js'))) {
				const filePath: string = folderPath + file;
				const command = (await import(pathToFileURL(filePath).href)).default as SlashCommand;

				this.commands.set(command.data.name, command);
				console.log('Loaded new command:', file);
			}
		}

		for (const file of readdirSync(eventsPath).filter((file) => file.endsWith('.js'))) {
			const filePath: string = eventsPath + file;
			const event = (await import(pathToFileURL(filePath).href)).default as Event<keyof ClientEvents>;
			if (event.once) {
				this.once(event.name, (...args) => event.execute(...args));
			} else {
				this.on(event.name, (...args) => event.execute(...args));
			}
			console.log('Loaded new event:', file);
		}
	}

	public async start() {
		// Load all commands and events
		await this.load();
		// Login to Discord with your client's token
		await this.login(DISCORD_TOKEN);
	}
}
