const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    data: {
        CustomId: "DeleteAction"
    },
    async execute(interaction) {
        const button = new ActionRowBuilder()
        const InteractionMsg = await interaction.message

        const UsersReviewId = InteractionMsg.embeds[0].footer.iconURL.split('/')[4]
        const Time = interaction.message.embeds[0].description.split("\n\n")[2]
        const Current = new Date().getTime()
        const TimeTo = Number(Time) + 5 * 60000

        if(interaction.user.id !== UsersReviewId && !interaction.member.permissions.has("MANAGE_MESSAGES")) 
        return interaction.reply({content: `You can't delete reviews you didn't make`, ephemeral: true})
        
        if(Current > TimeTo && !interaction.member.permissions.has("MANAGE_MESSAGES"))
        return interaction.reply({content: `Deletion period has expired \nThe review can't be deleted`, ephemeral: true})

        await interaction.deferReply({ephemeral: true})
        
        button.addComponents 
        (
            new ButtonBuilder().setCustomId('Delete').setLabel('Confirm').setStyle(ButtonStyle.Danger),
            new ButtonBuilder().setCustomId('Dismiss').setLabel('Cancel').setStyle(ButtonStyle.Secondary),
        )
        interaction.followUp({content: `Delete this message?\n**Message ID:** ${InteractionMsg.id}`, components: [button], ephemeral: true})
    }
}