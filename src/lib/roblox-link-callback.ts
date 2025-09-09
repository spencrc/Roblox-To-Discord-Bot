import { client } from '../client.js';
import { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, GuildBasedChannel } from 'discord.js';
import supabase from '../db/supabase.js';

export interface PostgresChanges {
	schema: string;
	table: string;
	commit_timestamp: string; //formatted as a string by supabase-js
	eventType: string;
	new: { [key: string]: string };
	old: { [key: string]: string };
	errors: unknown;
}

export const robloxLinkCallback = async (payload: PostgresChanges): Promise<void> => {
	const { discord_id, guild_id, roblox_id } = payload.new;
	const guild = client.guilds.cache.get(guild_id!)!;
	const { data, error } = await supabase
		.from('settings')
		.select('verify_log_channel_id')
		.match({ guild_id })
		.maybeSingle();

	if (error) {
		console.error('Error fetching verify_log_channel_id:', error);
	} else {
		if (!data) return;
		const verify_log_channel_id = data.verify_log_channel_id as string | null;
		if (verify_log_channel_id != null) {
			const channel = guild.channels.cache.get(verify_log_channel_id) as GuildBasedChannel | null;
			if (channel != null) {
                const link = `https://www.roblox.com/users/${roblox_id}/profile`;
                const embed = new EmbedBuilder()
                    .setColor(0x22bb33)
                    .setTitle('Verified Roblox Account')
                    .setDescription(
                        `
                        <@${discord_id}> your Roblox account was sucessfully verified!
                        
                        Want to see your profile? You can visit it [here](<${link}>)!
                        `
                    )
                    .setTimestamp();
                const button = new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel('Profile').setURL(link);
                const row = new ActionRowBuilder<ButtonBuilder>().setComponents(button);
                if (channel.isTextBased()) {
                    await channel.send({
                        embeds: [embed],
                        components: [row]
                    });
                }
            }
		}
	}
};