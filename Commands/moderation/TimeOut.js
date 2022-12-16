const { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction, EmbedBuilder } = require("discord.js");
const database = require("../../Schemas/infractions");
const ms = require("ms");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Restrict a member")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false)
    .addUserOption(options => options.setName('target').setDescription('Select the target').setRequired(true))
    .addStringOption((option) => option.setName("duration").setDescription("Provide a duration for the timeout").setRequired(true))
    .addStringOption((option) => option.setName("reason").setDescription("Provide a reason for the timeout").setMaxLength(512)),
    async execute(interaction, client) { 
        const { options, guild, member } = interaction
        const target = options.getMember("target")
        const duration = options.getString("duration")
        const reason = options.getString("reason") || "None specified"

        const ErrorAray = [];
        const ErrorEmbed = new EmbedBuilder()
        .setAuthor({name: "Could not be found"})
        .setColor("Red")

        if(!target) return interaction.reply({
            embeds: [ErrorEmbed.setDescription(`Member most likely left the server`)],
            ephemeral: true
        })

        if(!ms(duration) || ms(duration) > ms("28d"))
        ErrorAray.push("Time provided is invalid or over the 28d limit")

        if(!target.manageable || !target.moderatable)
        ErrorAray.push("Selected target is not moderatable by the bot")

        if(member.roles.highest.position < target.roles.highest.position)
        ErrorAray.push("Selected target has a higher role position than you")

        if(ErrorAray.length)
        return interaction.reply({
            embeds: [ErrorEmbed.setDescription(ErrorAray.join("\n"))],
            ephemeral: true
        })

        let timeError = false;
        await target.timeout(ms(duration), reason).catch(() => timeError = true );

        if(timeError)
        return interaction.reply({
            embeds:[ErrorEmbed.setDescription("Could not timeout user due to an uncommon error. Cannot take negative values")],
            ephemeral: true
        });

        const newInfraction = {
            IssuerId: member.id,
            IssuerTag: member.user.tag,
            Reason: reason,
            Date: Date.now()
        }

        let UserData = await database.findOne({Guild: guild.id, User: target.id})
        if(!UserData) UserData = await database.create({Guild: guild.id, User: target.id, Infractions: [newInfraction]})
        else UserData.Infractions.push(newInfraction) && await UserData.save()

        const SuccesEmbed = new EmbedBuilder()
        .setAuthor({name: "Timeout issues"})
        .setColor("Green")
        .setDescription([ `${target} was issued a timeout for **${ms(ms(duration), {long: true})}**
        \nby ${member} bringing their infractions total to **${UserData.Infractions.length} Points**
        \n\nReason: ${reason}`].join("\n"));

        return interaction.reply({embeds: [SuccesEmbed]})








    } 
}