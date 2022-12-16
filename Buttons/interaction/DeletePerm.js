const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    data: {
        CustomId: "DeletePerm",
        Permission: "MANAGE_MESSAGES"
    },
    async execute(interaction) {

        const button = new ActionRowBuilder()
        const InteractionMsg = await interaction.message
       
        await interaction.deferReply({ephemeral: true})
        button.addComponents 
        (
            new ButtonBuilder().setCustomId('Delete').setLabel('Confirm').setStyle(ButtonStyle.Danger),
            new ButtonBuilder().setCustomId('Dismiss').setLabel('Cancel').setStyle(ButtonStyle.Secondary),
        )
        interaction.followUp({content: `Delete this message?\n**Message ID:** ${InteractionMsg.id}`, components: [button], ephemeral: true})
    }
}