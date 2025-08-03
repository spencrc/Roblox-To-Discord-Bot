import {
	Events,
	Interaction,
	CacheType,
	MessageFlags,
	ChatInputCommandInteraction,
	AutocompleteInteraction,
	Collection
} from 'discord.js';
import { client } from '../client.js';
import { Event } from '../classes/event.js';

const executeChatInputCommand = async (interaction: ChatInputCommandInteraction<CacheType>): Promise<void> => {
	const command = client.commands.get(interaction.commandName);
	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	const cooldown = command.cooldown;
	if (cooldown) {
		const cooldowns = client.cooldowns;
		if (!cooldowns.has(command.data.name)) {
			cooldowns.set(command.data.name, new Collection());
		}

		const now = Date.now();
		const timestamps = cooldowns.get(command.data.name)!;
		
		if (timestamps.has(interaction.user.id)) {
			const expiryTime = timestamps.get(interaction.user.id)! + cooldown * 1000;

			if (now < expiryTime) {
				const expiredTimestamp = Math.round(expiryTime / 1000);
				await interaction.reply({ content: `Please wait, you are on a cooldown for \`${command.data.name}\`. You can use it again <t:${expiredTimestamp}:R>.`, flags: MessageFlags.Ephemeral });
				return;
			}
		}

		timestamps.set(interaction.user.id, now);
		setTimeout(() => timestamps.delete(interaction.user.id), cooldown * 1000);
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
