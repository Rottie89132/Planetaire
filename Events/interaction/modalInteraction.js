const { InteractionType } = require('discord.js');

module.exports = {
    name: "interactionCreate",
    execute(interaction, client) {
        if(interaction.type !== InteractionType.ModalSubmit) return;
        Modal = client.modals.get(interaction.customId)

        if(!Modal) {
            return interaction.reply({
                content: "This modal is outdated or does not exist.",
                 ephemeral: true
            })
        }

        if (Modal.Permission && !interaction.member.permissions.has(Modal.permission)) {
            return interaction.reply({ 
              content: `You do not have the required permission for this command`,
              ephemeral: true 
              })
            }

        Modal.execute(interaction, client);


        
    }
}