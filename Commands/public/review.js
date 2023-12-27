const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, TimestampStyles  } = require("discord.js");
const wait = require('node:timers/promises').setTimeout;
const fs = require('fs');

const ReviewsSchema = require("../../Schemas/ReviewsSchema");
const SetCoolDown = require("../../Schemas/Cooldowns");
const SetupSchema = require("../../Schemas/Setup");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("review")
    .setDescription("Give a review about another user")
    .setDMPermission(false)
    .addUserOption(option => option.setName('target').setDescription('Provide a user to review.').setRequired(true))
	.addStringOption((option) => option.setName("rating").setDescription("Provide a rating between 1 and 5.").setRequired(true)
    .addChoices (
        { name: '5 star rating', value: '5' },
        { name: '4 star rating', value: '4' },
        { name: '3 star rating', value: '3' },
        { name: '2 star rating', value: '2' },
        { name: '1 star rating', value: '1' }
        ))
    .addStringOption((option) => option.setName("description").setDescription("Provide the description.").setRequired(true)),
    async execute(interaction, client) {
        
        const { options, guild, member} =  interaction;
        const target  = options.getMember("target") || interaction.member;
        const rating = options.getString("rating");
        const description = options.getString("description");

        let CountRating = rating > 1 ?  "Stars" : "Star"
        
        RatingResults = ["⬜️⬜️⬜️⬜️⬜️", "🟥⬜️⬜️⬜️⬜️", "🟨🟨⬜️⬜️⬜️", "🟧🟧🟧⬜️⬜️", "🟩🟩🟩🟩⬜️", "🟩🟩🟩🟩🟩"]
        ColorResults = ["#364ec7", "#ff0000", "#ffd900", "#ff6600", "#49c736", "#49c736"]
        date = new Date().getTime()
    
        interaction.reply({content: "Your review is getting Processed!", ephemeral: true})
        await wait(2000);
        
//========================================================================================================================================

        function LoadEmbed (Title, Description, Color, Timestamp, Thumbnail, Footer) {
            const Embed = new EmbedBuilder().setColor(Color).setTitle(Title).setDescription(Description)
            if(Timestamp == true ) Embed.setTimestamp()
            if(Thumbnail !== undefined ) Embed.setThumbnail(Thumbnail)
            if(Footer !== undefined) Embed.setFooter(Footer)
            return [Embed]}

        function LoadButtons (Style, Dm, Label, Url) {
            const button = new ActionRowBuilder()
            if(Style == "Link") if(Dm == true) button.addComponents(
                    new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel(Label).setURL(Url),
                    new ButtonBuilder().setCustomId('DmDelete').setLabel(`Dismiss`).setStyle(ButtonStyle.Primary)
                    ); else button.addComponents(new ButtonBuilder().setStyle(ButtonStyle.Link).setLabel(Label).setURL(Url));
            return [button]}

        function LoadSelect () {
            const select = new ActionRowBuilder()
            select.addComponents(
            new StringSelectMenuBuilder().setCustomId('selection').addOptions(
						{
                            emoji: `1013433291929571420`,
							label: 'Send a report',
							description: `Report the user that's being reviewed.`,
							value: '1',
						},
						{
                            emoji: `1013432674137948160`,
							label: 'Edit the review',
							description: 'Allows the author to edit their review.',
							value: '2',
						},
                        {
                            emoji: `1013433192738467850`,
							label: 'Delete the review',
							description: 'Allows the author/moderator to delete the review.',
							value: '3',
						}
			)); return [select]
        }

//========================================================================================================================================

        let GuildData = await SetupSchema.findOne({GuildId: guild.id, GuildName: guild.name})
        
        if(!GuildData) return interaction.editReply({
            embeds: LoadEmbed("Server error has occured",
                "No review channels found.\nPlease try again after setting one up with /review-setup.",
                ColorResults[0]), ephemeral: true})

        let SetTimeOut = await SetCoolDown.findOne({UserID: member.id, GuildID: guild.id, Type: 'NextReview'})
        let TimeTo = SetTimeOut ? new Date(SetTimeOut.TimeOut).getTime() + 5 * 60000 : new Date().getTime()
    
        const Current = new Date().getTime()
        const Channel = client.channels.cache.get(GuildData.ReviewChannel)
        const LogChannel = client.channels.cache.get(GuildData.LogChannel)

        if(Current < TimeTo /*&& !target.user.id == "322393281306689536"*/) {
            Miliseconds = TimeTo - Current
            Minutes = Math.floor((Miliseconds % (1000 * 60 * 60 * 60)) / (1000 * 60))
            Seconds = Math.floor((Miliseconds % (1000 * 60 )) / 1000)
            waitTime = Minutes; TextTime = "minutes"
            if(Minutes == 1) {TextTime = "minute"}
            if(Minutes < 1){waitTime = Seconds}if(Minutes < 1){TextTime = "seconds"}
            
            return interaction.editReply({
                content: `You can create another review in ${waitTime} ${TextTime}`, ephemeral: true})
        }
        
        if(target.user.bot) return interaction.editReply({
            embeds: LoadEmbed("User error has occured",
                "You can't review a bot silly. \nPlease mention someone else instead.",
                ColorResults[0]), ephemeral: true})

        if(target.user == interaction.member.user /*&& !target.user.id == "322393281306689536"*/) return interaction.editReply({
            embeds: LoadEmbed("User error has occured",
                "You can't review yourself silly. \nPlease mention someone else instead.",
                ColorResults[0]), ephemeral: true})

//========================================================================================================================================

        let Data = await Channel.send({
            embeds: LoadEmbed(
                target.user.username, `${description} \n\n**Recommendation:** \n${RatingResults[rating]}`,
                ColorResults[rating], true, target.displayAvatarURL({ dynamic: true }),
                    {text: `${interaction.user.username}`,
                iconURL: `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}.webp`}
            ), components: LoadSelect()})

        interaction.editReply({content: "Your review got published!", components: LoadButtons ("Link", false, "Check it out", Data.url), ephemeral: true})

        const newReview = {
            ReviewId: Data.id,
            IssuerGuild: guild.id,
            IssuerId: member.id,
            IssuerAvatar: member.user.avatar,
            IssuerTag: member.user.username,
            Issuer_Ratting: rating,
            IssuerDesc: description,
            Creation_Date: new Date()
        }

        if(!SetTimeOut) SetTimeOut = await SetCoolDown.create({UserID: member.id, GuildID: guild.id, TimeOut: new Date(), Type: 'NextReview'})
        else SetTimeOut = await SetCoolDown.findOneAndUpdate(
            { UserID: member.id, GuildID: guild.id, Type: 'NextReview' },
            { $set: { 'TimeOut': new Date() }}
        ); await SetTimeOut.save()

        await ReviewsSchema.findOneAndUpdate({User: target.id}, { $set: {Nickname: target.user.username}})

        let UserData = await ReviewsSchema.findOne({User: target.id})
        if(!UserData) UserData = await ReviewsSchema .create({User: target.id, Nickname: target.user.username, Data: [newReview]})
        else UserData.Data.push(newReview) && await UserData.save()

        const FeedItem = {
            member, guild, content: {
                title: `Published a review about ${target.user.username}!`,
                subject: `${description}`, favorability: `${rating}`
            }, meta: { id: `${Data.id}`, StatusMessage: `published` }
        };

        const token = JSON.parse(fs.readFileSync('token.json'));
        await fetch(`${process.env.DomainUrl}/api/feed/${token.session}`, {
            method: 'POST', headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify(FeedItem),
        }).then(response => response.json());

        LogChannel.send({embeds: LoadEmbed(
            "ChangeLog", `${interaction.member} Created a new review
            \n\n**Mention:**\n<@${target.user.id}>\n\n**Description:**\n${description}\n\n**Rating:**\n${rating} ${CountRating}
            \n\n**ID:**\nUser: ${interaction.member.user.id}\nMessage: [${Data.id}](${Data.url})\nTarget: ${target.user.id}`,
            ColorResults[5], true), components: LoadButtons("Link", false, "Check it out", Data.url)})

        await Data.startThread({
            name: `${target.user.username} Case${Data.id.slice(-4)}`,
            type: 'GUILD_PUBLIC_THREAD'
        })
        
        const thread = Channel.threads.cache.find(x => x.name.includes(`${Data.id.slice(-4)}`))
        thread.members.add(target.user.id);
        thread.members.add(member.id);
        thread.setRateLimitPerUser(5)
        
        target.user.send({
            content: `You just received a review from ${interaction.user.username} in ${interaction.guild.name}`,
                components: LoadButtons ("Link", true, "Check it out", Data.url), ephemeral: true})
        .catch(()=> console.log(`No direct messages got send.`))
    }  
}