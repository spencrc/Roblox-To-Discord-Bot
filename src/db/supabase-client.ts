import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_KEY } from '../config.js';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

interface PostgresChanges {
	schema: string;
	table: string;
	commit_timestamp: string; //formatted as a string by supabase-js
	eventType: 'INSERT' | 'DELETE' | 'UPDATE';
	new: { [key: string]: string };
	old: { [key: string]: string };
	errors: unknown;
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
		(payload: PostgresChanges) => {
			console.log('Change received!', payload);
		}
	)
	.subscribe();
