module.exports = 
{
    data: {
        CustomId: "Dismiss"
    },
    async execute(interaction)
    {
        await interaction.deferUpdate();
        await interaction.editReply({ content: `Interacton got canceled`, components: []})
        await interaction.deleteReply()
    }
}

