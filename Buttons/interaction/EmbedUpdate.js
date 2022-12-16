const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, time  } = require("discord.js");

module.exports = {
    data: {
        CustomId: "EditAction",
        Permission: "VIEW_CHANNEL"
    },
    async execute(interaction) {
        const row = new ActionRowBuilder()
        const UsersReviewId = interaction.message.embeds[0].footer.iconURL.split('/')[4]
        const Time = interaction.message.embeds[0].description.split("\n\n")[2]
        const Current = new Date().getTime()
        const TimeTo = Number(Time) + 5 * 60000

        if(interaction.user.id !== UsersReviewId) 
        {interaction.reply({content: `You can't edit reviews you didn't make`, ephemeral: true})} 
       
        else if(Current < TimeTo) {
            Miliseconds = TimeTo - Current
            Minutes = Math.floor((Miliseconds % (1000 * 60 * 60 * 60)) / (1000 * 60))
            Seconds = Math.floor((Miliseconds % (1000 * 60 )) / 1000)
            waitTime = Minutes,TextTime = "minutes"

            if(Minutes < 1){waitTime = Seconds}if(Minutes < 1){TextTime = "seconds"}
            interaction.reply({content: `You can edit this review in ${waitTime} ${TextTime}`, ephemeral: true})
        }

        else 
        {
            row.addComponents
            (
                new ButtonBuilder().setCustomId('EditDescription').setLabel(`Description`).setStyle(ButtonStyle.Secondary),
                new ButtonBuilder().setCustomId('EditRating').setLabel(`Rating`).setStyle(ButtonStyle.Secondary),
                new ButtonBuilder().setCustomId('Confirm').setLabel(`Confirm`).setStyle(ButtonStyle.Success)
            )
            const InteractionMsg = await interaction.message

            receivedEmbed = interaction.message.embeds[0];
            embed = EmbedBuilder.from(receivedEmbed).setTimestamp()
            interaction.reply({content: `**Message ID:** ${InteractionMsg.id}`, embeds: [embed], components: [row], ephemeral: true })
        }
    }
};