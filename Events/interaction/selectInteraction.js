const { InteractionType } = require('discord.js');

module.exports = {
    name: "interactionCreate",
    execute(interaction, client) {
        if(!interaction.isSelectMenu()) return;
        const Selection = client.selects.get(interaction.customId);

        if(!Selection) {
            return interaction.reply({
                content: "This SelectMenu is outdated or does not exist.",
                 ephemeral: true
            })
        }

        if (Selection.Permission && !interaction.member.permissions.has(Selection.permission)) {
            return interaction.reply({ 
              content: `You do not have the required permission for this command`,
              ephemeral: true 
              })
            }

            Selection.execute(interaction, client);
    }
}