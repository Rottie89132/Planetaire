const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const wait = require('node:timers/promises').setTimeout;

module.exports = 
{
    data: new SlashCommandBuilder()
    .setName("purge")
    .setDescription("Deletes a specified amount of messages")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false)
    .addStringOption((option) =>
    option.setName("amount").setDescription("Provide the amount of messages to be deleted").setRequired(true))
    .addUserOption((option) => 
    option.setName("target").setDescription("Provide a user to delete messages from").setRequired(false)),
    
    async execute(interaction) {
        const { channel, options } = interaction
        const Amount = options.getString("amount")
        const Target = options.getMember("target")
        const Message = await channel.messages.fetch()

        await interaction.deferReply({ephemeral: true});
        interaction.editReply({content: `Please wait purge in process`, ephemeral: true})
        await wait(2000)

        if(Amount > 100 || Amount <= 0 )
            return interaction.editReply({content: `The amount must be atleast a 1 but it can't exceed a 100`, ephemeral: true})
        
        let ToDelete = 0
        const NormalPurge = [];
        (await Message).filter((msg) => {
        if(!msg.pinned && Amount > ToDelete) {NormalPurge.push(msg),ToDelete++}})

        if(Target) {
            let ToDelete = 0
            const filtered = [];
            (await Message).filter((msg) => {
            if(!msg.pinned && msg.author.id == Target.id && Amount > ToDelete){filtered.push(msg),ToDelete++}})

            await channel.bulkDelete(filtered, true).then(messages => {
            if(messages.size > 1){TOT = `messages`}else{TOT = `message`}
            interaction.editReply({content: `Cleared ${messages.size} ${TOT} From ${Target.user.tag}`, ephemeral: true})})
        }
        else { 
            try {
            await channel.bulkDelete(NormalPurge, true).then(messages => {
            if(messages.size > 1){TOT = `messages`}else{TOT = `message`}
            interaction.editReply({content: `Cleared ${messages.size} ${TOT} from this channel`, ephemeral: true})})
            } catch {}
        }

    }
}