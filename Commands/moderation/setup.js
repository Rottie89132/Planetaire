const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const database = require("../../Schemas/Setup");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("review-setup")
    .setDescription("Specify in what channel the reviews goes.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption((option) => option.setName("review-channel").setDescription("Provide a channel for reviews.").setRequired(true))
    .addChannelOption((option) => option.setName("log-channel").setDescription("Provide a channel for review logs.").setRequired(true))
    .setDMPermission(false),

    async execute(interaction, client) {
        const { options, guild } = interaction;
        const ReviewChannel  = options.getChannel("review-channel")
        const logChannel = options.getChannel("log-channel");
        
        let GuildData = await database.findOneAndUpdate(
            { GuildId: guild.id, GuildName: guild.name },
            { $set: { 'ReviewChannel': ReviewChannel.id, 'LogChannel': logChannel.id }}
        )
        if(!GuildData) GuildData = await database.create({GuildId: guild.id, GuildName: guild.name, ReviewChannel: ReviewChannel.id, LogChannel: logChannel.id})
        await GuildData.save()

        if(GuildData) return interaction.reply({content: `Channels have been succesfully set!`, ephemeral: true})
        else return interaction.reply({content: `An unkown error has occured`, ephemeral: true})
    }
}