import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_KEY } from '../config.js';
import { client } from '../client.js';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

interface PostgresChanges {
	schema: string;
	table: string;
	commit_timestamp: string; //formatted as a string by supabase-js
	eventType: string;
	new: { [key: string]: string };
	old: { [key: string]: string };
	errors: unknown;
}

const callback = (payload: PostgresChanges): void => {
	const { discord_id, guild_id, roblox_id } = payload.new;
	const guild = client.guilds.cache.get(guild_id!)!;
	const channel = guild.channels.cache.get('1397713142196469770')!
	if (channel.isTextBased()) {
		channel.send(`${discord_id} ${guild_id} ${roblox_id}`);
	}
	//console.log(discord_id, guild_id, roblox_id);
}

const channel = supabase
	.channel('roblox_discord_links_changes')
	.on(
		'postgres_changes',
		{
			event: '*', // can be 'INSERT', 'UPDATE', 'DELETE'
			schema: 'public',
			table: 'roblox_discord_links'
		},
		callback
	)
	.subscribe();
