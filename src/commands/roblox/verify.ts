import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { SlashCommand } from '../../classes/slash-command.js';
import { ROBLOX_CLIENT_ID } from '../../config.js';

function makeid(length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    
    return result;
}

export default new SlashCommand({
	data: new SlashCommandBuilder()
		.setName('verify')
		.setDescription('Replies with a verify link!'),
	execute: async (interaction: ChatInputCommandInteraction): Promise<void> => {
        const redirect_uri = 'http://localhost:3000/redirect';
        const code = makeid(10);
        const link: string = `https://apis.roblox.com/oauth/v1/authorize?client_id=${ROBLOX_CLIENT_ID}&redirect_uri=${redirect_uri}&scope=openid+profile&response_type=code&state=${code}`;
		await interaction.reply(`Please click [here](${link})!`);
	}
});
