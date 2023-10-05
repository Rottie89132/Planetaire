const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const ReviewsSchema = require("../../Schemas/ReviewsSchema");
const SetCoolDown = require("../../Schemas/Cooldowns");
const SetupSchema = require("../../Schemas/Setup");
const fs = require('fs');


module.exports = 
{
    data: {
        CustomId: "Delete"
    },
    async execute(interaction, client)
    {
        const { channel, guild, member } = interaction
        const button = new ActionRowBuilder()
        const Embed = new EmbedBuilder()

        let GuildData = await SetupSchema.findOne({GuildId: guild.id, GuildName: guild.name})
        if(!GuildData) return interaction.reply({content: `Review could not be deleted\nNo log channel was found pls try again after setting one up with /review-setup`, ephemeral: true})
        const logchannel = client.channels.cache.get(GuildData.LogChannel);
        
        const id = interaction.message.content.split(':**')[1]; await interaction.deferUpdate();
        const Message = await channel.messages.fetch(id); Message.delete()

        //await SetCoolDown.findOneAndDelete({GuildID: guild.id, UserID: member.user.id, Type: 'NextReview'})
        await SetCoolDown.findOneAndDelete({GuildID: guild.id, MessageID: id.slice(1), Type: 'NextLock'})
        
        Embed.setTitle("ChangeLog")
        Embed.setDescription(`Review got deleted by ${interaction.member}\n\n**ID:**\nMessage: ${id}`)
        Embed.setColor("#ff0000")
        Embed.setTimestamp()

        let Data = await logchannel.send({embeds: [Embed]})
        button.addComponents(new ButtonBuilder().setURL(Data.url).setLabel('ChangeLog').setStyle(ButtonStyle.Link),);
        await interaction.editReply({ content: `Message got deleted`, components: [button]})

        try {
            let UserData = await ReviewsSchema.findOneAndUpdate(
                { "Data.ReviewId": id.replace(" ","")},
                { $pull: { "Data" : {"ReviewId": id.replace(" ","")}}},{multi:true}
            ); await UserData.save()

            const FeedItem = {
                member, guild, content: {
                    title: `Deleted a review about ${UserData.Nickname}!`,
                    subject: `${UserData.Data[0].IssuerDesc}`, favorability: `${UserData.Data[0].Issuer_Ratting}`
                }, meta: { id: `${id.replace(" ","")}`, StatusMessage: `deleted` }
            };
    
            const token = JSON.parse(fs.readFileSync('token.json'));
            await fetch('http://localhost:4000/api/feed', {
                method: 'POST', headers: { 'Content-Type': 'application/json', 'authorization': `${token.session}` },
                body: JSON.stringify(FeedItem),
            }).then(response => response.json());
    
            const thread = channel.threads.cache.find(x => x.name.includes(`${id.slice(-4)}`))
            await thread.delete();
        } catch{}
        await interaction.deleteReply()
    }
}

