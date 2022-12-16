const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const Config = require("../../items/config.json");
const database = require("../../Schemas/ReviewsSchema");
const database2 = require("../../Schemas/Setup");

module.exports = 
{
    data: {
        CustomId: "Delete"
    },
    async execute(interaction, client)
    {
        const { channel, guild } = interaction
        const button = new ActionRowBuilder()
        const Embed = new EmbedBuilder()

        let GuildData = await database2.findOne({GuildId: guild.id, GuildName: guild.name})
        if(!GuildData) return interaction.reply({content: `Review could not be deleted\nNo log channel was found pls try again after setting one up with /review-setup`, ephemeral: true})
        const logchannel = client.channels.cache.get(GuildData.LogChannel);

        const id = interaction.message.content.split(':**')[1]; await interaction.deferUpdate();
        const Delete = await interaction.channel.messages.fetch(id); Delete.delete()
        
        Embed.setTitle("ChangeLog")
        Embed.setDescription(`Review got deleted by ${interaction.member}\n\n**ID:**\nMessage: ${id}`)
        Embed.setColor("#ff0000")
        Embed.setTimestamp()

        let Data = await logchannel.send({embeds: [Embed]})
        button.addComponents(new ButtonBuilder().setURL(Data.url).setLabel('ChangeLog').setStyle(ButtonStyle.Link),);
        await interaction.editReply({ content: `Message got deleted`, components: [button]})

        try {
            let UserData = await database.findOneAndUpdate(
                { "Data.ReviewId": id.replace(" ","")},
                { $pull: { "Data" : {"ReviewId": id.replace(" ","")}}},{multi:true}
            ); await UserData.save()

            const thread = channel.threads.cache.find(x => x.name.includes(`${id.slice(-4)}`))
            await thread.delete();
        } catch{}
        
    }
}

