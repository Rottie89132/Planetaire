const { EmbedBuilder } = require("discord.js");

module.exports = 
{
    data: {
        CustomId: "Description"
    },
    async execute(modal, interaction) {

        await modal.deferUpdate({ephemeral: true});
        const receivedEmbed = modal.message.embeds[0];
        const embed = EmbedBuilder.from(receivedEmbed)
        const Description = modal.fields.getTextInputValue('Description');
        date = new Date().getTime()
        
        embed.setDescription(`${Description}\n\n${receivedEmbed.description.split("\n\n")[1]}`);
        modal.editReply({embeds: [embed]})
    }
}
