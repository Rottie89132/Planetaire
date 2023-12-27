const fs = require('fs');

module.exports = {
    name: "guildCreate",
    async execute(guild, interaction) {
        const server = require("../../Schemas/Server");

        const channels = guild.channels.cache
        const channelData = new Array()

        channels.forEach((channel) => {
            if (channel.type == 0) {
                channelData.push({ id: channel.id, name: channel.name })
            }
        });
        
        let data = await server.findOne({GuildID: guild.id})
        if(!data) data = await server.create({
            GuildID: guild.id, 
            GuildName: guild.name, 
            GuildIcon: `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp`,
            Channels: channelData
        
        })
        else data = await server.findOneAndUpdate({ 
            GuildID: guild.id }, 
            {$set: { 
                GuildID: guild.id, 
                GuildName: guild.name, 
                GuildIcon: `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp`,
                Channels: channelData
            }
        })

        const token = JSON.parse(fs.readFileSync('token.json'));
        await fetch(`${process.env.DomainUrl}/api/guildUpdate/${token.session}`, {
            method: 'POST', headers: { 'Content-Type': 'application/json'},
        })
    }
}