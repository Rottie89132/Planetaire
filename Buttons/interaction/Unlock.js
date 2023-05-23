const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } = require("discord.js");

module.exports = {
    data: {
        CustomId: "UnLockAction",
        Permission: "MANAGE_MESSAGES"
    },
    async execute(interaction, client) {
        const { message, channel , guild } = interaction
        
        const MessageId = message.content.split(':** ')[1]
        const MessageLock = await channel.messages.fetch(MessageId)
        const receivedEmbed = MessageLock.embeds[0];
        const description = receivedEmbed.description

        const selectMenu = new ActionRowBuilder()
        
        const embed = EmbedBuilder.from(receivedEmbed)
        const MemberID = embed.data.footer.icon_url.split('/')[4]
        const member = guild.members.cache.get(MemberID)

        embed.setDescription(`${description}`)
        embed.setFooter({text: member.user.username, iconURL: embed.data.footer.icon_url });

        selectMenu.addComponents
        (
            new StringSelectMenuBuilder().setCustomId('selection').addOptions(
                {
                    emoji: `1013433291929571420`,
                    label: 'Send a report',
                    description: `Report the user that's being reviewed.`,
                    value: '1',
                },
                {
                    emoji: `1013432674137948160`,
                    label: 'Edit the review',
                    description: 'Allows the author to edit their review.',
                    value: '2',
                },
                {
                    emoji: `1013433192738467850`,
                    label: 'Delete the review',
                    description: 'Allows the author/moderator to delete the review.',
                    value: '3',
                }
            )
        )

        await interaction.deferUpdate();
        await MessageLock.edit({embeds: [embed], components: [selectMenu]})
        await interaction.editReply({ content: `Message got unlocked`, components: []})

        
        const thread = channel.threads.cache.find(x => x.name.includes(`${MessageId.slice(-4)}`))
        const threadChannel = await client.channels.fetch(thread.id);

        const messages = await threadChannel.messages.fetch();
        const botMessages = await messages.filter(msg => msg.author.bot === true);
        const deletemsg = botMessages.filter(msg => msg.content.includes("Violation Detected!"))
        
        for (const msg of deletemsg) { await msg[1].delete(); }

        await thread.setName(thread.name.replace(`Violation`, `Case`))
        await thread.setArchived(false);
        
        
    }
}