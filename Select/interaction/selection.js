const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits  } = require("discord.js");
const database = require("../../Schemas/ReviewsSchema");
const SetCoolDown = require("../../Schemas/Cooldowns");

module.exports = 
{
    data: {
        CustomId: "selection"
    },
    async execute(interaction) {
        const { values, member, guild } = interaction
        const InteractionMsg = await interaction.message
        const button = new ActionRowBuilder()
        const row = new ActionRowBuilder()
        const UsersReviewId = InteractionMsg.embeds[0].footer.iconURL.split('/')[4]
        const Targetid = InteractionMsg.embeds[0].thumbnail.url.split('/')[4]

        const UserData = await database.findOne({ User: Targetid, "Data.ReviewId": InteractionMsg.id },); 
        UserData.Data.forEach(element => {if(element.ReviewId == InteractionMsg.id){ReviewElement = element} })

        const Current = new Date().getTime()
        const Time = ReviewElement.Edit_Date ? ReviewElement.Edit_Date : ReviewElement.Creation_Date
        const TimeTo = interaction.member._roles.includes(`746797209995182102`) ? new Date(Time).getTime() + 1 * 60000 : new Date(Time).getTime() + 5 * 60000

        await InteractionMsg.edit()
        
        if(values[0] == 1) 
        {
            if (!member.permissions.has(PermissionFlagsBits.Administrator))
            return interaction.reply({content: `You do not have the required permission for this command`, ephemeral: true})
        
            let GetTimeOut = await SetCoolDown.findOne({MessageID: InteractionMsg.id, GuildID: guild.id, Type: 'NextLock'})
            if(GetTimeOut) {
                DataTimeOut = new Date(GetTimeOut.TimeOut).getTime() + 15 * 60000
                
                if(Date.now() < DataTimeOut) {
                    
                    Miliseconds = DataTimeOut - Date.now()
                    Minutes = Math.floor((Miliseconds % (1000 * 60 * 60 * 60)) / (1000 * 60))
                    Seconds = Math.floor((Miliseconds % (1000 * 60 )) / 1000)
                    waitTime = Minutes; TextTime = "minutes"
        
                    if(Minutes < 1){waitTime = Seconds}if(Minutes < 1){TextTime = "seconds"}
                    return interaction.reply({content: `You can lock this review in ${waitTime} ${TextTime}`, ephemeral: true})
                }
            }

            return interaction.reply({content: `Lock this message?\n**Message ID:** ${InteractionMsg.id}`,
            components:  [button.addComponents(
                new ButtonBuilder().setCustomId('LockedSelect').setLabel('Confirm').setStyle(ButtonStyle.Danger),
                new ButtonBuilder().setCustomId('Dismiss').setLabel('Cancel').setStyle(ButtonStyle.Secondary)
            )], ephemeral: true})
        }

        if(values[0] == 2) 
        {
            if(interaction.user.id !== UsersReviewId) 
            {interaction.reply({content: ` You can't edit reviews you didn't make `, ephemeral: true})} 
            else if(Current < TimeTo) {
                Miliseconds = TimeTo - Current
                Minutes = Math.floor((Miliseconds % (1000 * 60 * 60 * 60)) / (1000 * 60))
                Seconds = Math.floor((Miliseconds % (1000 * 60 )) / 1000)
                waitTime = Minutes; TextTime = "minutes"
    
                if(Minutes < 1){waitTime = Seconds}if(Minutes < 1){TextTime = "seconds"}
                interaction.reply({content: `You can edit this review in ${waitTime} ${TextTime}`, ephemeral: true})
            } else {
                row.addComponents
                (
                    new ButtonBuilder().setCustomId('EditDescription').setLabel(`Description`).setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder().setCustomId('EditRating').setLabel(`Rating`).setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder().setCustomId('Confirm').setLabel(`Confirm`).setStyle(ButtonStyle.Success)
                )

                receivedEmbed = interaction.message.embeds[0];
                embed = EmbedBuilder.from(receivedEmbed).setTimestamp()
                interaction.reply({content: `**Message ID:** ${InteractionMsg.id}`, embeds: [embed], components: [row], ephemeral: true })
            }
        }
        if(values[0] == 3) 
        {
            if(interaction.user.id !== UsersReviewId && !interaction.member.permissions.has("MANAGE_MESSAGES")) 
            return interaction.reply({content: `You can't delete reviews you didn't make`, ephemeral: true})
            
            if(Current > new Date(ReviewElement.Creation_Date).getTime() + 5 * 60000 && !interaction.member.permissions.has("MANAGE_MESSAGES"))
            return interaction.reply({content: `Deletion period has expired \nThe review can't be deleted`, ephemeral: true})

            return interaction.reply({content: `Delete this message?\n**Message ID:** ${InteractionMsg.id}`,
            components:  [button.addComponents(
                new ButtonBuilder().setCustomId('Delete').setLabel('Confirm').setStyle(ButtonStyle.Danger),
                new ButtonBuilder().setCustomId('Dismiss').setLabel('Cancel').setStyle(ButtonStyle.Secondary)
            )], ephemeral: true})
        }
    }
}