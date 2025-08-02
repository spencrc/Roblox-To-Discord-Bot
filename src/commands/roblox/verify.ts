import { ChatInputCommandInteraction, MessageFlags, SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { SlashCommand } from '../../classes/slash-command.js';
import { BASE_URL, ROBLOX_CLIENT_ID } from '../../config.js';
import { randomBytes } from 'node:crypto';
import { supabase } from '../../db/supabase-client.js';

const AUTHORIZE_URL = 'https://apis.roblox.com/oauth/v1/authorize?';

export default new SlashCommand({
	data: new SlashCommandBuilder().setName('verify').setDescription('Replies with a verify link!'),
	execute: async (interaction: ChatInputCommandInteraction): Promise<void> => {
		if (!interaction.inGuild()) return;

		const state = randomBytes(10).toString('base64url');
		const params = new URLSearchParams({
			client_id: ROBLOX_CLIENT_ID,
			redirect_uri: `${BASE_URL}/redirect`,
			scope: 'openid profile',
			response_type: 'code',
			state: state
		});
		const link: string = `${AUTHORIZE_URL}${params.toString()}`;

		const { error } = await supabase.from(`roblox_oauth_sessions`).insert([
			{
				discord_id: interaction.user.id,
				guild_id: interaction.guild?.id,
				state: state
			}
		]);

		if (error) {
			console.error(error);
		}

		const embed = new EmbedBuilder()
			.setColor(0x0099ff)
			.setTitle('Verify Your Roblox Account')
			.setDescription(
				`
				To verify your Roblox Account, please visit [here](<${link}>)
				
				Once you have verified your account, you will receive a notification.
			`
			)
			.setTimestamp();

		await interaction.reply({
			embeds: [embed],
			flags: MessageFlags.Ephemeral
		});
	}
});
