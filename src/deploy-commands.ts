import { REST, Routes } from 'discord.js';
import { DISCORD_CLIENT_ID, DISCORD_TOKEN } from './config.js';
import { client } from './client.js';

// Loads all commands
await client.loadCommands();

const rest: REST = new REST().setToken(DISCORD_TOKEN);

await (async () => {
	try {
		console.log(`Started refreshing application (/) commands.`);
		// We want a version of client.commands with data as JSON, so map client.commands like so:
		const commands = client.commands.map((cmd) => cmd.data.toJSON());

		// The put method is used to fully refresh all commands globally with the current set
		await rest.put(Routes.applicationCommands(DISCORD_CLIENT_ID), {
			body: commands
		});

		console.log(`Successfully reloaded application (/) commands.`);

		process.exit(0);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
		process.exit(1);
	}
})();
