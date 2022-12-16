const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const database = require("../../Schemas/ReviewsSchema");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("review-stats")
    .setDescription("Get the average stats from the selected member.")
    .addUserOption((option) => option.setName("member").setDescription("Provide a member to see their stats.").setRequired(false))
    .setDMPermission(false),

    async execute(interaction, client) {
        const { options } = interaction;
        const User = options.getMember("member") || interaction.member;

        ColorResults = ["#D9D9D9", "#ff0000", "#ffd900", "#ff6600", "#49c736", "#49c736"]
        RatingResults = ["⬜️⬜️⬜️⬜️⬜️", "🟥⬜️⬜️⬜️⬜️", "🟨🟨⬜️⬜️⬜️", "🟧🟧🟧⬜️⬜️", "🟩🟩🟩🟩⬜️", "🟩🟩🟩🟩🟩"]

        function LoadEmbed (Title, Description, Color, Timestamp, Thumbnail, Footer) {
            const Embed = new EmbedBuilder().setColor(Color).setTitle(Title).setDescription(Description)
            if(Timestamp == true ) Embed.setTimestamp()
            if(Thumbnail !== undefined ) Embed.setThumbnail(Thumbnail)
            if(Footer !== undefined) Embed.setFooter(Footer)
            return [Embed]}

        if(User.user.bot) return interaction.reply({
             embeds: LoadEmbed("User error has occured",
                "You can't check a bot silly. \nPlease mention someone else instead.",
                ColorResults[0]), ephemeral: true})

        let UserData = await database.findOne({User: User.id})
        let TargetData = await database.find()
        var averageRating = [];
        let Published = 0

        TargetData.forEach(res =>{

            if(res.User === User.id){
                res.Data.forEach(Data => {averageRating.push(Number(Data.Issuer_Ratting))})
            }

            res.Data.forEach(Data => {
                if(Data.IssuerId === User.id) {Published++}})
        })

        if(UserData) Recieved = UserData.Data.length 
        else Recieved = 0

        var Rt = 0;
        for (i=0; i < averageRating.length; i++) {Rt += averageRating[i]}
        
        if(Rt === 0 && averageRating.length === 0) {Rt = 0}
        else {Rt = Math.round(Rt / averageRating.length)}
        
        interaction.reply({
            embeds: LoadEmbed(`${User.user.tag}`,
            `A quick overview that displays this users stats.
            \n\n**About:**\n${User.user.tag} has recieved: ${Recieved} reviews, and published: ${Published}
            \n\n**Recommendation:**\n${RatingResults[Rt]}`, ColorResults[Rt], false, User.displayAvatarURL({ dynamic: true })), ephemeral: true})
    }
}