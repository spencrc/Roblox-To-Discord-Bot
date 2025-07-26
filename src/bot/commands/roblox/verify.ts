import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { SlashCommand } from '../../classes/slash-command.js';
import { ROBLOX_CLIENT_ID } from '../../../config.js';
import { createHash, randomBytes } from 'node:crypto';
import { supabase } from '../../../db/pg-pool.js';

const AUTHORIZE_URL = 'https://apis.roblox.com/oauth/v1/authorize?';

const sha256 = (buffer: string): Buffer => {
	return createHash('sha256').update(buffer).digest();
};

export default new SlashCommand({
	data: new SlashCommandBuilder().setName('verify').setDescription('Replies with a verify link!'),
	execute: async (interaction: ChatInputCommandInteraction): Promise<void> => {
		const codeVerifier = randomBytes(32).toString('base64url');
		const codeChallenge = sha256(codeVerifier).toString('base64url');
		const state = randomBytes(10).toString('base64url');
		const params = new URLSearchParams({
			client_id: ROBLOX_CLIENT_ID,
			code_challenge: codeChallenge,
			code_challenge_method: 'S256',
			redirect_uri: 'http://localhost:3000/redirect',
			scope: 'openid profile',
			response_type: 'code',
			state: state
		});
		const link: string = `${AUTHORIZE_URL}${params.toString()}`;

		await supabase
			.from(`roblox_oauth_sessions`)
			.insert([
				{
					discord_user_id: interaction.user.id,
					code_verifier: codeVerifier,
					state: state,
				}
			]);

		await interaction.reply(`Please click [here](<${link}>)!`);
	} //todo: add state and code_challenge to a database to store them for use for /redirect
});
