import type { ClientEvents } from 'discord.js';

type EventName = keyof ClientEvents;
type EventExecute<K extends EventName> = (
	...args: ClientEvents[K]
) => Promise<void> | void;

type EventOptions<K extends EventName> = {
	name: K;
	once?: boolean;
	execute: EventExecute<K>;
};

export class Event<K extends EventName> {
	public readonly name: K;
	public readonly once?: boolean;
	public readonly execute: EventExecute<K>;

	constructor(options: EventOptions<K>) {
		this.name = options.name;
		this.once = options.once;
		this.execute = options.execute;
	}
}
