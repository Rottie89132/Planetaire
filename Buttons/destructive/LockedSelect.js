const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } = require("discord.js");
const SetCooldown = require("../../Schemas/Cooldowns")

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
        const BotUser = await guild.members.fetch(client.user.id)
        const BotHighest = BotUser.roles.highest.position

        const LogEmbed = new EmbedBuilder()
        const embed = EmbedBuilder.from(receivedEmbed)
        
        const tags = new ActionRowBuilder()
        const row = new ActionRowBuilder()

        await interaction.deferUpdate();

        try {
        const Member = await guild.members.fetch(TargetId)
        MemberHighest = Member.roles.highest.position
        } catch{MemberHighest = 1}

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

        if(BotHighest <= MemberHighest)
        return interaction.editReply({content: `I do not have enough permisions`, components: [], ephemeral: true})

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
        
        let GetCooldown = await SetCooldown.findOne({MessageID: MessageId, GuildId: guild.id})
        if(!GetCooldown) SetCooldown.create({MessageID: MessageId, GuildId: guild.id, Cooldown: Date.now()})
        else GetCooldown = await SetCooldown.findOneAndUpdate(
            { MessageID: MessageId, GuildId: guild.id },
            { $set: { 'Cooldown': Date.now() }}
        );

        const thread = channel.threads.cache.find(x => x.name.includes(`${MessageId.slice(-4)}`))
        await thread.setName(thread.name.replace(`Case`, `Violation`))
        await thread.setArchived(true);
        await thread.send({content: `**Violation Detected!**\nActions have been taken against this individual
        \n\n**Individual’s information:**\nDiscriminator: <@${TargetId}>\nDiscord ID: ${TargetId}`})
        
    }
}

