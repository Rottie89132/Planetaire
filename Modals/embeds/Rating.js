const { EmbedBuilder, time } = require("discord.js");

module.exports = 
{
    data: {
        CustomId: "Rating"
    },
    async execute(modal, client)
    {
        await modal.deferUpdate({ephemeral: true});
        const receivedEmbed = modal.message.embeds[0];
        const ResponseEmbed = new EmbedBuilder()
        const embed = EmbedBuilder.from(receivedEmbed)
        const Rating = modal.fields.getTextInputValue('Rating');
        date = new Date().getTime()

        RatingResults = ["⬜️⬜️⬜️⬜️⬜️", "🟥⬜️⬜️⬜️⬜️", "🟨🟨⬜️⬜️⬜️", "🟧🟧🟧⬜️⬜️", "🟩🟩🟩🟩⬜️", "🟩🟩🟩🟩🟩"]
        ColorResults = ["#364ec7", "#ff0000", "#ffd900", "#ff6600", "#49c736", "#49c736"]
        
        ResponseEmbed.setColor(ColorResults[0])
        ResponseEmbed.setTitle("Rating error has occured");
        ResponseEmbed.setDescription("You can't give a rating higher than 5 and lower than 1. \n\nPlease try again and use the correct rating value instead."); 
                
        if(Rating > 5 || Rating < 1 || isNaN(Rating)) 
        return modal.followUp({embeds: [ResponseEmbed], ephemeral: true })

        embed.setDescription(`${receivedEmbed.description.split("\n\n")[0]}\n\n**Recommendation:**\n${RatingResults[Rating]}`);
        embed.setColor(ColorResults[Rating]);
        modal.editReply({embeds: [embed]})
        
    }
}