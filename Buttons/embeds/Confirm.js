const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const database = require("../../Schemas/ReviewsSchema");
const wait = require('node:timers/promises').setTimeout;
const fs = require('fs');

module.exports =
{
    data: {
        CustomId: "Confirm",
        Permission: "VIEW_CHANNEL"
    },
    async execute(interaction, client) {
        const { guild, member} = interaction
        const id = interaction.message.content.split(`:**`)[1]
        const receivedEmbed = interaction.message.embeds[0];
        const LogEmbed = new EmbedBuilder()
        const DmTargetId = interaction.message.embeds[0].thumbnail.url.split('/')[4]
        const channel = client.channels.cache.get(process.env.ChangelogChannelId);
        const embed = EmbedBuilder.from(receivedEmbed)
        const LinkRow = new ActionRowBuilder()
        const Linked = new ActionRowBuilder()

        await interaction.deferUpdate();

        let EmbedLink = await interaction.channel.messages.fetch(id)
        edit = await EmbedLink.edit({embeds: [embed]})
        url = edit.url
    
        LinkRow.addComponents
        (
            new ButtonBuilder().setURL(url).setLabel('Check it out').setStyle(ButtonStyle.Link),
            new ButtonBuilder().setCustomId('DmDelete').setLabel(`Dismiss`).setStyle(ButtonStyle.Primary)
        )

        Linked.addComponents
        (new ButtonBuilder().setURL(url).setLabel('Check it out').setStyle(ButtonStyle.Link),)
        const target = await client.users.fetch(DmTargetId);

        LogEmbed.setTitle("ChangeLog")
        LogEmbed.setDescription(`${interaction.member} edited their review
        \n\n**Mention:**\n<@${DmTargetId}>
        \n\n**Updated Description:** \n${receivedEmbed.description.split("\n\n")[0]}
        \n\n**ID:**\nUser: ${interaction.member.user.id}\nMessage: [${id}](${url})\nTarget: ${DmTargetId}`)
        LogEmbed.setColor("#ff6600")
        LogEmbed.setTimestamp()

        UpdatedRating = receivedEmbed.description.split("\n\n")[1].split("\n")[1]
        UpdatedDesc = receivedEmbed.description.split("\n\n")[0]
        
        switch (UpdatedRating) {
            case "🟥⬜️⬜️⬜️⬜️":
                ReadableRating = '1'
                break;
            case "🟨🟨⬜️⬜️⬜️":
                ReadableRating = '2'
                break;
            case "🟧🟧🟧⬜️⬜️":
                ReadableRating = '3'
                break;
            case "🟩🟩🟩🟩⬜️":
                ReadableRating = '4'
                break;
            case "🟩🟩🟩🟩🟩":
                ReadableRating = '5'
                break;
            default:
                ReadableRating = '0'
                break;
        }

        const PreUser = await database.findOne({ User: target.id, "Data.ReviewId": id.replace(" ","")})
        const { IssuerDesc, Issuer_Ratting } = PreUser.Data[0]
        
        let UserData = await database.findOneAndUpdate(
            { User: target.id, "Data.ReviewId": id.replace(" ","") },
            { $set: { "Data.$.Issuer_Ratting" : ReadableRating, "Data.$.IssuerDesc" : UpdatedDesc, "Data.$.Edit_Date" : new Date() }}
        ); await UserData.save()

        const FeedItem = {
            member, guild, content: {
                title: `Updated a review about ${target.username}!`,
                subject: `${IssuerDesc}`, favorability: `${Issuer_Ratting}`, updated: {
                    subject: `${UpdatedDesc}`, favorability: `${ReadableRating}`
                }
            }, meta: { id: `${id.replace(" ","")}`, StatusMessage: `updated`}
        };

        const token = JSON.parse(fs.readFileSync('token.json'));
        await fetch(`${process.env.DomainUrl}/api/feed`, {
            method: 'POST', headers: { 'Content-Type': 'application/json', 'authorization': `${token.session}` },
            body: JSON.stringify(FeedItem),
        }).then(response => response.json());

        channel.send({components: [Linked], embeds: [LogEmbed]})
        await interaction.editReply({components: [Linked], content: `Review got edited.`, embeds: [], ephemeral: true})
        target.send({components: [LinkRow], content: `A review about you got edited \nin ${interaction.guild.name}`, ephemeral: true})
        .catch(()=> console.log(`No direct messages got send.`))
        await wait(2000)
        await interaction.deleteReply()
    }
}