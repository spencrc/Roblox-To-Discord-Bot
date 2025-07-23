import {
	Events,
	Interaction,
	CacheType,
	MessageFlags,
	ChatInputCommandInteraction,
	AutocompleteInteraction
} from 'discord.js';
import { client } from '../client.js';
import { Event } from '../classes/event.js';

const executeChatInputCommand = async (interaction: ChatInputCommandInteraction<CacheType>): Promise<void> => {
	const command = client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({
				content: 'There was an error while executing this command!',
				flags: MessageFlags.Ephemeral
			});
		} else {
			await interaction.reply({
				content: 'There was an error while executing this command!',
				flags: MessageFlags.Ephemeral
			});
		}
	}
};

const autocomplete = async (interaction: AutocompleteInteraction<CacheType>): Promise<void> => {
	const command = client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.autocomplete!(interaction);
	} catch (error) {
		console.error(error);
	}
};

export default new Event({
	name: Events.InteractionCreate,
	execute: async (interaction: Interaction<CacheType>): Promise<void> => {
		if (interaction.isChatInputCommand()) await executeChatInputCommand(interaction);
		else if (interaction.isAutocomplete()) await autocomplete(interaction);
	}
});
