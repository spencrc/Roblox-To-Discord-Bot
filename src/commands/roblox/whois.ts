import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ChatInputCommandInteraction,
	EmbedBuilder,
	GuildMember,
	SlashCommandBuilder
} from 'discord.js';
import { SlashCommand } from '../../classes/slash-command.js';
import supabase from '../../db/supabase.js';
import { getUser, getUserThumbnail } from '../../lib/user.js';

export default new SlashCommand({
	data: new SlashCommandBuilder()
		.setName('whois')
		.setDescription("Displays the mentioned user's Roblox account")
		.addUserOption((option) => option.setName('user').setDescription('The user to look up').setRequired(true)),
	execute: async (interaction: ChatInputCommandInteraction): Promise<void> => {
		if (!interaction.inGuild()) return;
		const guild = interaction.guild!;
		const member = interaction.options.getMember('user') as GuildMember;

		const { data, error } = await supabase
			.from('roblox_discord_links')
			.select('roblox_id')
			.match({ guild_id: guild.id, discord_id: member.id })
			.maybeSingle();

		if (error) {
			console.error(error);
		}

		if (!data) {
			await interaction.reply(`Sorry, we couldn't find your Roblox account in the database. Are you verified?`);
			return;
		}

		const robloxId = data.roblox_id as string;
		const robloxUser = await getUser(robloxId);
		const robloxThumbnail = await getUserThumbnail(robloxId);
		const link = `https://www.roblox.com/users/${robloxId}/profile`;
		const embed = new EmbedBuilder()
			.setColor(0x22bb33)
			.setTitle(member.displayName)
			.setDescription(robloxUser.about)
			.setFields(
				{ name: 'Roblox username', value: robloxUser.name, inline: true },
				{ name: 'Roblox display name', value: robloxUser.displayName, inline: true },
				{ name: 'Roblox user ID', value: robloxUser.id, inline: true },
				{ name: 'Join date', value: robloxUser.createTime, inline: true }
			)
			.setThumbnail(robloxThumbnail)
			.setTimestamp();
		const button = new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel('Profile').setURL(link);
		const row = new ActionRowBuilder<ButtonBuilder>().setComponents(button);
		await interaction.reply({
			embeds: [embed],
			components: [row]
		});
	}
});
