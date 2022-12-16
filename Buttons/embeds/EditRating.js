const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");

module.exports =
{
    data: {
        CustomId: "EditRating",
        Permission: "VIEW_CHANNEL"
    },
    async execute(interaction, client) {
        const modal = new ModalBuilder()
        .setCustomId('Rating')
        .setTitle('Embed editor');

    const RatingInput = new TextInputBuilder()
        .setCustomId('Rating')
        .setLabel("Rating")
        .setStyle(TextInputStyle.Short)
        .setPlaceholder("Provide the Rating")
        .setRequired(true)
        .setMaxLength(1)

    const ActionRow = new ActionRowBuilder().addComponents(RatingInput);

    modal.addComponents(ActionRow);
    await interaction.showModal(modal);
            
    }

}