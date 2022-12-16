const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");

module.exports =
{
    data: {
        CustomId: "EditDescription",
        Permission: "VIEW_CHANNEL"
    },
    async execute(interaction, client) {
        const modal = new ModalBuilder()
        .setCustomId('Description')
        .setTitle('Embed editor');

    const DescriptionInput = new TextInputBuilder()
        .setCustomId('Description')
        .setLabel("Description")
        .setStyle(TextInputStyle.Paragraph)
        .setPlaceholder("Provide the description")
        .setRequired(true)

    const ActionRow = new ActionRowBuilder().addComponents(DescriptionInput);

    modal.addComponents(ActionRow);
    await interaction.showModal(modal);
            
    }
}