import { Client, Events, ClientUser } from 'discord.js';
import { Event } from '../classes/event.js';

export default new Event({
	name: Events.ClientReady,
	once: true,
	execute: (client: Client) => {
		const user: ClientUser = client.user as ClientUser;
		console.log(`[DISCORD CLIENT] Ready! Logged in as ${user.tag}`);
	}
});
