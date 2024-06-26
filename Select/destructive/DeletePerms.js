const { ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits  } = require("discord.js");

module.exports = {
    data: { 
        CustomId: "DeletePerms" 
    },
    async execute(interaction) {
        const { values, member } = interaction
        const InteractionMsg = await interaction.message
        const button = new ActionRowBuilder()
        
        await InteractionMsg.edit()
        
        if (!member.permissions.has(PermissionFlagsBits.Administrator))
        return interaction.reply({content: `You do not have the required permission for this command`, ephemeral: true})

        if(values[0] == 1) {

            return interaction.reply({content: `Unlock this message?\n**Message ID:** ${InteractionMsg.id}`,
                components:  [button.addComponents(
                    new ButtonBuilder().setCustomId('UnLockAction').setLabel('Confirm').setStyle(ButtonStyle.Success),
                    new ButtonBuilder().setCustomId('Dismiss').setLabel('Cancel').setStyle(ButtonStyle.Secondary)
                )], ephemeral: true})
        }

        if(values[0] == 2) { 
                return interaction.reply({content: `Delete this message?\n**Message ID:** ${InteractionMsg.id}`,
                components:  [button.addComponents(
                    new ButtonBuilder().setCustomId('Delete').setLabel('Confirm').setStyle(ButtonStyle.Danger),
                    new ButtonBuilder().setCustomId('Dismiss').setLabel('Cancel').setStyle(ButtonStyle.Secondary)
                )], ephemeral: true})
        }
    }
}