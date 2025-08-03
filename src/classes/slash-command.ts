import type {
	SlashCommandBuilder,
	ContextMenuCommandBuilder,
	SlashCommandSubcommandsOnlyBuilder,
	ChatInputCommandInteraction,
	SlashCommandOptionsOnlyBuilder,
	AutocompleteInteraction
} from 'discord.js';

type CommandBuilder =
	| SlashCommandBuilder
	| ContextMenuCommandBuilder
	| SlashCommandSubcommandsOnlyBuilder
	| SlashCommandOptionsOnlyBuilder;
type CommandExecute = (interaction: ChatInputCommandInteraction) => Promise<void> | void;
type Autocomplete = (interaction: AutocompleteInteraction) => Promise<void> | void;

type CommandOptions = {
	data: CommandBuilder;
	execute: CommandExecute;
	autocomplete?: Autocomplete;
	cooldown?: number;
};

export class SlashCommand {
	public readonly data: CommandBuilder;
	public readonly execute: CommandExecute;
	public readonly autocomplete?: Autocomplete;
	public readonly cooldown?: number;

	constructor(options: CommandOptions) {
		this.data = options.data;
		this.execute = options.execute;
		this.autocomplete = options.autocomplete;
		this.cooldown = options.cooldown;
	}
}
