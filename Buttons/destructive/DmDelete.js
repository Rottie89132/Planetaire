module.exports = 
{
    data: {
        CustomId: "DmDelete"
    },
    async execute(interaction, client)
    {
        member = await client.users.createDM(interaction.user.id)
        GetDM = await client.channels.cache.get(interaction.channelId)
        DMClear = await GetDM.messages.fetch(`${interaction.message.id}`)
        DMClear.delete()
    }
}

