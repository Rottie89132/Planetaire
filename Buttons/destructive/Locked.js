const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const database = require("../../Schemas/Setup");

module.exports = 
{
    data: {
        CustomId: "Locked"
    },
    async execute(interaction, client) {
        const { channel, message, guild } = interaction

        const MessageId = message.content.split(':** ')[1]
        const MessageLock = await channel.messages.fetch(MessageId)
        const receivedEmbed = MessageLock.embeds[0];
        Locked = receivedEmbed.description.split("\n\n")

        const TargetId = MessageLock.embeds[0].thumbnail.url.split('/')[4]
        const BotUser = await guild.members.fetch(client.user.id)
        const BotHighest = BotUser.roles.highest.position

        const LogEmbed = new EmbedBuilder()
        const embed = EmbedBuilder.from(receivedEmbed)
        
        const tags = new ActionRowBuilder()
        const row = new ActionRowBuilder()

        await interaction.deferUpdate();

        let GuildData = await database.findOne({GuildId: guild.id, GuildName: guild.name})
        if(!GuildData) return interaction.reply({content: `Review could not be locked\nNo log channel was found pls try again after setting one up with /review-setup`, ephemeral: true})
        const logchannel = client.channels.cache.get(GuildData.LogChannel);

        try {
        const Member = await guild.members.fetch(TargetId)
        MemberHighest = Member.roles.highest.position
        } catch{MemberHighest = 1}
        
        tags.addComponents
        (
            new ButtonBuilder().setCustomId('LockAction').setLabel(`Report`).setStyle(ButtonStyle.Secondary).setDisabled(true),
            new ButtonBuilder().setCustomId('EditAction').setLabel(`Edit`).setStyle(ButtonStyle.Success).setDisabled(true),
            new ButtonBuilder().setCustomId('DeletePerm').setLabel(`Delete`).setStyle(ButtonStyle.Danger)
        )

        if(BotHighest <= MemberHighest)
        return interaction.editReply({content: `I do not have enough permisions`, components: [], ephemeral: true})

        embed.setDescription(`${Locked[0]} \n\n\n${Locked[1]}`)
        embed.setFooter({text: `Review got locked!` });
        await MessageLock.edit({embeds: [embed], components: [tags]})

        LogEmbed.setTitle("ChangeLog")
        LogEmbed.setDescription(`Review got locked by ${interaction.member}\n\n**Mention:**\n<@${TargetId}>\n\n**Case ID:**\n[Violation#${MessageId.substring(MessageId.length - 4, MessageId.length)}](${MessageLock.url})`)
        LogEmbed.setColor("#ffd900")
        LogEmbed.setTimestamp()
        logchannel.send({embeds: [LogEmbed]})

        row.addComponents(new ButtonBuilder().setURL(MessageLock.url).setLabel('Message').setStyle(ButtonStyle.Link),)
        await interaction.editReply({ content: `Message got locked!`, components: []})

        try {
        const thread = channel.threads.cache.find(x => x.name.includes(`${MessageId.slice(-4)}`))
        await thread.setName(thread.name.replace(`Case`, `Violation`))
        await thread.send({content: `**Violation Detected!**\nActions have been taken against this individual
        \n\n**Individual’s information:**\nDiscriminator: <@${TargetId}>\nDiscord ID: ${TargetId}`})
        } catch{}
        await interaction.deleteReply()
    }
}

