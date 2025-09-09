import { client } from './client.js';
import supabase from './db/supabase.js';
import { robloxLinkCallback } from './lib/roblox-link-callback.js';

// Start Discord bot by loading all commands and events, then login using your client's token
await client.start();

// Subscribe to roblox_discord_links table, and listen for any changes. If a change occurs, call robloxLinkCallback
supabase
	.channel('roblox_discord_links_changes')
	.on(
		'postgres_changes',
		{
			event: '*', // can be 'INSERT', 'UPDATE', 'DELETE'
			schema: 'public',
			table: 'roblox_discord_links'
		},
		robloxLinkCallback
	)
	.subscribe();