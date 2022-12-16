const { InteractionType } = require('discord.js');

module.exports = {
    name: "interactionCreate",
    execute(interaction, client) {
        if(!interaction.isButton()) return;
        const Button = client.buttons.get(interaction.customId);

        if(!Button) {
            return interaction.reply({
                content: "This button is outdated or does not exist.",
                 ephemeral: true
            })
        }

        if (Button.Permission && !interaction.member.permissions.has(Button.permission)) {
            return interaction.reply({ 
              content: `You do not have the required permission for this command`,
              ephemeral: true 
              })
            }

        Button.execute(interaction, client);
    }
}