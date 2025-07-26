import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { SlashCommand } from '../../classes/slash-command.js';

export default new SlashCommand({
	data: new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!'),
	execute: async (interaction: ChatInputCommandInteraction): Promise<void> => {
		await interaction.reply('Pong!');
	}
});
