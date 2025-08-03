import { ChatInputCommandInteraction, EmbedBuilder, MessageFlags, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { SlashCommand } from '../../classes/slash-command.js';
import { supabase } from '../../db/supabase-client.js';

const unsetChannel = async (interaction: ChatInputCommandInteraction, guildId: string): Promise<void> => {
    const { error } = await supabase.from('settings').delete().match({ guild_id: guildId })

    if (error) {
        console.error(error);
    }

    const embed = new EmbedBuilder()
        .setColor(0x22bb33)
        .setTitle('Sucessfully Unset Verify Log Channel')
        .setDescription('The verify log channel was successfully **unset**!')
        .setTimestamp();

    await interaction.reply({
        embeds: [embed],
        flags: MessageFlags.Ephemeral
    });
}

export default new SlashCommand({
    data: new SlashCommandBuilder()
        .setName("set-verifylog")
        .setDescription('Sets the channel to send verify logs to!')
        .addChannelOption((option) =>
            option.setName('channel').setDescription('The channel name')
        )
        .addBooleanOption((option) =>
            option.setName('none').setDescription('Unsets the verify log channel if it exists, meaning verify messages won\'t be sent anywhere')
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    execute: async (interaction: ChatInputCommandInteraction): Promise<void> => {
        if (!interaction.inGuild()) return;

        const guild = interaction.guild!;
        const guildId = guild.id;
        const channel = interaction.options.getChannel('channel');
        const unsetBoolean = interaction.options.getBoolean('none');

        if (unsetBoolean === true) await unsetChannel(interaction, guildId);
        else if (channel && 'send' in channel) {
            const { error } = await supabase.from(`settings`).upsert([
                {
                    guild_id: guildId,
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
        } else {
            const embed = new EmbedBuilder()
                .setColor(0xbb2124)
                .setTitle('Error When Setting Verify Log Channel')
                .setDescription(`
                    Sorry, we could not set the verify log channel! Here's some questions to consider when resolving this error:
                    - Did you use the command with either the \`channel\` or \`none\` (which can only be True) options?\n- Did you pick a channel that can receive messages for \`channel\`?
                `)
                .setTimestamp();

            await interaction.reply({
                embeds: [embed],
                flags: MessageFlags.Ephemeral
            });
        }
    }
})