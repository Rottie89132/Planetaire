const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } = require("discord.js");
const SetCoolDown = require("../../Schemas/Cooldowns");

module.exports = 
{
    data: {
        CustomId: "LockedSelect"
    },
    async execute(interaction, client) {
        const { channel, message, guild } = interaction

        const MessageId = message.content.split(':** ')[1]
        const MessageLock = await channel.messages.fetch(MessageId)
        const receivedEmbed = MessageLock.embeds[0];
        const description = receivedEmbed.description

        const TargetId = MessageLock.embeds[0].thumbnail.url.split('/')[4]
        const logchannel = client.channels.cache.get(process.env.ChangelogChannelId);

        const LogEmbed = new EmbedBuilder()
        const embed = EmbedBuilder.from(receivedEmbed)
        
        const tags = new ActionRowBuilder()
        const row = new ActionRowBuilder()

        await interaction.deferUpdate();

        tags.addComponents
        (
            new StringSelectMenuBuilder().setCustomId('DeletePerms').addOptions(
                {
                    emoji: `1013433291929571420`,
                    label: 'Unlock review',
                    description: `Allows the moderator to unlock reviews.`,
                    value: '1',
                }, {
                    emoji: `1013433192738467850`,
                    label: 'Request deletion',
                    description: 'Allows the moderator to delete reviews.',
                    value: '2',
                }
            )
        )

        embed.setDescription(`${description}`)
        embed.setFooter({text: `Review got locked!`, iconURL:  embed.data.footer.icon_url});
        await MessageLock.edit({embeds: [embed], components: [tags]})

        LogEmbed.setTitle("ChangeLog")
        LogEmbed.setDescription(`Review got locked by ${interaction.member}\n\n**Mention:**\n<@${TargetId}>\n\n**Case ID:**\n[Violation#${MessageId.substring(MessageId.length - 4, MessageId.length)}](${MessageLock.url})`)
        LogEmbed.setColor("#ffd900")
        LogEmbed.setTimestamp()
        logchannel.send({embeds: [LogEmbed]})

        row.addComponents(new ButtonBuilder().setURL(MessageLock.url).setLabel('Message').setStyle(ButtonStyle.Link),)
        await interaction.editReply({ content: `Message got locked!`, components: []})
        
        let GetTimeOut = await SetCoolDown.findOne({MessageID: MessageId, GuildID: guild.id, Type: 'NextLock'})
        if(!GetTimeOut) SetCoolDown.create({MessageID: MessageId, GuildID: guild.id, Type: 'NextLock', TimeOut: new Date()})
        else GetTimeOut = await SetCoolDown.findOneAndUpdate(
            { MessageID: MessageId, GuildId: guild.id, Type: 'NextLock' },
            { $set: { 'TimeOut': new Date() }}
        );

        const thread = channel.threads.cache.find(x => x.name.includes(`${MessageId.slice(-4)}`))
        await thread.setName(thread.name.replace(`Case`, `Violation`))
        await thread.setArchived(true);
        await thread.send({content: `**Violation Detected!**\nActions have been taken against this individual
        \n\n**Individual’s information:**\nDiscriminator: <@${TargetId}>\nDiscord ID: ${TargetId}`})
        await interaction.deleteReply()
    }
}

