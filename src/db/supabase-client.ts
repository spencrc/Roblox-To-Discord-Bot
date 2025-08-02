import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_KEY } from '../config.js';
import { client } from '../client.js';
import { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from 'discord.js';

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

const callback = async (payload: PostgresChanges): Promise<void> => {
	const { discord_id, guild_id, roblox_id } = payload.new;
	const guild = client.guilds.cache.get(guild_id!)!;
	const { data, error} = await supabase
		.from('settings')
		.select('verify_log_channel_id')
		.match({ guild_id })
		.single();

	if (error) {
  		console.error('Error fetching verify_log_channel_id:', error);
	} else {
		const verify_log_channel_id = data.verify_log_channel_id as string | null;
		if (verify_log_channel_id != null) {
			const channel = guild.channels.cache.get(verify_log_channel_id)!;
			const link = `https://www.roblox.com/users/${roblox_id}/profile`;
			const embed = new EmbedBuilder()
				.setColor(0x22bb33)
				.setTitle('Verified Roblox Account')
				.setDescription(`
					<@${discord_id}> your Roblox account was sucessfully verified!
					
					Want to see your profile? You can visit it [here](<${link}>)!
					`
				)
				.setTimestamp();
			const button = new ButtonBuilder()
				.setStyle(ButtonStyle.Link)
				.setLabel('Profile')
				.setURL(link);
			const row = new ActionRowBuilder<ButtonBuilder>()
				.setComponents(button);
			if (channel.isTextBased()) {
				await channel.send({
					embeds: [embed], 
					components: [row]
				});
			}
		}
	}

};

supabase
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
