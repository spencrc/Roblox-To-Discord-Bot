import { ChatInputCommandInteraction, EmbedBuilder, MessageFlags, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { SlashCommand } from '../../classes/slash-command.js';
import { supabase } from '../../db/supabase-client.js';

export default new SlashCommand({
    data: new SlashCommandBuilder()
        .setName("set-verifylog")
        .setDescription('Sets the channel to send verify logs to!')
        .addStringOption((option) =>
            option.setName('channel').setDescription('The channel name').setRequired(true)
        )
        .addBooleanOption((option) =>
            option.setName('none').setDescription('Unsets the verify log channel if it exists, meaning verify messages won\'t be sent anywhere')
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    execute: async (interaction: ChatInputCommandInteraction): Promise<void> => {
        if (!interaction.inGuild()) return;

        const guild = interaction.guild!;
        const channelName = interaction.options.getString('channel', true);
        const unsetBoolean = interaction.options.getBoolean('none');
        const channel = guild.channels.cache.find(channel => channel.name === channelName);
        
        if (!channel) return;
        
        if (channel.isTextBased()) {
            if (unsetBoolean === false) {
                return;
            } else {
                const { error } = await supabase.from(`settings`).upsert([
                    {
                        guild_id: guild.id,
                        verify_log_channel_id: channel.id
                    }
                ]);
        
                if (error) {
                    console.error(error);
                }

                const embed = new EmbedBuilder()
                    .setColor(0x22bb33)
                    .setTitle('Sucessfully Set Verify Log Channel')
                    .setDescription(`The verify log channel was successfully set to be <#${channel.id}>!`)
                    .setTimestamp();

                await interaction.reply({
                    embeds: [embed],
                    flags: MessageFlags.Ephemeral
                });
            }
        }
    }
})